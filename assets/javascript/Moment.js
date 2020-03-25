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

    database.ref().on("child_added", function(newChild) {
        var nextTrain;
        var minAway;

        var firstTrainNew = moment(newChild.val().firstTrain, "hh:mm").subtract(1, "years");
        var differenceInTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = differenceInTime % newChild.val().frequency;

        minAway = newChild.val().frequency - remainder;
        nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + newChild.val().name + 
                            "</td><td>" + newChild.val().destination +
                            "</td><td>" + newChild.val().frequency +
                            "</td><td>" + nextTrain +
                            "</td><td>" + minAway + "</td></tr>");

         }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
    );

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // Change the HTML to reflect
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });


})