var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("This isn't the page you are looking for...")
});

module.exports = router;
