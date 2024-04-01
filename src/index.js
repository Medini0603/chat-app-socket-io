const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require('socket.io')
const { emit } = require("process")
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


//NOTE: 1 CLIENT HAS ONE UNIQUE SOCKET USING WHICH IT CONNECTS TO THE SERVER
//NOTE:---> .emit()  on server should have 1st parameter as "message" ONLYYYYY!! 
//i.e. io.emit('message','hvkngv')
//coz client has only one .on with the parameter named "message"
//runs some code when client is connected
//NOTEEEEEEEEEEEEEEEEEE: NOO NEED TO HAVE the ABOVE
//as we can use .on('locationmessage') if we use .emit('locationmessage')   ====ashte:)
io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    //emits to single client
    // // socket.emit('message','WELCOME!')
    // socket.emit('message',generateMessage("WELCOME!"))
    // //emits to all others clients excpet the one connected via this current socket
    // socket.broadcast.emit('message',generateMessage("A new user has joined"))
    //-------without ack
    // socket.on('sendMessage',(message)=>{
    //     //emits to all client
    //     io.emit("message",message)
    // })


    //-------------------room-----------
    socket.on('join', ({ username, room }) => {
        //to join individual rooms given in the variable name room(given by user in join page)
        //this allows us to specifically emit events to that room
        socket.join(room)

        //NOTEEEEEEEEEEEE
        //socket.emit,io.emit,socket.braodcast.emit
        //io.to.emit --to emit messages to everyone in a specific room
        //socket.broadcast.emit  --excpet the one sending it but only to memebers of chatrooom

        // socket.emit('message','WELCOME!')
        socket.emit('message', generateMessage("WELCOME!"))
        //emits to all others clients excpet the one connected via this current socket
        // socket.broadcast.emit('message', generateMessage("A new user has joined"))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
    })
    //=-------------------

    //-----------with ack
    //----the parameters are in order 1st message, then a function that was sent by client
    //---ORDER is IMPORTANT
    socket.on('sendMessage', (message, ackcallback) => {
        // check bad-words 
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return ackcallback("Profanity is not allowed")
        }
        //emits to all client
        // io.emit("message", generateMessage(message))
        io.to("Mysore").emit("message", generateMessage(message))
        ackcallback()
    })

    //listen to send location from any client
    socket.on('sendLocation', (coords, ackfunc) => {
        // https://google.com/maps?q=12,75
        //NOTEEEE; .emit is not using message instead something else that is matched in chat.js
        io.emit("location-link", generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        // io.emit("message",`Location: ${coords.latitude},${coords.longitude}`)
        ackfunc()
    })

    //to run code when the client connected to that particular socket gets disconnected
    socket.on('disconnect', () => {
        //the broadcast is not needed coz the current client is already being disconnected i.e.closed:)
        io.emit('message', generateMessage("A user has left the chat"))
    })
})

server.listen(port, () => {
    console.log("Server is up on port", port)
})