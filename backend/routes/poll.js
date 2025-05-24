const express = require('express');
const Poll = require('../models/Poll');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Poll (Admin)
router.post('/', auth(['admin']), async (req, res) => {
  const { question, options, expiresAt } = req.body;
  const poll = new Poll({
    question,
    options: options.map(text => ({ text })),
    createdBy: req.user.id,
    expiresAt
  });
  await poll.save();
  res.status(201).json(poll);
});

// Get All Polls
router.get('/', auth(), async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

// Vote (User)
router.post('/:id/vote', auth(['user']), async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll || new Date() > new Date(poll.expiresAt)) return res.status(400).send('Poll expired or not found');

  const user = await User.findById(req.user.id);
  if (user.votedPolls.includes(poll._id)) return res.status(400).send('Already voted');

  const optionIndex = req.body.optionIndex;
  poll.options[optionIndex].votes += 1;
  await poll.save();

  user.votedPolls.push(poll._id);
  await user.save();

  res.send('Vote recorded');
});

// Delete Poll (Admin)
router.delete('/:id', auth(['admin']), async (req, res) => {
  await Poll.findByIdAndDelete(req.params.id);
  res.send('Poll deleted');
});

module.exports = router;
