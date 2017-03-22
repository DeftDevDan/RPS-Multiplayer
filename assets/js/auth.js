window.onload=start;
var google = new firebase.auth.GoogleAuthProvider();
google.addScope("https://www.googleapis.com/auth/plus.login");
google.addScope("https://www.googleapis.com/auth/admin.directory.customer.readonly");
var guser, prof, gmail, database;


function start() {
	var config = {
	    apiKey: "AIzaSyA8bRhWzQ4IctzbS0RuCEO9EO3NjWwOW8M",
	    authDomain: "rps-game-54f23.firebaseapp.com",
	    databaseURL: "https://rps-game-54f23.firebaseio.com",
	    storageBucket: "rps-game-54f23.appspot.com",
	    messagingSenderId: "367644462259"
	};
	firebase.initializeApp(config);
	database = firebase.database();


	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    $("#logCheck").html("Logout");
		$("#logCheck").attr("onClick", "signOut()");
		guser = user;
		prof = guser.photoURL;
		gmail = guser.email;
		loadLobby();
	  } else {
	    loginGoogle();
	  }
	});
	database.ref("chat").on("value", function(snapshot) {
		updateChat(snapshot);
	});
}

function loginGoogle() {
	firebase.auth().signInWithPopup(google).then(function(result) {
		if (result.credential) {
			var token = result.credential.accessToken;
			$("#logCheck").html("Logout");
			$("#logCheck").attr("onClick", "signOut()");
			checkUser();
			loadLobby();
		}
		guser = result.user;
		console.log(guser);
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
		localStorage.clear();
		location.reload();
	}).catch(function(error) {

		console.log(error);
	});
}

function checkUser() {
	database.ref('users').once('value', function(snapshot) {
		userExist(snapshot.val());
	});
}

function userExist(usersRef) {
	var exists = false;
	for(var key in usersRef) {
		if(usersRef[key].email === gmail) {
			exists = true;
		} else {

		}
	}

	if(exists) {
	} else {
		database.ref("users").push({
			email: gmail,
			name: guser.displayName,
			pic: prof,
			wins: 0,
			losses: 0,
			ties: 0,
			rock: 0,
			paper: 0,
			scissors: 0,
			total: 0
		});
	}	
}