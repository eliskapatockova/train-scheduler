$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyAgw-74UmVA8bRHLUsuinrbLCT98LhFhW0",
        authDomain: "train-scheduler-c4c45.firebaseapp.com",
        databaseURL: "https://train-scheduler-c4c45.firebaseio.com",
        projectId: "train-scheduler-c4c45",
        storageBucket: "train-scheduler-c4c45.appspot.com",
        messagingSenderId: "493563491239"
    }

    firebase.initializeApp(config);

    var database = firebase.database();

    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function(){
        event.preventDefault();

        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        $("form")[0].reset();

    })

})