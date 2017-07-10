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
var trainName = "";
var destination = "";
var frequency = "";
var nextArrival = "";
var minutesAway= "";

database.ref('trains').set({
    name: trainName,
    destination: destination,
    frequency: frequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway
});


//
$("#submit").on('click', function(trainName, destination, firstTrainTime, frequency) {
database.ref('trains/')
})