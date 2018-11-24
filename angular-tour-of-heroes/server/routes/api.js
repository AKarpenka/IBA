const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

// Connect
const connection = (closure) => {
  return MongoClient.connect('mongodb://Nastya:12345n@ds253783.mlab.com:53783/heroes', {
    useNewUrlParser: true
  }, (err, db) => {
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

//add a hero to the database
router.post('/heroes', function(req, res) {
  connection((dbo) => {
    dbo.collection('heroes').insertOne(req.body, function(err, result) {
      if (err) {
        sendError(err, res);
      }
      res.send(result.ops[0]);
    });
  });
});

//search one hero
router.get('/detail/:id', function(req, res) {
  connection((dbo) => {
    const id = req.params.id;
    const details = {
      '_id': new ObjectID(id)
    };
    dbo.collection('heroes').findOne(details, function(err, doc) {
      if (err) {
        sendError(err, res);
      }
      res.send(doc);
    });
  });
});

//search one hero in dashboard
router.get('/dashboard', function(req, res) {
  connection((dbo) => {
    dbo.collection('heroes').find(req.body.name)
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

//hero update
router.put('/detail/:id', function(req, res) {
  connection((dbo) => {
    const _id = {
      '_id': new ObjectID(req.body._id)
    };
    dbo.collection('heroes').update(
      _id, {
        "name": req.body.name
      },
      function(err, result) {
        if (err) {
          sendError(err, res);
        } else {
          res.send(result);
        }
      }
    );
  });
});

//hero removal
router.delete('/heroes/:id', function(req, res) {
  connection((dbo) => {
    const id = req.params.id;
    const details = {
      '_id': new ObjectID(id)
    };
    dbo.collection('heroes').remove(details, function(err, result) {
      if (err) {
        sendError(err, res);
      }
      res.send(result);
    });
  });
});

module.exports = router;
