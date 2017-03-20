function loadGame() {
	$("#right").empty();
	$("#middle").empty();
	loadChatRight();
	database.ref("gameChat/" + chatKey).once("value", function(snapshot) {
		gameChat(snapshot);
	});

	var oppTitle = $("<h1>");
	var oppStats = $("<div>");
	var oppWins = $("<h3>");
	var oppLosses = $("<h3>");
	var oppTies = $("<h3>");
	var oppRock = $("<h3>");
	var oppPaper = $("<h3>");
	var oppScissors = $("<h3>");

	$("#opponentStats").append(oppTitle);
	$("#opponentStats").append(oppStats);
	$(oppStats).append(oppWins, oppLosses, oppTies, oppRock, oppPaper, oppScissors);

	var gameDiv = $("<div>").attr({
		id: gameName
	});
	var rock = $("<button>").html("rock").attr({
		id: "rock",
		onClick: "ready(0)"
	});
	var paper = $("<button>").html("paper").attr({
		id: "paper",
		onClick: "ready(1)"
	});
	var scissors = $("<button>").html("scissors").attr({
		id: "scissors",
		onClick: "ready(2)"
	});

	$("#middle").append(gameDiv, rock, paper, scissors);
}

function ready(choice) {
	database.ref("rooms").on("value", function(snapshot) {
		updateReady(snapshot.val(), choice);
	});
}

function updateReady(snapshot, choice) {
	for(var key in snapshot) {
		if (snapshot[key].roomName === gameName && playerNum === 1) {
			database.ref("rooms/" + key).update({
				p1Choice: choice,
				p1Ready: 1
			})
		} else if (snapshot[key].roomName === gameName && playerNum === 2) {
			database.ref("rooms/" + key).update({
				p2Choice: choice,
				p2Ready: 1
			})
		}

		if(snapshot[key].gameName && snapshot[key].p1Ready === 1 && snapshot[key].p2Ready === 1) {
			var result = whoWon(snapshot[key].p1Choice, snapshot[key].p2Choice);
			if(result = 0) {
				var ties = snapshot[key].ties;
				ties++;
				database.ref("rooms/" + key).update({
					ties: ties
				});
			} else if(result = 1) {
				var p1Wins = snapshot[key].p1Wins;
				var p2Losses = snapshot[key].p2Losses;
				p1Wins++;
				p2Losses++;
				database.ref("rooms/" + key).update({
					p1Wins: p1Wins,
					p2Losses: p2Losses
				});
			} else{
				var p2Wins = snapshot[key].p2Wins;
				var p1Losses = snapshot[key].p1Losses;
				p2Wins++;
				p1Losses++;
				database.ref("rooms/" + key).update({
					p2Wins: p2Wins,
					p1Losses: p1Losses
				});
			}
		}
	}
}

function whoWon(p1, p2) {
	if(p1 - p2 === 0) {
		//tie
		playerSnapshot(0);
		return 0;
	} else if (p1 - p2 === 1 || p1 - p2 === -2) {
		//p1 win
		playerSnapshot(1);
		return 1;
	} else {
		//p2 win
		playerSnapshot(2);
		return 2;
	}

	//update wins, ties, losses
}

function playerSnapshot(winner) {
	database.ref("users").once("value", function(snapshot) {
		playerUpdate(snapshot.val());
	});
}

function playerUpdate(snapshot, winner) {
	for(var key in snapshot) {
		if (snapshot[key].email === gmail) {
			var playa = snapshot[key];
			if (winner === 0) {
				ties = playa.ties;
				database.ref("users/" + key).update({
					ties: ties
				});
			} else if (winner === playerNum) {
				wins = playa.wins;
				database.ref("users/" + key).update({
					wins: wins
				});
			} else {
				losses = playa.losses;
				database.ref("users/" + key).update({
					losses: losses
				});
			}
		}
	}
}