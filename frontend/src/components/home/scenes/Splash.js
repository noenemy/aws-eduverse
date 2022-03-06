import Phaser from 'phaser';
import { API, graphqlOperation } from 'aws-amplify';
import { createTutee, updateTutee } from '../../../graphql/mutations';
import { getTtlSeconds, START_POINT } from '../common';
import { listTutees } from '../../../graphql/queries';

class Splash extends Phaser.Scene {

	constructor() {
        super();
        this.clickButton = null;
	}

	init() {
	}

	preload () {
        this.load.image('background_image', 'assets/images/splash-background.png');
        this.load.image('logo_image', 'assets/images/eduverse-splash-logo.png');
	}

	create () {
        console.log("@splash > loading background iamge");
        let bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background_image');

        let scaleX = this.cameras.main.width / bgImage.width
        let scaleY = this.cameras.main.height / bgImage.height
        let scale = Math.max(scaleX, scaleY)
        bgImage.setScale(scale).setScrollFactor(0)

        this.add.text(bgImage.width / 2 - 33, 300, "AWS 서비스를 이용해서 구현한", { fontSize: 30 });
        this.add.text(bgImage.width / 2 - 20, 350, "인터랙티브 가상 교육 플랫폼", { fontSize: 30 });

        this.clickButton = this.add.text(bgImage.width / 2, bgImage.height / 2 + 250, '[ 시작하기 ]', { fill: '#0f0', fontSize: 50 })
            .setInteractive({ useHandCursor: true })
            .on('pointover', () => this.enterButtonHoverState() )
            .on('pointout', () => this.enterButtonRestState() )
            .on('pointerdown', () => this.clickEnter() );
  
        const logo = this.physics.add.image(this.cameras.main.width / 2, 150, 'logo_image');
        logo.setVelocity(0, 100);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds( true );

        console.log("@logo > " + logo);
	}

    enterButtonHoverState() {
        console.log("enterButtonHoverState");
        this.clickButton.setStyle({ fill: '#ff0' });
    }

    enterButtonRestState() {
        console.log("enterButtonRestState");
        this.clickButton.setStyle({ fill: '#0f0' });
    }
    

    clickEnter() {
        console.log("Enter clicked");
    }

	update(time, delta) {

	}

}


export default Splash;