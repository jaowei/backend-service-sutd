const Item = require('../models/item')

const ITEMS = []

const db = {}

db.insertItem = (item) => {
  const newItem = new Item({
    ...item,
    id: ITEMS.length + 1
  })
  ITEMS.push(newItem)
  return newItem
}

db.findAllItems = () => {
  return [...ITEMS]
}

db.findItem = (id) => {
  id = Number(id)
  return ITEMS.find(item => item.id === id)
}

db.updateItem = (id, item) => {
  id = Number(id)
  const idx = ITEMS.findIndex(item => item.id === id)
  if (idx === -1) {
    return null
  } else {
    const updatedItem = new Item({
      ...item,
      id
    })
    ITEMS.splice(idx, 1, updatedItem)
    return updatedItem
  }
}

db.deleteItem = (id) => {
  id = Number(id)
  const idx = ITEMS.findIndex(item => item.id === id)
  if (idx === -1) {
    return false
  } else {
    ITEMS.splice(idx, 1)
    return true
  }
}

module.exports = db