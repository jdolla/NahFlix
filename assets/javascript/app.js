var movie = (function (id, name, poster, emotions, shouldHaves, comments) {
    var private = {
        id: null,
        name: "",
        poster: "",
        emotions: null,
        shouldHaves: null,
        comments: null
    };

    private.id = id;
    private.name = name;
    private.poster = poster;

    if (emotions && emotions.constructor === Array) {
        private.emotions = [];
        private.emotions.push(emotions);
    } else {
        private.emotions = emotions;
    }

    if (shouldHaves && shouldHaves.constructor === Array) {
        private.shouldHaves = [];
        private.shouldHaves.push(shouldHaves);
    } else {
        private.shouldHaves = shouldHaves;
    }

    if (comments && comments.constructor === Array) {
        private.comments = [];
        private.comments.push(comments);
    } else {
        private.comments = comments;
    }


    return {
        id: function () {
            return private.id;
        },
        name: function () {
            return private.name;
        },
        poster: function () {
            return private.poster;
        },
        emotions: function () {
            return private.emotions;
        },
        shouldHaves: function () {
            return private.shouldHaves;
        },
        comments: function () {
            return private.comments;
        },
        elem: function () {
            //should return elements for use in page
            return "";
        },
        getData: function () {
            //returns a json string that represents the movie.
            let jString = JSON.stringify(private, function (k, v) {
                if (k === "id") return undefined;
                return v;
            });

            return JSON.parse(jString);
        }
    }

});

function loadEmotions() {
    //fetches all the template emotions from firebase
    const eRef = fb.ref("emotions");
    eRef.once("value", function (s) {
        emotions = s.toJSON();
    });
}

function saveMovie(movie) {
    // debugger;
    fbMovieRef = fb.ref(`movies/${movie.id()}`);
    fbMovieRef.set(movie.getData());
}

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

loadEmotions();

// https://javascript.info/async-await
// async function getEmotions() {
//     const eRef = fb.ref("emotions");
//     let eSnap = eRef.once("value", function(s){});

//     let result = await eSnap;
//     return result.toJSON();
// }

