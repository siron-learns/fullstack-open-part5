const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const listHelper = require('../utils/list_helper')

const api = supertest(app)

describe("initial dummy test", () => {
    test('dummy returns 1', () => {
        const blogs = []
    
        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})

describe("basic blog tests", () => {
    test('when list has only one blog then equals the likes of that', () => {
        const result = listHelper.totalLikes([helper.testBlogs[0]])
        assert.strictEqual(result, 15)
    })

    test('favorite blog test', () => {
        const blogResult = listHelper.favoriteBlog(helper.testBlogs)
        assert.deepStrictEqual(blogResult, helper.testBlogs[0])
    })
})

describe("initial state of db with 2 existing blogs", () => {

    // clear db
    const deleteBlogs = async () => {
        await blog.deleteMany({})
    }

    deleteBlogs()

    test("check that 1 user is added", async () => {
        await User.deleteMany({})
        await api
            .post('/api/users')
            .send(helper.testUsers[0])
            .expect(201)
            .expect("Content-Type", /application\/json/)
    })

    test("check that adding 1 blog without token fails", async () => {
        await api
            .post('/api/blogs')
            .send(helper.testBlogs[1])
            .expect(400)
    })

    test("check that adding 1 blog with user token succeeds", async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.testUsers[0])
            .expect(200)

        await api
            .post('/api/blogs')
            .send(helper.testBlogs[0])
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(200)
            .expect("Content-Type", /application\/json/)
        
        const allBlogs = await api.get('/api/blogs')
        
        assert.strictEqual(allBlogs.body.length, 1)
    })

    test("check that adding a blog without url fails", async () => {
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.testUsers[0])
            .expect(200)

        await api
            .post('/api/blogs')
            .send(helper.testBlogs[2])
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(400)

    })

    test("deleting a blog is only allowed with a verified user token", async () => {
        // this works because first user has created the first blog
        const loggedInUser = await api
            .post('/api/login')
            .send(helper.testUsers[0])
            .expect(200)

        const allBlogs = await blog.find({})
        const firstBlog = allBlogs[0]

        await api
            .delete(`/api/blogs/${firstBlog._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(204)

        // blogs db should be empty
        const allBlogsAfter = await blog.find({})

        assert.strictEqual(allBlogsAfter.length, 0)

    })

})



