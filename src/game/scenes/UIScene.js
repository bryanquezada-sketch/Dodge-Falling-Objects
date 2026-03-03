import { Scene } from 'phaser';

export class UIScene extends Scene {
    constructor ()
    {
        super ({ key: 'UIScene' });
    }

    create ()
    {
        this.gameScene = this.scene.get('Game');

        this.hpCounter = this.add.text(0, 0, `HP: 3`, {
            fontSize: '16px',
            fill: '#ffffff'
        });

        this.gameScene.events.on('deductHP', (hp) => {
            this.hpCounter.setText(`HP: ${hp}`);
        }, this);

        this.gameScene.events.on('playerLost', () => {
            this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'YOU LOSE!', {
                fontSize: '128px',
                wordWrap: { width: this.scale.width },
                align: 'center'
            }).setOrigin(0.5);
        })

        this.timerText = this.add.text(0, 16, 'Time: 60', {
            fontSize: '16px',
            fill: '#ffffff'
        });

        this.gameScene.events.on('updateTime', (seconds) => {
            this.timerText.setText(`Time: ${seconds}`);
        });

        this.gameScene.events.on('playerWon', () => {
            this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
            this.add.text(this.scale.width / 2, this.scale.height / 2, 'YOU WIN!\nDISNEY WORLD THAT WAY ->', {
                fontSize: '64px',
                wordWrap: { width: this.scale.width },
                align: 'center'
            }).setOrigin(0.5);
        })
    }
}