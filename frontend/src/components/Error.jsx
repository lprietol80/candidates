import React from 'react'

function Error({message}) {
  return (
        <div className="error-ctnr pendiente">
      <article className="error-card error">
        <h3>Error</h3>
        <h4>{message}</h4>
      </article>      
    </div>
  )
}

export default Error


