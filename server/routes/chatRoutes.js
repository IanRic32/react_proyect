const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Obtener todos los chats
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo chat
router.post('/', async (req, res) => {
  const chat = new Chat({
    title: req.body.title,
    messages: req.body.messages
  });

  try {
    const newChat = await chat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;