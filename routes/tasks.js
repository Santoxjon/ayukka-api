var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));


/* GET home page. */
router.post('/create', function (req, res, next) {
    let id = parseInt(new Date().getTime());
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

router.get('/:column_id/:task_id', function (req, res, next) {
    const _id = new ObjectId(req.params.column_id);
    const id = req.params.task_id;

    req.app.locals.db.collection("columns").findOne({ _id }, function (err, data) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json(data)
        }
    });
});

router.put('/update', function (req, res, next) {
    let _id = new ObjectId(req.body.columnId);
    let id = req.body.taskId;
    let name = req.body.name;
    let tasktext = req.body.tasktext;
    let priority = req.body.priority;

    req.app.locals.db.collection("columns").aggregate(
        [
            {
                $match: { _id }
            },
            {
                $project:
                {
                    index: { $indexOfArray: ["$tasks.id", id] },
                }
            }
        ]
    ).toArray(
        function (err, data) {
            if (err != null) {
                console.log(err);
                res.send({ mensaje: "error: " + err });
            } else {
                req.app.locals.db.collection("columns").updateOne(
                    { _id },
                    {
                        $set: {
                            [`tasks.${data[0].index}.name`]: name,
                            [`tasks.${data[0].index}.tasktext`]: tasktext,
                            [`tasks.${data[0].index}.priority`]: priority,
                        }
                    },
                    function (err) {
                        if (err != null) {
                            console.log(err);
                            res.send({ mensaje: "error: " + err });
                        } else {
                            res.json('Exito');
                        }
                    }
                )
            }
        })
});

router.delete('/delete', function (req, res, next) {
    let _id = new ObjectId(req.body.columnId);
    let id = req.body.taskId;

    req.app.locals.db.collection("columns").update(
        { _id },
        { $pull: { tasks: { id } } }
        ,
        function (err) {
            if (err != null) {
                console.log(err);
                res.send({ mensaje: "error: " + err });
            } else {
                res.json('Exito');
            }
        }
    )
});

router.put('/move', function (req, res, next) {
    let _id = new ObjectId(req.body.columnId);
    let newColumnId = new ObjectId(req.body.newColumnId);
    let id = +req.body.taskId;

    console.log("Column id: " + _id);
    console.log("Task id: " + id);
    console.log("New column id: " + newColumnId);

    req.app.locals.db.collection("columns").findOne({ _id }, function (err, data) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            let task = data.tasks.filter(task => task.id === id)[0];

            req.app.locals.db.collection("columns").update(
                { _id },
                { $pull: { tasks: { id: task.id } } }
                ,
                function (err) {
                    if (err != null) {
                        console.log(err);
                        res.send({ mensaje: "error: " + err });
                    } else {
                        req.app.locals.db.collection("columns").updateOne({ "_id": newColumnId }, { $push: { tasks: task } }, function (err) {
                            if (err != null) {
                                console.log(err);
                                res.send({ mensaje: "error: " + err });
                            } else {
                                res.json("Success")
                            }
                        });
                    }
                }
            )

        }
    });
});

module.exports = router;
