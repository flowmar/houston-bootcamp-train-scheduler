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

var database = firebase.database();
var trainName = $('#trainName');
var destination = $('#destination');
var frequency = $('#frequency');
var nextArrival = $('nextArrival');
var minutesAway= $('minutesAway');

var trains = database.ref('trains');

console.log(trains);

var now = moment().format();
console.log(now);
// $('#time').text("The Current time is: " + moment().format());
$('#time').append(moment().format('HH:mm') + "<br>");

$('#time').append(moment().format('LTS'));


//
$("#submit").on('click', function(trainName, destination, firstTrainTime, frequency) {
database.ref('trains/')
})