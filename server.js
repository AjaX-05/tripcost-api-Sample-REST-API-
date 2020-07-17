const express = require("express");
const mongo = require("mongodb").MongoClient;
const app = express();

const url = "mongodb://localhost:27017";

app.use(express.json());

let db, trips, expenses;

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    db = client.db("tripcost");
    trips = db.collection("trips");
    expenses = db.collection("expenses");
  }
);

// Adding/Inserting a new Trip

app.post("/trip", (req, res) => {
  const name = req.body.name;
  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    console.log(result);
    res.status(200).json({ ok: true });
  });
});

// Getting all Trip Id's and Names

app.get("/trips", (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ trips: items });
  });
});

//

app.post("/expense", (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip, //trip ID
      // date: req.body.date, ***(Date in ISO format)***
      amount: req.body.amount, //Price
      category: req.body.category, //Category
      description: req.body.description, //Description
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.send(500).json({ err: err });
        return;
      }
      res.status(200).send({ ok: true });
    }
  );
});

// Get all Expenses Details of a Particular ID
app.get("/expenses", (req, res) => {
  expenses.find({ trip: req.body.trip }).toArray((err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ trips: items });
  });
});

// Get all Expenses Details of all ID's
app.get("/expenses/all", (req, res) => {
  expenses.find().toArray((err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ trips: items });
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Server is Ready and Listening on PORT:${PORT}`)
);
