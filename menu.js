var userName;
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
		
		$("body").append(
			$("<input type=text id='name-input' style='padding:3px; font-size:16px; border-width:2px; border-style:solid; color:#ffffff; background-color:#704700; border-color:#301a00; border-radius:8px; text-align:center; '>")
			.css("position", "absolute")
			.css("left", "480px")
			.css("top", "150px")
			.css("width", "150px")
			.css("font-family", "brothers")
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