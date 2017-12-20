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

// Create a reference to firebase

const db = firebase.database();

// Create global variables

let destination;
let frequency;
let trainName;
let minutesAway;
let firstTrainTime;
let trainData;

// db.ref().once("value", snapshot => {
//   trainData = snapshot.val();
//   console.log("FUICAFDAFSDGAEWFEGD");
//   console.log(trainData);
//   return trainData;
// });

// Create a function to clear out input boxes after submission
function clearBoxes() {
  $("#trainName").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#firstTrainTime").val("");
}

// Create a function to display the time and date
function setClock() {
  // Set an Interval to update the time at the top of the page every second
  setInterval(_ => {
    let now = moment().format("LTS");
    let nowDay = moment().format("LL");
    // Update the time every second
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
  // Run the function to create the clock at the top of the screen
  setClock();
  // Listen for changes to the database, when a change occurs,
  db.ref().once("value", snapshot => {
    // Set the trainData variable to the human-readable value of the snapshot
    trainData = snapshot.val();
    console.log(trainData);
  });
  setTimeout(function() {
    createTable();
  }, 3000);
  // Event listener for the submit button
  // When the 'submit' button is clicked...
  $("#submit").on("click", function() {
    // Take the input from the input text boxes
    var trainName = $("#trainName")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var frequency = parseInt(
      $("#frequency")
        .val()
        .trim()
    );
    var firstTrain = $("#firstTrainTime")
      .val()
      .trim();

    // Create a new train object
    let newTrain = {
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrain
    };

    console.log(newTrain);
    // Push new train to the database
    db.ref().push(newTrain);
    clearBoxes();

    alert(
      "Success! Your train, " +
        trainName +
        "\n travelling to " +
        destination +
        "has been added to the schedule!"
    );
    return false;
  });
}

// Add a new row to the table when a new train is added to the database
db.ref().on("child_added", (childSnapshot, prevChildKey) => {
  console.log(childSnapshot.val());
  trainData = childSnapshot.val();
  let childName = childSnapshot.val().trainName;
  let childDestination = childSnapshot.val().destination;
  let childFrequency = childSnapshot.val().frequency;
  let childFirstTrain = childSnapshot.val().firstTrainTime;

  let childDifference = moment().diff(moment.unix(childFirstTrain), "minutes");
  let childRemainder =
    moment().diff(moment.unix(childFirstTrain), "minutes") % childFrequency;
  let childMinutes = childFrequency - childRemainder;

  let childArrival = moment()
    .add(childMinutes, "m")
    .format("hh:mm A");

  createTable();

  $("#tbody").append(
    "<tr><td>" +
      childName +
      "</td><td>" +
      childDestination +
      "</td><td>" +
      childFrequency +
      "</td><td>" +
      childArrival +
      "</td><td>" +
      childMinutes +
      "</td></tr>"
  );
});

function createTable() {
  for (let i = 0; i < Object.keys(trainData).length; ++i) {
    console.log("HELLO!");
    console.log(trainData);
    console.log(trainData[i]);
    destination = trainData[i].destination;
    frequency = trainData[i].frequency;
    trainName = trainData[i].trainName;

    minutesAway = trainData[i].minutesAway;
    firstTrainTime = trainData[i].firstTrainTime;
    let difference = moment().diff(moment.unix(firstTrainTime), "minutes");
    let remainder =
      moment().diff(moment().unix(firstTrainTime), "minutes") % frequency;
    minutesAway = frequency - remainder;
    let nextArrival = moment()
      .add(minutesAway, "m")
      .format("hh:mm A");

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
}

$(document).ready(loadpage());
