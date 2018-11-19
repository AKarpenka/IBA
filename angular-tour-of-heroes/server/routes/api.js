const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');

//чтобы правильно парсить json, который передали в body
router.use(bodyParser.json());
//чтобы правильно парсить данные формы
router.use(bodyParser.urlencoded({ extended: true }));

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

//add a hero to the database
router.post('/heroes', function (req, res){
  connection((dbo) => {
    dbo.collection('heroes').insert(hero, function (err, res) {
      if (err) {
        sendError(err, res);
      }
      res.send(hero);
    });
  });
});

//hero search
router.get('/dashboard/:id', function (req, res) {
  connection((dbo) => {
    dbo.collection('heroes').findOne({ id: req.body.id }, function (err, doc) {
      if (err) {
        sendError(err, res);
      }
      res.send(doc);
    });
  });
});

//обновление героя
router.put('/detail/:id', function (req, res) {
  connection((dbo) => {
    dbo.collection('heroes').updateOne(
      //элемент, который находит
      { id: req.body.id },
      //что обновляем
      { name: req.body.name },
      function (err, result) {
        if (err) {
          sendError(err, res);
        }
        // здесь нужен код, если все норм
      }
    );
  });
});

//удаление героя
router.delete('/heroes/:id', function (req, res) {
  connection((dbo) => {
    dbo.collection('heroes').deleteOne(
      //условие
      { id: req.body.id },
      function (err, result) {
        if (err) {
          sendError(err, res);
        }
        // здесь нужен код, если все норм
      }
    );
  });
});

module.exports = router;
