var google = new firebase.auth.GoogleAuthProvider();
google.addScope("https://www.googleapis.com/auth/plus.login");
google.addScope("https://www.googleapis.com/auth/admin.directory.customer.readonly");

var token = localStorage.getItem(token);


if (localStorage.getItem("token") === null) {
	loginGoogle();
}
function loginGoogle() {
	firebase.auth().signInWithPopup(google).then(function(result) {
		if (result.credential) {
			token = result.credential.accessToken;
			localStorage.setItem(token);
			console.log(result.user);
		}
		var user = result.user;
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
		localStorage.removeItem("token");
	}).catch(function(error) {

	});
}