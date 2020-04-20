var AUDIO = {
	
}
const LEVELAMT = 15;
class preloader extends Phaser.Scene {
	constructor() {
		super("preloader");
	}
	
	preload() {
		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(240, 270, 320, 50);
		console.log("loading");
		this.loadText = this.add.text(400, 278, "Loading", {fontFamily: "brothers", align: "center"}).setOrigin(0.5);
		this.load.on('progress', function (value) {
			if (this.loadText)
				this.loadText.setText("Loading\n\n" + Math.floor(value * 100) + "%");
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(250, 280, 300 * value, 30);
			console.log("progress" + value);
		}, this);
					
		this.load.on('fileprogress', function (file) {
			console.log(file.src);
		});
		 
		this.load.on('complete', function () {
			console.log('complete');
		});
		this.start = Date.now();
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
		this.load.audio("flower0", "assets/yipee.wav");
		this.load.audio("flower1", "assets/yay.wav");
		this.load.audio("flower2", "assets/woohoo.wav");
		this.load.audio("ohno", "assets/ohno.wav");
		this.load.audio("levelmusic", "assets/music_level.mp3");
		this.load.audio("menumusic", "assets/music_menu.mp3");
		
		this.load.image("tileset1", "assets/tileset1.png");
		this.load.image("tileset2", "assets/tileset2.png");
		this.load.image("tileset3", "assets/tileset3.png");
		this.load.spritesheet("water", "assets/watersheet.png", {
			frameWidth: 5,
			frameHeight: 5
		});
		this.load.image("background1", "assets/background1.png");
		this.load.image("background2", "assets/background2.png");
		this.load.image("background3", "assets/background3.png");
		this.load.image("menubackground", "assets/menubackground.png");
		this.load.image("msgbg", "assets/messagebackground.png");
		this.load.image("play", "assets/play.png");
		
		this.load.image("levelselect", "assets/levelselect.png");
		this.load.image("backtomenu", "assets/backtomenu.png");
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
		console.log("loading took " + (Date.now() - this.start) + "ms");
		AUDIO["walk"] = this.sound.add("walk");
		AUDIO["jump"] = this.sound.add("jump");
		AUDIO["fall"] = this.sound.add("fall");
		AUDIO["medal0"] = this.sound.add("medal0");
		AUDIO["medal1"] = this.sound.add("medal1");
		AUDIO["medal2"] = this.sound.add("medal2");
		AUDIO["medal3"] = this.sound.add("medal3");
		AUDIO["flower0"] = this.sound.add("flower0");
		AUDIO["flower1"] = this.sound.add("flower1");
		AUDIO["flower2"] = this.sound.add("flower2");
		AUDIO["levelmusic"] = this.sound.add("levelmusic");
		AUDIO["levelmusic"].volume = 0.1;
		AUDIO["levelmusic"].loop = true;
		AUDIO["menumusic"] = this.sound.add("menumusic");;
		AUDIO["menumusic"].loop = true;
		AUDIO["menumusic"].volume = 0.3;
		AUDIO["ohno"] = this.sound.add("ohno");
		ajax.enter();
		this.scene.start("menuScene");
		
	}
	
	update(time, delta) {
	}
}