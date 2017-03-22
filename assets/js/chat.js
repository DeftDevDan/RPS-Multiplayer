var chatCount = 0;

function updateChat(snap) {
	var msg = snap.val().msg;
	var user = snap.val().user;
	var newMsg = $("<li>");
	$(newMsg).html("<strong>" + user + ":</strong>" + msg);
	$("#messages").append(newMsg);
}

function loadChatCenter() {
	$("#middle").empty();
	loadChat("#middle");
}

function loadChatRight() {
	loadChat("#right");
}

function loadChat(position) {
	var chatBox = $("<div>");
	if(position === "#middle") {
		var messages = $("<div>").attr("id", "messages");
	} else if (position === "#right") {
		var messages = $("<div>").attr("id", "messagesRight");
		if(chatCount === 0) {
			database.ref(chatRoute).on("value", function(snapshot) {
				chatCount = 1;
				gameChat(snapshot.val());
			});			
		}
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

	if (msg === "ggez") {
		var rand = Math.floor(Math.random() * 5);

		switch(rand) {
			case 0:
				msg = "The Hulk touched me when I was 10";		
				break;
			case 1:
				msg = "I bet Blackwidow wants your babies";
				break;
			case 2:
				msg = "Hold on, my mommy just caught me masturbating to pictures of Sophie Turner fully clothed";
				break;
			case 3:
				msg = "My daddy blocked pornhub, what do I do?";
				break;
			case 4:	
				msg = "The Hulk wanted to play hide the pickle with me";
		}

	}

	if(position === "#middle") {
		database.ref("chat").set({
			user: user,
			msg: msg
		});
	} else if (position === "#right") {
		database.ref(chatRoute).set({
			msg: msg,
			user: user
		});
	}
}