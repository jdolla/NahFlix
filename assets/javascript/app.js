function cacheEmotions() {
    //fetches all the template emotions from firebase
    const eRef = fb.ref("emotions");
    eRef.once("value", function (s) {
        emotions = s.toJSON();
    });
}

function cacheShouldHaves() {
    //fetches all the template emotions from firebase
    const sRef = fb.ref("shouldHaves");
    sRef.once("value", function (s) {
        shouldHaves = s.toJSON();
    });
}

function getNewMovie(movie) {

    let newMovie = {
        "title": `${movie.title}`,
        "poster": `${movie.poster}`,
        "emotions": emotions,
        "totalEmotions": 0,
        "shouldHaves": shouldHaves,
        "totalShouldHaves": 0,
        "comments": [{ "message": "Be the first!", "timestamp": firebase.database.ServerValue.TIMESTAMP }]
    };

    moviesRef.child(movie.id).set(newMovie);

    return { id: movie.id, movie: newMovie };
}

function renderPreviews() {
    moviesRef.orderByChild("totalEmotions").limitToLast(3).once("value", function (s) {

        /*
             TO DO:  Need to get a single div on the page that we can clear out
             then populate with previews.
        */
        $(lifeWasters).empty();

        s.forEach(child => {
            let preview = {
                id: child.key,
                movie: child.toJSON()
            };

            renderPreview(preview);

        });

    });

}

function renderPreview(preview) {
    let posterDiv = $('<div>', {
        class: "poster",
        "data-id": preview.id
    });

    $(posterDiv).append($('<img>', {
        class: "poster-pic",
        src: MOVIE_DB_IMG_URL + preview.movie.poster,
        alt: "A movie poster"
    }));

    $(posterDiv).append($('<h1>', { class: "poster-title" }).text(
        preview.movie.title
    ))

    let topNahMoji = mostCountedNahMoji(preview.movie.emotions);
    let nahMojiDiv = $('<div>', { class: "nahMoji" });
    $(nahMojiDiv).html($('<img>', {
        class: "nahMoji-pic",
        src: topNahMoji.emotion.img,
        alt: "A NahMoji",
        "data-name": topNahMoji.name,
        "data-description": topNahMoji.emotion.description
    }));

    let movieDiv = $('<div>', { class: "col-sm-4 moviePreview" });
    $(movieDiv).append(posterDiv);
    $(movieDiv).append(nahMojiDiv);
    $(lifeWasters).append(movieDiv);
}

function fetchOrCreateMovies(movies, action) {
    //movies:  object
    //{id:int, title:string, path:string}

    //action: this should be a function that handles movie objects.

    //https://firebase.googleblog.com/2016/01/keeping-our-promises-and-callbacks_76.html
    //https://scotch.io/tutorials/javascript-promises-for-dummies

    let pList = []; //a list of promises; see the resources above for more info

    for (let i = 0; i < movies.length; i++) {
        //generate a list of promises that will be evaluated later.
        const elem = movies[i];
        pList.push(
            moviesRef.child(elem.id).once('value').then(
                function (snap) {
                    if (snap.exists()) {
                        let movie = {
                            id: snap.key,
                            movie: snap.toJSON()
                        }
                        return movie;
                    } else {
                        // return newMovie(this.id, this.title, this.poster);
                        let movie = getNewMovie(this);
                        return movie;
                    }
                }.bind({ id: elem.id, title: elem.title, poster: elem.poster })
            )
        )
    }

    Promise.all(pList).then(action);

}

function renderSearch(movies) {
    console.log(movies);    // remove later.  look at console to make sure list is there.
   
    


    //(11)   in the html file there is a div that has an ID of:  lifeWasters
    //      Hide this div.
    //      http://api.jquery.com/hide/


    //(12) Set the html() to an empty string for the resultsDisplay Div

    //Loop through all the movies
    for (let i = 0; i < movies.length; i++){
        let movie = movies[i]; //get the movie at position [i] in the array.
        
        //(1) Create variables for id, title, poster
        //(2) Set the value of the variable to the same property from the movie.
        console.log(movie.id)
        console.log(movie.movie.title);
        console.log(movie.movie.poster);

        //this gets the list of emotions for the movie.
        //this is an object that has one property for every emotion
        let emotions = movie.movie.emotions;

        //this gets the emotion with the most "votes"
        let mostCountedEmotion = mostCountedNahMoji(emotions);

        console.log(mostCountedEmotion); //check console for what this looks like.


        //(3) Create variables for the following: emotionName, emotionImage, emotionDescription
        //(4) Set the value of the variable to the same property from the movie.
        console.log(mostCountedEmotion.name);
        console.log(mostCountedEmotion.emotion.img);
        console.log(mostCountedEmotion.emotion.description);

        //(5) create a variable and assign the lifeWasters div (the ID = lifeWasters)
        //(6)   use JQuery - it is easier
        //      Create a div and give it a class of "search-result"
        //      Also give this class an attribute called "data-movieId" (assign the movie id to this)
        //(7)   Append to this div another div that contains an H1 tag as well as the movie title
        //(8)   Append to the search-result div an img tag that has a src = the poster
        //(9)   Append to the search-result div an img tag that has a src = emotionImage

        //(10)  Append this to the "resultsDisplay" div
        
        
    }
    


    //(12)   in the html file there is a div that has an ID of: resultsDisplay
    //      Show this div (this is where all the search results will go)
    //      http://api.jquery.com/show/
    
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

    if (topEmotion.emotion.count === 0) {
        return {
            "name": "Nah this flick?",
            "emotion": {
                "description": "This flick hasn't been rated",
                "img": "nahMoji.jpg"
            }
        }
    }
    return topEmotion;
}

