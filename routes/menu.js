const express = require('express');
const router = express.Router();

/* GET menu page. */
router.get('/', function (req, res) {
  res.render('menu', { user: req.user });
});

module.exports = router;
