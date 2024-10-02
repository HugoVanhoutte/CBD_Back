require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())


//Routes
const productsRoutes = require('./routes/products')
app.use("/api/products", productsRoutes)

const usersRoutes = require('./routes/users')
app.use("/api/users", usersRoutes)

const categoriesRoutes = require('./routes/categories')
app.use("/api/categories", categoriesRoutes)

const port = process.env.PORT || 3333

app.listen(port, () => {
    console.log(('Server started on port ' + port))
})

