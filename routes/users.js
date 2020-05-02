/** User route module.
 * @module routes/user
 */

/** Require module for express lightweight middleware.
 * @requires express
 */
const express = require('express');

/** Require module for express router.
 * @requires Router
 */
const router = express.Router();

/** GET user list page.
 * @name get/
 * @param {object} req - Request
 * @param {object} res - Response
 */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
