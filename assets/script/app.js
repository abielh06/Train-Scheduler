// 1. linking firebase to app.js
// 2. collect data input (train name, destination, arrival, frequency)
// 3. arrival time formula
// 4. insert data to firbase


//   Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBQ4x_hDcthrhi8kiGDd4sCAvqe-2eRY64",
    authDomain: "train-activity-e87e2.firebaseapp.com",
    databaseURL: "https://train-activity-e87e2.firebaseio.com",
    projectId: "train-activity-e87e2",
    storageBucket: "train-activity-e87e2.appspot.com",
    messagingSenderId: "1077326589376",
    appId: "1:1077326589376:web:f79a2cc4b319dc4f096c25"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//   selector for firbase database
  var dataRef = firebase.database();

  var Trainname = "";
  var destination = "";
  var firstTrain = 0;
  var frequency = "";
  
  // Capture Button Click
  $("#submit").on("click", function(event) {
      alert("Train succesfully added!!")
    event.preventDefault();
    // Code in the logic for storing and retrieving the most recent user.
    // Dont forget to provide initial data to your Firebase database.
    Trainname = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();
    var tFrequency = frequency;

    // input for first train time
    var firstTime = firstTrain;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    // Code for the push
    dataRef.ref().push({
      Trainname: Trainname,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      nextTrain: nextTrain,
      minutesAway: tMinutesTillTrain,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });
  // Firebase watcher + initial loader HINT: .on("value")
  dataRef.ref().on("child_added", function(snapshot) {
    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().Trainname);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrain);
    console.log(snapshot.val().frequency);
    var col1=$("<td>").text(snapshot.val().Trainname);
    var col2=$("<td>").text(snapshot.val().destination);
    var col3=$("<td>").text(snapshot.val().frequency);
    var col4=$("<td>").text(snapshot.val().nextTrain);
    var col5=$("<td>").text(snapshot.val().minutesAway);
    var tr=$("<tr>").append(col1, col2, col3, col4, col5);
    $("#train-list").append(tr);
   
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

