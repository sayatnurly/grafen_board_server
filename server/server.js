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

    socket.on('openRoom', (room) => {
      console.log('room', socket.id, room)
      socket.join(room)

      socket.on('draw', (data) => {
          socket.broadcast.to(room).emit('data', { x: data.x, y: data.y, strokeWidth: data.strokeWidth, strokeColor: data.strokeColor })
      })

      socket.on('up', (data) => {
          socket.broadcast.to(room).emit('onUp', data)
      })

      socket.on('down', (data) => {
          socket.broadcast.to(room).emit('onDown', { x: data.x, y: data.y })
      })

      socket.on('reset', (data) => {
          socket.broadcast.to(room).emit('onReset', { cnvWidth: data.cnvWidth, cnvHeight: data.cnvHeight })
      })
    })

    socket.on('disconnect', (socket) => console.log(`${socket.id} has disconnected`))
})

http.listen(port, () => {
  console.log(`server has been started on port ${port}`)
})
