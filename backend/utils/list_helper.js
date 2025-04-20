const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    // calculates sume of likes in all blogs
    console.log('LENGTH', blogs.length)
    if (blogs.length === 1){
        return blogs[0].likes
    } else {
        const likes = blogs.map(x => x.likes)
        const initialValue = 0;
        const sumOfArray =  likes.reduce(
            (acc, cval) => acc + cval,
            initialValue,
        )
    
        return sumOfArray
    }
}

const favoriteBlog = (blogs) => {
    // Find blog with most likes (if more than 1 return first)
    const likes = blogs.map(x => x.likes)
    const maxLikes = likes.reduce((a, b) => Math.max(a, b))
    const blogWithMostLikes = blogs.filter(x => x.likes === maxLikes)

    return blogWithMostLikes[0]
}


module.exports = {
    dummy, totalLikes, favoriteBlog
}