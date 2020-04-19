
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
		
		this.backgroundImage = this.add.image(0, 0, "menubackground").setOrigin(0, 0);
		var levelsButton = this.add.image(550, 150, 'button-big').setInteractive();
		this.add.image(levelsButton.getCenter().x, levelsButton.getCenter().y, "levelselect");
		levelsButton.on('pointerdown', function(pointer) {
			this.scene.start("levelSelect");
		}, this);
		var playButton = this.add.image(550, 50, 'button-big').setInteractive();
		this.add.image(playButton.getCenter().x, playButton.getCenter().y, "play");
		playButton.on('pointerdown', function(pointer) {
			this.scene.start("myScene");
		}, this);
	}
	
	update(time, delta) {
	}
}