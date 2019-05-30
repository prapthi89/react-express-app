var express = require('express');
var app = express();
const mongoose = require('mongoose');
// this is our MongoDB database
var url = 'mongodb://localhost/EmployeeDB';
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
app.use(cors());
const router = express.Router();

// connects our back end code with the database
mongoose.connect(
  url,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err});
    return res.json({ success: true, data: data});
  });
});

router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  var numId = Number(id);
  console.log("id : " + numId);
  Data.findOneAndUpdate({id: numId}, update, err => {
    if (err) return res.json({ success: false, err: err});
    return res.json({ success: true});
  });
});

router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  console.log("ID to delete : " + id);
  var numId = Number(id);
  console.log("ID : " + numId);
  Data.findOneAndDelete({id: numId}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.post("/insertData", (req, res) => {
  let data = new Data();
  const { id, message } = req.body;

  if ((!id && id != 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUT"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);
app.listen(API_PORT, () => console.log('LISTENING ON PORT ${API_PORT}'));
