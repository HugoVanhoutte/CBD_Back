const express = require('express')
const dbQuery = require('../config/dbQuery')
const checkToken = require("../middleware/checkToken")
const router = express.Router()

router.get('/', async (req, res) => {
    const decoded = checkToken(req.headers.authorization)
    if (decoded.role !== 'admin') {
        res.status(403).send({'error': 'User is not admin'})
    } else {
        const sql = "SELECT * FROM orders"
        dbQuery(sql)
            .then((results) => {
                res.status(200).json(results);
            })
            .catch((error) => {
                res.status(500).send({'error': error.message});
            })
    }
})

router.get('/:id', async (req, res) => {
    const decoded = checkToken(req.headers.authorization)
    if (decoded.role !== 'admin') {
        res.status(403).send({'error': 'User is not admin'})
    } else {
        const sql = "SELECT * FROM orders WHERE id = ?"
        dbQuery(sql, [req.params.id])
            .then((results) => {
                res.status(200).json(results[0])
            })
            .catch((error) => {
                res.status(500).send({'error': error.message})
            })
    }
})


router.post('/', async (req, res) => {
    if (!checkToken(req.headers.authorization)) {
        res.sendStatus(401)
    } else {
        const sql = "INSERT INTO orders (user_id, products) VALUES (?, ?)"
        const products = req.body.products
        const user_id = req.body.user_id

        //checks if ids exists, if not, simply removes the product from the order
        for (const product of products) {
            const index = products.indexOf(product)
            const sqlProductCheck = "SELECT name FROM products WHERE id = ?"
            await dbQuery(sqlProductCheck, [product.id])
                .then((results) => {
                    if (results.length === 0) {
                        products.splice(index, 1)
                    }
                })
                .catch((error) => {
                    res.status(500).send({'error': error.message})
                })
        }

        dbQuery(sql, [user_id, JSON.stringify(products)]).then(() => {
            res.sendStatus(201)
        }).catch((error) => {
            res.status(500).send({'error': error.message})
        })
    }
})

router.delete('/:id', async (req, res) => {
    const decoded = checkToken(req.headers.authorization)
    if (!decoded) {
        res.sendStatus(401)
    } else {
        const sql = "DELETE FROM orders WHERE id = ?"
        dbQuery(sql, [req.params.id])
            .then((results) => {
                //TODO: check if user is either admin or the user who created this order (A TESTER)
                results.user_id === decoded.id || decoded.role === 'admin' ? res.sendStatus(200) : res.sendStatus(401)
            })
            .catch((error) => {
                res.status(500).send({'error': error.message})
            })
    }
})

router.put('/:id', async (req, res) => {
    const decoded = checkToken(req.headers.authorization)
    if (!decoded) {
        res.sendStatus(401)
    } else {
        const sql = "UPDATE orders SET products = ? WHERE id = ?"
        dbQuery(sql, [req.params.id, req.params.id])
            .then((results) => {
                //TODO: check if user is either admin or the user who created this order (A TESTER)
                results.user_id === decoded.id || decoded.role === 'admin' ? res.sendStatus(200) : res.sendStatus(401)
            })
            .catch((error) => {
                res.status(500).send({'error': error.message})
            })
    }
})

module.exports = router
