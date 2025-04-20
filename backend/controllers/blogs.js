const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const helper = require('../tests/test_helper')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// API 
blogRouter.get('/', async (request, response) => {
    const allBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(allBlogs)
})

blogRouter.post('/', async (request, response) => {

    const body = request.body
    const token = request.token
    const userId = request.user

    const user = await User.findById(userId)

    if (!body.likes){
        var likes = 0
    } else {
        var likes = body.likes
    }

    if (!body.url || !body.title){
        return response.status(400).end()
    }

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: likes,
        user: user._id
    })

    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()

    const result = await newBlog.save()
    // user.blogs = user.blogs.concat(result._id)

    response.json(result)
})

blogRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const blogId = await Blog.findById(id)
    response.json(blogId)
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const token = request.token
    const userId = request.user

    // verify if user is blog creator
    const blog = await Blog.findById(id)
    if (!blog){
        response.status(404).end()
    }

    if (blog.user.toString() === userId.toString()){
        const deletedBlog = await Blog.findByIdAndDelete(id)
        response.status(204).end()
    } else {
        response.status(400).json(
            {error: 'User ID does not match! Cannot Delete blog!'})
    }
})

blogRouter.put('/:id', async (request, response) => {
    
    const body = request.body
    const id = request.params.id

    const blog = await Blog.findById(id)
    if (!blog){
        response.status(404).end()
    }
    
    // modify likes
    blog.likes = body.likes

    const updatedBlog = await blog.save()
    
    response.json(updatedBlog)

})

module.exports = blogRouter