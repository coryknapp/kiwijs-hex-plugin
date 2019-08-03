//Initialise the Kiwi Game. 
var gameOptions = {
	width: 780,
	height: 640
}

var game = new Kiwi.Game('content', 'RoguelikeGame', null, gameOptions);


//Add all the States we are going to use.
game.states.addState(PlayState);


game.states.switchState("PlayState");
