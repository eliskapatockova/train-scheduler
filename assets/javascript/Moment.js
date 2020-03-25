$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyBQvXsTu9rSFN9H3UANM6nQ_9BVcFnRxUY",
        authDomain: "train-scheduler-ac2c8.firebaseapp.com",
        databaseURL: "https://train-scheduler-ac2c8.firebaseio.com",
        projectId: "train-scheduler-ac2c8",
        storageBucket: "train-scheduler-ac2c8.appspot.com",
        messagingSenderId: "432526871285",
        appId: "1:432526871285:web:9e4752af0596c7449113bc",
        measurementId: "G-PP069CSVXN"
    }


    var mykey = firebaseConfig.apiKey;

    firebase.initializeApp(firebaseConfig);

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

    database.ref().on("child_added", function(snapshot) {
        var nextTrain;
        var minAway;

        var firstTrainNew = moment(snapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        var differenceInTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = differenceInTime % snapshot.val().frequency;

        minAway = snapshot.val().frequency - remainder;
        nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + snapshot.val().name + 
                            "</td><td>" + snapshot.val().destination +
                            "</td><td>" + snapshot.val().frequency +
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