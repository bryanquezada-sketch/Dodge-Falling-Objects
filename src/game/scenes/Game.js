import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.player = this.physics.add.sprite(320, 0, 'player');
        this.player.setCollideWorldBounds(true);
        Phaser.Display.Bounds.SetBottom(this.player, this.scale.height);

        /*
        this.ground = this.add.tileSprite(0, 328, WIDTH, HEIGHT, 'TEXTURE', 'TEXTUREFRAME');
        this.physics.add.existing(this.ground, true);
        this.physics.add.collider(this.player, this.ground);
        */

        this.stopBuffer = 0;
        this.lastXKey = 'none'
        this.input.keyboard.on('keydown', (e) => {
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                this.lastXKey = 'left';
            } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                this.lastXKey = 'right';
            }
        });

        this.fallingObjects = this.physics.add.group({
            defaultKey: 'object',
            maxSize: 50
        });


        //Math.floor(...): Rounds the result down to the nearest whole integer. 
        //This ensures you do not have a "partial" lane if the screen width isn't perfectly divisible by 16.
        this.totalLanes = Math.floor(this.scale.width / 16);

        //Array.from({ length: ... }): Creates a new array with a specific number of empty slots based on totalLanes.
        this.spawnLanes = Array.from({ length: this.totalLanes }, (v, i) => (i * 16) + 8);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys ({
            //up: Phaser.Input.Keyboard.KeyCodes.W,
            //down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.input.keyboard.on('keydown-SPACE', this.spawnObjects, this);
        this.input.keyboard.on('keydown', (event) => {
            console.log("Key pressed:", event.key);
        });
        // -- END OF CREATE --
    }

    spawnObjects ()
    {
        console.log('SPACE IS HIT');
        this.fallingObject = this.fallingObjects.get(Phaser.Math.RND.pick(this.spawnLanes), 0);
        this.fallingObject.setActive(true);
        this.fallingObject.setVisible(true);
        this.fallingObject.body.setCircle(16);
    }
    update ()
    {
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