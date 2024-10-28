const express = require('express')
const dbQuery = require('../config/dbQuery')
const checkToken = require("../middleware/checkToken");
const router = express.Router()

//Get every category
router.get('/', async (req, res) => {
    const sql = "SELECT * FROM categories"
    dbQuery(sql)
    .then((results) => {
        res.status(200).json(results)
    })
    .catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

//Get all main category (no parents)
router.get('/main', async (req, res) => {
    const sql = "SELECT * FROM categories WHERE parent_id IS NULL"
    dbQuery(sql)
    .then((results) => {
        res.status(200).json(results)
    })
    .catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

//Get 1 category by id
router.get('/:id', async (req, res) => {
    const sql = "SELECT * FROM categories WHERE id= ?"
    dbQuery(sql, [req.params.id])
    .then((results) => {
        res.status(200).json(results[0])
    })
    .catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

//Get all categories from parent (by parent id)
router.get('/from_parent/:id', async (req, res) => {
    const sql = "SELECT * FROM categories WHERE parent_id = ?"
    dbQuery(sql, [req.params.id])
    .then((results) => {
        res.status(200).json(results)
    })
    .catch((error) => {
        res.status(500).send({'error': error.message})
    })
})
//removes 1 category (by id)
router.delete('/:id', async (req, res) => {
    const decoded = checkToken(req.headers.authorization)
    if (decoded.role !== 'admin') {
        res.status(403).send({'error': 'User is not admin'})
    } else {
        const sql = "DELETE FROM categories WHERE id = ?"
        dbQuery(sql, [req.params.id])
        .then(() => {
            res.sendStatus(200)
        })
        .catch((error) => {
            res.status(500).send({'error': error.message})
        })
    }
})

//Create category
router.post('/', async (req, res) => {
    const decoded = checkToken(req.headers.authorization)
    if (decoded.role !== 'admin') {
        res.status(403).send({'error': 'User is not admin'})
    } else {
        const sql = "INSERT INTO categories (parent_id, name) VALUES (?, ?)"
        dbQuery(sql, [req.body.category.parent_id, req.body.category.name])
        .then(() => {
            res.sendStatus(201)
        })
        .catch((error) => {
            res.status(500).send({'error': error.message})
        })
    }
})

//Updates a category
router.put('/:id', async (req, res) => {
    const decoded = checkToken(req.headers.authorization)
    if (decoded.role !== 'admin') {
        res.status(403).send({'error': 'User is not admin'})
    } else {
        const sql = "UPDATE categories SET name = ?, parent_id = ? WHERE id = ? "
        dbQuery(sql, [req.body.category.name, req.body.category.parent_id, req.params.id])
            .then(() => {
                res.sendStatus(200)
            })
            .catch((error) => {
                res.status(500).send({'error': error.message})
            })
    }
})

router.get('/get-categories-by-product/:product_id', async (req, res) => {
    const sql = "SELECT category_id FROM products_categories WHERE product_id = ?"
    dbQuery(sql, [req.params.product_id])
        .then((results) => {
            const response = results.map(item => item.category_id);
            res.status(200).json(response)
        })
        .catch((error) => {
            res.status(500).send({'error': error.message})
        })
})

module.exports = router
