const GROUND_ACCEL = 800;
const SKY_ACC_RATIO = 0.5;
const GROUND_MAXSPEED = 230;
const FALL_MAXSPEED = 1000;
const DRAG = 1800;
const JUMP_STR = 250;
const GAME_PREF = "ktc-";
const BUBBLE_AMT = 10;
var scene;
function getColorScale(scale) {
	t = Math.floor(scale * 255);
	green = (t >= 128 ? 255 : t * 2);
	red = (t < 128 ? 255 : 2 * (255 - t));
	if (red < 0) red = 0;
	if (red > 255) red = 255;
	blue = 0;
	return red * 256 * 256 + green * 256 + blue//"rgb(" + red + "," + green + ",0)";
}

function timeString(t) {
	return Math.floor(t / 1000) + "." + ("" + Math.floor((Math.floor(Math.abs(t)))% 1000 / 10)).padStart(2, "0")  + "s";
}
class myScene extends Phaser.Scene {
	constructor() {
		super("myScene");
	}
	
	preload() {
		console.log("loading level scene");
		this.load.tilemapTiledJSON("level" + this.levelNo, "levels/level" + this.levelNo + ".json");
		$("#name-input").remove();
	};
	
	init(data) {
		const {level = 1, ghost=[]} = data;
		this.levelNo = level;
		this.environmentNo = Math.ceil(level / 5);
		this.ghostData = ghost;
		
	}
	
	create() {
		this.bestTime = localStorage.getItem(GAME_PREF + this.levelNo);
		console.log(this.levelNo);
		
		scene = this;
		this.backgroundImage = this.add.image(0, 0, "background" + this.environmentNo).setOrigin(0, 0);
		this.timeText = this.add.text(32, 32);
		this.timeText.setFontSize(30).setColor("#000000");
		this.countDown = this.add.image(400, 300, "countdown");
		this.countDown.setOrigin(0.5);
		
		this.messageText = this.add.text(0, 0);
		this.messageText.setDepth(19);
		this.messagePost = this.add.image(0, 0, "msgbg");
		this.messagePost.setOrigin(0.5).setDepth(18).setAlpha(0);
		
		this.bubbles = [];
		for (var i = 0; i < BUBBLE_AMT; ++i) {
			this.bubbles.push(this.add.image(380 + 18 * i, 10 + 10 * (i%2), "bubble", 0));
			this.bubbles[i].depth = 11;
		}
		
		this.waterText = this.add.image(310, 20, "watertext");
		/*this.waterText.setFontSize(30).setColor("#0000bb");
		this.waterText.setText("Water: 0/100");*/
		this.waterText.depth = this.timeText.depth = 10;
		
		this.anims.create({
			key: "run",
			frames: this.anims.generateFrameNumbers("player", {start: 2, end: 3}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: "jump",
			frames: this.anims.generateFrameNumbers("player", {start: 10, end: 10}),
			frameRate: 3,
			repeat: -1
		});
		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("player", {start: 0, end: 1}),
			frameRate: 3,
			repeat: -1
		});
		this.waterLeft = 0;
		this.waterMax = 1000;
		
		this.replayData = [];
		
		this.startTime = false;
		this.timeSaved = false;
		
		
		this.jumpStart = false;
		
		this.doubleJumpAvailable = true;
		this.player = this.physics.add.sprite(100, 20, "player", 0).setOrigin(0.5);
		
		this.replayIndex = 0;
		
		this.player.setMaxVelocity(GROUND_MAXSPEED, FALL_MAXSPEED).
		setSize(38, 38);
		this.player.body.setAllowGravity(true);
		
		this.player.displayOriginX = 0.5; 
		this.player.displayOriginY = 0.5;
		
		this.player.setCollideWorldBounds(true);
		
		
		this.loadMap();
		var levelsButton = this.add.image(700, 20, 'button-big').setInteractive({cursor: "pointer"});
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
		var source = {
			contains: function(x, y) {
				for (var p of scene.plants.children.entries) {
					if (p.body.hitTest(x,y) && p.water < p.targetWater && p.water > 0) {
						p.water += 1;
						if (p.water >= p.targetWater) {
							p.setFrame(p.frame.name + 1);
							if (scene.plants.children.entries.filter(a => a.water < a.targetWater).length === 0) {
								scene.levelWon = true;
								
								
								
							}
						}
						return true;
					}
					var pos = scene.player.body.position;
					if (x > pos.x + 10 && x < pos.x + 30 && y > pos.y + 5 && y < pos.y + 20 && scene.waterLeft < scene.waterMax) {
						scene.waterLeft += 1;
						return true;
					}
				}
				return false;
				
			}
		}
		
