/** Menu route module.
 * @module routes/menu
 */

/** Require module for express lightweight middleware.
 * @requires express
 */
const express = require('express');

/** Require module for express router.
 * @requires Router
 */
const router = express.Router();

/** GET menu page.
 * @name get/
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {object} user - User
 */
router.get('/', function(req, res) {
  res.render('menu', {user:req.user});
});

module.exports = router;
