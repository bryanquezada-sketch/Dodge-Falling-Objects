export default class FallingObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){ 
        super(scene, x, y, 'falling-object');
    }

    update ()
    {
        const thresholdY = this.scene.physics.world.bounds.bottom + 32;

        if (this.y >= thresholdY) {
            this.scene.recycleObject(this);
        }
    }
}