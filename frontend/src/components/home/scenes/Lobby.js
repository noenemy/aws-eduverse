import Phaser from 'phaser';
import Tutee from '../entities/Tutee';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateTutee, onDeleteTutee, onUpdateTutee } from '../../../graphql/subscriptions';
import { listTutees } from '../../../graphql/queries';
import { LOBBY_SCALE, NPC_CONFIG, PLAYER_SCALE, STUFF_TO_SAY, ZOOM_SCALE } from '../common';
class Lobby extends Phaser.Scene {
  
  tuteeMap = {};
  npcKind = ['carry', 'hoe', 'jump', 'sword', 'witch'];
  allCharacters = ['pink','purple','green','babypink'];
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
  isCollide = true;
  door = {};
  doorTrigger = {};

  constructor(data) {
    super({ key: 'LobbyScene' });

    this.navigate = data.navigate;
    this.setAllUsers = data.setAllUsers;
    this.createSubscriptions();
    
    if(data && data.newTutee) {
      console.log("@ Lobby.user >>", data);
      this.mainTutee = data.newTutee;
      this.mainPlayerId = data.newTutee.id;
    }

    // this.time.addEvent({delay: 5000, callback: ()=>{}, callbackScope: this, loop: false});
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
    this.time.addEvent({delay: 5000, callback: ()=>{this.isCollide=false;}, callbackScope: this, loop: false});
  }

