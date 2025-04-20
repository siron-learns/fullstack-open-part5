const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        name: name,
        passwordHash: passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const allUsers = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(allUsers)

})

module.exports = userRouter