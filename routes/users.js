var express = require('express');
var router = express.Router();
ObjectID = require('mongodb').ObjectID;

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET users listing. */
router.get('/', (req, res, next) => {
  req.app.locals.db.collection("users").find().sort({ "name": 1 }).toArray(function (err, data) {
    if (err != null) {
      console.log(err);
      res.send({ mensaje: "error: " + err });
    } else {
      res.json(data)
    }
  });
});

router.get('/:id', (req, res) => {
  let id = new ObjectId(req.params.id);
  res.send(id);
});

router.get('/check/:username', (req, res) => {
  let userName = req.params.username;

  req.app.locals.db.collection("users").findOne({ userName }, function (err, data) {
    if (err != null) {
      console.log(err);
      res.send({ mensaje: "error: " + err });
    } else {
      let response = data == null ? { registered: false } : { registered: true };
      res.json(response)
    }
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  console.log(process.env.PORT);
  res.json({ status: "Ok" });
});

module.exports = router;