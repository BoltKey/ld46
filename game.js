var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: "#663222",
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 500},
			debug: false
		}
	},
	scene: [preloader, menuScene, levelSelect, myScene, credits, complete]
}
var soundMuted = false;
var musicMuted = false;
const AUTHOR_MEDALS = [
	2553, 8591, 13179, 12028, 11927, 30526, 23670, 33829, 16946, 31844, 59683, 79400, 26022, 27957, 70876];
function gold(t) {
	return Math.ceil(t * 1.1 / 1000) * 1000;
}
function silver(t) {
	return Math.ceil(5 + t * 1.3 / 1000) * 1000;
}
function bronze(t) {
	return Math.ceil(20 + t * 1.5 / 1000) * 1000;
}
const MEDAL_TIMES = [];
for (var i = 0; i < 15; ++i) {
	var m = AUTHOR_MEDALS[i];
	MEDAL_TIMES.push([bronze(m), silver(m), gold(m), m]);
}

const game = new Phaser.Game(config);


function createMuteButtons(scene) {
	var mutesound = scene.add.image(700, 550, 'soundmute', 0 + 2 * soundMuted).setInteractive({cursor: "pointer"});
	mutesound.on('pointerover', function(pointer) {
		mutesound.setFrame(1 + 2 * soundMuted);
	}, scene);
	mutesound.on('pointerout', function(pointer) {
		mutesound.setFrame(0 + 2 * soundMuted);
	}, scene);
	mutesound.on('pointerdown', function(pointer) {
		//this.scene.start("levelSelect");
		console.log("mute sound");
		
		soundMuted = !soundMuted;
		mutesound.setFrame(1 + 2 * soundMuted);
	}, scene);
	
	var mutemusic = scene.add.image(750, 550, 'musicmute', 0 + 2 * musicMuted).setInteractive({cursor: "pointer"});
	mutemusic.on('pointerover', function(pointer) {
		mutemusic.setFrame(1 + 2 * musicMuted);
	}, scene);
	mutemusic.on('pointerout', function(pointer) {
		mutemusic.setFrame(0 + 2 * musicMuted);
	}, scene);
	mutemusic.on('pointerdown', function(pointer) {
		//this.scene.start("levelSelect");
		console.log("mute music");
		
		musicMuted = !musicMuted;
		mutemusic.setFrame(1 + 2 * musicMuted);
		
		AUDIO.levelmusic.volume = (!musicMuted) * 0.3;
		AUDIO.menumusic.volume = (!musicMuted) * 0.3;
	}, scene);
}