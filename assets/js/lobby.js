var google = new firebase.auth.GoogleAuthProvider();
google.addScope("https://www.googleapis.com/auth/plus.login");
google.addScope("https://www.googleapis.com/auth/admin.directory.customer.readonly");

function loginGoogle() {
	firebase.auth().signInWithPopup(google).then(function(result) {
		if (result.credential) {
			var token = result.credential.accessToken;
			console.log(result.user);
		}
		var user = result.user
		console.log("something");
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		//This is the email of the user's account used
		var email = error.email;
		//The firebase.auth.AuthCredential type that was used
		var credential = error.credential;
		console.log(errorMessage);
	});
	console.log("test");
}

function signOut() {
	firebase.auth().signOut().then(function() {

	}).catch(function(error) {

	});
}