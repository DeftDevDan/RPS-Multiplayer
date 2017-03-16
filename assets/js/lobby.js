function loadLobby() {
	var profPic = $("<img>");
	profPic.attr("src", prof);
	$(profPic).addClass("img-circle img-responsive");
	$("#stats").append(profPic);
}