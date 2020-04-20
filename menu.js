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
			$("<input type=text id='name-input'>")
			.css("position", "absolute")
			.css("left", "500px")
			.css("top", "150px")
			.on("input", function(e) {ajax.rename(e.target.value)})
		)
		if (userName) {
			$("#name-input").val(userName);
		}
		this.add.text(450, 150, "Name");
	}
	
	update(time, delta) {
	}
}