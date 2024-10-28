require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
const cors = require('cors');
app.use(cors("http://0.0.1.48:8080"))


// Middleware pour activer le CORS
// app.use(cors({ origin: "http://0.0.1.48:8080" }));

// Configuration Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API CBD',
            version: '0.0.1',
            description: 'Une API pour gérer les utilisateurs et les produits',
            contact: {
                name: 'Hugo',
            },
            servers: [{ url: 'http://10.0.1.48:3000' }],
        },
    },
    apis: ["./routes/*.js"], // Les routes à documenter dans Swagger
};

const ordersRoutes = require('./routes/orders')
app.use("/api/orders", ordersRoutes)

const categoriesRoutes = require('./routes/categories')
app.use("/api/categories", categoriesRoutes)
// Génération de la documentation Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions)

// Route pour accéder à la documentation Swagger
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import des routes
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');

// Utilisation des routes dans l'application
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);

// Définition du port sur lequel le serveur écoute
const port = process.env.PORT || 3333;

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
    console.log('Server started on port ' + port);
});
