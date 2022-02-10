import Phaser from 'phaser';
import Tutee from '../entities/Tutee';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateTutee, onUpdateTutee } from '../../../graphql/subscriptions';
import { listTutees } from '../../../graphql/queries';
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

  constructor() {
    super({ key: 'LobbyScene' });
    this.createSubscriptions();
  }

  init(data) {
    this.nickname = data.nickname;
    this.mainTutee = {
      ...data.newTutee,
      x: parseInt(data.newTutee.x),
      y: parseInt(data.newTutee.y),
    }
  }

  preload() {

    // this.load.tilemapTiledJSON('lobby-map', 'assets/tilemaps/lobby.json');
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
      
    })

  }

  create(data) {

    this.new_lobby = this.make.tilemap({key: 'new-lobby-map'});
    this.addNewLobby();
    
    this.anims.create({
      key: 'door-anims',
      frames: this.anims.generateFrameNumbers('door-sheet', {
        start: 0,
        end: 2
      }),
      repeat: -1,
      duration: 800,
    });

    this.anims.create({
      key: `carry-anims`,
      frames: this.anims.generateFrameNumbers('carry-sheet', {
        start: 0,
        end: 31
      }),
      repeat: -1,
      duration: 2000,
    });

    this.anims.create({
      key: 'emoji-anims',
      frames: this.anims.generateFrameNumbers('emoji-sheet', {
        start: 0,
        end: 14
      }),
      repeat: 100,
      duration: 3000
    })

    this.addSpriteAndPlay(215, 30, 'door', 1, );
    this.addSpriteAndPlay(435, 230, 'carry', 1.3);
    this.addSpriteAndPlay(435, 210, 'emoji', 1.3);

    // this.debug = this.add.graphics();
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.createTuteeAnims();
    
    console.log("@ mainTutee > ", this.mainTutee);

    // 기존 방문자들 추가
    this.addActiveTutees();
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

  async addActiveTutees() {
    // 기존 방문자들 추가
    const filter = {
      state: { eq: "active" }
    };
    const allData = await API.graphql(graphqlOperation(listTutees, { filter: filter }));
    this.allTutees = allData.data.listTutees.items;
    this.allTutees.map(tutee => this.addTutee(tutee));
    
    return this.allTutees;
  }

  addTutee({x, y, id, nickname, character}) {

    // console.log(`@ Lobby.addTutee >> :`, {x, y, id, nickname, character});
    // console.log(`@ Lobby >> addTutee id: ${id}, x : ${x}, y: ${y}, nickname: ${nickname}`);

    // this.tuteeMap[id] = new Tutee(this, x, y, `${this.tutee}-idle-sheet`, id, nickname);
    this.tuteeMap[id] = new Tutee(this, x, y, `walk-${character}-sheet`, id, nickname, character);

    const isMainPlayer = this.nickname === nickname;  //서버를 다녀와야 id가 발급되므로 nickname 이 unique 해야할 듯
    if(isMainPlayer) {
      this.mainPlayerId = id;
      this.tuteeMap[id].setupMyAnimations();
    } else {
      this.tuteeMap[id].setupOtherAnimations();
    }

    this.tuteeMap[id].body.setCollideWorldBounds(true);
  
    this.createCollider(this.tuteeMap[id]);
  }

  addSpriteAndPlay(x, y, anims, scaled) {
    this.add.sprite(x, y,`${anims}-sheet`).setScale(scaled).play(`${anims}-anims`);
  }

  createCollider(tutee) {
    if(this.new_lobby && this.new_lobby.getLayer('wall_layer')) {
      // console.log(`wall_layer : `, this.new_lobby.getLayer('wall_layer'))
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
    this.tuteeMap[id].setMovingStateTo(to, x, y);

    let target = new Phaser.Math.Vector2();
    target.x = x;
    target.y = y;

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

  addNewLobby() {

    const lobbyTiles = this.backgroundTilesets.map(item => this.new_lobby.addTilesetImage(item, `new-lobby-${item}-sheet`))

    // const newLobbyWallPaperTiles = this.new_lobby.addTilesetImage('wallpapers', 'new-lobby-wallpaper-sheet');
    const groundLayer = this.new_lobby.createLayer('ground_layer', lobbyTiles);
    const ceilLayer = this.new_lobby.createLayer('ceil_layer', lobbyTiles);
    ceilLayer.setCollisionBetween(1, 1280);
    // ceilLayer.setCollisionByExclusion([-1]);
    const wallLayer = this.new_lobby.createLayer('wall_layer', lobbyTiles);
    wallLayer.setCollision([602,603,604,640,641,642,643,644,645,646,680,681,682,683,684,685,686]);
    // wallLayer.setCollisionBetween(121, 688)
    // wallLayer.setCollisionByExclusion([-1]);
    this.new_lobby.createLayer('interior_ground_layer', lobbyTiles);
    this.new_lobby.createLayer('interior_upper_layer', lobbyTiles);

    // const interiorGroundLayer = this.new_lobby.createLayer

    this.physics.world.setBounds(0, 0, this.new_lobby.widthInPixels, this.new_lobby.heightInPixels);
  }

  update(time, delta) {
    // const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;
    
  }

  createSubscriptions() {

    const createSub = API.graphql(
      graphqlOperation(onCreateTutee)
    ).subscribe({
      next: (subData) => {
        const tutee = subData.value.data.onCreateTutee;
        console.log("@@@@ onCreateTutee >>  ", tutee);

        this.addTutee(tutee);

      }
    });

    const updateSub = API.graphql(
      graphqlOperation(onUpdateTutee)
    ).subscribe({
      next: (subData) => {
        const tutee = subData.value.data.onUpdateTutee;
        if(this.mainTutee && tutee.id !== this.mainTutee.id) {
          console.log("@@@ onUpdateTutee >> ", tutee);
          this.moveTutee(tutee.id, tutee.x, tutee.y, tutee.to)
        }
      }
    })
  }
}

export default Lobby;