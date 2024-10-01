
const express = require('express')
const dbQuery = require('../config/dbQuery')
const checkToken = require("../middleware/checkToken");
const router = express.Router()

const express = require('express');
const dbQuery = require('../config/dbQuery');
const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupérer tous les produits
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Produit A"
 *                   description:
 *                     type: string
 *                     example: "Description du produit A"
 *                   price:
 *                     type: number
 *                     example: 99.99
 *                   images:
 *                     type: string
 *                     example: "image-url.jpg"
 */
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';
    dbQuery(sql).then((results) => {
        res.status(200).json(results);
    }).catch((error) => {
        res.status(500).send({'error': error.message});
    });
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à récupérer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails du produit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Produit A"
 *                 description:
 *                   type: string
 *                   example: "Description du produit A"
 *                 price:
 *                   type: number
 *                   example: 99.99
 *                 images:
 *                   type: string
 *                   example: "image-url.jpg"
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', async (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    dbQuery(sql, [req.params.id]).then((results) => {
        res.status(200).json(results);
    }).catch((error) => {
        res.status(500).send({'error': error.message});
    });
});

/**
 * @swagger
 * /products/new:
 *   post:
 *     summary: Créer un nouveau produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Nouveau Produit"
 *                   description:
 *                     type: string
 *                     example: "Description du nouveau produit"
 *                   price:
 *                     type: number
 *                     example: 199.99
 *                   images:
 *                     type: string
 *                     example: "image-url.jpg"
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       500:
 *         description: Erreur serveur
 */
router.post('/new', async (req, res) => {
    /*
    try {
        checkToken(req.body.token)
    } catch (error) {
        throw error
    }
     */
    const product = req.body.product
    const values = [product.name, product.description, product.price, product.images]
    const sql = "INSERT INTO products (name, description, price, images) VALUES (?,?,?,?)"
    dbQuery(sql, values).then(() => {
        res.sendStatus(201);
    }).catch((error) => {
        res.status(500).send({'error': error.message});
    });
});

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Supprimer un produit par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:id', async (req, res) => {
    /*
    try {
        checkToken(req.body.token)
    } catch (error) {
        throw error
    }
    */
    const sql = 'DELETE FROM products WHERE id = ?'
    dbQuery(sql, [req.params.id]).then((results) => {
        results.affectedRows === 0 ? res.sendStatus(404) : res.sendStatus(200);
    }).catch((error) => {
        res.status(500).send({'error': error.message});
    });
});

/**
 * @swagger
 * /products/update/{id}:
 *   put:
 *     summary: Mettre à jour un produit par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à mettre à jour
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Produit mis à jour"
 *                   description:
 *                     type: string
 *                     example: "Nouvelle description"
 *                   price:
 *                     type: number
 *                     example: 149.99
 *                   images:
 *                     type: string
 *                     example: "new-image-url.jpg"
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', async (req, res) => {
    const product = req.body.product;
    const values = [product.name, product.description, product.price, product.images, req.params.id];
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, images = ? WHERE id = ?';
    dbQuery(sql, values).then((results) => {
        results.length === 0 ? res.sendStatus(404) : res.sendStatus(200);
    }).catch((error) => {
        res.status(500).send({'error': error.message});
    });
});

module.exports = router;
