const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const dbQuery = require('../config/dbQuery')


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
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);

        const users = results.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            firstname: user.firstname,
            role: user.role,
            created_at: user.created_at
        }));

        res.status(200).json(users);
    });
});

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
    console.log(req.body)
    const { email, password, name, firstname, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (email, password, name, firstname, role) VALUES (?, ?, ?, ?, ?)';
    dbQuery(sql, [email, hashedPassword, name, firstname, role]).then(() => {
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
 *     description: Permet à un utilisateur de se connecter avec son email et son mot de passe. Si l'utilisateur n'existe pas, il est créé automatiquement.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: "Toto@example.com"
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *       201:
 *         description: Utilisateur créé et connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Identifiants invalides"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    const selectSql = 'SELECT * FROM users WHERE email = ?';
    dbQuery(selectSql, [email])
        .then(async (results) => {
            if (results.length > 0) {
                // L'utilisateur existe, vérification du mot de passe
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    res.status(200).json({ message: 'Connexion réussie' }); // Connexion réussie
                } else {
                    res.status(401).json({ error: 'Identifiants invalides' }); // Mauvais mot de passe
                }
            } else {
                // L'utilisateur n'existe pas, création automatique
                const hashedPassword = await bcrypt.hash(password, 10);
                const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
                dbQuery(insertSql, [email, hashedPassword])
                    .then(() => {
                        res.status(201).json({ message: 'Utilisateur créé avec succès' }); // Utilisateur créé
                    })
                    .catch((error) => {
                        res.status(500).json({ error: error.message }); // Erreur serveur lors de la création
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error.message }); // Erreur serveur lors de la sélection
        });
});

module.exports = router;

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
router.get('/profile', (req, res) => {
    res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    });
});

module.exports = router;
