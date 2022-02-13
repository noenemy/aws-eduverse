import Phaser from 'phaser';
import Tutee from '../entities/Tutee';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateTutee, onDeleteTutee, onUpdateTutee } from '../../../graphql/subscriptions';
import { listTutees } from '../../../graphql/queries';
// import { Dialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

class Lobby extends Phaser.Scene {

  tuteeMap = {}
  allCharacters = ['pink','purple'];
  allState = ['idle', 'down'];
  backgroundTilesets = [
    'chairs_shadow',
    'couches_shadow',
    'couchtables_shadow',
    'curtains',
    'kidsroom_shadow',
    'rugs',
    'stairs',
    'tables_shadow',
    'wallpapers',
    'decorations',
    'kitchen_tiles',
    'kitchens_assembled',
    'storage',
  ];
  mainTutee = {};
  showAuditoriumModal = false;
  isCollide = false;

  constructor(data) {
    super({ key: 'LobbyScene' });

    this.navigate = data.navigate;
    this.setAllUsers = data.setAllUsers;
    this.createSubscriptions();

    //다른 메뉴 갔다가 홈으로 돌아오는 경우
    console.log("@ Lobby.user >>", data);
    if(data && data.newTutee) {
      this.mainTutee = data.newTutee;
      this.mainPlayerId = data.newTutee.id;
    }
  }

  init(data) {
    // 로그인 씬에서 닉네임 입력 후 넘어오는 경우 (신규, 기존 튜티)
    if(data.newTutee) {
      this.mainTutee = {
        ...data.newTutee,
        x: parseInt(data.newTutee.x),
        y: parseInt(data.newTutee.y),
      }
      this.mainPlayerId = data.newTutee.id;
    }
  }

  preload() {

    this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

    this.load.tilemapTiledJSON('new-lobby-map', 'assets/tilemaps/new_lobby.json');
    this.load.spritesheet(`door-sheet`, `assets/gifs/door3_beige.png`, {
        frameWidth: 48,
        frameHeight: 32,
    });
    
    this.backgroundTilesets.map(item => {
      return this.load.spritesheet(`new-lobby-${item}-sheet`, `assets/tilesets/${item}.png`, {
        frameWidth: 16,
        frameHeight: 16,
        endFrame: 2
        // margin: 1,
        // spacing: 2,
      },);
    });

    this.allCharacters.map(char => {
      return this.load.spritesheet(`walk-${char}-sheet`, `assets/walk/walk_${char}.png`, {
        frameWidth: 32,
        frameHeight: 32,
      })
    });

    this.load.spritesheet(`carry-sheet`, `assets/carry/carry_welcome.png`, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('emoji-sheet', `assets/carry/emoticons.png`, {
      frameWidth: 16,
      frameHeight: 16,
    });

  }

  create(data) {

    console.log("@ this.mainTutee >> ", this.mainTutee)

    this.new_lobby = this.make.tilemap({key: 'new-lobby-map'});
    this.createLobby();

    this.createAnims('door-anims', 'door-sheet', 0, 2, { repeat: -1, duration: 800 });
    this.createAnims('carry-anims', 'carry-sheet', 0, 31, { repeat: -1, duration: 2000 });
    this.createAnims('emoji-anims', 'emoji-sheet', 0, 14, { repeat: -1, duration: 5000 });

    this.createTuteeAnims();

    this.auditoriumDoor = this.addSpriteAndPlay(215, 35, 'door', 1 );
    const welcomeNpc = this.addSpriteAndPlay(435, 230, 'carry', 1.3);

    this.time.addEvent({delay: 5000, callback: this.onRemoveWelcome, callbackScope: this, loop: false});
    this.welcomeSpeechBubble = this.addSpeechBubble(450, 200, 120, 25, `Welcome! ${this.mainTutee.nickname ? this.mainTutee.nickname : 'Tutee'}! Let's study~!`)

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    // 나를 포함한 기존 튜티들 추가
    this.addActiveTutees().then(res => {
      console.log("@ res >> ", res);
      console.log("@ addActiveTutees. tuteeMap > ", this.tuteeMap)
      // 방문자 모두 추가 후, 이동할 문에 main player에 대한 collide 설정
      this.physics.add.existing(this.auditoriumDoor);
      this.auditoriumDoor.body.setImmovable();
      
      this.auditoriumTrigger = this.physics.add.collider(
        this.tuteeMap[this.mainPlayerId],
         this.auditoriumDoor, 
         () => {
          console.log("@ Auditorium Door collide!");
          console.log("@ onCollideAuditorium.this > ", this)
      
          console.log("@ this.tuteeMap > ", this.tuteeMap)
      
          // this.tuteeMap[this.mainTutee.id].destroy();
      
          if(this.mainTutee && !this.isCollide) {
            this.createModal(this, 'Auditorium', `${this.mainTutee.nickname}, Do you want to go to the Auditorium?`, ()=> {
              console.log("@ Click yes")
              this.navigate('/auditorium');
            });
          }
        })
    });

  }

  createModal(scene, title, message, onClickYes) {
    this.isCollide = true;
    this.rexUI.modalPromise(
      this.createDialog(scene, title, message, onClickYes).setPosition(400, 300), {
          manaulClose: true,
          duration: {
              in: 1000,
              out: 1000
          }
    }).then((closeEventData) => {
      console.log("@ Dialog closed And this.isCollide > ", this.isCollide)
      this.isCollide = false;
    });
  }

  createDialog(scene, title, message, onClickYes) {
    var dialog = this.rexUI.add.dialog({
			background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xdec4a6),
			title: scene.rexUI.add.label({
					background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x766a62),
					text: scene.add.text(0, 0, title ?? 'Confirmation', { fontSize: '15px' }),
					space: {
							left: 15,
							right: 15,
							top: 10,
							bottom: 10
					}
			}),
			content: scene.add.text(0, 0, message ?? 'Do you confirm?', { fontSize: '12px', color: '#5b5a5c' }),
			actions: [
					this.createLabel(scene, 'Yes'),
					this.createLabel(scene, 'No')
			],
			space: {
					title: 25,
					content: 25,
					action: 15,
					left: 20,
					right: 20,
					top: 20,
					bottom: 20,
			},
			align: {
					actions: 'right', // 'center'|'left'|'right'
			},
			expand: {
					content: false,  // Content is a pure text object
			}
	  }).layout().popUp(1000);

    
	  dialog
			.on('button.click', function (button, groupName, index, pointer, event) {
        console.log("@ Click index > ", index);
        if(index === 0 && typeof onClickYes === 'function') {
          onClickYes();
        }
        dialog.emit('modal.requestClose', { closedDialog: "Auditorium" });
			})
			.on('button.over', function (button, groupName, index, pointer, event) {
        console.log("@ button.over")
        button.getElement('background').setStrokeStyle(1, 0xffffff);
			})
			.on('button.out', function (button, groupName, index, pointer, event) {
        console.log("@ button.out")
        button.getElement('background').setStrokeStyle();
			});

