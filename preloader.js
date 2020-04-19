class preloader extends Phaser.Scene {
	constructor() {
		super("preloader");
	}
	
	preload() {
		console.log("making menu");
		this.load.image("button", "assets/button.png");
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
		
		this.load.image("woodset", "assets/tileset.png");
		this.load.image("water", "assets/water.png");
		this.load.image("background", "assets/background1.png");
		this.load.image("menubackground", "assets/menubackground.png");
		this.load.image("levelselectBackground", "assets/levelselectBackground.png");
		this.load.image("button-big", "assets/button_big.png");
		this.load.spritesheet(
			"woodSheet",
			"assets/tileset.png",
			{
				frameWidth: 20,
				frameHeight: 20,
				margin: 0, 
				spacing: 0
			}	
		);
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
		this.scene.start("menuScene");
	}
	
	update(time, delta) {
	}
}