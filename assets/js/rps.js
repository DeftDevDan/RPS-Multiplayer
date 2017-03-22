var readyCheckCount = 0;
var winCheck = false;

function loadGame() {
	$("#right").empty();
	$("#middle").empty();
	loadChatRight();
	gameLoaded = true;

	var gameDiv = $("<div>").attr({
		id: gameName
	});

	var breaker = $("<br>");
	var myWins = $("<div>").attr({
		id: "myWins"
	});
	var myWinsHeader = $("<h2>").html("My Wins:");
	var myWinsNum = $("<h3>").attr({
		id: "myWinsNum"
	});
	$(myWins).append(myWinsHeader);
	$(myWins).append(myWinsNum);
	$(gameDiv).append(myWins);
	var ties = $("<div>").attr({
		id: "ties"
	});
	var tiesHeader = $("<h2>").html("Ties:");
	var tiesNum = $("<h3>").attr({
		id: "tiesNum"
	});

	$(ties).append(tiesHeader);
	$(ties).append(tiesNum);
	$(gameDiv).append(ties);

	var oppWins = $("<div>").attr({
		id: "oppWins"
	});
	var oppWinsHeader = $("<h2>").html("Opponent Wins:");
	var oppWinsNum = $("<h3>").attr({
		id: "oppWinsNum"
	});
	$(oppWins).append(oppWinsHeader);
	$(oppWins).append(oppWinsNum);
	$(gameDiv).append(oppWins);

	database.ref(roomRoute).on("value", function(snapshot) {
		console.log("something is happening");
		updateRoomStats(snapshot.val());
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

	$(gameDiv).append(rock,paper,scissors);
	$("#middle").append(gameDiv);
	database.ref(roomRoute + "/ready").on("value", function(snapshot) {
		readyCheck(snapshot.val());
	});
}

function updateRoomStats(snap) {
	var p1wins = snap.p1Wins;
	var ties = snap.ties;
	var p2wins = snap.p2Wins;

	console.log(p1wins);
	console.log(p2wins);
	console.log(ties);

	if(playerNum === 1) {
		$("#myWinsNum").html(p1wins);
		$("#tiesNum").html(ties);
		$("#oppWinsNum").html(p2wins);
	} else if(playerNum === 2) {
		$("#myWinsNum").html(p2wins);
		$("#tiesNum").html(ties);
		$("#oppWinsNum").html(p1wins);
	}
}

function ready(choice) {
	if (playerNum === 1) {
		database.ref(roomRoute + "/ready").update({
			p1choice: choice,
			p1ready: 1
		});
	} else if(playerNum === 2) {
		database.ref(roomRoute + "/ready").update({
			p2choice: choice,
			p2ready: 1
		});
	}
}

function readyCheck(snap) {
	if(snap.p1ready === 1 && snap.p2ready === 1) {
		database.ref(roomRoute + "/ready").update({
			p1ready: 0,
			p2ready: 0
		});
		whoWon(snap.p1choice, snap.p2choice);
	}
}

function whoWon(p1, p2) {
	if(p1 - p2 === 0) {
		//tie
		console.log("tie");
		database.ref(roomRoute).once("value", function(snapshot) {
			updateTie(snapshot.val(), p1);
		});
	} else if (p1 - p2 === 1 || p1 - p2 === -2) {
		//p1 win
		console.log("p1Win");
		database.ref(roomRoute).once("value", function(snapshot) {
			updateP1Win(snapshot.val(), p1);
		});
	} else {
		//p2 win
		console.log("p2Win");
		database.ref(roomRoute).once("value", function(snapshot) {
			updateP2Win(snapshot.val(), p2);
		});
	}	
}

function updateTie(snap, choice) {
	var ties;

	ties = snap.ties;
	ties++;

	database.ref(roomRoute).update({
		ties: ties
	});

	database.ref(userPath).once("value", function(snapshot) {
		updateStats(snapshot.val(), 0, choice)
	});
}

function updateP1Win(snap, choice) {
	var wins;
	var p2choice;

	if(choice === 0) {
		p2choice = 2;
	} else if(choice === 1) {
		p2choice = 0;
	} else {
		p2choice = 1;
	}

	wins = snap.p1Wins;
	wins++;

	database.ref(roomRoute).update({
		p1Wins: wins
	});

	if(playerNum === 1) {
		database.ref(userPath).once("value", function(snapshot) {
			updateStats(snapshot.val(), 1, choice)
		});
	}else if (playerNum === 2) {
		database.ref(userPath).once("value", function(snapshot) {
			updateStats(snapshot.val(), 2, p2choice)
		});
	}
}

function updateP2Win(snap, choice) {
	var wins;
	var p1choice;

	if(choice === 0) {
		p1choice = 2;
	} else if(choice === 1) {
		p1choice = 0;
	} else {
		p1choice = 1;
	}

	wins = snap.p2Wins;
	wins++;

	database.ref(roomRoute).update({
		p2Wins: wins
	});

	if(playerNum === 1) {
		database.ref(userPath).once("value", function(snapshot) {
			updateStats(snapshot.val(), 2, p1choice)
		});
	}else if (playerNum === 2) {
		database.ref(userPath).once("value", function(snapshot) {
			updateStats(snapshot.val(), 1, choice)
		});
	}
}

//snapshot will be for current user
function updateStats(snap, result, choice) {
//results: 0 = tie, 1 = win, 2 = loss
	var wins, ties, losses, total, rock, paper, scissors;
	if(snap.total === null) {
		wins = 0;
		ties = 0;
		losses = 0;
		total = 0;
		rock = 0;
		paper = 0;
		scissors = 0;
	} else {
		wins = snap.wins;
		ties = snap.ties;
		losses = snap.losses;
		total = snap.total;
		rock = snap.rock;
		paper = snap.paper;
		scissors = snap.scissors;		
	}

	total++;
	if (result === 0) {
		ties++;
	} else if (result === 1) {
		wins++;
	} else if (result === 2) {
		losses++;
	}

	if (choice === 0) {
		rock++;
	} else if (choice === 1) {
		paper++;
	} else if (choice === 2) {
		scissors++;
	}

	database.ref(userPath).update({
		wins: wins,
		ties: ties,
		losses: losses,
		total: total,
		rock: rock,
		paper: paper,
		scissors: scissors
	})
}