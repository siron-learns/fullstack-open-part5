import "../index.css"

const Notification = ({notification}) => {
      const { message, isError } = notification
      
     if (!message) {
        return null
     }

    // additional style rule conditional on error
     const style = {
        color: isError ? 'red' : 'green'
     }

     return (
        <div className="errorMessage" style={style}>{message}</div>
     )

}

export default Notification