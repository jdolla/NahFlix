function loadEmotions() {
    //fetches all the template emotions from firebase
    const eRef = fb.ref("emotions");
    eRef.once("value", function (s) {
        emotions = s.toJSON();
    });
}

function loadShouldHaves() {
    //fetches all the template emotions from firebase
    const sRef = fb.ref("shouldHaves");
    sRef.once("value", function (s) {
        shouldHaves = s.toJSON();
    });
}

function saveNewMovie(id, title, poster) {
    //Checks to see if a movie exists.
    //Saves the movie if it doesn't exist.
    newMovieRef = fb.ref(`movies/${id}`);
    newMovieRef.once("value", function(s){
        if(!s.exists()){
            let newMovie = {
                "title": `${title}`,
                "poster": `${poster}`,
                "emotions": emotions,
                "totalEmotions":0,
                "shouldHaves": shouldHaves,
                "totalShouldHaves":0,
                "comments":[{"message":"Be the first!", "timestamp":firebase.database.ServerValue.TIMESTAMP}]
            };
            newMovieRef.set(newMovie);
        }
    });
}

// function loadMostVoted(){
//     moviesRef = fb.ref("movie");

    

// }



var config = {
    apiKey: "AIzaSyC1lgIwwL6TZ3FvR-t_XjP63cgnx-s_T7E",
    authDomain: "nahflix.firebaseapp.com",
    databaseURL: "https://nahflix.firebaseio.com",
    projectId: "nahflix",
    storageBucket: "",
    messagingSenderId: "736393655102"
};
firebase.initializeApp(config);
fb = firebase.database();



var emotions;
var shouldHaves;
var comments;


// loadEmotions();
// loadShouldHaves();
