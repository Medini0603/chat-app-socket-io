const socket=io()

socket.on('message',(message)=>{
    console.log(message)
})

// when form is submittted
document.getElementById('message-form').addEventListener('submit',(e)=>{
    e.preventDefault()

    // const message=document.getElementById('msg').value
    const message=e.target.elements.msg.value
    socket.emit('sendMessage',message)
})

//when location button is clicked
document.getElementById("send-location").addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        // console.log(position.coords.latitude)
        // console.log(position.coords.longitude)

        //use the navigator api to send lothe clients location to all other connected clients
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
    })
})