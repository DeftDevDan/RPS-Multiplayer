var inGame = false;
var gameName, playerNum;
var statSend=[];
function loadLobby() {
	var profPic = $("<img>");
	$(profPic).attr("src", prof);
	$(profPic).addClass("img-circle img-responsive col-md-6");
	var userName = $("<h3>");
	$(userName).attr("data-name", guser.displayName);
	$(userName).html(guser.displayName);
	var profDiv = $("<div>");
	$(profDiv).attr("style", "display: inline-block");
	$(profDiv).append(profPic, userName);
	$("#left").prepend(profDiv);
	database.ref("users").on("value", function(snapshot) {
		$("#stats").empty();
		loadStats(snapshot.val());
	});
	var roomDiv = $("<div>");
	$(roomDiv).attr({
		id: "roomDiv",
		height: "90vh"
	});
	$("#right").append(roomDiv);
	var roomBtn = $("<button>");
	$(roomBtn).attr({
		onClick: "createRoom()"
	}).html("Create Room");
	$("#right").append(roomBtn);

	database.ref("rooms").on("value", function(snapshot) {
		if(inGame === false){
			$("#roomDiv").empty();
			loadRooms(snapshot.val());
		}	
	});

	loadChatCenter();
}

function loadRooms(snapshot) {
	var roomName;
	for (var key in snapshot) {
		if(snapshot[key].playerCount < 2) {
			addBtn(snapshot[key].roomName);
		}
	}
}

function loadStats(snap) {
	var userInfo;
	for (var key in snap) {
		if (snap[key].email === gmail) {
			userInfo = snap[key];
		}
	}
	var wins = $("<h3>");
	var losses = $("<h3>");
	var ties = $("<h3>");
	var rock = $("<h3>");
	var paper = $("<h3>");
	var scissors = $("<h3>");

	$(wins).html("<strong>wins: </strong>" + userInfo.wins);
	$(losses).html("<strong>losses: </strong>" + userInfo.losses);
	$(ties).html("<strong>ties: </strong>" + userInfo.ties);
	$(rock).html("<strong>rock: </strong>" + Math.floor(userInfo.rock/userInfo.total * 100) + "%");
	$(paper).html("<strong>paper: </strong>" + Math.floor(userInfo.paper/userInfo.total * 100) + "%");
	$(scissors).html("<strong>scissors: </strong>" + Math.floor(userInfo.scissors/userInfo.total * 100) + "%");
	$("#stats").append(wins, losses, ties, rock, paper, scissors);

	var ro, pap, scis;
	if(userInfo.rock !== 0) {
		ro = Math.floor(userInfo.rock/userInfo.total * 100);
	} else {
		ro = 0;
	}
	if(userInfo.paper !== 0) {
		pap = Math.floor(userInfo.paper/userInfo.total * 100);
	} else {
		pap = 0;
	}
	if(userInfo.scissors !== 0) {
		scis = Math.floor(userInfo.scissors/userInfo.total * 100);
	} else {
		scis = 0;
	}


	statSend.push(userInfo.wins, userInfo.losses, userInfo.ties, ro, pap, scis);
}

//When player chooses the make a new game room, this will prompt for a game room name, then make sure that the name has not already been taken and makes the game room
function createRoom() {
	//clearRooms();
	//public/private();
	var type = "public";
	var response = prompt("Enter name of Game Room");
	if (response === null) {
		return;
	}
	database.ref("rooms").once("value", function(snapshot) {
		roomExist(snapshot.val(), response.toUpperCase(), type);
	});
}

//This checks to see if the room exists in the database, if the game name does not exist, it creates a new game room and sets the properties, if the game room does exist, it runs the gameExists() function
function roomExist(rooms, roomName, type) {
	var exists = false;
	for (var key in rooms) {
		if (rooms[key].roomName === roomName) {
			gameExists();
			exists = true;
		}
	}

	if (exists) {
	}else {
		var newRef = database.ref("rooms");
		var newData = {
			roomName: roomName,
			type: type,
			player1: "",
			player2: "",
			playerCount: 1,
			p1Wins: 0,
			p2Wins: 0,
			p1Choice: 0,
			p2Choice: 0,
			p1Ready: 0,
			p2Ready: 0,
			ties: 0,
			p1Stats: statSend,
			p2Stats: []
		};
		newRef.push(newData);
		join(roomName, 1);
		addBtn(roomName);
	}
}

//If the game exists, this function will alert the player and restart the game name choosing cycle
function gameExists() {
	alert("Game Name Exists, Try Again");
	createRoom();
}

function addBtn(roomName) {
	var btn = $("<button>");
	$(btn).html(roomName).attr({
		onClick: "join(\""+roomName+"\", 2)",
		id: "\"" + roomName + "\""
	});
	$("#roomDiv").append(btn);
	$("#roomDiv").append("<br>");
}

//the player joins the game room, gets a snapshot to run the addPlayer function and passes the desire player number
function join(roomName, player) {
	gameName = roomName;
	inGame = true;
	if (player === 1) {
		database.ref("rooms").on("value", function(snapshot) {
			addPlayer(snapshot.val(), 1);
		});		
	} else {
		database.ref("rooms").on("value", function(snapshot) {
			addPlayer(snapshot.val(), 2);
		});	
	}
}

//addPlayer adds player name to the desired game room
function addPlayer(snap, player) {
	for(var key in snap) {
		if (snap[key].roomName === gameName && player === 1) {
			database.ref("rooms/" + key).update({player1: guser.displayName});
			playerNum = 1;
		} else if (snap[key].roomName === gameName && player === 2) {
			database.ref("rooms/" + key).update({player2: guser.displayName});
			database.ref("rooms/" + key).update({playerCount: 2});
			database.ref("rooms/" + key).update({p2Stats: statSend})
			playerNum = 2;
		}
	}

	loadGame();
}