	  return dialog;
  }

  createLabel(scene, text) {
    return scene.rexUI.add.label({
        // width: 40,
        // height: 40,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x766a62),
        text: scene.add.text(0, 0, text, {
            fontSize: '12px'
        }),
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
  }

  createAnims(key, sheet, start, end, others) {
    return this.anims.create({
      key: key,
      frames: this.anims.generateFrameNumbers(sheet, {
        start: start,
        end: end
      }),
      ...others
    });
  }

  createWindow(func)
  {
    var x = Phaser.Math.Between(400, 600);
    var y = Phaser.Math.Between(64, 128);

    var handle = 'window' + this.count++;

    var win = this.add.zone(x, y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
    var demo = new func(handle, win);
    this.input.setDraggable(win);
    win.on('drag', function (pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
        demo.refresh()
    });
    this.scene.add(handle, demo, true);
  }


  createTuteeAnims() {
    this.allState.map(direction => {
      return this.allCharacters.map(char => {
        return this.anims.create({
          key: `walk-${char}-${direction}`,
          frames: this.anims.generateFrameNumbers(`walk-${char}-sheet`, {
            start: 0,
            end: 7
          }),
          repeat: direction === 'idle' ? 0 : -1
        });
      })
    });
  }

  onRemoveWelcome() {

    if(this.welcomeSpeechBubble && this.welcomeSpeechBubble.length > 0) {
      this.welcomeSpeechBubble.map(item => {
        if(item.destroy) {
          return item.destroy();
        }
        return item;
      })
    }

    this.addSpriteAndPlay(435, 210, 'emoji', 1.3);

  }

  async addActiveTutees() {
    // 기존 방문자들 추가
    const filter = {
      state: { eq: "active" }
    };
    const allData = await API.graphql(graphqlOperation(listTutees, { filter: filter }));
    this.allTutees = allData.data.listTutees.items;
    this.allTutees.map(tutee => this.addTutee(tutee));
    this.setAllUsers(this.allTutees);
    
    return this.allTutees;
  }

  addTutee({x, y, id, nickname, character}) {

    this.tuteeMap[id] = new Tutee(this, x, y, `walk-${character}-sheet`, id, nickname, character);
    console.log("@ this.tuteeMap >>> ", this.tuteeMap)
    const isMainPlayer = id === this.mainPlayerId; 
    if(isMainPlayer) {
      this.tuteeMap[id].setupMyAnimations();
      this.createCollider(this.tuteeMap[id]);
    } else {
      this.tuteeMap[id].setupOtherAnimations();
    }

  }

  addSpriteAndPlay(x, y, anims, scaled) {
    return this.add.sprite(x, y,`${anims}-sheet`).setScale(scaled).play(`${anims}-anims`);
  }

  createCollider(tutee) {
    
    if(this.new_lobby && this.new_lobby.getLayer('wall_layer')) {
      this.physics.add.collider(tutee, this.new_lobby.getLayer('wall_layer').tilemapLayer);
    }

    if(this.new_lobby && this.new_lobby.getLayer('ceil_layer')) {
      this.physics.add.collider(tutee, this.new_lobby.getLayer('ceil_layer').tilemapLayer);
    }
  }

  removeTutee(id) {
    if(this.tuteeMap[id]) {
      this.tuteeMap[id].destroy();
      delete this.tuteeMap[id];
    }
  }

  moveTutee(id, x, y, to) {

    if(!this.tuteeMap[id] || !this.tuteeMap[id].setMovingStateTo) return; 

    this.tuteeMap[id].setMovingStateTo(to, x, y);

    // let target = new Phaser.Math.Vector2();
    // target.x = x;
    // target.y = y;

    // if(this.debug) {
    //   this.debug.clear().lineStyle(1, 0x00ff00);
    //   this.debug.lineBetween(0, target.y, this.new_lobby.widthInPixels, target.y);
    //   this.debug.lineBetween(target.x, 0, target.x, this.new_lobby.heightInPixels);
    //   if(this.movetext) this.movetext.destroy();
    //   this.movetext = this.add.text(target.x, target.y
        
    //     , `${target.x},${target.y}`)
    // }

    const distance = Phaser.Math.Distance.Between(this.tuteeMap[id].body.x, this.tuteeMap[id].body.y, x, y);
    if(this.tween) this.tween.stop();
    this.tween = this.add.tween({
      targets: this.tuteeMap[id],
      x: x + 8,
      y: y + 23,
      duration: distance * 20
    });
  }

  createLobby() {

    const lobbyTiles = this.backgroundTilesets.map(item => this.new_lobby.addTilesetImage(item, `new-lobby-${item}-sheet`))
    
    this.groundLayer = this.new_lobby.createLayer('ground_layer', lobbyTiles);
    this.ceilLayer = this.new_lobby.createLayer('ceil_layer', lobbyTiles);
    this.ceilLayer.setCollisionByProperty({ collides: true}, true);
    this.wallLayer = this.new_lobby.createLayer('wall_layer', lobbyTiles);
    this.wallLayer.setCollisionByProperty({ collides: true}, true);
    
    // this.showCollisionDebug(this.ceilLayer, new Phaser.Display.Color(243,234,48,255));
    // this.showCollisionDebug(this.wallLayer, new Phaser.Display.Color(143,234,48,255));
    
    this.new_lobby.createLayer('interior_ground_layer', lobbyTiles);
    this.new_lobby.createLayer('interior_upper_layer', lobbyTiles);

    // const interiorGroundLayer = this.new_lobby.createLayer

    this.physics.world.setBounds(0, 0, this.new_lobby.widthInPixels, this.new_lobby.heightInPixels-70);
    this.physics.world.setBoundsCollision(true, true, true, true);
  }

  update(time, delta) {
    // const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;

  }

  showCollisionDebug(layer, color) {
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    layer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: color
    })
  }

  addSpeechBubble (x, y, width, height, quote) {
    var allContent = [];
    var allCounter = 0;
    var bubbleWidth = width;
    var bubbleHeight = height;
    var bubblePadding = 10;
    var arrowHeight = bubbleHeight / 4;

    var bubble = this.add.graphics({ x: x, y: y });
    allContent[allCounter++] = bubble;

    //  Bubble shadow
    // bubble.fillStyle(0x222222, 0.5);
    // bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xdec4a6, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x766a62, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    var point1X = Math.floor(bubbleWidth / 7);
    var point1Y = bubbleHeight;
    var point2X = Math.floor((bubbleWidth / 7) * 2);
    var point2Y = bubbleHeight;
    var point3X = Math.floor(bubbleWidth / 7);
    var point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    // bubble.lineStyle(4, 0x222222, 0.5);
    // bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    var content = this.add.text(0, 0, quote, { fontFamily: 'Calibri', fontSize: 10, color: '#5b5a5c', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

    allContent[allCounter++] = content;
    var b = content.getBounds();

    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

    return allContent;
  }

  createSubscriptions() {

    const createSub = API.graphql(
      graphqlOperation(onCreateTutee)
    ).subscribe({
      next: (subData) => {
        const tutee = subData.value.data.onCreateTutee;

        this.addTutee(tutee);
        // this.setAllUsers

      }
    });

    const updateSub = API.graphql(
      graphqlOperation(onUpdateTutee)
    ).subscribe({
      next: (subData) => {
        const tutee = subData.value.data.onUpdateTutee;
        if(this.mainTutee && tutee.id !== this.mainTutee.id) {
          this.moveTutee(tutee.id, tutee.x, tutee.y, tutee.to)
        }
      }
    });

    const deleteSub = API.graphql(
      graphqlOperation(onDeleteTutee)
    ).subscribe({
      next: (subData) => {
        console.log("@@@ onDeleteTutee >> ", subData);
        const tutee = subData.value.data.onDeleteTutee;
        if(tutee.id) {
          this.removeTutee(tutee.id);
        }
      }
    })
  }
}

export default Lobby;