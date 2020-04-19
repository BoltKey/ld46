const GROUND_ACCEL = 800;
const SKY_ACC_RATIO = 0.5;
const GROUND_MAXSPEED = 230;
const FALL_MAXSPEED = 1000;
const DRAG = 1800;
const JUMP_STR = 250;
const GAME_PREF = "watering";
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
		
	};
	
	init(data) {
		const {level = 1, ghost=[]} = data;
		this.levelNo = level;
		this.ghostData = ghost;
		
	}
	
	create() {
		this.bestTime = localStorage.getItem(GAME_PREF + this.levelNo);
		console.log(this.levelNo);
		
		scene = this;
		this.backgroundImage = this.add.image(0, 0, "background").setOrigin(0, 0);
		this.timeText = this.add.text(32, 32);
		this.timeText.setFontSize(30).setColor("#000000");
		
		this.waterText = this.add.text(32, 64);
		this.waterText.setFontSize(30).setColor("#0000bb");
		this.waterText.setText("Water: 0/100");
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
		setSize(40, 40);
		this.player.body.setAllowGravity(true);
		
		this.player.displayOriginX = 0.5; 
		this.player.displayOriginY = 0.5;
		
		this.player.setCollideWorldBounds(true);
		
		this.map = this.add.tilemap("level" + this.levelNo);
		let terrain = this.map.addTilesetImage("wood", "woodset");
		this.platforms = this.map.createDynamicLayer("platforms", [terrain], 0, 0);
		this.plantLayer = this.map.createDynamicLayer("plants", [terrain], 0, 0);
		this.waterLayer = this.map.createDynamicLayer("water", [terrain], 0, 0);
		this.backgroundLayer = this.map.createStaticLayer("background", [terrain], 0, 0);
		var scale = 1;
		this.platforms.setScale(scale);
		this.plantLayer.setScale(scale);
		this.waterLayer.setScale(scale);
		this.backgroundLayer.setScale(scale);
		this.plants = this.physics.add.staticGroup();
		this.levelWon = false;
		this.levelLost = false;
		this.platforms.setCollisionBetween(1, 1000);
		this.physics.add.collider(this.platforms, this.player);
		
		this.plantLayer.forEachTile(tile => {
			if (tile.properties.plant) {
				var plant = this.physics.add.sprite(tile.getCenterX(), tile.getCenterY() - 10, "plantSheet", 0);
				plant.baseIndex = 0;
				plant.body.setAllowGravity(false);
				//plant.setScale(scale);
				plant.water = tile.properties.startwater || 10;
				plant.targetWater = tile.properties.targetwater || 100;
				plant.loseWater = tile.properties.losewater || 0;
				plant.graphics = this.add.graphics({x: tile.getCenterX(), y: tile.getCenterY()});
				this.plants.add(plant);
				this.plantLayer.removeTileAt(tile.x, tile.y);
			}
		});
		
		
		var source = {
			contains: function(x, y) {
				for (var p of scene.plants.children.entries) {
					if (p.body.hitTest(x,y) && p.water < p.targetWater && p.water > 0) {
						console.log(p, "received water drop");
						p.water += 1;
						if (p.water >= p.targetWater) {
							p.setFrame(p.frame.name + 1);
							if (scene.plants.children.entries.filter(a => a.water < a.targetWater).length === 0) {
								scene.levelWon = true;
								scene.add.text(100, 100, "VICTORY!!!!11!one!", {fontSize: "60px", color: "#ff0000"});
								
							}
						}
						return true;
					}
					var pos = scene.player.body.position;
					if (x > pos.x + 10 && x < pos.x + 30 && y > pos.y + 5 && y < pos.y + 20 && scene.waterLeft < scene.waterMax) {
						console.log("caught water");
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
			quantity: 2,
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
		this.key_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.input.keyboard.on("keydown-N", function() {this.scene.start("myScene", {level: this.levelNo + 1})}, this);
		
		
		
	}
	
	update(time, delta) {
		function t(th) {
			return time - th.startTime;
		}
		if (!this.plants.children) 
			return;
		this.plants.children.entries.forEach(p => {
			if (p.water < p.targetWater)
				p.water -= p.loseWater * (delta / 1000);
			p.water = Math.max(0, p.water);
			p.water = Math.min(p.targetWater, p.water);
			if (p.water === 0 && !this.levelLost) {
				this.levelLost = true;
				scene.add.text(100, 100, "you losed :(((((\n rip in peperon \n press [R]estart", {fontSize: "60px", color: "#ff0000"});
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
			p.setFrame(p.baseIndex + currFrame+1);
		});
		var groundAccel = GROUND_ACCEL / ((50 + this.waterLeft) / 100);
		this.player.body.setMaxVelocity(Math.min(GROUND_MAXSPEED, groundAccel), FALL_MAXSPEED);
		var jumpStr = Math.min(JUMP_STR, groundAccel * 1);
		var string;
		if (!this.levelWon || !this.timeSaved) {
			if (t(this) > 0) {
				string = timeString(t(this));
			}
			else {
				string = Math.ceil(-t(this) / 1000 * 3);
			}
			if (this.bestTime) {
				string += " (best: " + timeString(this.bestTime) + ")";
			}
			this.timeText.setText(string);
		}
		if (this.levelWon && !this.timeSaved) {
			console.log("saving time " + Math.floor(t(this)) + " for level " + this.levelNo);
			if (!this.bestTime || Math.floor(t(this)) < +this.bestTime) {
				localStorage.setItem(GAME_PREF + this.levelNo, Math.floor(t(this)));
				this.bestTime = Math.floor(t(this));
			}
			this.timeSaved = true;
		}
		if (!this.startTime) {
			this.startTime = time + 1000;
		}
		if (t(this) < 0) {
			
			return;
		}
		
		
		this.replayData.push({t: Math.floor(t(this)), x: Math.round(this.player.body.x), y: Math.round(this.player.body.y), f: this.player.frame.name});
		
		while (this.ghostData[this.replayIndex+1] && this.ghostData[this.replayIndex+1].t < t(this)) {
			++this.replayIndex;
		}
		var ghostFrame = this.ghostData[this.replayIndex];
		if (ghostFrame && this.ghost) {
			this.ghost.setPosition(ghostFrame.x, ghostFrame.y);
			this.ghost.setFrame(ghostFrame.f);
		}
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
			console.log("watering " + drops + " drops");
			
			this.waterEmitter.setFrequency(1, drops);
			this.waterEmitter.start();
		}
		else {
			this.waterEmitter.stop();
		}
		this.waterText.setText("Water: " + this.waterLeft + "/" + this.waterMax);
		
		//touch = this.player.body.blocked;
		
		if (this.key_UP.isDown) {
			if (touch.down) {
				this.player.setVelocityY(-jumpStr);
				this.player.anims.play("jump", true);
				//this.audio.jump.play();
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
				
			}
			else if (!touch.down) {
				//this.player.anims.play("player-fall", true);
			}
			this.jumpStart = false;
		}
		if (touch.down) {
			if (this.player.body.velocity.x === 0 && !this.jumpStart) {
				this.player.anims.play("idle", true);
			}
		}
		if (this.key_RIGHT.isDown && !touch.right && this.player.body.velocity.x >= 0) {
			this.player.setAccelerationX(groundAccel);
			if (!touch.down) {
				this.player.setAccelerationX(groundAccel * SKY_ACC_RATIO);
			}
		}
		else if (this.key_LEFT.isDown && !touch.left && this.player.body.velocity.x <= 0) {
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
		this.waterEmitter.setPosition(this.player.body.position.x + (this.player.flipX ? 5 : 35), this.player.body.position.y + 10);
		this.waterEmitter.setSpeedX({ min: this.player.body.velocity.x - 10, max: this.player.body.velocity.x + 10 });
		this.waterEmitter.setSpeedY({ min: this.player.body.velocity.y - 10, max: this.player.body.velocity.y + 10 });
	}
}