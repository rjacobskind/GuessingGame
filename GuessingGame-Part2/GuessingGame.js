function generateWinningNumber(){
  return Math.ceil(Math.random() * 100);
}

function shuffle(arr){
  var unshuffledLength = arr.length, index, transferVal;

  while(unshuffledLength > 0){
    index = Math.floor(Math.random() * unshuffledLength--);

    transferVal = arr[unshuffledLength];
    arr[unshuffledLength] = arr[index];
    arr[index] = transferVal;

  }
  return arr;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
  }

Game.prototype.isLower = function(){
  if(this.playersGuess < this.winningNumber){
    return true;
  }
  else{return false;}
}

Game.prototype.playersGuessSubmission = function(num){
  this.playersGuess = num;
  if(this.playersGuess < 1 || this.playersGuess > 100 || typeof this.playersGuess !== "number"){
    throw "That is an invalid guess.";
  }
  return this.checkGuess();
}

Game.prototype.checkGuess = function(){
  if(this.playersGuess === this.winningNumber){
    $('#submit, #hint').prop("disabled", true);
    $('#subtitle').text("Click Reset to Play Again");
    return "You Win!";
  }

  else if(this.playersGuess !== this.winningNumber){
    for(var i = 0; i < this.pastGuesses.length; i++){
      if(this.playersGuess === this.pastGuesses[i]){
        $('#subtitle').text("Please guess again");
        return "You have already guessed that number.";
      }
    }
      var difference = this.difference();
      this.pastGuesses.push(this.playersGuess);

      $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);


      if(this.pastGuesses.length === 5){
        $('#submit, #hint').prop("disabled", true);
        $('#subtitle').text("Click Reset to Play Again");
        $('#win').text("The correct number was: " + this.winningNumber);
        return "You Lose.";
      }

      if(this.isLower()){
        $('#subtitle').text(" Guess higher!");
      }

      else if(!this.isLower()){
        $('#subtitle').text(" Guess lower!");
      }

      if(difference < 10){
        return "You're burning up!";
      }

      else if(difference >= 10 && difference < 25){
        return "You're lukewarm.";
      }

      else if(difference >= 25 && difference < 50){
        return "You're a bit chilly.";
      }

      else if(difference >= 50 && difference < 100){
        return "You're ice cold!";
      }
  }
}

function newGame(){
  var game = new Game();
  return game;
}

Game.prototype.provideHint = function(){
  return shuffle([generateWinningNumber(), generateWinningNumber(), this.winningNumber]);
}


function logGuess(x){
  var guess = +$('#player-input').val();
  $('#player-input').val("");

  var output = x.playersGuessSubmission(guess);
  $('#title').text(output);
}


$(document).ready(function(){
var game = new Game();

$('#submit').on('click', function(){
  logGuess(game);
  return false;
});

$('#player-input').on('keypress', function(){
  if(event.which === 13 && $('#title').text() !== "You Win!" && $('#title').text() !== "You Lose."){
    logGuess(game);
    return false;
  }
});

$('#reset').on('click', function(){
  game = newGame();
  $('#title').text("Guessing Game!");
  $('#win').text("");
  $('#subtitle').text("Guess a number between 1 and 100");
  $('.guess').text("-");
  $('#submit, #hint').prop("disabled", false);
});

$('#hint').on('click', function(){
  var hints = game.provideHint();
  $('#title').text("The winning number is:\n" + hints[0] + ", " + hints[1] + ", or " + hints[2]);
});
});
