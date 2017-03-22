window.onbeforeunload = leaveGame;

function leaveGame() {
	if(inGame === true) {
		database.ref(roomRoute).update({
			playerCount: 0
		});
		database.ref(chatRoute).set({
			msg: "Opponent left, please refresh page to return to lobby",
			user: "System"
		});
		console.log("something is happening test");		
	}
}