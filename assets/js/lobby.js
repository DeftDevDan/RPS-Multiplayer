var inGame = false;
var gameName, playerNum, gameKey, chatRoute, roomRoute, gameLoaded = false, userPath;

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
	for (var key in snapshot) {
		if(snapshot[key].playerCount < 2) {
			addBtn(snapshot[key].roomName);
		}
		if(snapshot[key].playerCount === 0) {
			database.ref("rooms/" + key).remove();
		}
	}
}

//Button created on line 22
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

function roomExist(rooms, roomName, type) {
	var exists = false;
	for (var key in rooms) {
		if (rooms[key].roomName === roomName) {
			gameExists(); //line 110
			exists = true;
		}
	}

	if (exists) {
	}else {
		database.ref("rooms").push({
			roomName: roomName,
			type: type,
			ready: {
				p1ready: 0,
				p2ready:0,
				p1choice: 0,
				p2choice: 0
			},
			p1Wins: 0,
			p2Wins: 0,
			ties: 0,
			p1: {
				name: "",
			},
			p2: {
				name: "",
			},
			playerCount:1,
			chat: {
				user: guser.displayName,
				msg: "joined!"
			},
		}),
		join(roomName, 1);
		addBtn(roomName); //line 99
	}
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

//If the game exists, this function will alert the player and restart the game name choosing cycle
function gameExists() {
	alert("Game Name Exists, Try Again");
	createRoom();
}

//the player joins the game room, gets a snapshot to run the addPlayer function and passes the desire player number
function join(roomName, player) {
	gameName = roomName;
	if (inGame === false) {
		if (player === 1) {
			database.ref("rooms").on("value", function(snapshot) {
				addPlayer(snapshot.val(), 1);
				inGame = true;
			});		
		} else {
			database.ref("rooms").on("value", function(snapshot) {
				addPlayer(snapshot.val(), 2);
				inGame = true;
			});	
		}
	}

}

//addPlayer adds player name to the desired game room
function addPlayer(snap, player) {
	for(var key in snap) {
		if (snap[key].roomName === gameName && player === 1) {
			database.ref("rooms/" + key + "/p1").update({name: guser.displayName});
			playerNum = 1;
		} else if (snap[key].roomName === gameName && player === 2) {
			database.ref("rooms/" + key + "/p2").update({name: guser.displayName});
			database.ref("rooms/" + key).update({playerCount: 2});
			playerNum = 2;			
		}
		chatRoute = "rooms/" + key + "/chat";
		roomRoute = "rooms/" + key;
	}
	if(gameLoaded === false) {
		loadGame();
	}
}

function gameChat(snap) {
	var msg = snap.msg;
	var user = snap.user;
	if(msg !== null) {
		var newMsg = $("<li>");
		$(newMsg).html("<strong>" + user + ":</strong>" + msg);	
		$("#messagesRight").append(newMsg);		
	}
}

function loadStats(snap) {
	var userInfo;
	for (var key in snap) {
		if (snap[key].email === gmail) {
			userInfo = snap[key];
			userPath = "users/" + key;
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
}
