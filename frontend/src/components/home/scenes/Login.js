import Phaser from 'phaser';
import { API, graphqlOperation } from 'aws-amplify';
import { createTutee } from '../../../graphql/mutations';
import { getTtlSeconds, randomInt } from '../common';
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
	}

	create () {
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
						x: 455, //randomInt(100, 400),	//default 시작위치
						y: 70, //randomInt(100, 400),
						state: "active", 	//active, disconected?
						character: checkedCharacter.length ? checkedCharacter[0] : 'purple',
						ttl: getTtlSeconds(20)
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

					const tutee = res.data?.createTutee;

					setUser(tutee);

					//  Populate the text with whatever they typed in as the username!
					// text.setText('Welcome ' + inputUsername.value);
					this.scene.scene.launch('LobbyScene', {
						nickname: inputUsername.value,
						newTutee: tutee
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

}


export default Login;