window.onbeforeunload = function() {
	if (inGame === true) {
		leaveGame();
	}
}

function leaveGame() {
	prompt("Are you sure?");
}