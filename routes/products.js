const express = require('express')
const dbQuery = require('../config/dbQuery')
const error = require("jsonwebtoken/lib/JsonWebTokenError");
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM products'
        res.status(200).send(await dbQuery(sql))
    } catch (error) {
        res.status(500).send({'error': error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const sql = 'SELECT * FROM products WHERE id = ?'
        res.status(200).send(await dbQuery(sql, [req.params.id]))
    } catch (error) {
        res.send({'error': error.message})
    }
})

router.post('/new', async (req, res) => {
    try {
        const product = req.body.product
        const values = [product.name, product.description, product.price, product.images]
        const sql = "INSERT INTO products (name, description, price, images) VALUES (?,?,?,?)"
        await dbQuery(sql, values)

        res.send(201).send({'success': 'product created successfully'})
    } catch (error) {
        res.status(500).send({'error': error.message})
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM products WHERE id = ?'
        res.send(await dbQuery(sql, [req.params.id]))
    } catch (error) {
        res.status(500).send({'error': error.message})
    }
})

router.put('/update/:id', async (req, res) => {
    try {
        const product = req.body.product
        const values = [product.name, product.description, product.price, product.images, req.params.id]
        const sql = 'UPDATE products SET name = ?, description = ?, price = ?, images = ? WHERE id = ?'
        await dbQuery(sql, values)
        res.status(200).send({'success': 'product updated successfully'})

    } catch (error) {
        res.status(500).send({'error': error.message})
    }
})
module.exports = router