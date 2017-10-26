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
    console.log(trainData);
    console.log(trainName);

    // Loop through the data and create a row in the HTML table for every entry
    for (var i = 0; i < trainData.length; i++) {
      trainName = trainData[i].trainName;
      destination = trainData[i].destination;
      frequency = trainData[i].frequency;
      nextArrival = trainData[i].nextArrival;
      minutesAway = trainData[i].minutesAway;
      console.log(trainName);
      console.log(destination);
      $('#table').append(
        '<tr><td class="font-weight-bold">' +
          trainName +
          '</td><td class="font-italic">' +
          destination +
          '</td><td>' +
          frequency +
          '</td><td>' +
          nextArrival +
          '</td><td>' +
          minutesAway +
          '</td></tr>'
      );
    }
    console.log('YAAAY');
    var now = moment().format();
    console.log(now);
  });

  // $('#time').text("The Current time is: " + moment().format());
  $('#time').append(moment().format('HH:mm') + '<br>');

  $('#time').append(moment().format('LTS'));

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
    var firstTrainTime = $('#firstTrainTime')
      .val()
      .trim();

    //
    database
      .ref()
      .child('/trains')
      .push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
      });

    alert('Success!');
  });
}

loadpage();
