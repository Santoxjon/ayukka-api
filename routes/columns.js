const { ObjectId } = require('bson');
var express = require('express');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', (req, res) => {
    req.app.locals.db.collection("columns").find().sort({ "_id": 1 }).toArray(function (err, data) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json(data)
        }
    });
});

router.get('/:col_id', (req, res) => {
    let _id = new ObjectId(req.params.col_id);
    req.app.locals.db.collection("columns").findOne({ _id }, function (err, data) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json(data)
        }
    });
});

router.put('/:col_id/updateCol', (req, res) => {
    let _id = new ObjectId(req.body.columnId);
    let name = req.body.name;
    let description = req.body.description
    let color = req.body.color;

    req.app.locals.db.collection("columns").updateOne({ _id }, { $set: { name, description, color } }, (err) => {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json('Exito');
        }
    }
    )
});

router.delete('/:col_id/deleteCol', (req, res) => {
    let _id = new ObjectId(req.body.columnId);

    req.app.locals.db.collection("columns").deleteOne({ _id }, (err) => {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json('Exito');
        }
    }
    )
});

router.post('/create', (req, res) => {
    let name = req.body.columnName;
    let description = req.body.columnDesc;
    let color = req.body.color;
    let tasks = [];

    req.app.locals.db.collection("columns").insertOne({ name, description, color, tasks }, function (err) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.redirect(process.env.CLIENT_URL);
        }
    });
});

module.exports = router;
