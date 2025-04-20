const BlogForm = ({
    handleSubmit,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange,
    title,
    author,
    url
}) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    title <input 
                        type="text" 
                        data-testid='blog-title'
                        value={title} 
                        name="title" 
                        onChange={handleTitleChange}/>
                </div>
                <div>
                    author <input 
                        type="text" 
                        data-testid='blog-author'
                        value={author} 
                        name="author" 
                        onChange={handleAuthorChange}/>
                </div>
                <div>
                    url <input 
                        type="text" 
                        data-testid='blog-url'
                        value={url} 
                        name="url" 
                        onChange={handleUrlChange}/>
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
