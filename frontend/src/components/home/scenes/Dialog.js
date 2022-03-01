import Phaser from 'phaser';
import DialogModalPlugin from '../plugins/dialog_plugin';

class Dialog extends Phaser.Scene {

	constructor() {
		super({key: 'DialogScene'});
	}

	init() {
	}

	preload () {
		this.load.plugin('DialogModalPlugin', DialogModalPlugin);
		// this.plugins.registerGameObject('DialogModalPlugin', DialogModalPlugin )
	}

	create () {
		this.dialog = this.plugins.get('DialogModalPlugin');
		console.log("@ dialog this > ", this)
		this.dialog.init();
		this.dialog.setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', true);
	}

	update() {

	}

}


export default Dialog;