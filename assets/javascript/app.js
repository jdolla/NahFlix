var emotion = (function(name, description, img){
    var private = {
        name: "",
        description: "",
        img: ""
    };

    private.name = name;
    private.description = description;
    private.img = img;

    return {
        name: function(){
            return private.name;
        },
        description: function(){
            return private.description;
        },
        img: function(){
            return private.img;
        },
        elem: function(){
            //This will return an html element
            return "";
        }
    }
});

var shouldHave = (function(name){
    var private = {
        name: ""
    };

    private.name = name;

    return {
        name: function(){
            return private.name;
        },
        elem: function(){
            //Should return an html element; definition tbd
            return "";
        }
    };

});

var comment = (function(timestamp, message){
    var private = {
        timestamp: null,
        message: ""
    };

    private.timestamp = timestamp;
    private.message = message;

    return {
        timestamp: function(){
            return private.timestamp;
        },
        message: function(){
            return private.message;
        }
    }

});

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
    privte.poster = poster;
    
    if(emotions.constructor === Array){
        private.emotions = [];
        private.emotions.push(emotions);
    } else {
        private.emotions = emotions;
    }

    if(shouldHave.constructor === Array){
        private.shouldHaves = [];
        private.shouldHaves.push(shouldHaves);
    } else {
        private.shouldHaves = shouldHaves;
    }

    if(comments.constructor === Array){
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