var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));


/* GET home page. */
router.post('/create', function (req, res, next) {
    let id = new Date().getTime();
    let name = req.body.name;
    let tasktext = req.body.tasktext;
    let priority = +req.body.priority;
    let _id = new ObjectId(req.body.column);

    let newTask = { id, name, tasktext, priority }

    req.app.locals.db.collection("columns").updateOne({ _id }, { $push: { tasks: newTask } }, function (err) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.redirect(process.env.CLIENT_URL);
        }
    });
});

module.exports = router;
