const path=require("path")
const http=require("http")
const express=require("express")
const socketio=require('socket.io')
const { emit } = require("process")
const Filter=require('bad-words')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT||3000

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


//NOTE: 1 CLIENT HAS ONE UNIQUE SOCKET USING WHICH IT CONNECTS TO THE SERVER
//NOTE: .emit()  on server should have 1st parameter as "message" ONLYYYYY!! 
//i.e. io.emit('message','hvkngv')
//coz client has only one .on with the parameter named "message"
//runs some code when client is connected
io.on('connection',(socket)=>{
    console.log('New WebSocket connection')
    //emits to single client
    socket.emit('message','WELCOME!')
    //emits to all others clients excpet the one connected via this current socket
    socket.broadcast.emit('message',"A new user has joined")
    //-------without ack
    // socket.on('sendMessage',(message)=>{
    //     //emits to all client
    //     io.emit("message",message)
    // })

    //-----------with ack
    //----the parameters are in order 1st message, then a function that was sent by client
    //---ORDER is IMPORTANT
    socket.on('sendMessage',(message,ackcallback)=>{
        // check bad-words 
        const filter=new Filter()

        if(filter.isProfane(message)){
            return ackcallback("Profanity is not allowed")
        }
        //emits to all client
        io.emit("message",message)
        ackcallback()
    })

    //listen to send location from any client
    socket.on('sendLocation',(coords,ackfunc)=>{
        // https://google.com/maps?q=12,75
        io.emit("message",`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        // io.emit("message",`Location: ${coords.latitude},${coords.longitude}`)
        ackfunc()
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