var AUDIO = {
	
}
const LEVELAMT = 15;
class preloader extends Phaser.Scene {
	constructor() {
		super("preloader");
	}
	
	preload() {
		console.log("making menu");
		//this.load.image("button", "assets/button.png");
		this.load.spritesheet ("medal", "assets/medals.png", {
			frameWidth: 30,
			frameHeight: 30
		});
		this.load.spritesheet("player", "assets/player.png", {
			frameWidth: 40,
			frameHeight: 40,
			margin: 0,
			spacing: 0
		});
		this.load.audio("walk", "assets/walk.wav");
		this.load.audio("jump", "assets/jump.wav");
		this.load.audio("fall", "assets/fall.wav");
		this.load.audio("medal0", "assets/medal0.wav");
		this.load.audio("medal1", "assets/medal1.wav");
		this.load.audio("medal2", "assets/medal2.wav");
		this.load.audio("medal3", "assets/medal3.wav");
		
		this.load.image("tileset1", "assets/tileset1.png");
		this.load.image("tileset2", "assets/tileset2.png");
		this.load.image("tileset3", "assets/tileset3.png");
		this.load.image("water", "assets/water.png");
		this.load.image("background1", "assets/background1.png");
		this.load.image("background2", "assets/background2.png");
		this.load.image("background3", "assets/background3.png");
		this.load.image("menubackground", "assets/menubackground.png");
		this.load.image("msgbg", "assets/messagebackground.png");
		this.load.image("play", "assets/play.png");
		
		this.load.image("levelselect", "assets/levelselect.png");
		this.load.image("watertext", "assets/watertext.png");
		this.load.image("levelselectBackground", "assets/levelselectBackground.png");
		this.load.image("levelend", "assets/levelend.png");
		this.load.spritesheet ("medal", "assets/medals.png", {
			frameWidth: 30,
			frameHeight: 30
		});
		this.load.spritesheet("button-big", "assets/button_big.png", {
			frameWidth: 150,
			frameHeight: 30
		});
		this.load.spritesheet("button", "assets/button.png", {
			frameWidth: 60,
			frameHeight: 30
		});
		this.load.spritesheet("countdown", "assets/countdown.png", {
			frameWidth: 150,
			frameHeight: 150
		});
		//this.load.image("button-highlight", "assets/button-highlight.png");
		/*this.load.spritesheet(
			"woodSheet",
			"assets/tileset.png",
			{
				frameWidth: 20,
				frameHeight: 20,
				margin: 0, 
				spacing: 0
			}	
		);*/
		this.load.spritesheet(
			"bubble", 
			"assets/bubbles.png",
			{
				frameWidth: 20,
				frameHeight: 20
			});
		this.load.spritesheet(
			"plantSheet",
			"assets/plants.png",
			{
				frameWidth: 40,
				frameHeight: 40,
				margin: 0, 
				spacing: 0
			}	
		);
	};
	
	init(data) {
	}
	
	create() {
		AUDIO["walk"] = this.sound.add("walk");
		AUDIO["jump"] = this.sound.add("jump");
		AUDIO["fall"] = this.sound.add("fall");
		AUDIO["medal0"] = this.sound.add("medal0");
		AUDIO["medal1"] = this.sound.add("medal1");
		AUDIO["medal2"] = this.sound.add("medal2");
		AUDIO["medal3"] = this.sound.add("medal3");
		ajax.enter();
		this.scene.start("menuScene");
		
	}
	
	update(time, delta) {
	}
}