import { useState} from 'react'

const Blog = ({ blog, user, handleLikes, handleDelete }) => {
  
  const [blogDetails, setBlogDetails] = useState(false)

  const showBlogDetails = { display: blogDetails ? '': 'none'}
  const buttonName = blogDetails ? 'hide' : 'view'
  const showRemoveButton = { display: user.id === blog.user.id || blog.user === user.id ? '': 'none'}

  console.log('USER LOGGED IN', user)
  console.log('BLOG USER', blog)

  const toggleVisibility = () => {
    setBlogDetails(!blogDetails)
  }

  return (
    <div className="blog">
      <p>{blog.title} <button onClick={toggleVisibility}>{buttonName}</button></p>
      <div style={showBlogDetails}>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <p>{blog.likes} <button onClick={() => handleLikes(blog)}>like</button></p>
      <button style={showRemoveButton} onClick={() => handleDelete(blog)}>remove</button>
      </div>
    </div>  
  )}

export default Blog