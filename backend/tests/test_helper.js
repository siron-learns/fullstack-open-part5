const User = require('../models/user')

const testBlogs = [
    {
        "title": "Go To Statement Considered Harmful",
        "author": "Edsger W. Dijkstra",
        "url": "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        "likes": 15,
      },
    {
        "title": "The Arbing Blog",
        "author": "Sam Priestley",
        "url": "https://sampriestley.com/",
        "likes": 10,
    },
]

const testUsers = [
    {
        "username": "testUser1",
        "password": "test123"
    },
    {
        "username": "testUser2",
        "password": "test456"
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    testBlogs, testUsers, usersInDb
}