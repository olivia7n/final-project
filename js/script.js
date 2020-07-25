var total_questions = 5;

var questions = {
    1 : 'The only letter that doesn’t appear on the periodic table is J.',
	2 : 'A single strand of Spaghetti is called a “Spaghetto”.',
	3 : 'The capital of Texas is Houston.',
	4 : 'Iceland does not have a railway system.',
	5 : 'The letter Q does not appear in any state names in the U.S.' 
}

var answers = {
    1 : true,
    2 : true,
    3 : false,
    4 : true,
    5 : true
}

var gameData = {
    "status" : "",
    "points" : 0,
    "missedquestions" : 0,
    "question" : 1
}

var draggableData = {}
var dragger_quick_ref = null; 
var endGameStatus = (total_questions + 1) 

function UpdateGame(choice) {

    var dragWindow = $("#dragWindow");

    var dragThis = $("#dragThis");

    var resetButton = $("#resetButton");

    var gameStatusText = $("#gameStatusText");
    var currentQuestionText = $("#currentQuestionText");
    var pointsText = $("#pointText");
    var highscoreText = $("#highscoreText");

    var outputImg = $("#outputImg");
    var outputText = $("#outputText");
    
    var dragTitle = $("#dragTitle");
    var dragQuestion = $("#dragQuestion");


    if (gameData.question < endGameStatus) {

        if (choice == -1) {
            dragWindow.css('display', 'block');

            resetButton.css('display', 'none');
    
            outputText.css('color', 'black');
            outputText.text("Drag the question box to the answer box you believe to be correct!");

            outputImg.css('display', 'none');

            dragThis.css('display', 'block');
    
        } 

        else if (choice === true || choice === false) {

            if (choice === answers[gameData.question]) {
                gameData.points += 1;
                
            } 

            else if (choice !== answers[gameData.question]) {
                gameData.missedquestions += 1;
                
            }
            
        }
    
        gameData.question += 1;
        gameStatusText.text("Game Status: " + gameData.status);
        currentQuestionText.text("Question: (" + gameData.question + "/" + total_questions + ")");
        pointsText.text("Points: " + gameData.points);
        dragTitle.text("Question #" + gameData.question);
        dragQuestion.text(questions[gameData.question]);
        
    }

    if (gameData.question == endGameStatus) {

        gameData.status = "Ended"
        gameStatusText.text("Game Status: " + gameData.status);
        pointsText.text("Points: " + gameData.points);

        dragWindow.css('display', 'none');

        dragThis.css('display', 'none')

        outputImg.css('display', 'block');

        var calculateReview = (gameData.points / total_questions) 

        var reviewMessage = ""; 
        var reviewImg = "";

        outputImg.attr('src' + reviewImg)

        var crPercent = Math.round((calculateReview + Number.EPSILON) * 100) 
        outputText.text(gameData.points + " points out of " + total_questions + " (" + crPercent + "%) possible... " + reviewMessage);

        resetButton.css('display', 'inline-block');

        $('#gameDataWindow')[0].scrollIntoView(true);
    }    
    
}

function StartGame() {
    
    gameData.points = 0; 
    gameData.missedquestions = 0; 
    gameData.question = 0; 
    
    gameData.status = "In Progress"

    UpdateGame(-1); 
}

function returnItem(item, target) {
    var oPos = item.data("uiDraggable").originalPosition;
    item.position({
        my: "top left",
        at: "top left+" + oPos.left,
        of: target,
        using: function(pos) {
        item.animate(pos, "fast", "linear");
        }
    });

    draggableData[$("#dragThis").attr('value')] = "undecided";
}

function CheckAnswer(dragger) {

    var plr_choice = draggableData[$("#dragThis").attr('value')]
    console.log("Player chose: " + plr_choice);

    UpdateGame(plr_choice);
    returnItem(dragger, $("#resetPos"));
}

function ResetGame() {
    StartGame();
    returnItem(dragger_quick_ref, $("#resetPos"));
}

$(function(){
    setTimeout(function(){
        StartGame();
    }, 50)
})

$('#dragThis').draggable({
    containment: $('#dragWindow'),
    drag: function() {
        $('#dragThis').draggable('option', 'containment', "#dragWindow");
    },
    stop: function() {
        if (dragger_quick_ref === null) {
            dragger_quick_ref = $(this);
        }

        if (draggableData[$("#dragThis").attr('value')] === "undecided" || draggableData[$("#dragThis").attr('value')] === undefined) {
            returnItem($(this), $("#resetPos"));
        } else if (draggableData[$("#dragThis").attr('value')] === true || draggableData[$("#dragThis").attr('value')] === false) {
            CheckAnswer($(this))
        }

    },
    revert: 'invalid'
});

$('#dropTrue').droppable({
    accept: '#dragThis',
    over: function() {
        $(this).animate({
            'border-width': '7px',
            'border-color': 'purple'
        }, 100);
        if (draggableData[$("#dragThis").attr('value')] === null) {
            draggableData[$("#dragThis").attr('value')] = "undecided"
        };
    },
    drop: function() {
        $('#dragThis').draggable('option', 'containment', "#dragWindow");
        $('#dragThis').draggable({revert:'invalid'});
        draggableData[$("#dragThis").attr('value')] = true
    },
    out: function() {
        $(this).animate({
            'border-width': '3px',
            'border-color': '#f90'
        }, 100);
        $('#dragThis').draggable('option', 'containment', "#dragWindow");
        $('#dragThis').draggable({revert:true});
        draggableData[$("#dragThis").attr('value')] = "undecided"
    }
});

$('#dropFalse').droppable({
    accept: '#dragThis',
    over: function() {
        $(this).animate({
            'border-width': '7px',
            'border-color': 'purple'
        }, 100);
        if (draggableData[$("#dragThis").attr('value')] === null) {
            draggableData[$("#dragThis").attr('value')] = "undecided"
        };
    },
    drop: function() {
        $('#dragThis').draggable('option', 'containment', "#dragWindow");
        $('#dragThis').draggable({revert:'invalid'});
        draggableData[$("#dragThis").attr('value')] = false
    },
    out: function() {
        $(this).animate({
            'border-width': '3px',
            'border-color': '#f90'
        }, 100);
        $('#dragThis').draggable('option', 'containment', "#dragWindow");
        $('#dragThis').draggable({revert:true});
        draggableData[$("#dragThis").attr('value')] = "undecided"
    }
});