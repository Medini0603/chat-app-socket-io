const socket=io()
//acknowledgement
//server(emit)->client(message)--acknowledgement-->server
//client(emit)->server(message)--acknowledgement-->client

//!IMPPPPPPPPPPPPPPPPPP
//for every client this prints ALL THE MESsAGES that the SERVER SENDS until its connected to server
socket.on('message',(message)=>{
    console.log(message)
})

// when form is submittted
document.getElementById('message-form').addEventListener('submit',(e)=>{
    e.preventDefault()

    // const message=document.getElementById('msg').value
    const message=e.target.elements.msg.value
    //without acknowledgement
    // socket.emit('sendMessage',message)
    //with acknowledgement
    socket.emit('sendMessage',message,(ackfromserevr)=>{
        console.log("The message was delivered",ackfromserevr)
    })
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