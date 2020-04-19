
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
		var levelsButton = this.add.image(120, 400, 'button-big').setInteractive();
		this.backgroundImage = this.add.image(0, 0, "menubackground").setOrigin(0, 0);
		this.add.text(levelsButton.getCenter().x, levelsButton.getCenter().y, "Level select", {align: "center"}).setOrigin(0.5);
		levelsButton.on('pointerdown', function(pointer) {
			this.scene.start("levelSelect");
		}, this);
		var playButton = this.add.image(120, 300, 'button-big').setInteractive();
		this.add.text(playButton.getCenter().x, playButton.getCenter().y, "Play", {align: "center"}).setOrigin(0.5);
		playButton.on('pointerdown', function(pointer) {
			this.scene.start("myScene");
		}, this);
	}
	
	update(time, delta) {
	}
}