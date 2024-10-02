const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dbQuery = require('../config/dbQuery')
const {compare} = require("bcrypt");


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 24
 *                   email:
 *                     type: string
 *                     example: "Toto@example.com"
 *                   name:
 *                     type: string
 *                     example: "Dupont"
 *                   firstname:
 *                     type: string
 *                     example: "Jean"
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   created_at:
 *                     type: string
 *                     example: "2024-09-02T07:11:31.000Z"
 */

router.get('/', (req, res) => {
    const sql = 'SELECT id, email, username, role, basket, favorites FROM users'
    dbQuery(sql, [req.params.id]).then((results) => {
        res.status(200).json(results)
    }).catch((error)=>{
        res.status(500).send({'error': error.message})
    })
})

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "Toto@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "Dupont"
 *               firstname:
 *                 type: string
 *                 example: "Jean"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body.user
    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';
    dbQuery(sql, [email, hashedPassword, username]).then(() => {
        res.sendStatus(201)
    }).catch((error) => {
        res.status(500).send({'error':error.message})
    })
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "Toto@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "<JWT_TOKEN>"
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body.user

    const sql = 'SELECT * FROM users WHERE email = ?'
    dbQuery(sql, [email]).then(async (results) => {
        if (results.length === 0) {
            res.status(401).send({'error': 'Email ou mot de passe incorrect'})
        }
        const user = results[0]
        if(!compare(password, user.password)) {
            res.sendStatus(401)
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET
        )

        res.status(200).json({token: token})
    }).catch((error)=>{
        res.status(500).send({'error': error.message})

    })
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations du profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 */
router.get('/:id', (req, res) => {
    const sql = 'SELECT id, email, username, role, basket, favorites FROM users WHERE id = ?'
    dbQuery(sql, [req.params.id]).then((results) => {
        res.status(200).json(results[0])
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})


//TODO: Update Swagger

module.exports = router;
