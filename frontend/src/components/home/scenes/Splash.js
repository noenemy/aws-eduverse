import Phaser from 'phaser';
import { API, graphqlOperation } from 'aws-amplify';
import { createTutee, updateTutee } from '../../../graphql/mutations';
import { getTtlSeconds, START_POINT } from '../common';
import { listTutees } from '../../../graphql/queries';

class Splash extends Phaser.Scene {

	constructor() {
		super({key: 'SplashScene'});
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

        this.topText = this.add.text(bgImage.width / 2 - 33, 300, "AWS 서비스를 이용해서 구현한", { fontSize: 30 });
        this.add.text(bgImage.width / 2 - 20, 350, "인터랙티브 가상 교육 플랫폼", { fontSize: 30 });

        this.clickButton = this.add.text(bgImage.width / 2, bgImage.height / 2 + 250, '[ 시작하기 ]', { fill: '#0f0', fontSize: 50 })
            .setInteractive({ useHandCursor: true })
            .on('pointover', () => this.enterButtonHoverState() )
            .on('pointout', () => this.enterButtonRestState() )
            .on('pointerdown', () => this.clickEnter() );

        this.logo = this.physics.add.image(this.cameras.main.width / 2, 150, 'logo_image');
        this.logo.setVelocity(0, 100);
        this.logo.setGravity(0, 180)
        this.logo.setBounce(1, 1);
        this.logo.setCollideWorldBounds( true );

        this.physics.add.existing(this.topText);
        this.topText.body.setImmovable();

        this.physics.add.collider(this.logo, this.topText)
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
        this.scene.launch('LoginScene');
    }

	update(time, delta) {
	}

}


export default Splash;