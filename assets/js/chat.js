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
	var chat = $("<form>");
	var chatMessage = $("<input>").attr({
		id: "chatMsg",
		type: "text",
		name: "message"
	});
	var sendMsg = $("<button>");

	$(chat).append(chatMessage, sendMsg);
	$(chatBox).append(chat);
	$(chatBox).append(position);
}