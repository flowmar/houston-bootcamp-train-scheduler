// import 'babel';
// import * as firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBxb0Xg38kI4YclVCdetdlGRWU5dckB0sA',
  authDomain: 'train-scheduler-216e6.firebaseapp.com',
  databaseURL: 'https://train-scheduler-216e6.firebaseio.com',
  projectId: 'train-scheduler-216e6',
  storageBucket: 'train-scheduler-216e6.appspot.com',
  messagingSenderId: '391022964912'
};

firebase.initializeApp(config);

// Create reference to firebase
const db = firebase.database();

// Create a reference to the data stored in the table
const trains = db.ref();

// Create a global variable for the train data
let trainData;
let trainName;
let destination;
let frequency;
let nextArrival;
let minutesAway;

function loadpage() {
  // Listen for changes to the database
  trains.on('value', snapshot => {
    // Prints the array of train objects to the console
    trainData = snapshot.val();
    trainName = trainData[0].trainName;
    // console.log(trainData);
    // console.log(trainName);

    // Loop through the data and create a row in the HTML table for every entry
    for (var i = 0; i < trainData.length; i++) {
      trainName = trainData[i].trainName;
      destination = trainData[i].destination;

      frequency = trainData[i].frequency;
      nextArrival = trainData[i].nextArrival;
      minutesAway = trainData[i].minutesAway;
      // console.log(trainName);
      // console.log(destination);
      $('#table').append(
        '<tr><td class="font-weight-bold lead h1">' +
          trainName +
          '</td><td class="font-italic lead text-uppercase">' +
          destination +
          '</td><td class=lead>' +
          frequency +
          '</td><td class=lead>' +
          nextArrival +
          '</td><td class=lead>' +
          minutesAway +
          '</td></tr>'
      );
    }
    var now = moment().format();
    console.log(now);
  });

  // Set an Interval to update the time at the top of the page every second
  setInterval(_ => {
    let now = moment().format('LTS');
    let nowDay = moment().format('LL');

    $('#time').empty();
    $('#time').append(
      'The current time is:<br> <strong>' +
        now +
        '</strong>' +
        '<br> on <br>' +
        nowDay
    );
  }, 1000);

  var firstTrainTime = moment([2014, 5, 22, 12, 00, 01, 00]);
  $('#test').html('<span class="text-white">' + firstTrainTime) + '</span>';

  // When the 'submit' button is clicked...
  $('#submit').on('click', function() {
    // Take the input from the input text boxes
    var trainName = $('#trainName')
      .val()
      .trim();
    var destination = $('#destination')
      .val()
      .trim();
    var frequency = $('#frequency')
      .val()
      .trim();
    var firstTrainTime = moment(
      $('#firstTrainTime')
        .val()
        .trim(),
      'HH:mm'
    )
      .subtract(10, 'years')
      .format('X');

    let newTrain = {
      name: trainName,
      destination: destination,
      frequency: frequency,
      firstTrain: firstTrainTime
    };

    // Push new train to the database
    db.ref().push(newTrain);
    clearBoxes();

    alert('Success!');
  });
}

function clearBoxes() {
  $('#trainName').val('');
  $('#destination').val('');
  $('#frequency').val('');
  $('#firstTrainTime').val('');
}

loadpage();
