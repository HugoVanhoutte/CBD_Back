const express = require('express')
const dbQuery = require('../config/dbQuery')
const checkToken = require("../middleware/checkToken")
const router = express.Router()

router.get('/', async (req, res) => {
    const sql = "SELECT * FROM orders"
    dbQuery(sql).then((results) => {
        console.log(results)
        res.status(200).json(results);
    }).catch((error) => {
        res.status(500).send({'error': error.message});
    })
})

router.get('/:id', async (req, res) => {
    //TODO: Check user token
    const sql = "SELECT * FROM orders WHERE id = ?"
    dbQuery(sql, [req.params.id]).then((results) => {
        res.status(200).json(results[0])
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})


router.post('/', async (req, res) => {
    const sql = "INSERT INTO orders (user_id, products) VALUES (?, ?)"
    const products = req.body.products
    const user_id = req.body.user_id
    //TODO Check User

    //checks if ids exists, if not, simply removes the product from the order
    for (const product of products) {
        const index = products.indexOf(product)
        const sqlProductCheck = "SELECT name FROM products WHERE id = ?"
        await dbQuery(sqlProductCheck, [product.id]).then((results) => {
            if (results.length === 0) {
                products.splice(index, 1)
            }
        }).catch((error)=> {
            res.status(500).send({'error': error.message})
        })
    }

    dbQuery(sql, [user_id, JSON.stringify(products)]).then(() => {
        res.sendStatus(201)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

router.delete('/:id', async (req, res) => {
    //TODO: Check token
    const sql = "DELETE FROM orders WHERE id = ?"
    dbQuery(sql, [req.params.id]).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

router.put('/:id', async (req, res) => {
    //TODO: Check token
    const sql = "UPDATE orders SET products = ? WHERE id = ?"
    dbQuery(sql, [req.params.id, req.params.id]).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        res.status(500).send({'error': error.message})
    })
})

module.exports = router