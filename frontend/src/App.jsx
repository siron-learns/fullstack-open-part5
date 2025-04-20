import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import Toggable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      console.log('promise fulfilled')
      setBlogs( blogs )
    })  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({message, isError})
    setTimeout(() => {
      setNotification({message : null})}, 3000)
  }

  const handleLogin = async (event) => {
    // set user and password back to blank after logged in
    event.preventDefault()
    console.log('logging in with', username, password)
    const user = await blogService.login({username, password}) 
    console.log('LOGGED IN USER', user)
    if (user === null) {
      notifyWith("The username or password is incorrect", true)
    }

    window.localStorage.setItem(
      'loggedInUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  }

  const handleLogOut = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  const handleBlogCreation = async (event) => {
    blogFormRef.current.toggleVisibility()
    event.preventDefault()
    const blog = await blogService.create({title, author, url})
    if (blog) {
      notifyWith(`a new blog ${title} by ${author} has been created`)
    }
    setTitle('')
    setAuthor('')
    setUrl('')
    setBlogs(blogs.concat(blog))
  } 

  const handleLikes = async (blog) => {
    try {
      const newBlog = {...blog, likes: blog.likes + 1}
      setBlogs(blogs.map(blog => blog.id !== newBlog.id ? blog : newBlog))
      await blogService.update(newBlog)
    } catch (e) {
      console.log(e)
    }
  }

  const handleDelete = async (blog) => {
    try {
      const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
      if (ok) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <Notification notification={notification}/>
        <LoginForm 
          username={username}
          password={password}
          handleUsernameChange={({target}) => setUsername(target.value)}
          handlePasswordChange={({target}) => setPassword(target.value)}
          handleSubmit={handleLogin}/>
      </div>
    )
  }

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <div>
        <Notification notification={notification}/>
        <h2>Blogs</h2>
        <p>{user.username} logged in <button onClick={handleLogOut}>logout</button> </p> 
        <Toggable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm 
              title={title}
              author={author}
              url={url}
              handleAuthorChange={({target}) => setAuthor(target.value)}
              handleTitleChange={({target}) => setTitle(target.value)}
              handleUrlChange={({target}) => setUrl(target.value)}
              handleSubmit={handleBlogCreation}
            />
        </Toggable>
        <br />
        <div>
          {blogs.sort((a, b) => a.likes - b.likes).map(blog =>
            <Blog key={blog.id} blog={blog} user={user} handleLikes={() => handleLikes(blog)} handleDelete={handleDelete} />
          )}</div>
      </div>
    )
  }

  return (
    <div>
      <div>
        {!user && loginForm()}
        {user && blogForm()}
      </div>
    </div>
  )
}

export default App