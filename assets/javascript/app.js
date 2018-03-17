var movie = (function(id, name, poster, emotions, shouldHaves, comments){
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
    
    if(emotions && emotions.constructor === Array){
        private.emotions = [];
        private.emotions.push(emotions);
    } else {
        private.emotions = emotions;
    }

    if(shouldHave && shouldHave.constructor === Array){
        private.shouldHaves = [];
        private.shouldHaves.push(shouldHaves);
    } else {
        private.shouldHaves = shouldHaves;
    }

    if(comments && comments.constructor === Array){
        private.comments = [];
        private.comments.push(comments);
    } else {
        private.comments = comments;
    }


    return {
        id: function(){
            return private.id;
        }, 
        name: function(){
            return private.name;
        },  
        poster: function(){
            return private.poster;
        },
        emotions: function(){
            return private.emotions;
        },   
        shouldHaves: function(){
            return private.shouldHaves;
        },   
        comments: function(){
            return private.comments;
        },
        elem: function(){
            //should return elements for use in page
            return "";
        },
        upVoteEmotion: function(){
            //this will increase the correct emotion count and save to firebase
            return null;
        },
        upVoteShouldHaves: function(){
            //this will increase the correct shuldHave count and save to firebase
            return null;
        },
        getString: function(){
            //returns a json string that represents the movie.
            return JSON.stringify(private);
        }
    }

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