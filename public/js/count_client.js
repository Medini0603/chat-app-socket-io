//to send and recieve events with server
const socket=io()

//Count app
// server stores a single number called count and it will show the count to all connected clients
//client will also have abutton to click to increment count and it will be updates on all clients

//rn index.js --server
//chat.js --client

//to recieve event from server
//same name of function as in server
//acess the variable sent by server using param of callback function
socket.on('countUpdated',(count)=>{
    console.log("Your count has been updated",count)
})

document.getElementById('increment').addEventListener('click',()=>{
    console.log("Clicked")
    //when clicked increment it and emit it to server
    socket.emit('increment')
})
