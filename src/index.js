const path=require("path")
const http=require("http")
const express=require("express")
const socketio=require('socket.io')
const { emit } = require("process")

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT||3000

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


//NOTE: 1 CLIENT HAS ONE UNIQUE SOCKET USING WHICH IT CONNECTS TO THE SERVER

//runs some code when client is connected
io.on('connection',(socket)=>{
    console.log('New WebSocket connection')
    //emits to single client
    socket.emit('message','WELCOME!')
    //emits to all others clients excpet the one connected via this current socket
    socket.broadcast.emit('message',"A new user has joined")
    socket.on('sendMessage',(message)=>{
        //emits to all client
        io.emit("message",message)
    })

    //to run code when the client connected to that particular socket gets disconnected
    socket.on('disconnect',()=>{
        //the broadcast is not needed coz the current client is already being disconnected i.e.closed:)
        io.emit('message',"A user has left the chat")
    })
})

server.listen(port,()=>{
    console.log("Server is up on port",port)
})