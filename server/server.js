const express = require('express')
const app = express()
const socketIO = require('socket.io')
const http = require('http').createServer(app)
const io = socketIO(http, {
    cors: {
      origin: "*",
    },
  })

const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    console.log(`${socket.id} has connectd`)
    
    socket.on('createRoom', (room) => {
        console.log(room)
        socket.join(room)
    })

    socket.on('draw', (data) => {
        socket.in(room).broadcast.emit('data', { x: data.x, y: data.y, strokeWidth: data.strokeWidth, strokeColor: data.strokeColor })
    })

    socket.on('up', (data) => {
        socket.in(room).broadcast.emit('onUp', data)
    })

    socket.on('down', (data) => {
        socket.in(room).broadcast.emit('onDown', { x: data.x, y: data.y })
    })
    
    socket.on('reset', (data) => {
        socket.in(room).broadcast.emit('onReset', { cnvWidth: data.cnvWidth, cnvHeight: data.cnvHeight })
    })

    socket.on('disconnect', (socket) => console.log(`${socket.id} has disconnected`))
})

http.listen(port, () => {
  console.log(`server has been started on port ${port}`)
})
