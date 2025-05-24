const ErrorResponse = require('../utils/errorResponse');
const Poll = require('../models/Poll');
const User = require('../models/User');

// @desc    Get all polls
// @route   GET /api/v1/polls
// @access  Public
exports.getPolls = async (req, res, next) => {
  try {
    let query;

    // If user is not admin, only show non-closed polls
    if (req.user && req.user.role === 'admin') {
      query = Poll.find().populate('createdBy', 'username');
    } else {
      query = Poll.find({ isClosed: false }).populate('createdBy', 'username');
    }

    const polls = await query.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: polls.length,
      data: polls,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single poll
// @route   GET /api/v1/polls/:id
// @access  Public
exports.getPoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      'createdBy',
      'username'
    );

    if (!poll) {
      return next(
        new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404)
      );
    }

    // If poll is closed and user is not admin, check if user has voted
    if (poll.isClosed && req.user && req.user.role !== 'admin') {
      if (!poll.voters.includes(req.user.id)) {
        return next(
          new ErrorResponse('Not authorized to view results of this poll', 401)
        );
      }
    }

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new poll
// @route   POST /api/v1/polls
// @access  Private/Admin
exports.createPoll = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Validate options
    if (!req.body.options || req.body.options.length < 2) {
      return next(
        new ErrorResponse('Please provide at least two options for the poll', 400)
      );
    }

    // Check for duplicate options
    const optionTexts = req.body.options.map((option) => option.text);
    if (new Set(optionTexts).size !== optionTexts.length) {
      return next(new ErrorResponse('Poll options must be unique', 400));
    }

    const poll = await Poll.create(req.body);

    res.status(201).json({
      success: true,
      data: poll,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update poll
// @route   PUT /api/v1/polls/:id
// @access  Private/Admin
exports.updatePoll = async (req, res, next) => {
  try {
    let poll = await Poll.findById(req.params.id);

    if (!poll) {
      return next(
        new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is poll owner or admin
    if (poll.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this poll`,
          401
        )
      );
    }

    // Validate options if they are being updated
    if (req.body.options) {
      if (req.body.options.length < 2) {
        return next(
          new ErrorResponse('Please provide at least two options for the poll', 400)
        );
      }

      // Check for duplicate options
      const optionTexts = req.body.options.map((option) => option.text);
      if (new Set(optionTexts).size !== optionTexts.length) {
        return next(new ErrorResponse('Poll options must be unique', 400));
      }
    }

    poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete poll
// @route   DELETE /api/v1/polls/:id
// @access  Private/Admin
exports.deletePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return next(
        new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is poll owner or admin
    if (poll.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this poll`,
          401
        )
      );
    }

    await poll.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Vote on a poll
// @route   PUT /api/v1/polls/:id/vote
// @access  Private
exports.vote = async (req, res, next) => {
  try {
    const { optionId } = req.body;

    if (!optionId) {
      return next(new ErrorResponse('Please provide an option to vote for', 400));
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return next(
        new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if poll is closed
    if (poll.isClosed) {
      return next(new ErrorResponse('This poll is already closed', 400));
    }

    // Check if user has already voted
    if (poll.voters.includes(req.user.id)) {
      return next(new ErrorResponse('You have already voted on this poll', 400));
    }

    // Find the option and increment votes
    const option = poll.options.id(optionId);
    if (!option) {
      return next(new ErrorResponse('Option not found', 404));
    }

    option.votes += 1;
    poll.voters.push(req.user.id);

    await poll.save();

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Close poll manually
// @route   PUT /api/v1/polls/:id/close
// @access  Private/Admin
exports.closePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return next(
        new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is poll owner or admin
    if (poll.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to close this poll`,
          401
        )
      );
    }

    // Check if poll is already closed
    if (poll.isClosed) {
      return next(new ErrorResponse('This poll is already closed', 400));
    }

    poll.isClosed = true;
    await poll.save();

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (err) {
    next(err);
  }
};