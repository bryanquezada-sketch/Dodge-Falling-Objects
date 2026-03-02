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
        this.ground = this.add.tileSprite(0, 328);
        this.physics.add.existing(this.ground, true);
        this.physics.add.collider(this.player, this.ground);
        */

       this.fallingObjects = this.physics.add.group({
        defaultKey: 'object',
        maxSize: 50
       });

       this.fallingObjects.body.setCircle(16);
//       this.fallingObjects.body.setAllowGravity(false);

       //Math.floor(...): Rounds the result down to the nearest whole integer. This ensures you do not have a "partial" lane if the screen width isn't perfectly divisible by 16.
       this.totalLanes = Math.floor(this.scale.width / 16);

       //Array.from({ length: ... }): Creates a new array with a specific number of empty slots based on totalLanes.
       this.spawnLanes = Array.from({ length: this.totalLanes }, (v, i) => i * 16);
       
       /* (i * 16) + 8: Calculates the start of the lane (i * 16) and adds half of the lane width (8).
       Logic: Most Phaser sprites use a center-origin (0.5). If you spawn a sprite at x = 0, half the sprite will be off-screen to the left. By adding 
        8, the sprite’s center aligns with the middle of the 
        16-pixel lane.
        Result: this.spawnLanes becomes an array of center-positions: [8, 24, 40, 56, ...].
       this.spawnLanes = Array.from({ length: this.totalLanes }, (v, i) => (i * 16) + 8);
       */

       
    
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys ({
            //up: Phaser.Input.Keyboard.KeyCodes.W,
            //down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })

        // -- END OF CREATE --
    }

    update ()
    {
        const playerSpeed = 160;

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-playerSpeed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }

        // -- END OF UPDATE --
    }
}
