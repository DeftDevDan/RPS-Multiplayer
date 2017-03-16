window.onload=start;
var google = new firebase.auth.GoogleAuthProvider();
google.addScope("https://www.googleapis.com/auth/plus.login");
google.addScope("https://www.googleapis.com/auth/admin.directory.customer.readonly");
var user, prof;
function start() {
	user = localStorage.getItem("user");
	prof = localStorage.getItem("picture");
	if (localStorage.getItem("user") !== null) {
		$("#logCheck").html("Logout");
		$("#logCheck").attr("onClick", "signOut()");
		loadLobby();
	}
}


function loginGoogle() {
	firebase.auth().signInWithPopup(google).then(function(result) {
		if (result.credential) {
			var token = result.credential.accessToken;
			$("#logCheck").html("Logout");
			$("#logCheck").attr("onClick", "signOut()");
			loadLobby();
		}
		user = result.user;
		localStorage.setItem("user", user.displayName);
		localStorage.setItem("picture", user.photoURL);
		console.log(user);
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		//This is the email of the user's account used
		var email = error.email;
		//The firebase.auth.AuthCredential type that was used
		var credential = error.credential;
		console.log(errorMessage);
	});
}

function signOut() {
	firebase.auth().signOut().then(function() {
		localStorage.removeItem("user");
		location.reload();
	}).catch(function(error) {
		console.log(error);
	});
}