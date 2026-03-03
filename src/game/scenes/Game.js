import { Scene } from 'phaser';
import FallingObject from './FallingObject';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');
        this.cameras.main.setBackgroundColor(0x222222);

        this.player = this.physics.add.sprite(320, 0, 'player');
        this.player.setCollideWorldBounds(true);
        Phaser.Display.Bounds.SetBottom(this.player, this.scale.height);

        /*
        this.ground = this.add.tileSprite(0, 328, WIDTH, HEIGHT, 'TEXTURE', 'TEXTUREFRAME');
        this.physics.add.existing(this.ground, true);
        this.physics.add.collider(this.player, this.ground);
        */

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys ({
            //up: Phaser.Input.Keyboard.KeyCodes.W,
            //down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.stopBuffer = 0;
        this.lastXKey = 'none'
        this.input.keyboard.on('keydown', (e) => {
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                this.lastXKey = 'left';
            } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                this.lastXKey = 'right';
            }
        });


        //Math.floor(...): Rounds the result down to the nearest whole integer. 
        //This ensures you do not have a "partial" lane if the screen width isn't perfectly divisible by 16.
        this.totalLanes = Math.floor(this.scale.width / 16);

        //Array.from({ length: ... }): Creates a new array with a specific number of empty slots based on totalLanes.
        this.spawnLanes = Array.from({ length: this.totalLanes }, (v, i) => (i * 16) + 8);

        this.fallingObjects = this.physics.add.group({
            classType: FallingObject,
            runChildUpdate: true,
            maxSize: -1
        });

        this.time.addEvent({
            delay: 100,
            callback: this.spawnObject,
            callbackScope: this,
            loop: true
        })

        this.physics.add.overlap(
            this.player, 
            this.fallingObjects, 
            this.handleHit, 
            this.checkCooldown, 
            this
            );
        
        this.hp = 3;
        
        this.time.addEvent({
            delay: 1000,
            callback: this.tick,
            callbackScope: this,
            loop: true
        });
        // -- END OF CREATE --
    }

    tick()
    {
        this.timeLeft--;
        this.events.emit('updateTime', this.timeLeft);

        if (this.timeLeft <= 0) {
            //this.handleGameOver //THE WIN!
        }
    }

    checkCooldown(player, object)
    {
        const currentTime = this.time.now;

        if (!player.lastHitTime || currentTime > player.lastHitTime + 1000) {
            return true;
        }

        return false;
    }

    handleHit (player, object)
    {
        this.hp -= 1;
        this.events.emit('deductHP', this.hp);
        player.lastHitTime = this.time.now;
        player.setAlpha(0.5);
        this.time.delayedCall(1000, () => player.setAlpha(1));
        if (this.hp === 0) {
            this.events.emit('playerLost');
            //this.input.keyboard.enabled = false;
        }
    }

    spawnObject ()
    {
        const fallingSpeed = 200;
        const fallingObject = this.fallingObjects.get(Phaser.Math.RND.pick(this.spawnLanes), -16);
        
        if (fallingObject) {
            this.physics.world.enableBody(fallingObject);
            fallingObject.setActive(true);
            fallingObject.setVisible(true);
            fallingObject.body.setCircle(16);
            fallingObject.setVelocityY(fallingSpeed);
        }
    }

    recycleObject (obj)
    {
        this.fallingObjects.killAndHide(obj);
        obj.body.stop();
        this.physics.world.disableBody(obj.body);
        
    }

    update ()
    {
        console.log('Active Objects: ', this.fallingObjects.countActive());

        const playerSpeed = 160
        const leftDown = this.wasd.left.isDown || this.cursors.left.isDown;
        const rightDown = this.wasd.right.isDown || this.cursors.right.isDown;

        if (leftDown && rightDown) {
            this.stopBuffer = 0;
            if (this.lastXKey === 'left'){
                this.player.setVelocityX(-playerSpeed);
            } else {
                this.player.setVelocityX(playerSpeed);
            } 
        } else if (leftDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(-playerSpeed)
        } else if (rightDown) {
            this.stopBuffer = 0;
            this.player.setVelocityX(playerSpeed);
        } else {
            this.stopBuffer++;
            if (this.stopBuffer > 2) {
                this.player.setVelocityX(0);
                this.lastXKey = 'none';
            }
        }


        // -- END OF UPDATE --
    }
}