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

let destination = "";
let frequency = 0;
let trainName = "";
let minutesAway = 0;
let firstTrainTime = "";
let trainData;

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
  // setTimeout(function() {
  //   createTable();
  // }, 3000);
}
// Event listener for the submit button
// When the 'submit' button is clicked...
$("#submit").on("click", function() {
  // Take the input from the input text boxes
  let newtrainName = $("#trainName")
    .val()
    .trim();
  let newDestination = $("#destination")
    .val()
    .trim();
  let newFrequency = parseInt(
    $("#frequency")
      .val()
      .trim()
  );
  let newfirstTrain = moment(
    $("#firstTrainTime")
      .val()
      .trim(),
    "HH:mm"
  )
    .subtract(1, "year")
    .format("X");

  // Create a new train object
  let newTrain = {
    trainName: newtrainName,
    destination: newDestination,
    frequency: newFrequency,
    firstTrainTime: newfirstTrain
  };
  console.log("LINE NINETY THREE");
  console.log(newTrain);
  // Push new train to the database
  db.ref().push(newTrain);
  clearBoxes();

  alert(
    "Success! Your train, " +
      newtrainName +
      "\n travelling to " +
      newDestination +
      " has been added to the schedule!"
  );
  createTable();
  return false;
});

// Add a new row to the table when a new train is added to the database
db.ref().on("child_added", (childSnapshot, prevChildKey) => {
  // console.log(childSnapshot.val());
  trainData = childSnapshot.val();
  for (var i = 0; i < trainData.length; i++) {
    let childName = childSnapshot.val().trainName;
    let childDestination = childSnapshot.val().destination;
    let childFrequency = childSnapshot.val().frequency;
    let childFirstTrain = childSnapshot.val().firstTrainTime;

    let childDifference = moment().diff(
      moment.unix(childFirstTrain),
      "minutes"
    );
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
  }
});

function createTable() {
  // for (let i = 0; i < Object.keys(trainData).length; i++) {
  console.log("CREATE TABLE!");
  let keys = Object.keys(trainData);
  console.log(keys);
  for (let key in keys) {
    var trainJSON = JSON.stringify(keys);
    console.log(trainJSON);
    console.log(trainData[keys[key]]);
    destination = JSON.stringify(trainData[keys[key]].destination);
    frequency = JSON.stringify(trainData[keys[key]].frequency);
    trainName = JSON.stringify(trainData[keys[key]].trainName);
    minutesAway = JSON.stringify(trainData[keys[key]].minutesAway);
    firstTrainTime = JSON.stringify(trainData[keys[key]].firstTrainTime);
    console.log(
      "Destination: " +
        destination +
        "\nFrequency: " +
        frequency +
        "\nTrain Name: " +
        trainName +
        "\n Minutes away: " +
        minutesAway +
        "\n First Train Time: " +
        firstTrainTime
    );

    console.log(firstTrainTime);
    let difference = moment().diff(moment().unix(firstTrainTime), "minutes");
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

$(document).ready(_ => {
  db.ref().once("value", snapshot => {
    trainData = snapshot.val();
    console.log("FUICAFDAFSDGAEWFEGD");
    console.log(trainData);
    createTable();
  });
  loadpage();
});
