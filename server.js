require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())
