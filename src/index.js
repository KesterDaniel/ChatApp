const express = require("express")
const http = require("http")
const port = process.env.PORT || 3000
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { genMessage } = require("../src/utils/messages")
const { genLocMessage } = require("../src/utils/messages")
const { addUser, removeUser, getUser, getUsersInRoom } = require("../src/utils/users")




const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicdir = path.join(__dirname, "../public")
app.use(express.static(publicdir))



io.on("connection", (socket)=>{
    console.log("New websocket connection")

    

    socket.on("join", ({DisplayName, Room}, callback)=>{
        const { error, user } = addUser({ id: socket.id, DisplayName, Room })

        if(error){
            return callback(error)
        }

        socket.join(user.Room)
        
        socket.emit("message", genMessage( "Admin", `You are welcome here, ${user.DisplayName}`))
        socket.broadcast.to(user.Room).emit("message", genMessage("Admin", `${user.DisplayName} has joined!`))
        io.to(user.Room).emit("roomData", {
            room: user.Room,
            users: getUsersInRoom(user.Room)
        })

        callback()
    })

    socket.on("newChat", (chat, callback)=>{
        const user = getUser(socket.id)
        io.to(user.Room).emit("message", genMessage(user.DisplayName, chat))
        callback()
    })

    socket.on("sendlocation", (coordinates, callback)=>{
        const user = getUser(socket.id)
        io.to(user.Room).emit("Locmessage", genLocMessage(user.DisplayName, `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`))
        callback()
    })

    socket.on("disconnect", ()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.Room).emit("message", genMessage( "Admin" ,`${user.DisplayName} has left`))
            io.to(user.Room).emit("roomData", {
                room: user.Room,
                users: getUsersInRoom(user.Room)
            })
        }
    })
})

server.listen(port, ()=>{
    console.log("server up")
})

