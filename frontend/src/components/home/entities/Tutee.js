import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

class Tutee extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, sheet) {
		super(scene, x, y, sheet, 0);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.scene = scene;

		this.anims.play(`${scene.tutee}-idle`);

		this.setOrigin(0.5,1);
		this.body.setSize(16,23);
		this.body.setOffset(0,10);
		this.body.setMaxVelocity(150, 150);
		this.body.setDrag(1000, 1000);

		this.keys = scene.cursorKeys;
		this.input = {};

		this.setupAnimations();

		this.body.setVelocity(0,0);

	}

	setupAnimations() {
    this.animState = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'idle', from: '*', to: 'idle' },
        { name: 'left', from: '*', to: 'left' },
        { name: 'right', from: '*', to: 'right' },
        { name: 'up', from: '*', to: 'up' },
        { name: 'down', from: '*', to: 'down' },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play(this.scene.tutee +'-'+ lifecycle.to);
          console.log(lifecycle);
        },
				onLeft: () => {
					this.body.setVelocity(-1000, 0);
					// this.x -= 5;
				},
				onRight: () => {
					this.body.setVelocity(1000, 0);
				},
				onUp: () => {
					this.body.setVelocity(0, -400);
				},
				onDown: () => {
					this.body.setVelocity(0, 400);
				}
      },
    });

		this.animPredicates = {
      idle: () => {
        return ['left','right','up','down'].filter(item => this.keys[item].isDown).length === 0;
      },
      left: () => {
        return this.keys.left.isDown;
      },
      right: () => {
        return this.keys.right.isDown;
      },
      up: () => {
        return this.keys.up.isDown;
      },
      down: () => {
        return this.keys.down.isDown;
      },
    };
  }

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		for (const t of this.animState.transitions()) {
      if (t in this.animPredicates && this.animPredicates[t]()) {
        this.animState[t]();
        break;
      }
    }
	}
}

export default Tutee;