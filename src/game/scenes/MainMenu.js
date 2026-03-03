import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(0, 0, 'background', ).setOrigin(0);

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo').setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 'Click to Start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
