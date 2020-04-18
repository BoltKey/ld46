const GROUND_ACCEL = 800;
const SKY_ACC_RATIO = 0.5;
const GROUND_MAXSPEED = 230;
const FALL_MAXSPEED = 1000;
const DRAG = 1800;
const JUMP_STR = 250;
var scene;
class myScene extends Phaser.Scene {
	constructor() {
		super();
	}
	
	preload() {
		this.load.spritesheet("player", "assets/player.png", {
			frameWidth: 40,
			frameHeight: 40,
			margin: 0,
			spacing: 0
		});
		this.load.tilemapTiledJSON("level" + this.levelNo, "levels/level" + this.levelNo + ".json");
		this.load.image("woodset", "assets/tileset.png");
		this.load.image("water", "assets/water.png");
		
		this.load.spritesheet(
			"woodSheet",
			"assets/tileset.png",
			{
				frameWidth: 40,
				frameHeight: 40,
				margin: 0,
				spacing: 0
			}	
		);
	};
	
	init(data) {
		const {level = 1, ghost=[]} = data;
		this.levelNo = level;
		this.ghostData = ghost;
	}
	
	create() {
		
		console.log(this.levelNo);
		
		scene = this;
		
		this.timeText = this.add.text(32, 32);
		this.timeText.setFontSize(30).setColor("#000000");
		
		this.waterText = this.add.text(32, 64);
		this.waterText.setFontSize(30).setColor("#0000bb");
		this.waterText.setText("Water: 0/100");
		
		this.waterLeft = 0;
		this.waterMax = 1000;
		
		this.replayData = [];
		
		this.startTime = false;
		
		
		
		
		this.jumpStart = false;
		
		this.doubleJumpAvailable = true;
		this.player = this.physics.add.sprite(100, 20, "player", 0).setOrigin(0.5);
		this.bestTime = 0;
		
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
		var scale = 0.5;
		this.platforms.setScale(scale);
		this.plantLayer.setScale(scale);
		this.waterLayer.setScale(scale);
		this.plants = this.physics.add.staticGroup();
		this.levelWon = false;
		this.platforms.setCollisionBetween(1, 1000);
		this.physics.add.collider(this.platforms, this.player);
		
		this.plantLayer.forEachTile(tile => {
			if (tile.properties.plant) {
				var plant = this.physics.add.sprite(tile.getCenterX(), tile.getCenterY(), "woodSheet", 1);
				plant.body.setAllowGravity(false);
				plant.setScale(scale);
				plant.water = 0;
				plant.targetWater = 100;
				this.plants.add(plant);
				this.plantLayer.removeTileAt(tile.x, tile.y);
			}
		});
		
		
		var source = {
			contains: function(x, y) {
				for (var p of scene.plants.children.entries) {
					if (p.body.hitTest(x,y) && p.water < p.targetWater) {
						console.log(p, "received water drop");
						p.water += 1;
						if (p.water >= p.targetWater) {
							p.setFrame(p.frame.name + 1);
							if (scene.plants.children.entries.filter(a => a.water < a.targetWater).length === 0) {
								scene.levelWon = true;
								scene.add.text(100, 100, "VICTORY!!!!11!one!", {fontSize: "60px", color: "#ff0000"});
							}
						}
						return p;
					}
					var pos = scene.player.body.position;
					if (x > pos.x + 15 && x < pos.x + 25 && y > pos.y + 10 && y < pos.y + 15 && scene.waterLeft < scene.waterMax) {
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
		this.key_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		
		
		
	}
	
	update(time, delta) {
		function t(th) {
			return time - th.startTime;
		}
		var groundAccel = GROUND_ACCEL / ((50 + this.waterLeft) / 100);
		this.player.body.setMaxVelocity(Math.min(GROUND_MAXSPEED, groundAccel), FALL_MAXSPEED);
		var jumpStr = Math.min(JUMP_STR, groundAccel * 1);
		var string;
		if (!this.levelWon) {
			if (t(this) > 0) {
				string = Math.floor(t(this) / 1000) + "." + Math.floor(Math.abs(t(this))) % 1000 + "s";
			}
			else {
				string = Math.ceil(-t(this) / 1000 * 3);
			}
			this.timeText.setText(string);
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
				this.player.anims.play("player-jump", true);
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
				//this.player.anims.play("player-run", true);
				if (this.player.body.velocity.x > 0) {
					this.player.flipX = 0;
				}
				else {
					this.player.flipX = -1;
				}
			}
			else if (!touch.down) {
				//this.player.anims.play("player-fall", true);
			}
			this.jumpStart = false;
		}
		if (touch.down) {
			if (this.player.body.velocity.x === 0 && !this.jumpStart) {
				//this.player.anims.play("player-idle", true);
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
		this.waterEmitter.setPosition(this.player.body.position.x + (this.player.flipX ? 5 : 35), this.player.body.position.y + 10);
		this.waterEmitter.setSpeedX({ min: this.player.body.velocity.x - 10, max: this.player.body.velocity.x + 10 });
		this.waterEmitter.setSpeedY({ min: this.player.body.velocity.y - 10, max: this.player.body.velocity.y + 10 });
	}
}