import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import http from 'http'
import login from './login'
import menu from './menu'
import user from './user'
import log from './log'
import dept from './dept'
import dictDetail from './dictDetail'
import job from './job'
import role from './role'
import dict from './dict'
import email from './email'
import jobGroup from './jobGroup'
import jobInfo from './jobInfo'
import jobLog from './jobLog'

const app = express()
const port = 8000

// Compression
app.use(compression())
// Logger
app.use(morgan('dev'))
// Enable CORS
app.use(cors())
// POST, PUT, DELETE body parser
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: false
}))
// No cache
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Pragma', 'no-cache')
  res.header('Expires', '-1')
  next()
})

app.use('/mock-api/v1/auth', login)
app.use('/mock-api/v1/api/menus', menu)
app.use('/mock-api/v1/api/users', user)
app.use('/mock-api/v1/api/logs', log)
app.use('/mock-api/v1/api/dept', dept)
app.use('/mock-api/v1/api/dictDetail', dictDetail)
app.use('/mock-api/v1/api/job', job)
app.use('/mock-api/v1/api/roles', role)
app.use('/mock-api/v1/api/dict', dict)
app.use('/mock-api/v1/api/email', email)
app.use('/mock-api/v1/scheduler/group', jobGroup)
app.use('/mock-api/v1/scheduler/info', jobInfo)
app.use('/mock-api/v1/scheduler/log', jobLog)

// Catch 404 error
app.use((req, res, next) => {
  const err = new Error('Not Found')
  res.status(404).json({
    message: err.message,
    error: err
  })
})

// Create HTTP server.
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
console.log('Mock server started on port ' + port + '!')

// Event listener for HTTP server "error" event.
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Express ERROR (app) : %s requires elevated privileges', bind)
      process.exit(1)
    case 'EADDRINUSE':
      console.error('Express ERROR (app) : %s is already in use', bind)
      process.exit(1)
    default:
      throw error
  }
}