  preload() {
    this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    // this.load.tilemapTiledJSON('new-lobby-map', 'assets/tilemaps/new_lobby.json');

    this.load.bitmapFont('DungGeunMo', 'assets/fonts/DungGeunMo_white.png','assets/fonts/DungGeunMo_white.xml');
    this.load.bitmapFont('DungGeunMo_skyblue', 'assets/fonts/DungGeunMo_skyblue.png','assets/fonts/DungGeunMo_skyblue.xml');

    this.load.tilemapTiledJSON('new-lobby-map', 'assets/tilemaps/scaled_lobby.json');
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

    NPC_CONFIG.map(item => this.load.spritesheet(`${item.name}-sheet`, `assets/${item.name}/${item.name}.png`, {
      frameWidth: 32,
      frameHeight: 32,
    }));

    this.load.spritesheet('emoji-sheet', `assets/carry/emoticons.png`, {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.npcKind.map(item => this.load.image(`${item}-face`, `assets/${item}/${item}_face.png`));

    this.load.spritesheet("frames", "../assets/frameHeartSheet.png", {
      frameWidth: 32,
      frameHeight: 32
    });

  } //end of preload

  create(data) {
    
    console.log("@ this.mainTutee >> ", this.mainTutee)

    this.new_lobby = this.make.tilemap({key: 'new-lobby-map'});
    this.createLobby();
    this.createAnims('door-anims', 'door-sheet', 0, 2, { repeat: -1, duration: 800 });

    // npc 생성
    let lobbyScene = this;
    NPC_CONFIG.map(item => this.createAnims(`${item.name}-anims`, `${item.name}-sheet`, item.start, item.end, {repeat:-1, duration: item.duration}));
    this.npcList = NPC_CONFIG.map(item => {
      //npc display name 노출
      this.add.bitmapText(
        item.x-40, 
        item.y-20, 
        'DungGeunMo_skyblue', 
        item.displayName, 
        12, 
        Phaser.GameObjects.BitmapText.ALIGN_CENTER).setDepth(100);
      let npc = this.addSpriteAndPlay(item.x, item.y, item.name, PLAYER_SCALE)
      //npc 클릭이벤트 생성
      npc.setInteractive();
      npc.on('pointerdown', function(pointer) {
        console.log("@ npc click > ", this);
        lobbyScene.scene.launch('DialogScene',{ face: item.name, stuffToSay: STUFF_TO_SAY[item.name]});
      });

      return npc;
    });
    //웰컴봇에만 귀요미 이모지 보이자
    this.createAnims('emoji-anims', 'emoji-sheet', 0, 14, { repeat: -1, duration: 5000 });

    this.createTuteeAnims();

    // 이동문 생성
    this.door["auditorium"] = this.addSpriteAndPlay(170, 35, 'door', LOBBY_SCALE );
    this.door["classroom"] = this.addSpriteAndPlay(670, 17, 'door', LOBBY_SCALE );
    this.door["vrlearning"] = this.addSpriteAndPlay(165, 257, 'door', LOBBY_SCALE );

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    // 나를 포함한 기존 튜티들 추가
    this.addActiveTutees().then(res => {

      this.setCameraFollow();

      // 방문자 모두 추가 후, 이동할 문에 main player에 대한 collide 설정
      //3개 문 collide 생성
      for( const item in this.door) {
        this.physics.add.existing(this.door[item]);
        this.door[item].body.setImmovable();
        this.doorTrigger[item] = this.physics.add.collider(
          this.tuteeMap[this.mainPlayerId],
          this.door[item], 
           () => {
            if(this.mainTutee && !this.isCollide) {
              this.createModal(
                this, 
                item, 
                `${this.mainTutee.nickname}, Do you want to go to the ${item}`,
                 ()=> {
                  this.navigate(`/${item}`);
                });
            }
          })
      }

      this.time.addEvent({delay: 5000, callback: this.onRemoveWelcome, callbackScope: this, loop: false});
      this.welcomeSpeechBubble = this.addSpeechBubble(this.npcList[0].x, this.npcList[0].y-40, 140, 30, `Welcome! ${this.mainTutee.nickname ? this.mainTutee.nickname : 'Tutee'}! Let's study~!`)
      
    });

    

  } // end of create()

  setCameraFollow() {
    this.cameras.main.setBounds(0, 0, 800, 400);
    this.cameras.main.startFollow(this.tuteeMap[this.mainPlayerId], true, 0.09, 0.09,);
    this.cameras.main.setZoom(ZOOM_SCALE);
    // this.cameras.main.useBounds(true);
    
  }

  createModal(scene, title, message, onClickYes) {
    this.isCollide = true;
    this.rexUI.modalPromise(
      this.createRexDialog(scene, title, message, onClickYes).setPosition(300, 150), {
          manaulClose: true,
          duration: {
              in: 1000,
              out: 1000
          }
    }).then((closeEventData) => {
      this.time.addEvent({delay: 5000, callback: ()=>{ this.isCollide = false; }, callbackScope: this, loop: false});

    });
  }

  createRexDialog(scene, title, message, onClickYes) {
    var rexDialog = this.rexUI.add.dialog({
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

    rexDialog.setDepth(200);
	  rexDialog
			.on('button.click', function (button, groupName, index, pointer, event) {
        if(index === 0 && typeof onClickYes === 'function') {
          onClickYes();
        }
        rexDialog.emit('modal.requestClose', { closedDialog: "Auditorium" });
			})
			.on('button.over', function (button, groupName, index, pointer, event) {
        console.log("@ button.over")
        button.getElement('background').setStrokeStyle(1, 0xffffff);
			})
			.on('button.out', function (button, groupName, index, pointer, event) {
        console.log("@ button.out")
        button.getElement('background').setStrokeStyle();
			});

    
    
    
	  return rexDialog;
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
    this.addSpriteAndPlay(this.npcList[0].x, this.npcList[0].y-15, 'emoji', PLAYER_SCALE);
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
    // console.log("@ this.tuteeMap >>> ", this.tuteeMap)
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
      if(this.tuteeMap[id].nicknametext) this.tuteeMap[id].nicknametext.destroy();
      this.tuteeMap[id].destroy();
      delete this.tuteeMap[id];
    }
  }

  moveTutee(id, x, y, to) {
    if(!this.tuteeMap[id] || !this.tuteeMap[id].setMovingStateTo) return; 

    this.tuteeMap[id].setMovingStateTo(to, x, y);

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
    const lobbyTiles = this.backgroundTilesets.map(item => this.new_lobby.addTilesetImage(item, `new-lobby-${item}-sheet`));
    
    this.groundLayer = this.new_lobby.createLayer('ground_layer', lobbyTiles).setScale(LOBBY_SCALE).setScrollFactor(1);
    this.ceilLayer = this.new_lobby.createLayer('ceil_layer', lobbyTiles).setScale(LOBBY_SCALE).setScrollFactor(1);
    // this.ceilLayer.setCollisionByProperty({ collides: true}, true);
    this.wallLayer = this.new_lobby.createLayer('wall_layer', lobbyTiles).setScale(LOBBY_SCALE).setScrollFactor(1);
    // this.wallLayer.setCollisionByProperty({ collides: true}, true);
    
    this.new_lobby.createLayer('interior_ground_layer', lobbyTiles).setScale(LOBBY_SCALE).setScrollFactor(1);
    this.new_lobby.createLayer('interior_upper_layer', lobbyTiles).setScale(LOBBY_SCALE).setScrollFactor(1);
    this.new_lobby.createLayer('interior_top_layer', lobbyTiles).setScale(LOBBY_SCALE).setScrollFactor(1);

    this.physics.world.setBounds(0, 0, this.new_lobby.widthInPixels*LOBBY_SCALE, this.new_lobby.heightInPixels*LOBBY_SCALE);
    this.physics.world.setBoundsCollision(true, true, true, true);
  }

  update(time, delta) {
    // const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;
    // console.log("@ ",this.cameras.main.getWorldPoint(0, this.cameras.main.height))

    // this.controls.update(delta);
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

    var content = this.add.text(0, 0, quote, { fontFamily: 'Calibri', fontSize: 11, color: '#5b5a5c', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

    allContent[allCounter++] = content;
    var b = content.getBounds();

    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

    return allContent;
  }

  async getAllUsers () {
    const allData = await API.graphql(graphqlOperation(listTutees));
    const allTutees = Array.from(allData.data.listTutees.items);
    
    return allTutees;
  } 

  createSubscriptions() {

    API.graphql(
      graphqlOperation(onCreateTutee)
    ).subscribe({
      next: (subData) => {
        const tutee = subData.value.data.onCreateTutee;

        this.addTutee(tutee);
        // this.setAllUsers

      }
    });

    API.graphql(
      graphqlOperation(onUpdateTutee)
    ).subscribe({
      next: (subData) => {
        const tutee = subData.value.data.onUpdateTutee;
        if(this.mainTutee && tutee.id !== this.mainTutee.id) {
          this.moveTutee(tutee.id, tutee.x, tutee.y, tutee.to);

          //다른튜티 장소 업뎃하기
          
        }
      }
    });

    API.graphql(
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