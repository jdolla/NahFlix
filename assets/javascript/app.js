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

var movie = (function(id, name, emotions, shouldHaves, comments){
    var private = {
        id: null,
        name: "",
        emotions: null,
        shouldHaves: null,
        comments: null
    };



});