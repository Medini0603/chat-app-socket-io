//to run node count_server.js
//localhost:3001 on multiple windows
const path=require("path")
const http=require("http")
const express=require("express")
const socketio=require('socket.io')
const { emit } = require("process")

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT||3001

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))
let count=0
//this function runs once for each client
//i.e. if 5 clients then 5 times

//count app 2 function
//server emit-> client recieve - countUpdated
//client emit-> server recieve - increment


io.on('connection',(socket)=>{
    console.log('New WebSocket connection')
    //to send event from server along with count
    socket.emit('countUpdated',count)
    //listen to increment from clients the name is the same function name as in client
    socket.on('increment',()=>{
        count++
        //it emits to only one client i.e the one it is updating
        // socket.emit('countUpdated',count)

        //if we have 5 browser windows with localhost:3001 and one clicks button output is shown for all console of clients
        //this emits on all clients i.e TO EVERY SINGLE CONNECTION!!!
        io.emit('countUpdated',count)
    })
})

server.listen(port,()=>{
    console.log("Server is up on port",port)
})