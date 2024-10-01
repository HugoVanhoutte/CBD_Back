const express = require('express')
const dbQuery = require('../config/dbQuery')
const checkToken = require("../middleware/checkToken");
const router = express.Router()

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM products'
    dbQuery(sql).then((results) => {
        res.status(200).json(results)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

router.get('/:id', async (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?'
    dbQuery(sql, [req.params.id]).then((results) => {
        res.status(200).json(results)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

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
        res.sendStatus(201)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

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
        results.affectedRows === 0 ? res.sendStatus(404) : res.sendStatus(200)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

router.put('/update/:id', async (req, res) => {
    const product = req.body.product
    const values = [product.name, product.description, product.price, product.images, req.params.id]
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, images = ? WHERE id = ?'
    dbQuery(sql, values).then((results) => {
        results.length === 0 ? res.sendStatus(404) : res.sendStatus(200)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})
module.exports = router