var scene;
function getMedalBeat(level) {
	var bestTime = +localStorage.getItem(GAME_PREF + level);
	var medalBeat = 0;
	
	if (bestTime) {
		medalBeat = MEDAL_TIMES[level-1].filter(a => a >= bestTime).length;
	}
	return medalBeat;
}
class levelSelect extends Phaser.Scene {
	constructor() {
		super("levelSelect");
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
		
		this.backgroundImage = this.add.image(0, 0, "levelselectBackground").setOrigin(0, 0);
		var t = scene.add.text(480, 280, "High scores");
		t.setFontFamily("brothers");
		
		for (var i = 0; i < 10; ++i) {
			this.highScoreTexts[i] = this.add.text(480, 300 + 20 * i, "");
			this.highScoreTexts[i].setFontFamily("brothers");
		}
		createMuteButtons(this);
		for (var levelNo = 1; levelNo <= LEVELAMT; ++levelNo) {
			(function(level) {
				var lev = level;
				var levelbutton = scene.add.image(80 + 80 * ((lev-1)%5), 200 + 40 * (Math.floor((lev-1)/5)), 'button', 0).setInteractive({cursor: "pointer"});
				var bestTime = localStorage.getItem(GAME_PREF + lev);
				var medalBeat = getMedalBeat(lev);
				var text = scene.add.text(480, 220);
				if (medalBeat > 0) {
					var medal = scene.add.image(94 + 80 * ((lev-1)%5), 200 + 40 * (Math.floor((lev-1)/5)), 'medal', medalBeat - 1);
				}
				scene.add.text(levelbutton.getCenter().x - 10, levelbutton.getCenter().y, lev, {align: "right", fontFamily: "brothers"}).setOrigin(0.5);
				levelbutton.on('pointerdown', function(pointer) {
					scene.scene.start("myScene", {level: lev});
				});
				levelbutton.on('pointerover', function(pointer) {
					var s = "";
					if (bestTime) {
						s += "Your best time: " + timeString(bestTime) + "\n";
					}
					var medals = getMedalBeat(lev);
					s += (medals < 4 ? ("Beat " + timeString(MEDAL_TIMES[lev-1][medals]) + 
			" for next medal\n") : "")
					scene.highScoreTexts[0].setText("loading scores...");
					
					ajax.fetchScores(lev).then(function() {
						var i = 0;
						for (var h of highScores) {
							scene.highScoreTexts[i++].setText(h[0] + ": " + timeString(h[1]));
						}
					});
					text.setText(s).setFontFamily("brothers");
					levelbutton.setFrame(1);
				});
				levelbutton.on('pointerout', function(pointer) {
					levelbutton.setFrame(0);
					
					text.setText("");
					scene.highScoreTexts.forEach(a => a.setText(""));
				});
				
			}(levelNo) );
		}
		if (allComplete()) {
			var text = scene.add.text(480, 220);
			var speedrunButton = this.add.image(300, 350, 'button-big').setInteractive({cursor: "pointer"});
			speedrunButton.on('pointerover', function(pointer) {
				speedrunButton.setFrame(1);
				
				var s = "";
				if (localStorage.getItem(GAME_PREF + "speedrun")) {
					s += "Your best time: " + timeString(localStorage.getItem(GAME_PREF + "speedrun")) + "\n";
				}
				text.setText(s).setFontFamily("brothers");
				ajax.fetchScores(100).then(function() {
					var i = 0;
					for (var h of highScores) {
						scene.highScoreTexts[i++].setText(h[0] + ": " + timeString(h[1]));
					}
				});
			}, this);
			speedrunButton.on('pointerout', function(pointer) {
				speedrunButton.setFrame(0);
				text.setText("");
				scene.highScoreTexts.forEach(a => a.setText(""));
			}, this);
			this.add.text(speedrunButton.getCenter().x, speedrunButton.getCenter().y, "Speedrun", {fontFamily: "brothers", fontSize: 20}).setOrigin(0.5);
			speedrunButton.on('pointerdown', function(pointer) {
				speedrunStart = Date.now();
				this.scene.start("myScene", {level: 1, speedrun: true});
			}, this);
		}
		
		var levelsButton = this.add.image(550, 150, 'button-big').setInteractive({cursor: "pointer"});
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