
class menuScene extends Phaser.Scene {
	constructor() {
		super("menuScene");
	}
	
	preload() {
		console.log("making menu");
		this.load.image("button", "assets/button_big.png");
	};
	
	init(data) {
	}
	
	create() {
		var levelsButton = this.add.image(120, 400, 'button').setInteractive();
		this.add.text(levelsButton.getCenter().x, levelsButton.getCenter().y, "Level select", {align: "center"}).setOrigin(0.5);
		levelsButton.on('pointerdown', function(pointer) {
			this.scene.start("levelSelect");
		}, this);
		var playButton = this.add.image(120, 300, 'button').setInteractive();
		this.add.text(playButton.getCenter().x, playButton.getCenter().y, "Play", {align: "center"}).setOrigin(0.5);
		playButton.on('pointerdown', function(pointer) {
			this.scene.start("myScene");
		}, this);
	}
	
	update(time, delta) {
	}
}