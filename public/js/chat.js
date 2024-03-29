const socket=io()

socket.on('message',(message)=>{
    console.log(message)
})

document.getElementById('message-form').addEventListener('submit',(e)=>{
    e.preventDefault()

    // const message=document.getElementById('msg').value
    const message=e.target.elements.msg.value
    socket.emit('sendMessage',message)
})