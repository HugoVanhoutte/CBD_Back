require('dotenv').config(); 
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const express = require('express');
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const app = express();
app.use(bodyParser.json())
const cors = require('cors');
app.use(cors())

// Middleware pour le parsing du body en JSON
app.use(bodyParser.json());

// Middleware pour activer le CORS
app.use(cors({ origin: "http://localhost:8080" }));

// Configuration Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Quiz',
            version: '0.0.1',
            description: 'Une API pour gérer les utilisateurs et les produits',
            contact: {
                name: 'Tayeb',
            },
            servers: [{ url: 'http://localhost:3000' }],
        },
    },
    apis: ["./routes/*.js"], // Les routes à documenter dans Swagger
};

// Génération de la documentation Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

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
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
