function generateWinningNumber(){

  return Math.floor(Math.random() * 100) + 1;

}

function newGame(){
  return new Game();
}


function shuffle(arr){
  var m = arr.length, t, i;
  while(m){
    i = Math.floor(Math.random() * m--)
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();

}

Game.prototype.difference = function () {
  return Math.abs(this.winningNumber - this.playersGuess);
};

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function (x) {
  if(x < 1 || x > 100 || isNaN(x)){
    $('#message').text("Hmmm... Between 1 and 100... Want to try again?")
    throw("That is an invalid guess.")

  }else{
    this.playersGuess = x;
  };
  return this.checkGuess()
};

Game.prototype.checkGuess = function () {
  if(this.playersGuess===this.winningNumber) {
        $('#submit , #hint').prop('disabled',true)
        $('#message').text('You Win!')
        $('#player-input').val(this.winningNumber)
        $('#player-input').prop('disabled',true)
        return "You Win!"
  }else{

    if(this.pastGuesses.indexOf(this.playersGuess) != -1){
      return "You have already guessed that number."

    }else{
      this.pastGuesses.push(this.playersGuess);
      $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);

      if(this.pastGuesses.length === 5){
        $('#submit , #hint').prop('disabled',true)
        $('#player-input').prop('disabled',true)
        this.lost = true;
        return "You Lose. Push Reset to Play Again";

      }else if(this.difference() < 10){
        return "You're burning up!"
      }else if(this.difference() < 25){
        return "You're lukewarm."
      }else if(this.difference() < 50){
        return "You're a bit chilly."
      }else{
        return "You're ice cold!"
      }
    }
  }
  return ""
};

Game.prototype.provideHint = function () {
  var arr = [generateWinningNumber(), this.winningNumber , generateWinningNumber() ]
  return shuffle(arr);
};

function makeGuess(game){
  var guess = +$('#player-input').val();
  $('#player-input').val("")

  result = game.playersGuessSubmission(guess);

  $('#message').text(result)

}

$(document).ready(function(){
  var game = new Game();

  $('#submit').on('click', function(){
    makeGuess(game);
  });

  $('#player-input').keypress(function(event){
    if ( event.which == 13 ) {
          if(game.lost !== true){
           makeGuess(game);
         }
        }
  });
  $('#reset').on('click',function(){
    game = new Game();
    $('#guess-list li').text("-");
    $('#submit , #hint').prop('disabled', false);
    $('#message').text("Guess a number between 1 and 100");
    $('#player-input').prop('disabled',false)
    $('#player-input').val("")

  })
  $('#hint').on('click', function(){

    hints = game.provideHint()
    $('#message').text("The winning number is "+hints[0] + " "+ hints[1] + " "+ hints[2])
  })

});
