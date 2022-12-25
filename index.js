'use strict'
// index.js
// This is our main server file

// A static server using Node and Exswspress
const express = require("express");
// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");

const fetch = require("cross-fetch");
// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}






/* start of code run on start-up */
// create object to interface with express
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
// Code in this section sets up an express pipeline


/* Starting on the server, add code to handle a new GET request, "/getTwoVideos". This should pick two distict random videos (that is, not the same), and send an array containing their VideoTable data in the HTTP response. Notice the handy function "getRandomInt" at the top of "index.js".*/

///////////////////////////////////////////////////////
app.get("/getTwoVideos", (req, res) => {
  getVideo()


    .then(function(result) {
      res.json(result)
    })

    .catch(function(err) {
      console.log("db error", err)
    })

})

async function getVideo() {
  const arr = [];
  let i = 0;
  let j = 0
  while (j < 8) {
    let IDs = await db.get('select * from VideoTable where rowIdNum = ' + i);
    if (IDs != undefined) {
      arr.push(IDs.rowIdNum)
      j++;

    }
    i++;

  }
  //console.log("bruh/ Here are your IDs. take care. ", arr);
  let num1 = arr[getRandomInt(8)]
  let num2 = arr[getRandomInt(8)]
  while (num2 == num1) {
    num2 = arr[getRandomInt(8)]
  }
  // warning! You can only use ? to replace table data, not table name or column name.
  const sql1 = 'select * from VideoTable where rowIdNum = ' + num1;
  const sql2 = 'select * from VideoTable where rowIdNum = ' + num2;
  // console.log("THIS IS A YESY", sql1, sql2);

  let result1 = await db.get(sql1);
  let result2 = await db.get(sql2);
  //console.log(result1.url, "\n", result2.url);
  let result = [result1, result2];
  //console.log("THis is the resukt", result);
  return result;
}






app.post("/insertPref", (req, res) => {

  console.log(req.body, "this is the bit I care about.")
  //setPreference(req.body[0], req.body[1])
  Checker(req.body[0], req.body[1])
    .then(function(result) {
      //res.json(result)
      if (result) {
        res.send("continue");
      }
      else {
        res.send("pickWinner")

      }
    })

    .catch(function(err) {
      console.log("setPreference error", err)
    })

})



async function Checker(pref1, pref2) {


  async function insertAndCount(pref1, pref2) {
    const tableContents = await dumpTable();
    console.log("Length before insert: ", tableContents.length);
    if (tableContents.length < 14) { // win run 15 times
      await setPreference(pref1, pref2)
      // console.log("video was not inserted");
      return 1;
    } else {
      await setPreference(pref1, pref2)
      return 0;
      // console.log("TABLE CONTENTS: ", tableContents);

    }

  }
  let returnV = await insertAndCount(pref1, pref2)
    .catch(function(err) {
      console.log("db error", err)
    })
  return returnV;
}


async function setPreference(pref1, pref2) {
  // we can just check if the first rowID is unloved. is so, set it to worse and the other one to better.


  console.log("testing",)


  const sql = "insert into PrefTable (better, worse) values (?, ?)";
  await db.run(sql, pref1, pref2);
  console.log("VIDEO IS BEING INSERTTED")
  // console.log("video was inserted");


  return 1;
}






async function dumpTable() {
  const sql = "select * from PrefTable"

  let result = await db.all(sql)
  return result;
}

////////////////////////////////////////////////////////// */
// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
    // change parameter to "true" to get it to computer real winner based on PrefTable 
    // with parameter="false", it uses fake preferences data and gets a random result.
    // winner should contain the rowId of the winning video.
    let winner = await win.computeWinner(8, false);
    winInfo(winner)
      .then(function(result) {// you'll need to send back a more meaningful response here.
        res.json(result)
      })

  } catch (err) {
    res.status(500).send(err);
  }
});

async function winInfo(id) {
  const sql = 'select * from VideoTable where rowIdNum = ?';
  // console.log("THIS IS A YESY", sql1, sql2);

  let result = await db.get(sql, [id]);

  //console.log("THis is the resukt", result);
  return result;

}


// Page not found
app.use(function(req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

