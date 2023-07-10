import express, { application } from 'express'
const server = express()

server.get('/', (_, res) => {
  return res.send('Olá, dev!')
})



export {server}