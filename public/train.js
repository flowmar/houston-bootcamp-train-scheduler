"use strict";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBxb0Xg38kI4YclVCdetdlGRWU5dckB0sA",
  authDomain: "train-scheduler-216e6.firebaseapp.com",
  databaseURL: "https://train-scheduler-216e6.firebaseio.com",
  projectId: "train-scheduler-216e6",
  storageBucket: "train-scheduler-216e6.appspot.com",
  messagingSenderId: "391022964912"
};

firebase.initializeApp(config);

// Create reference to firebase
const db = firebase.database();

// Create a reference to the data stored in the table
const trains = db.ref();

// Create a global variable for the train data
let trainData;
let trainName;
// let destination;
// let frequency;
// let nextArrival;
// let minutesAway;

// Clears out the user input boxes
function clearBoxes() {
  $("#trainName").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#firstTrainTime").val("");
}

// Creates a table based on the preexisting data in the database
function createTable() {
  // Loop through the data from Firebase and set the train attributes to variables
  for (let i = 0; i < Object.keys(trainData).length; i++) {
    let trainName = trainData[i].trainName;
    let destination = trainData[i].destination;
    let frequency = trainData[i].frequency;
    let nextArrival = trainData[i].nextArrival;
    let minutesAway = trainData[i].minutesAway;
    let firstTrainTime = trainData[i].firstTrainTime;
    console.log("Train Number: " + i);
    console.log("Train Name: " + trainName);
    console.log("Destination: " + destination);
    console.log("Frequency: " + frequency);

    // Loop through the data and create a row in the HTML table for every entry
    $("#tbody").append(
      '<tr><td class="font-weight-bold lead h1">' +
        trainName +
        '</td><td class="font-italic lead text-uppercase">' +
        destination +
        '</td><td class="lead">' +
        frequency +
        '</td><td class="lead">' +
        nextArrival +
        '</td><td class="lead">' +
        minutesAway +
        "</td></tr>"
    );
  }

  // Use the firstTrainTime and frequency of each train to calculate the Next Arrival and Minutes Away columns
  for (let j = 0; j < Object.keys(trainData).length; j++) {
    firstTrainTime;
  }
}

function setClock() {
  // Set an Interval to update the time at the top of the page every second
  setInterval(_ => {
    let now = moment().format("LTS");
    let nowDay = moment().format("LL");

    $("#time").empty();
    $("#time").append(
      "The current time is:<br> <strong>" +
        now +
        "</strong>" +
        "<br> on <br>" +
        nowDay
    );
  }, 1000);
}

function loadpage() {
  // Listen for changes to the database, when a change occurs,
  trains.on("value", snapshot => {
    // Set the trainData variable to the human-readable value of the snapshot
    trainData = snapshot.val();
    console.log(trainData);
    // Run the function to create the table from the preexisting data
    createTable();
    // Run the function to create the clock at the top of the screen
    setClock();
  });

  // When the 'submit' button is clicked...
  $("#submit").on("click", function() {
    // Take the input from the input text boxes
    var trainName = $("#trainName")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var frequency = $("#frequency")
      .val()
      .trim();
    var firstTrainTime = moment(
      $("#firstTrainTime")
        .val()
        .trim(),
      "HH:mm"
    )
      .subtract(10, "years")
      .format("X");

    let newTrain = {
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrainTime
    };

    // Push new train to the database
    trains.push(newTrain);
    clearBoxes();

    alert("Success!");
  });
}

$(document).ready(function() {
  loadpage();
});
