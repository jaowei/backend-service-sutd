const express = require('express')
const Item = require('../models/item')

module.exports = (db) => {
  const router = express.Router()
  
  router.post('/', async (req, res, next) => {
    const uid = req.uid
    const { name, quantity } = req.body
    const newItem = new Item({ name, quantity, uid })
    const item = await db.insertItem(newItem)
    res.status(201).send(item)
  })

  router.get('/', async (req, res, next) => {
    const uid = req.uid
    console.log(uid)
    const items = await db.findAllItemsByUser(uid)
    console.log(items)
    res.send(items)
  })

  router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const item = await db.findItem(id)
    if (item) {
      res.send(item)
    } else {
      res.status(400).send(`Item id ${id} not found`)
    }
  })

  router.put('/:id', async (req, res, next) => {
    const uid = req.uid
    const id = req.params.id
    const { name, quantity } = req.body

    const userItems = await db.findAllItemsByUser(uid)
    const validItemIds = userItems.filter((el) => el.id === id)

    if (validItemIds.length > 0) {
      const updatedItem = new Item({ name, quantity, uid })
      const item = await db.updateItem(id, updatedItem)
      res.send(item)
    } else {
      res.status(400).send(`You are not authorised to edit this item`)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    const success = await db.deleteItem(id)
    if (success) {
      res.send(`Deleted item ${id} successfully`)
    } else {
      res.status(400).send(`Item id ${id} not found`)
    }
  })

  return router
}