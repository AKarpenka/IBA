const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://Nastya:12345n@ds253783.mlab.com:53783/heroes',{ useNewUrlParser: true }, (err, db) => {
        if (err) return console.log(err);

        let dbo = db.db("heroes");
        closure(dbo);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/heroes', (req, res) => {
    connection((dbo) => {
        dbo.collection('heroes')
            .find()
            .toArray()
            .then((heroes) => {
                response.data = heroes;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;
