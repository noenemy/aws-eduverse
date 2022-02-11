import Phaser from 'phaser';
import { API, graphqlOperation } from 'aws-amplify';
import { createTutee } from '../../../graphql/mutations';
import { getTtlSeconds, randomInt } from '../common';
import { getTutee, listTutees } from '../../../graphql/queries';
// var game = new Phaser.Game(config);
class Login extends Phaser.Scene {

	constructor(user, setUser) {
		super({key: 'LoginScene'});
		this.setUser = setUser;
		this.user = user;

		console.log("@ ###user  >> ", user)
		// if(user.nick)
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
						ttl: getTtlSeconds(3600)
					}

					// 모든 튜티 가져오기... get안하고 일단...다 데려옴
					const allData = await API.graphql(graphqlOperation(listTutees));
    			const allTutees = Array.from(allData.data.listTutees.items);

					let tutee = {};
					const existingTutee = allTutees.filter(item => item.nickname === newTutee.nickname);
					//존재하면 그 정보로 세팅
					if(existingTutee.length > 0) {
						tutee = existingTutee[0];
					} else {	//없으면 생성
						const res = await API.graphql(graphqlOperation(createTutee, {
							input: newTutee
						}));
						tutee = res.data?.createTutee;
					}

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

					console.log("@ tutee >> ", tutee)

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

	update() {

	}

}


export default Login;