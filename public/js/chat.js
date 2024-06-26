const socket=io()
//acknowledgement
//server(emit)->client(message)--acknowledgement-->server
//client(emit)->server(message)--acknowledgement-->client

//!IMPPPPPPPPPPPPPPPPPP

//HTML elements that are used
const $messageForm=document.getElementById('message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector("button")
const $locationSendButton=document.getElementById('send-location')
const $messages=document.getElementById('messages')

//templates
const messageTemplate=document.getElementById("message-template").innerHTML
const locationMessageTemplate=document.getElementById("location-template").innerHTML
const sidebarTemplate=document.getElementById("sidebar-template").innerHTML
//---------------------------------------------

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

//AutoScroll
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
//------------------------------------------------
//for every client this prints ALL THE MESsAGES that the SERVER SENDS until its connected to server 
// except the location
socket.on('message',(message)=>{
    console.log(message)
    //find the message in template and set the value to the message sent by server 
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        // createdAt:message.createdAt
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    //insertAdjacentHTML inserts the html got from mustache template above into $messages div
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

//to print location link (name shld match as in server)
socket.on('location-link',(message)=>{
    console.log(message)
    const html=Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
//send room data function
socket.on('roomData',({room,users})=>{
   const html=Mustache.render(sidebarTemplate,{
    room,
    users
   })
   document.getElementById('sidebar').innerHTML=html
})

// when form is submittted
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    //disable send button to avoid multiple clicks
    $messageFormButton.setAttribute('disabled','disabled')
    // const message=document.getElementById('msg').value
    const message=e.target.elements.msg.value
    //without acknowledgement
    // socket.emit('sendMessage',message)
    //with acknowledgement
    socket.emit('sendMessage',message,(error)=>{
        //enable the button again
        $messageFormButton.removeAttribute('disabled')
        //clear the messsage input form after sending message
        $messageFormInput.value=""
        $messageFormInput.focus()
        //----
        //ack of either error or delivery
        if(error){
            console.log(error)
        }
        else{
        console.log("The message was delivered")
        }
    })
})

//when location button is clicked
$locationSendButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by browser')
    }

    $locationSendButton.setAttribute("disabled","disabled")

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        // console.log(position.coords.latitude)
        // console.log(position.coords.longitude)
        //use the navigator api to send lothe clients location to all other connected clients
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $locationSendButton.removeAttribute('disabled')
            console.log("Location shared")
        })
    })
})
//setup a socket to that particular room and user
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})