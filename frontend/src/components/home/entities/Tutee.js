import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';
import { API, graphqlOperation } from 'aws-amplify';
import { updateTutee } from '../../../graphql/mutations';

class Tutee extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, sheet, id) {
		super(scene, x, y, sheet, 0);

    this.keys = scene.cursorKeys;

		scene.add.existing(this);
		scene.physics.add.existing(this);

    this.id = id;

		this.scene = scene;

		this.anims.play(`${scene.tutee}-idle`);

		this.setOrigin(0.5, 1);

		this.body.setSize(16,23);
		// this.body.setOffset(0,10);
		
		this.input = {};

    this.movingStateTo = {
      to: "idle",
      x: this.x,
      y: this.y
    };

    this.debug = this.scene.add.graphics();

    this.velocity = 4;

	}

  setMovingStateTo(to, x, y) {
    this.movingStateTo.to = to;
    this.movingStateTo.x = x+8;
    this.movingStateTo.y = y+30;
  }

  async updateTuteePosition(tutee) {

    const tuteeDetails = {
      id: tutee.id,
      x: tutee.x,
      y: tutee.y,
      to: tutee.to
    }
    const updateTutees = await API.graphql(graphqlOperation(updateTutee, { input: tuteeDetails }));
  }

	setupMyAnimations() {

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
          this.anims.play(`${this.scene.tutee}-${lifecycle.to}`);
          if(!['idle', 'none'].includes(lifecycle.from) && lifecycle.to === 'idle') {
            // this.client.sendPosition(this.id, this.body.x, this.body.y, "idle");
            this.updateTuteePosition({
              id: this.id,
              x: this.body.x,
              y: this.body.y,
              to: "idle"
            });
          }
          console.log("MY lifecycle > ", lifecycle);
        },
				onLeft: () => {
          this.x -= this.velocity;
          // this.client.sendPosition(this.id, this.body.x, this.body.y, "left");
          this.updateTuteePosition({
            id: this.id,
            x: this.body.x,
            y: this.body.y,
            to: "left"
          });
				},
				onRight: () => {
          this.x += this.velocity;
          // this.client.sendPosition(this.id, this.body.x, this.body.y, "right");
          this.updateTuteePosition({
            id: this.id,
            x: this.body.x,
            y: this.body.y,
            to: "right"
          });
				},
				onUp: () => {
          this.y -= this.velocity;
          // this.client.sendPosition(this.id, this.body.x, this.body.y, "up");
          this.updateTuteePosition({
            id: this.id,
            x: this.body.x,
            y: this.body.y,
            to: "up"
          });
				},
				onDown: () => {
          this.y += this.velocity;
          // this.client.sendPosition(this.id, this.body.x, this.body.y, "down");
          this.updateTuteePosition({
            id: this.id,
            x: this.body.x,
            y: this.body.y,
            to: "down"
          });
				},
        // onIdle: () => {
        //   this.client.sendPosition(this.id, this.body.x, this.body.y, "idle");
        // }
      },
    });

    this.animPredicates = {
      idle: () => {
        return ['left','right','up','down'].filter(item => this.keys && this.keys[item].isDown).length === 0;
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

  setupOtherAnimations() {

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
          this.anims.play(`${this.scene.tutee}-${lifecycle.to}`);
          // console.log("OTHER's lifecycle > ", lifecycle);
          this.setX(this.movingStateTo.x);
          this.setY(this.movingStateTo.y);
        },
				onLeft: () => {
          this.setX(this.movingStateTo.x);
				},
				onRight: () => {
          this.setX(this.movingStateTo.x);
				},
				onUp: () => {
          this.setY(this.movingStateTo.y);
				},
				onDown: () => {
          this.setY(this.movingStateTo.y);
				}
      },
    });

    this.animPredicates = {
      idle: () => {
        return ['left','right','up','down'].filter(item => item === this.movingStateTo.to).length === 0;
      },
      left: () => {
        return this.movingStateTo.to === "left";
      },
      right: () => {
        return this.movingStateTo.to === "right";
      },
      up: () => {
        return this.movingStateTo.to === "up";
      },
      down: () => {
        return this.movingStateTo.to === "down";
      },
    };
  }

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

    if(!this.animState) return;

    if(this.id === this.scene.mainPlayerId) {
      this.debug.clear().lineStyle(1, 0xFF00FF);
      this.debug.lineBetween(0, this.body.y, 800, this.body.y);
      this.debug.lineBetween(this.body.x, 0, this.body.x, 600);
      if(this.text) this.text.destroy();
      this.text = this.scene.add.text(this.body.x, this.body.y, `${this.body.x},${this.body.y}`)

    } else {
      // if(this.body.speed > 0) {
        // const distance = Phaser.Math.Distance.Between(this.body.x, this.body.y, this.movingStateTo.x, this.movingStateTo.y);

        // if(distance < 4) {
          // console.log("@ near!")
          // this.body.reset(this.movingStateTo.x, this.movingStateTo.y);
          // this.setMovingStateTo( "idle", this.movingStateTo.x, this.movingStateTo.y );

        // }
      // }
    }

		for (const t of this.animState.transitions()) {    
      if (t in this.animPredicates && this.animPredicates[t]()) {
        this.animState[t]();
        break;
      }
    }

    // if(this.id !== this.scene.mainPlayerId && ['left','right','up','down'].includes(this.movingStateTo.to)) {
    //   console.log("@ this.body > ", this.body);
    //   console.log("@ this.movingStateTo > ", this.movingStateTo)
    //   while(!this.gotToDestination[this.movingStateTo.to]) {
    //     this.moveBody[this.movingStateTo.to]();
    //   }      
    // }
	}

}

export default Tutee;