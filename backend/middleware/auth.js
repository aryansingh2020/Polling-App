const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(verified.role)) {
        return res.status(403).send('Access denied');
      }
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).send('Invalid token');
    }
  };
};

module.exports = auth;
