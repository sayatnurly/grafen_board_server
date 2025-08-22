const express = require('express')
const app = express()
const socketIO = require('socket.io')
const http = require('http').createServer(app)
const io = socketIO(http, {
    cors: {
      origin: "*",
    },
  })

const port = 3000

io.on('connection', (socket) => {

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
        socket.broadcast.to(room).emit('onDown', { x: data[0], y: data[1] })
      })

      socket.on('ratioSize', (data) => {
        socket.broadcast.to(room).emit('onRatioSize', { width: data[0], height: data[1] })
      })

      socket.on('text', (data) => {
        socket.broadcast.to(room).emit('onText', { letter: data[0], x: data[1], y: data[2]})
      })

      socket.on('undoText', (data) => {
        socket.broadcast.to(room).emit('onUndoText', { recentWords: data[0], allPoints: data[1] } )
      })

      socket.on('undoDraw', (data) => {
        socket.broadcast.to(room).emit('onUndoDraw', { allPoints: data[0], recentWords: data[1] } )
      })

      socket.on('reset', (data) => {
        socket.broadcast.to(room).emit('onReset', { cnvWidth: data[0], cnvHeight: data[1] })
      })
    })

    socket.on('disconnect', (socket) => console.log(`${socket.id} has disconnected`))
})

http.listen(port, '0.0.0.0', () => {
  console.log(`server has been started on port ${port}`)
})
