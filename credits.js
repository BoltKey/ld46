var scene;
function getMedalBeat(level) {
	var bestTime = +localStorage.getItem(GAME_PREF + level);
	var medalBeat = 0;
	
	if (bestTime) {
		medalBeat = MEDAL_TIMES[level-1].filter(a => a >= bestTime).length;
	}
	return medalBeat;
}
class credits extends Phaser.Scene {
	constructor() {
		super("credits");
	}
	
	preload() {
		console.log("making menu");
		
		
		$("#name-input").remove();
	};
	
	init(data) {
	}
	
	create() {
		AUDIO.levelmusic.stop();
		if (!AUDIO.menumusic.isPlaying) {
			AUDIO.menumusic.play();
		}
		scene = this;
		this.highScoreTexts = [];
		
		this.backgroundImage = this.add.image(0, 0, "menubackground").setOrigin(0, 0).setTint(Phaser.Display.Color.GetColor(100, 100, 100));
		var t = scene.add.text(400, 250, 
			"Idea, game design, game programming,\n" + 
			"level design, sound effects:\n" + 
			"BoltKey (https://boltkey.cz)\n\n" +
			"Illustrations, graphic design:\n" + 
			"Klára Spanelová\n(https://klaraspanelova.tumblr.com/, \n @obrazyatak on instagram)\n\n" + 
			"Music by Kevin the C..-\n" + 
			"I mean Kevin MacLeod:\n" + 
			"Easy Lemon\n" +
			"Latin Industries\n\n" +
			"Thanks for playing!"
			
		);
		t.setFontFamily("brothers").setOrigin(0.5);
		t.setFontSize(30);
		t.setAlign("center");
		var levelsButton = this.add.image(200, 400, 'button-big').setInteractive({cursor: "pointer"});
		this.add.image(levelsButton.getCenter().x, levelsButton.getCenter().y, "backtomenu");
		levelsButton.on('pointerdown', function(pointer) {
			this.scene.start("menuScene");
		}, this);
		levelsButton.on('pointerover', function(pointer) {
			levelsButton.setFrame(1);
		}, this);
		levelsButton.on('pointerout', function(pointer) {
			levelsButton.setFrame(0);
		}, this);
	}
	
	update(time, delta) {
	}
}