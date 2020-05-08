/** Index route module.
 * @module routes/index
 */

/** Require module for express lightweight middleware.
 * @requires express
 */
const express = require('express');

/** Require module for express router.
 * @requires Router
 */
const router = express.Router();

/** GET home page.
 * @name get/
 * @param {object} req - Request
 * @param {object} res - Response
 */
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;