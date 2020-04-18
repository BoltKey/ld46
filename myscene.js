const GROUND_ACCEL = 1400;
const SKY_ACC_RATIO = 0.5;
const GROUND_MAXSPEED = 150;
const FALL_MAXSPEED = 1000;
const DRAG = 1300;
const JUMP_STR = 250;
class myScene extends Phaser.Scene {
	constructor() {
		super();
	}
	
	preload() {
		this.load.image("player", "assets/player.png");
		this.load.tilemapTiledJSON("level" + this.levelNo, "levels/level" + this.levelNo + ".json");
		this.load.image("woodset", "assets/tileset.png");
		
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
		
		this.timeText = this.add.text(32, 32);
		this.timeText.setFontSize(30);
		
		this.replayData = [];
		
		this.startTime = false;
		
		
		this.jumpStart = false;
		
		this.doubleJumpAvailable = true;
		this.player = this.physics.add.sprite(100, 20, "player").setOrigin(0.5);
		this.bestTime = 0;
		
		this.replayIndex = 0;
		
		this.player.setMaxVelocity(GROUND_MAXSPEED, FALL_MAXSPEED).
		setSize(40, 40);
		this.player.body.setAllowGravity(true);
		
		this.player.displayOriginX = 0.5; 
		this.player.displayOriginY = 0.5;
		
		this.player.setCollideWorldBounds(true);
		
		
		this.key_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.key_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.key_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.key_R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		
		
		this.map = this.add.tilemap("level" + this.levelNo);
		let terrain = this.map.addTilesetImage("wood", "woodset");
		this.platforms = this.map.createDynamicLayer("platforms", [terrain], 0, 0);
		this.platforms.setScale(0.5);
		this.platforms.setCollisionBetween(1, 1000);
		this.physics.add.collider(this.platforms, this.player);
	}
	
	update(time, delta) {
		function t(th) {
			return time - th.startTime;
		}
		var string;
		if (t(this) > 0) {
			string = Math.floor(t(this) / 1000) + "." + Math.floor(Math.abs(t(this))) % 1000 + "s";
		}
		else {
			string = Math.ceil(-t(this) / 1000 * 3);
		}
		
		this.timeText.setText(string);
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
		//touch = this.player.body.blocked;
		
		if (this.key_UP.isDown) {
			if (touch.down) {
				this.player.setVelocityY(-JUMP_STR);
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
		if (this.key_RIGHT.isDown && !touch.right) {
			this.player.setAccelerationX(GROUND_ACCEL);
			if (!touch.down) {
				this.player.setAccelerationX(GROUND_ACCEL * SKY_ACC_RATIO);
			}
		}
		else if (this.key_LEFT.isDown && !touch.left) {
			this.player.setAccelerationX(-GROUND_ACCEL);
			if (!touch.down) {
				this.player.setAccelerationX(-GROUND_ACCEL * SKY_ACC_RATIO);
			}
		}
		else {
			this.player.setAccelerationX(0);
			this.player.setDragX(DRAG);
			if (!touch.down) {
				this.player.setDragX(DRAG * SKY_ACC_RATIO);
			}
		}
	}
}