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
