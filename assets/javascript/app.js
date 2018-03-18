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
    newMovieRef.once("value", function (s) {
        if (!s.exists()) {
            let newMovie = {
                "title": `${title}`,
                "poster": `${poster}`,
                "emotions": emotions,
                "totalEmotions": 0,
                "shouldHaves": shouldHaves,
                "totalShouldHaves": 0,
                "comments": [{ "message": "Be the first!", "timestamp": firebase.database.ServerValue.TIMESTAMP }]
            };
            newMovieRef.set(newMovie);
        }
    });
}

function loadMostVoted() {

    moviesRef.orderByChild("totalEmotions").limitToLast(3).once("value", function (s) {
        s.forEach(child => {
            let movieId = child.key;
            let movie = child.toJSON();

            addPreview(movieId, movie);

        });
        
    });

}


function mostCountedNahMoji(emotions) {
    let topEmotion;
    const emotionKeys = Object.keys(emotions);
    for (let i = 0; i < emotionKeys.length; i++) {
        const emotion = emotions[emotionKeys[i]];
        if (!topEmotion || topEmotion["emotion"].count < emotion.count) {
            topEmotion = {
                "name": emotionKeys[i],
                "emotion": emotion
            }
        }
    }

    if(topEmotion.emotion.count === 0){
        return {
            "name":"Nah this flick?",
            "emotion":{
                "description":"This flick hasn't been rated",
                "img":"nahMoji.jpg"
            }
        }
    }
    return topEmotion;
}



function addPreview(movieId, movie){

    let posterDiv = $('<div>', {
        class:"poster",
        "data-id": movieId
    });

    $(posterDiv).append($('<img>', {
        class: "poster-pic",
        src: TMD_BASE_URL + movie.poster,
        alt: "A movie poster"
    }));

    $(posterDiv).append($('<h1>', {class:"poster-title"}).text(
        movie.title
    ))

    let topNahMoji = mostCountedNahMoji(movie.emotions);
    let nahMojiDiv = $('<div>', {class: "nahMoji"});
    $(nahMojiDiv).html($('<img>', {
        class: "nahMoji-pic",
        src: topNahMoji.emotion.img,
        alt: "A NahMoji",
        "data-name": topNahMoji.name,
        "data-description": topNahMoji.emotion.description
    }));

    let movieDiv = $('<div>', {class:"movie"});
    $(movieDiv).append(posterDiv);
    $(movieDiv).append(nahMojiDiv);
    $(lifeWasters).append(movieDiv);
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
var comments;

const mojiRoot = "./assets/images/";

const moviesRef = fb.ref("movies");
const lifeWasters = $("#lifeWasters");

const TMD_BASE_URL = "https://image.tmdb.org/t/p/w185";

loadEmotions();
loadShouldHaves();

loadMostVoted();