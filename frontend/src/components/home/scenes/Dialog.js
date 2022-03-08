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
		this.nickname = data.mainTutee && data.mainTutee.nickname ? data.mainTutee.nickname : '튜티';
	}

	preload () {
		this.load.plugin('DialogModalPlugin', DialogModalPlugin);
		// this.plugins.registerGameObject('DialogModalPlugin', DialogModalPlugin )
		// this.load.bitmapFont('DungGeunMo_black', 'assets/fonts/DungGeunMo.png','assets/fonts/DungGeunMo.xml');
		// this.load.bitmapFont('DungGeunMo_green_stroke', 'assets/fonts/DungGeunMo_green_stroke.png','assets/fonts/DungGeunMo_green_stroke.xml');
	}

	create () {
		this.dialog = this.plugins.get('DialogModalPlugin');
		this.dialog.init(this.initData);

		if(this.stuffToSay.length === 0) return;
		
		this.sayIndex = 0;
		const actualSay = String(this.stuffToSay[this.sayIndex]).replaceAll('{USERNAME}', this.nickname);
		this.dialog.setText(actualSay, true);
		this.sayIndex++;
		this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		// this.input.keyboard.on("keyup_SPACE", this.talk, this);
	}

	talk() {
		// console.log(`@ talk ! this.sayIndex: ${this.sayIndex}, this.stuffToSay: ${this.stuffToSay[this.sayIndex]}`)
		this.dialog.removeDialog();
		this.dialog.init(this.initData);
		const actualSay = String(this.stuffToSay[this.sayIndex]).replaceAll('{USERNAME}', this.nickname);
    this.dialog.setText(actualSay);
		this.sayIndex++;
  }

	update() {
		if(this.keySpace.isDown) {
			this.keySpaceDown = true;
		}
		if(this.keySpaceDown && this.keySpace.isUp) {
			this.keySpaceDown = false;
			if(this.sayIndex > this.stuffToSay.length - 1) {
				console.log(`@ npc saying done. index: ${this.sayIndex} length: ${this.stuffToSay.length}`)
				this.keySpace.destroy();
				this.dialog.removeDialog();
				
				return;
			}
			this.talk();
		}
	}

}


export default Dialog;