		this.waterParticles = this.add.particles("water");
		var config = {
			lifespan: 10000,
			gravityY: 300,
			quantity: 0,
			speedX: {min: -10, max: 10},
			speedY: {min: -3, max: 3},
			deathZone: {type: "onEnter", source: source}
		};
		this.waterEmitter = this.waterParticles.createEmitter(config);
		
		this.waterLayer.forEachTile(tile => {
			if (tile.properties.watersource) {
				var emitter = this.waterParticles.createEmitter(config);
				emitter.setFrequency(1, tile.properties.watersource);
				emitter.setPosition(tile.getCenterX(), tile.getCenterY());
			}
		});
		
		
		this.key_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.key_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.key_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.key_R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		this.key_N = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
		this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.key_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.input.keyboard.on("keydown-N", function() {this.scene.start("myScene", {level: this.levelNo + 1})}, this);
		
		
		AUDIO.walk.volume = 0;
		AUDIO.walk.loop = true;
		AUDIO.walk.play();
	}
	
	loadMap() {
		this.map = this.add.tilemap("level" + this.levelNo);
		let terrain = this.map.addTilesetImage("wood", "tileset" + this.environmentNo);
		this.platforms = this.map.createStaticLayer("platforms", [terrain], 0, 0);
		this.plantLayer = this.map.createDynamicLayer("plants", [terrain], 0, 0);
		this.waterLayer = this.map.createDynamicLayer("water", [terrain], 0, 0);
		this.textLayer = this.map.createDynamicLayer("text", [terrain], 0, 0);
		this.backgroundLayer = this.map.createStaticLayer("background", [terrain], 0, 0);
		
		var scale = 1;
		this.platforms.setScale(scale);
		this.plantLayer.setScale(scale);
		this.waterLayer.setScale(scale);
		if (this.textLayer) {
			this.textLayer.setScale(scale);
		}
		this.airborne = false;
		this.backgroundLayer.setScale(scale);
		this.plants = this.physics.add.staticGroup();
		this.levelWon = false;
		this.levelLost = false;
		this.platforms.setCollisionBetween(1, 1000);
		this.physics.add.collider(this.platforms, this.player);
		this.physics.add.collider(this.player, this.backgroundLayer);
		this.textDisplayed = false;
		this.backgroundLayer.setTileIndexCallback([43], function(player, tile) {
			scene.messageText.setText(tile.properties.message); 
			var x = tile.getCenterX();
			x = Math.min(600, Math.max(200, x));
			var y = tile.getCenterY() + 130;
			if (y > 500) {
				y -= 280;
			}
			scene.messageText.setOrigin(0.5).setPosition(x, y).setAlign("center");
			scene.messagePost.setPosition(x, y).setAlpha(1);
			this.textDisplayed = true}, this);
		this.backgroundLayer.setTileIndexCallback([-1], function(player, tile) {if (!this.textDisplayed) {scene.messageText.setText(""); this.messagePost.setAlpha(0);}}, this);
		
		this.plantLayer.forEachTile(tile => {
			if (tile.properties.plant) {
				var baseIndex = (tile.properties.plant - 1) * 5;
				var plant = this.physics.add.sprite(tile.getCenterX(), tile.getCenterY() - 10, "plantSheet", baseIndex);
				plant.baseIndex = baseIndex;
				plant.body.setAllowGravity(false);
				//plant.setScale(scale);
				plant.water = tile.properties.startwater || 10;
				plant.targetWater = tile.properties.targetwater || 100;
				plant.loseWater = tile.properties.losewater || 0;
				plant.graphics = this.add.graphics({x: tile.getCenterX(), y: tile.getCenterY()});
				this.plants.add(plant);
				
			}
			else if (tile.properties.player) {
				this.player.setPosition(tile.getCenterX(), tile.getCenterY());
			}
			
			this.plantLayer.removeTileAt(tile.x, tile.y);
		});
		/*if (this.textLayer) {
			this.textLayer.forEachTile(tile => {
				if (tile.properties.text) {
					this.add.text(tile.getCenterX(), tile.getCenterY(), tile.properties.text);
					
				}
				
				this.plantLayer.removeTileAt(tile.x, tile.y);
			});
		}*/
	}
	updatePlants(delta) {
		this.plants.children.entries.forEach(p => {
			if (p.water < p.targetWater)
				p.water -= p.loseWater * (delta / 1000);
			p.water = Math.max(0, p.water);
			p.water = Math.min(p.targetWater, p.water);
			if (p.water === 0 && !this.levelLost) {
				this.levelLost = true;
				var t = this.add.text(400, 100, "Oh no, a flower died!\nPress R to restart", {fontSize: "20px", color: "#ff0000"});
				t.setOrigin(0.5);
			}
			var gaugeHeight = 40;
			var gaugeWidth = 10;
			
			
			p.graphics.clear();
			p.graphics.beginPath();
			p.graphics.lineStyle(gaugeWidth, "#000000", 1.0);
			p.graphics.beginPath();
			p.graphics.moveTo(-25, 5);
			p.graphics.lineTo(-25, 5 - gaugeHeight)
			p.graphics.strokePath();
			p.graphics.closePath();
			
			p.graphics.beginPath();
			p.graphics.lineStyle(gaugeWidth - 2, getColorScale(p.water / p.targetWater), 1.0);
			p.graphics.beginPath();
			p.graphics.moveTo(-25, 4);
			p.graphics.lineTo(-25, 4 - (p.water / p.targetWater) * (gaugeHeight - 2))
			p.graphics.strokePath();
			p.graphics.closePath();
			var currFrame = Math.floor((p.water / p.targetWater) * 3);
			if (p.water === 0) {
				currFrame -= 1;
			}
			p.setFrame(p.baseIndex + currFrame+1);
		});
	}
	checkWin(time, delta) {
		var string;
		if (!this.startTime) {
			this.startTime = time + 1000;
		}
		function t(th) {
			return time - th.startTime;
		}
		if (!this.levelWon || !this.timeSaved) {
			if (t(this) > 0) {
				this.countDown.setFrame(3);
				if (!this.countDown.fading) {
					this.countDown.fading = true;
					this.tweens.add({
					  targets: this.countDown,
					  alpha: 0,
					  duration: 300,
					  ease: 'Power2'
					}, this);
				}
				string = timeString(t(this));
				this.timeText.setPosition(32, 32);
				this.timeText.setFontSize(30);
				this.timeText.setOrigin(0);
				if (this.bestTime) {
					//string += " (best: " + timeString(this.bestTime) + ")";
				}
			}
			else {
				
				this.countDown.setFrame(3-Math.ceil(-t(this) / 1000 * 3));
				//this.timeText.setPosition(400, 300);
				//this.timeText.setFontSize(140);
				//this.timeText.setOrigin(0.5);
				
			}
			
			this.timeText.setText(string);
		}
		if (this.levelWon && !this.timeSaved) {
			// level won
			scene.add.image(400, 300, "levelend");
			console.log("saving time " + Math.floor(t(this)) + " for level " + this.levelNo);
			var newBestString = "Your time:\n" + timeString(t(this)) + "\n";
			var oldMedals = getMedalBeat(this.levelNo);
			var m = 0;
			while (m < oldMedals) {
				this.add.image(340 + 40 * m, 180, "medal", m);
				++m;
			}
			var newMedals = oldMedals;
			if (!this.bestTime || Math.floor(t(this)) < +this.bestTime) {
				localStorage.setItem(GAME_PREF + this.levelNo, Math.floor(t(this)));
				this.bestTime = Math.floor(t(this));
				newMedals = getMedalBeat(this.levelNo);
				newBestString +=  "New personal best!\n";
			}
			ajax.submit(time - this.startTime, this.levelNo, scene);
			this.timeSaved = true;
			var timeOut = 500;
			while (m < newMedals) {
				(function(m, timeOut) {
					var medal = m;
					setTimeout(function() {scene.add.image(340 + 40 * m, 180, "medal", medal), AUDIO["medal" + medal].play()}, timeOut);
				})(m, timeOut);
				timeOut += 500;
				++m;
			}
			scene.add.text(400, 300, "Level complete!\n" + 
			newBestString + 
			(newMedals < 4 ? ("Beat " + timeString(MEDAL_TIMES[this.levelNo-1][newMedals]) + 
			" for next medal\n") : "") + 
			"press N for next level\n" + 
			"Press R to try again", 
			{fontSize: "20px", color: "#ffff00", align: "center"}).setOrigin(0.5);
		}
		
		if (t(this) < 0) {
			
			return;
		}
	}
	updatePlayer(delta) {
		var groundAccel = GROUND_ACCEL / ((50 + this.waterLeft) / 100);
		this.player.body.setMaxVelocity(Math.min(GROUND_MAXSPEED, groundAccel), FALL_MAXSPEED);
		var jumpStr = Math.min(JUMP_STR, groundAccel * 1.2 - 30);
		if (this.key_R.isDown) {
			this.scene.restart({level: this.levelNo, ghost: this.ghostData});
			return;
		}
		if (!this.player.body) {
			return;
		}
		var touch = {};
		for (var d of ["up", "down", "left", "right"]) {
			touch[d] = this.player.body.blocked[d];
		}
		
		if (this.key_SPACE.isDown && this.waterLeft > 0) {
			
			var drops = Math.ceil(this.waterLeft / 100);
			this.waterLeft -= drops;
			
			this.waterEmitter.setFrequency(1, drops);
			this.waterEmitter.start();
		}
		else {
			this.waterEmitter.stop();
		}
		
		
		//touch = this.player.body.blocked;
		var walk = false;
		if (this.key_UP.isDown || this.key_W.isDown) {
			if (touch.down) {
				this.player.setVelocityY(-jumpStr);
				this.player.anims.play("jump", true);
				AUDIO.jump.play();
				this.jumpStart = true;
			}
			else if (this.jumpStart) {
				if (this.player.body.velocity.y < 0) {
					this.player.setAccelerationY(-200);
				}
				else {
					this.player.setAccelerationY(0);
					this.player.anims.play("player-fall", true);
				}
			}
		}
		else {
			this.player.setAccelerationY(0);
			if (touch.down && this.player.body.velocity.x !== 0) {
				this.player.anims.play("run", true);
				walk = true;
				if (!this.walkSound) {
					$(AUDIO.walk).animate({volume: 1}, 100);
					this.walkSound = true;
				}
				
			}
			else if (!touch.down) {
				//this.player.anims.play("player-fall", true);
			}
			this.jumpStart = false;
		}
		if (!walk && this.walkSound) {
			$(AUDIO.walk).animate({volume: 0}, 100);
			this.walkSound = false;
		}
		if (touch.down) {
			if (this.player.body.velocity.x === 0 && !this.jumpStart) {
				this.player.anims.play("idle", true);
			}
			if (this.airborne) {
				AUDIO.fall.play();
			}
			this.airborne = false;
		}
		else {
			this.airborne = true;
		}
		if ((this.key_RIGHT.isDown || this.key_D.isDown) && !touch.right && this.player.body.velocity.x >= 0) {
			this.player.setAccelerationX(groundAccel);
			if (!touch.down) {
				this.player.setAccelerationX(groundAccel * SKY_ACC_RATIO);
			}
		}
		else if ((this.key_LEFT.isDown || this.key_A.isDown) && !touch.left && this.player.body.velocity.x <= 0) {
			this.player.setAccelerationX(-groundAccel);
			if (!touch.down) {
				this.player.setAccelerationX(-groundAccel * SKY_ACC_RATIO);
			}
		}
		else {
			this.player.setAccelerationX(0);
			this.player.setDragX(DRAG);
			if (!touch.down) {
				this.player.setDragX(DRAG * SKY_ACC_RATIO);
			}
		}
		
		if (this.player.body.velocity.x > 0) {
			this.player.flipX = 0;
		}
		else if (this.player.body.velocity.x < 0) {
			this.player.flipX = -1;
		}
	}
	updateWater() {
		this.waterEmitter.setPosition(this.player.body.position.x + (this.player.flipX ? 5 : 35), this.player.body.position.y + 10);
		this.waterEmitter.setSpeedX({ min: this.player.body.velocity.x - 10, max: this.player.body.velocity.x + 10 });
		this.waterEmitter.setSpeedY({ min: this.player.body.velocity.y - 10, max: this.player.body.velocity.y + 10 });
		var bubbleMaxFrame = 9;
		var maxDisplay = bubbleMaxFrame * BUBBLE_AMT;
		
		var toDisplay = Math.ceil((this.waterLeft / this.waterMax) * maxDisplay);
		
		for (var i = 0; i < BUBBLE_AMT; ++i) {
			var toSub = Math.min(bubbleMaxFrame, toDisplay);
			toDisplay -= toSub;
			this.bubbles[i].setFrame(toSub);
		}
		
		//is.waterText.setText("Water: " + this.waterLeft + "/" + this.waterMax);
	}
	update(time, delta) {
		this.textDisplayed = false;
		if (!this.plants.children) 
			return;
		this.updatePlants(delta);
		
		
		
		this.checkWin(time, delta);
		
		/*this.replayData.push({t: Math.floor(t(this)), x: Math.round(this.player.body.x), y: Math.round(this.player.body.y), f: this.player.frame.name});
		
		while (this.ghostData[this.replayIndex+1] && this.ghostData[this.replayIndex+1].t < t(this)) {
			++this.replayIndex;
		}
		var ghostFrame = this.ghostData[this.replayIndex];
		if (ghostFrame && this.ghost) {
			this.ghost.setPosition(ghostFrame.x, ghostFrame.y);
			this.ghost.setFrame(ghostFrame.f);
		}*/
		if ( time - this.startTime > 0) {
			this.updatePlayer(delta);
		}
		
		this.updateWater();
		
	}
}