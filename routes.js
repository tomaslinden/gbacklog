const express = require('express');
const User = require('./user');

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
});

module.exports = router
