import Phaser from 'phaser';
import DialogModalPlugin from '../plugins/dialog_plugin';

class Dialog extends Phaser.Scene {

	

	constructor() {
		super({key: 'DialogScene'});
	}

	init(data) {
		console.log("@ dialog init >", data)
		this.initData = data;
		this.face = data.face || 'carry';
		this.stuffToSay = data.stuffToSay || [];
		this.sayIndex = 0;
	}

	preload () {
		this.load.plugin('DialogModalPlugin', DialogModalPlugin);
		// this.plugins.registerGameObject('DialogModalPlugin', DialogModalPlugin )
	}

	create () {
		var cursors = this.input.keyboard.createCursorKeys();

		this.dialog = this.plugins.get('DialogModalPlugin');
		this.dialog.init(this.initData);

		if(this.stuffToSay.length === 0) return;
		
		this.sayIndex = 0;
		this.dialog.setText(this.stuffToSay[this.sayIndex++], true);

		this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		// this.input.keyboard.on("keyup_SPACE", this.talk, this);
	}

	talk() {
		console.log("@ talk !")
		this.dialog.removeDialog();
		this.dialog.init(this.initData);
    this.dialog.setText(this.stuffToSay[this.sayIndex++], true);
  }

	update() {
		if(this.keySpace.isDown) {
			if(this.sayIndex + 1 > this.stuffToSay.length) {
				this.dialog.removeDialog();
				return;
			}
			this.talk();
		}
	}

}


export default Dialog;