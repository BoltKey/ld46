var userName;
var speedrunStart;
class menuScene extends Phaser.Scene {
	constructor() {
		super("menuScene");
	}
	
	preload() {
		console.log("making menu");
		
	};
	
	init(data) {
	}
	
	create() {
		AUDIO.levelmusic.stop();
		if (!AUDIO.menumusic.isPlaying) {
			AUDIO.menumusic.play();
		}
		
		this.backgroundImage = this.add.image(0, 0, "menubackground").setOrigin(0, 0);
		createMuteButtons(this);
		var levelsButton = this.add.image(550, 100, 'button-big').setInteractive({cursor: "pointer"});
		levelsButton.on('pointerover', function(pointer) {
			levelsButton.setFrame(1);
		}, this);
		levelsButton.on('pointerout', function(pointer) {
			levelsButton.setFrame(0);
		}, this);
		this.add.image(levelsButton.getCenter().x, levelsButton.getCenter().y, "levelselect");
		levelsButton.on('pointerdown', function(pointer) {
			this.scene.start("levelSelect");
		}, this);
		
		var creditsButton = this.add.image(550, 400, 'button-big').setInteractive({cursor: "pointer"});
		creditsButton.on('pointerover', function(pointer) {
			creditsButton.setFrame(1);
		}, this);
		creditsButton.on('pointerout', function(pointer) {
			creditsButton.setFrame(0);
		}, this);
		creditsButton.on('pointerdown', function(pointer) {
			this.scene.start("credits");
		}, this);
		this.add.text(creditsButton.getCenter().x, creditsButton.getCenter().y, "Credits", {fontFamily: "brothers", fontSize: 20}).setOrigin(0.5);
		
		var playButton = this.add.image(550, 50, 'button-big').setInteractive({cursor: "pointer"});
		playButton.on('pointerover', function(pointer) {
			playButton.setFrame(1);
		}, this);
		playButton.on('pointerout', function(pointer) {
			playButton.setFrame(0);
		}, this);
		this.add.image(playButton.getCenter().x, playButton.getCenter().y, "play");
		playButton.on('pointerdown', function(pointer) {
			this.scene.start("myScene");
		}, this);
		if (allComplete()) {
			var speedrunButton = this.add.image(550, 300, 'button-big').setInteractive({cursor: "pointer"});
			speedrunButton.on('pointerover', function(pointer) {
				speedrunButton.setFrame(1);
			}, this);
			speedrunButton.on('pointerout', function(pointer) {
				speedrunButton.setFrame(0);
			}, this);
			this.add.text(speedrunButton.getCenter().x, speedrunButton.getCenter().y, "Speedrun", {fontFamily: "brothers", fontSize: 20}).setOrigin(0.5);
			speedrunButton.on('pointerdown', function(pointer) {
				speedrunStart = Date.now();
				this.scene.start("myScene", {level: 1, speedrun: true});
			}, this);
		}
		
		$("body").append(
			$("<input type=text id='name-input'>")
			.css("top", $("canvas").position().top + 150)
			.css("left", $("canvas").position().left + 470)
			
			.on("input", function(e) {ajax.rename(e.target.value)})
		)
		if (userName) {
			$("#name-input").val(userName);
		}
		this.add.text(425, 150, "Name", {fontFamily: "brothers"});
	}
	
	update(time, delta) {
	}
}