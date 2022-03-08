import Phaser from 'phaser';
class Splash extends Phaser.Scene {

    sceneLight = {};

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
        // background image
        let bgImage = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background_image');

        let scaleX = this.cameras.main.width / bgImage.width
        let scaleY = this.cameras.main.height / bgImage.height
        let scale = Math.max(scaleX, scaleY)
        bgImage.setScale(scale).setScrollFactor(0)

        // introduction text
        this.topText = this.add.text(this.scale.width / 2, 300, "AWS 서비스를 이용해서 구현한", { fill: '#023047', fontSize: 30 });
        this.bottomText = this.add.text(this.scale.width / 2 - 20, 350, "인터랙티브 가상 교육 플랫폼", { fill: '#023047', fontSize: 30 });

        // start text button
        this.clickButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, '[ 시작하기 ]', { fill: '#333D29', fontSize: 50 })
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState() )
            .on('pointerout', () => this.enterButtonRestState() )
            .on('pointerdown', () => this.clickEnter() );

        //위치 가운데 정렬
        this.topText.setX(this.scale.width/2 - this.topText.width/2);
        this.bottomText.setX(this.scale.width/2 - this.bottomText.width/2);
        this.clickButton.setX(this.scale.width/2 - this.clickButton.width/2);

        // logo image
        this.logo = this.physics.add.image(this.cameras.main.width / 2, 150, 'logo_image');
        this.logo.setVelocity(0, 100);
        this.logo.setGravity(0, 250)
        this.logo.setBounce(1, 1);
        this.logo.setCollideWorldBounds( true );

        this.physics.add.existing(this.topText);
        this.topText.body.setImmovable();

        this.physics.add.collider(this.logo, this.topText);

        //로고에 빛 효과
        // this.offsets = Math.random()+ 1 - 2;
        // console.log("@ offsets > ", this.offsets)

        // bgImage.setPipeline('Light2D');
        // this.sceneLight = this.lights.addLight(100, 100, 200).setScrollFactor(0.0).setIntensity(2);
        // this.lights.enable().setAmbientColor(0x555555);

        // this.lights.addLight(0, 100, 100).setColor(0xff0000).setIntensity(3.0);
        // this.lights.addLight(0, 200, 100).setColor(0x00ff00).setIntensity(3.0);
        // this.lights.addLight(0, 300, 100).setColor(0x0000ff).setIntensity(3.0);

	}

    enterButtonHoverState() {
        console.log("enterButtonHoverState");
        this.clickButton.setStyle({ fill: '#F1FAEE' });
    }

    enterButtonRestState() {
        console.log("enterButtonRestState");
        this.clickButton.setStyle({ fill: '#333D29' });
    }
    

    clickEnter() {
        console.log("Enter clicked");
        this.clickButton.destroy();
        this.scene.launch('LoginScene');
    }

	update(time, delta) {
        // const scene = this;
        // this.sceneLight.x = 400 + Math.sin(scene.offsets) * 1000;
        // scene.offsets += 0.02;
	}

}


export default Splash;