import axios from 'axios'

const blogsUrl = 'http://localhost:3001/api/blogs'
const loginUrl = 'http://localhost:3001/api/login'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(blogsUrl)
  return response.data
}

const login = async (user) => {
  try {
    const response = await axios.post(loginUrl, user)
    return response.data
  } catch(e) {
    console.log(e)
    return null
  }
}

const create = async (blog) => {
  var headers = {
    'Authorization': token
  }
  const response = await axios.post(blogsUrl, blog, {"headers": headers})
  return response.data
}

const update = async (blog) => {
  var headers = {
    'Authorization': token
  }
  const url = `${blogsUrl}/${blog.id}`
  const request = await axios.put(url, {likes: blog.likes}, {"headers": headers})
  console.log('REQUEST', request)
  return request.data
}

const remove = async (id) => {
  var headers = {
    'Authorization': token
  }
  const url = `${blogsUrl}/${id}`
  const request = await axios.delete(url, {"headers": headers})
  return request.data
}

export default { 
  setToken, getAll, login, create, update, remove
}