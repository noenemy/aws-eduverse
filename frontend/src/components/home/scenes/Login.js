import Phaser from 'phaser';
import { API, graphqlOperation } from 'aws-amplify';
import { createTutee, updateTutee } from '../../../graphql/mutations';
import { getTtlSeconds, START_POINT } from '../common';
import { listTutees } from '../../../graphql/queries';

class Login extends Phaser.Scene {

	constructor(user, setUser, allUsers, setAllUsers) {
		super({key: 'LoginScene'});
		this.setUser = setUser;
		this.setAllUsers = setAllUsers;
		this.user = user;
	}

	init({domX, domY}) {
		this.domX = domX;
		this.domY = domY;
	}

	preload () {
		this.load.html('nameform', 'assets/htmls/loginform.html');
	}

	create () {
		var element = this.add.dom(this.scale.width/2, this.scale.height).createFromCache('nameform');
		
		// element.setPerspective(800);
		element.addListener('click');

		const setUser = this.setUser;
		const setAllUsers = this.setAllUsers;

		element.on('click', async function (event) {

			if (event.target.name === 'loginButton')
			{
				var inputUsername = this.getChildByName('username');

				//  Have they entered anything?
				if (inputUsername.value !== '')
				{
					const allCharacters = ['pink','purple','green','babypink'];
					const checkedCharacter = allCharacters.filter(item => {
						let character = this.getChildByID(`character_${item}`);
						return character.checked;
					});
					
					const newTutee = {
						// id: 1, PK 는 자동생성
						nickname: inputUsername.value,
						x: START_POINT.x, //randomInt(100, 400),	//default 시작위치
						y: START_POINT.y, //randomInt(100, 400),
						state: "active", 	//active, disconected?
						character: checkedCharacter.length ? checkedCharacter[0] : 'purple',
						lastVisit: 'lobby',
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
						//로비 입장 위치는 항상 고정 - collide 오류 방지
						delete tutee.createdAt;
						delete tutee.updatedAt;
						tutee.x = newTutee.x;
						tutee.y = newTutee.y;
						tutee.lastVisit = newTutee.lastVisit;
						await API.graphql(graphqlOperation(updateTutee, {
							input: tutee
						}));
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

					setUser(tutee);
					setAllUsers(allTutees);

					this.scene.scene.launch('LobbyScene', {
						nickname: inputUsername.value,
						newTutee: tutee
					});
					
				}
			}

		});

		this.tweens.add({
				targets: element,
				y: this.scale.height*0.77,
				duration: 2500,
				ease: 'Power3'
		});
	}

	update() {

	}

}


export default Login;