var scene;
class levelSelect extends Phaser.Scene {
	constructor() {
		super("levelSelect");
	}
	
	preload() {
		console.log("making menu");
		this.load.image("button-big", "assets/button.png");
	};
	
	init(data) {
	}
	
	create() {
		scene = this;
		for (var levelNo = 1; levelNo <= 20; ++levelNo) {
			(function(level) {
				var lev = level;
				console.log("making level " + lev + " button");
				var levelbutton = scene.add.image(80 + 40 * ((lev-1)%5), 200 + 40 * (Math.floor((lev-1)/5)), 'button-big').setInteractive();
				scene.add.text(levelbutton.getCenter().x, levelbutton.getCenter().y, lev, {align: "right"}).setOrigin(0.5);
				levelbutton.on('pointerdown', function(pointer) {
					scene.scene.start("myScene", {level: lev});
				});
			}(levelNo) );
		}
	}
	
	update(time, delta) {
	}
}