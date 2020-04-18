var scene;
class levelSelect extends Phaser.Scene {
	constructor() {
		super("levelSelect");
	}
	
	preload() {
		console.log("making menu");
		this.load.image("button", "assets/button.png");
		this.load.spritesheet ("medal", "assets/medals.png", {
			frameWidth: 30,
			frameHeight: 30
		});
	};
	
	init(data) {
	}
	
	create() {
		scene = this;
		for (var levelNo = 1; levelNo <= 20; ++levelNo) {
			(function(level) {
				var lev = level;
				var levelbutton = scene.add.image(80 + 40 * ((lev-1)%5), 200 + 40 * (Math.floor((lev-1)/5)), 'button').setInteractive();
				var bestTime = localStorage.getItem(GAME_PREF + lev);
				var medalBeat = 0;
				if (bestTime) {
					medalBeat = MEDAL_TIMES[lev-1].filter(a => a >= bestTime).length;
				}
				if (medalBeat > 0) {
					var medal = scene.add.image(80 + 40 * ((lev-1)%5), 200 + 40 * (Math.floor((lev-1)/5)), 'medal', medalBeat - 1);
				}
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