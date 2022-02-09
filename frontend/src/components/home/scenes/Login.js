import Phaser from 'phaser';
import { API, graphqlOperation } from 'aws-amplify';
import { createTutee } from '../../../graphql/mutations';
import { randomInt } from '../common';
// var game = new Phaser.Game(config);
class Login extends Phaser.Scene {

	constructor(setUser) {
		super({key: 'LoginScene'});
		console.log(" @ setUser >", typeof setUser)
		this.setUser = setUser;
		console.log(" @ setUser2 >", typeof this.setUser)
	}

	init() {
	}

	preload () {
		this.load.html('nameform', 'assets/text/loginform.html');
		// this.load.image('pic', 'assets/pics/turkey-1985086.jpg');

		// this.load.image('main_text', `assets/main_text.png`);
	}

	create () {
		// this.add.image(400, 300, 'pic');

		// var text = this.add.text(10, 10, 'Please Input Nickname', { color: 'white', fontFamily: 'Arial', fontSize: '32px '});

		// var main_text = this.add.image(600,100,'main_text');
		var element = this.add.dom(400, 600).createFromCache('nameform');
		
		element.setPerspective(800);

		element.addListener('click');

		const setUser = this.setUser;

		element.on('click', async function (event) {

			if (event.target.name === 'loginButton')
			{
				var inputUsername = this.getChildByName('username');
				
				//  Have they entered anything?
				if (inputUsername.value !== '')
				{
					const allCharacters = ['pink','purple'];
					const checkedCharacter = allCharacters.filter(item => {
						let character = this.getChildByID(`character_${item}`);
						return character.checked;
					});
					
					const newTutee = {
						// id: 1, PK 는 자동생성
						nickname: inputUsername.value,
						x: randomInt(100, 400),	//default 시작위치
						y: randomInt(100, 400),
						state: "active", 	//active, disconected?
						character: checkedCharacter.length ? checkedCharacter[0] : 'purple'
					}

					const res = await API.graphql(graphqlOperation(createTutee, {
						input: newTutee
					}));

					//  Turn off the click events
					this.removeListener('click');

					//  Tween the login form out
					this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' });

					this.scene.tweens.add({ targets: element, scaleX: 2, scaleY: 2, y: 700, duration: 3000, ease: 'Power3',
						onComplete: function ()
						{
							element.setVisible(false);
						}
					});

					console.log("@ res >> ", res)

					setUser(res.data?.createTutee);

					//  Populate the text with whatever they typed in as the username!
					// text.setText('Welcome ' + inputUsername.value);
					this.scene.scene.launch('LobbyScene', {
						nickname: inputUsername.value,
						newTutee: res.data?.createTutee
					});
					
				}
				// else
				// {
				// 		//  Flash the prompt
				// 		this.scene.tweens.add({ targets: text, alpha: 0.1, duration: 200, ease: 'Power3', yoyo: true });
				// }
			}

		});

		this.tweens.add({
				targets: element,
				y: 300,
				duration: 3000,
				ease: 'Power3'
		});
	}

	getNickName() {
		return this.nickname;
	}
	
}


export default Login;