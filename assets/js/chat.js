var chatKey;

function loadChatCenter() {
	$("#middle").empty();
	loadChat("#middle");
}
function loadChatRight() {
	$("#right").empty();
	loadChat("#right");
}

function loadChat(position) {
	var chatBox = $("<div>");
	if(position === "#middle") {
		var messages = $("<div>").attr("id", "messages");
	} else if (position === "#right") {
		var messages = $("<div>").attr("id", "messagesRight");
		database.ref("gameChat").once("value", function(snapshot) {
			getGameKey(snapshot.val());
		});
	}

	var messageList = $("<ul>");
	$(messages).append(messageList);

	var chat = $("<form>");
	var chatMessage = $("<input>").attr({
		id: "chatMsg",
		type: "text",
		name: "message"
	});
	var sendMsg = $("<button>");
	$(sendMsg).html("Send").attr({
		onClick: "msgSend(\"" + position + "\")"
	});

	$(chat).append(chatMessage, sendMsg);
	$(chatBox).append(messages, chat)
	$(position).append(chatBox);
}

function msgSend(position) {
	event.preventDefault();

	var msg = $("#chatMsg").val();
	var user = guser.displayName;
	$("#chatMsg").val("");

	if(position === "#middle") {
		database.ref("chat").set({
			user: user,
			msg: msg
		});
	} else if (position === "#right") {
		database.ref("gameChat/" + chatKey).set({
			gameName: gameName,
			msg: msg,
			user: user
		});
	}
}

function getGameKey(snap) {
	for(var key in snap) {
		if (snap[key].gameName === gameName) {
			chatKey = key;
		}
	}
}

function gameChat(snap) {
	console.log(snap.val());
	var msg = snap.val().msg;
	var user = snap.val().user;
	var newMsg = $("<li>");
	$(newMsg).html("<strong>" + user + ":</strong>" + msg);	
	$("#messagesRight").append(newMsg);
}

function updateChat(snap) {
	var msg = snap.val().msg;
	var user = snap.val().user;
	var newMsg = $("<li>");
	$(newMsg).html("<strong>" + user + ":</strong>" + msg);
	$("#messages").append(newMsg);
}