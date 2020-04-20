var orig = "https://boltkey.cz/kevin_the_can/";
var scores = {};
var first;
var highScores;
var userName;
var ajax = {
	enter: function(name) {
		if (typeof kongregate !== "undefined") {
			var kname = kongregate.services.getUsername();
			var id = kongregate.services.getUserId();
			if (id && name === undefined)
				name = kname
		}
		$.ajax({
		url: orig + "php/entry.php" + ((name === undefined) ? "" : "?display=" + name),
		type: "GET",
		crossDomain: true,
		success: function(data){
			console.log(data);
			var a = JSON.parse(data);
			if (a[0]) {
				first = false;
			}
			else {
				first = true;
			}
			$("#name-input").val(a[1]);
			userName = a[1];
			/*$("#usr-text").val(a[1]);
			userName = a[1];
			if (userName.substr(0, 4) !== "usr_") {
				
			}*/
			//ajax.fetchScores();
		}
	})
	},
	rename: function(name) {
		userName = name;
		$.ajax({
		url: orig + "php/rename.php?newname=" + name,
		type: "GET",
		crossDomain: true,
		success: function(data){
			console.log(data);
		}
	})
	},
	submit: function(score, level, scene) {
		// Hi. Please, don't try to hack this. You will break the system probably.
		return $.ajax({
		url: orig + "php/settime.php?score=" + score + "&level=" + level,
		type: "GET",
		crossDomain: true,
		success: function(data) {
			console.log(data);
			ajax.fetchScores(level).then(function() {
				
			});
		}
	})
	},
	fetchScores: function(level) {
		return $.ajax({
		url: orig + "php/gettimes.php?level=" + level,
		type: "GET",
		crossDomain: true,
		success: function(data) {
			highScores = JSON.parse(data);
			for (var i in highScores) {
				var a = highScores[i].filter(function(a) {return a[0] === userName})[0];
				if (a)
					scores[i] = a[1];
			}
		}
	})
	}
}