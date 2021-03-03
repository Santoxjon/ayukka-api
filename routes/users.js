var express = require('express');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET users listing. */
router.get('/', function (req, res, next) {
  req.app.locals.db.collection("users").find().sort({ "name": 1 }).toArray(function (err, data) {
    if (err != null) {
      console.log(err);
      res.send({ mensaje: "error: " + err });
    } else {
      res.json(data)
    }
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  console.log(process.env.PORT);
  res.json({status: "Ok"});
});

module.exports = router;