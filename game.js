var config = {
	type: Phaser.AUTO,
	width: 812,
	height: 560,
	backgroundColor: "#ffff00",
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 500},
			debug: false
		}
	},
	scene: [menuScene, levelSelect, myScene]
}

const game = new Phaser.Game(config);
