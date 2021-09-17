const io = require('socket.io-client')
const amqplib = require('amqplib')
const fs = require('fs')

const queue = 'heartbeat'

const socket = io('http://localhost:3000')

;(async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queue)
  channel.consume(queue, (msg) => {
    const data = JSON.parse(msg.content)
    fs.appendFile('log.txt', `${data}\n`, (err) => {
      if (err) throw err;
      console.log('saved');
    })
	  channel.ack(msg)
  })
})()

socket.on('connect', () => {
  console.log(`Client ${socket.id} connected!`)
})

socket.on('message', (message) => {
  console.log(message)
})

socket.on('disconnect', () => {
  console.log('Server disconnected!')
})