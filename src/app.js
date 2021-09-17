const express = require('express')
const logger = require('morgan')
const { Server } = require('socket.io')
const http = require('http');
const amqplib = require('amqplib')
const cron = require('node-cron')

const app = express()
const server = http.createServer(app);
const io = new Server(server)

app.use(express.json())
app.use(logger('common'))
app.use(require('./routes'))

const queue = 'heartbeat'

const createConnection = async () => {
  const client = await amqplib.connect('amqp://localhost:5672'); 
  const channel = await client.createChannel()
  await channel.assertQueue(queue)
  return channel
}

io.on('connection', async (socket) => {
  const exchangeChannel = await createConnection()
  
  setInterval(() => {
    const message = `I'm alive at ${new Date()}`
    socket.emit('message', message)
    exchangeChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message), {
      contentType: 'application/json',
    }))
  }, 60000)

  cron.schedule('42 * * * *', () => {
    const message = '42 is the meaning to life!'
    exchangeChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message), {
      contentType: 'application/json',
    }))
  })
});

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})