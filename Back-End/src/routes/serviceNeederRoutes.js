const express = require('express');
const { 
  registerServiceNeeder, 
  loginServiceNeeder, 
  findMatchingProviders 
} = require('../controllers/serviceNeederController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerServiceNeeder);
router.post('/login', loginServiceNeeder);
router.post('/find-providers', authMiddleware, async (req, res, next) => {
  try {
    await findMatchingProviders(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;