async function upVoteEmotion(movieId, emotion) {

    //https://firebase.google.com/docs/reference/js/firebase.database.Reference#transaction
    let movieNahMoji = fb.ref(`movies/${movieId}/emotions`);
    let tx = await movieNahMoji.child(emotion).child("count").transaction(function (count) {
        return (count || 0) + 1;
    });

    let movieRef = fb.ref(`movies/${movieId}`);
    let txTotal = movieRef.child("totalEmotions").transaction(function (total) {
        return (total || 0) + 1;
    });

    let NahMojis = await movieNahMoji.once('value').then(
        function (snap) {
            return snap.toJSON();
        }
    );

    let rows = []
    for(let NahMoji in NahMojis){
        rows.push([NahMojis[NahMoji].emotion, NahMojis[NahMoji].count, NahMojis[NahMoji].description]);
        debugger;
    }

    return NahMojis;
}

async function upVoteShouldHaves(movieId, shouldHave) {

    //https://firebase.google.com/docs/reference/js/firebase.database.Reference#transaction
    let movieShouldHaves = fb.ref(`movies/${movieId}/shouldHaves`);
    let tx = await movieShouldHaves.child(shouldHave).child("count").transaction(function (count) {
        return (count || 0) + 1;
    });

    let movieRef = fb.ref(`movies/${movieId}`);
    let txtotal = movieRef.child("totalShouldHaves").transaction(function (total) {
        return (total || 0) + 1;
    });

    let shouldHaves = await movieShouldHaves.once('value').then(
        function (snap) {
            return snap.toJSON();
        }
    );

    return shouldHaves;
}

function renderNahMojiChart(emotions) {
    //TODO:  Need to add code to get google chart and plug it in where it belongs.
    console.log(emotions);
}

function renderShouldHavesChart(shouldHaves) {
    //TODO:  Need to add code to get google chart and plug it in somewhere
    console.log(shouldHaves);
}

function searchMovie(movie) {
    const apiKey = "ce1c7db1d5a1e3d2ac7aba7563b687cf";
    movie = encodeURIComponent(movie);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query=${movie}&language=en-US&api_key=${apiKey}`,
        "method": "GET",
        "headers": {},
        "data": "{}"
    }

    $.ajax(settings).done(function (response) {

        // console.log(response.results);
        var res = response.results;
        var resMax = res.length;
        if (res.length > 10) {
            resMax = 10
        }
        var foundMovies = [];
        for (var i = 0; i < resMax; i++) {
            // console.log(res[i]);


            //iterate over each "result"
            //create an array of objects of:  {id:int, title:string, path:string}
            var object = { id: res[i].id, title: res[i].title, poster: res[i].poster_path };
            foundMovies.push(object);
            //call the function fetchOrCreateMovies; pass an array of movies and the 'renderSearch' function

        }
        fetchOrCreateMovies(foundMovies,renderSearch);
    });
}

//event listner for the Go button
document.getElementById("searchBtn").addEventListener("click", function(event){
    var movie = $("#searchEngine").val().trim(); //Added trim to remove trailing spaces
    
    searchMovie(movie); // Call function to search for movies.

});




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
const lifeWasters = $("#previews");

const MOVIE_DB_IMG_URL = "https://image.tmdb.org/t/p/w185";

google.charts.load('current', { packages: ['corechart'] });
// google.charts.setOnLoadCallback(drawChart);

cacheEmotions();
cacheShouldHaves();
renderPreviews();


// upVoteEmotion(603, "Sad").then(function(r){

//     console.log(r);
// })

// upVoteShouldHaves(603, "Take a nap").then(renderShouldHavesChart);

// //sample call - for rendering search
// fetchOrCreateMovies([
//     { id: 603, title: "The Matrix", poster: "/hEpWvX6Bp79eLxY1kX5ZZJcme5U.jpg" },
//     { id: 100, title: "Frankie", poster: "/z.jpg" }
// ], renderSearch);
