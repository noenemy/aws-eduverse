import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';
import { API, graphqlOperation } from 'aws-amplify';
import { updateTutee } from '../../../graphql/mutations';

class Tutee extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, sheet, id, nickname, character) {
		super(scene, x, y, sheet, 0);

    scene.add.existing(this);
		scene.physics.add.existing(this);

    console.log("@ new Tutee >> ", {id, nickname, character} )

    this.scene = scene;

    this.keys = scene.cursorKeys;

    this.id = id;
    this.nickname = nickname;
    this.character = character ? character : "purple";

    this.anims.play(`walk-${character}-idle`);

		this.setOrigin(0.5, 1);

		this.body.setSize(16,22);
		this.body.setOffset(10,10);
		
		this.input = {};

    this.movingStateTo = {
      to: "idle",
      x: this.x,
      y: this.y
    };

    // this.debug = this.scene.add.graphics();

    this.velocity = 10;
    this.setScale(1.8);

	}

  setMovingStateTo(to, x, y) {
    this.movingStateTo.to = to;
    this.movingStateTo.x = x;
    this.movingStateTo.y = y;
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
          // this.anims.play(`${this.scene.tutee}-${lifecycle.to}`);
          if('idle' === lifecycle.to) {
            this.anims.play(`walk-${this.character}-${lifecycle.to}`);
          } else {
            this.anims.play(`walk-${this.character}-down`);
          }
          
          if(!['idle', 'none'].includes(lifecycle.from) && lifecycle.to === 'idle') {
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
          // this.updateTuteePosition({
          //   id: this.id,
          //   x: this.body.x,
          //   y: this.body.y,
          //   to: "left"
          // });
				},
				onRight: () => {
          this.x += this.velocity;
          // this.updateTuteePosition({
          //   id: this.id,
          //   x: this.body.x,
          //   y: this.body.y,
          //   to: "right"
          // });
				},
				onUp: () => {
          this.y -= this.velocity;
          // this.updateTuteePosition({
          //   id: this.id,
          //   x: this.body.x,
          //   y: this.body.y,
          //   to: "up"
          // });
				},
				onDown: () => {
          this.y += this.velocity;
          // this.updateTuteePosition({
          //   id: this.id,
          //   x: this.body.x,
          //   y: this.body.y,
          //   to: "down"
          // });
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
        // { name: 'left', from: '*', to: 'left' },
        // { name: 'right', from: '*', to: 'right' },
        // { name: 'up', from: '*', to: 'up' },
        { name: 'down', from: '*', to: 'down' },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          // this.anims.play(`${this.scene.tutee}-${lifecycle.to}`);
          this.anims.play(`walk-${this.character}-${lifecycle.to}`);
          // console.log("OTHER's lifecycle > ", lifecycle);
          // this.setX(this.movingStateTo.x);
          // this.setY(this.movingStateTo.y);
          // const distance = Phaser.Math.Distance.Between(this.body.x, this.body.y, this.movingStateTo.x, this.movingStateTo.y);
          // if(this.tween) this.tween.destroy();
          // this.tween = this.scene.add.tween({
          //   targets: this,
          //   x: this.movingStateTo.x,
          //   y: this.movingStateTo.y,
          //   duration: distance*10
          // });
        },
				onLeft: () => {
          // this.setX(this.movingStateTo.x);
				},
				onRight: () => {
          // this.setX(this.movingStateTo.x);
				},
				onUp: () => {
          // this.setY(this.movingStateTo.y);
				},
				onDown: () => {
          // this.setY(this.movingStateTo.y);
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

    if(this.nicknametext) this.nicknametext.destroy();
    this.nicknametext = this.scene.add.text(this.body.x, this.body.y-20, this.nickname);

    if(this.id === this.scene.mainPlayerId) {
      // this.debug.clear().lineStyle(1, 0xFF00FF);
      // this.debug.lineBetween(0, this.body.y, 1200, this.body.y);
      // this.debug.lineBetween(this.body.x, 0, this.body.x, 800);

      if(this.text) this.text.destroy();
      this.text = this.scene.add.text(this.body.x, this.body.y, `${this.body.x},${this.body.y}`)
    } else {

      if(this.body.speed > 0) {
        const distance = Phaser.Math.Distance.Between(this.body.x, this.body.y, this.movingStateTo.x, this.movingStateTo.y);

        if(distance < 4) {
          console.log("@ near!")
          // this.body.reset(this.movingStateTo.x, this.movingStateTo.y);
          this.setX(this.movingStateTo.x);
          this.setY(this.movingStateTo.y);
          this.setMovingStateTo( "idle", this.movingStateTo.x, this.movingStateTo.y );
          if(this.tween) this.tween.stop();
          return;
        } 
      }
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