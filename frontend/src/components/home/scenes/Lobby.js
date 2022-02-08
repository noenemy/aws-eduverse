import Phaser from 'phaser';
import Tutee from '../entities/Tutee';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateTutee, onUpdateTutee } from '../../../graphql/subscriptions';
import { listTutees } from '../../../graphql/queries';
class Lobby extends Phaser.Scene {

  tuteeMap = {}
  allCharacters = ['pink','purple']

  constructor() {
    super({ key: 'LobbyScene' });

    this.tutees = [];
    this.tutee = 'Adam';
    this.char = 'pink';

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

    this.load.spritesheet('new-lobby-wallpaper-sheet', 'assets/tilesets/wallpapers.png', {
      frameWidth: 16,
      frameHeight: 16,
      endFrame: 2
      // margin: 1,
      // spacing: 2,
    },);

    this.allCharacters.map(char => {
      this.load.spritesheet(`walk-${char}-sheet`, `assets/walk/walk_${char}.png`, {
        frameWidth: 32,
        frameHeight: 32,
        // spacing: 16,
        // margin: 1
      })
    })

  }

  async create(data) {

    this.new_lobby = this.make.tilemap({key: 'new-lobby-map'});
    this.addNewLobby();

    // this.debug = this.add.graphics();
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.createAnims();
    
    console.log("@ mainTutee > ", this.mainTutee);

    // 로비 입장하면 나 추가
    // this.addTutee(this.mainTutee);

    // 기존 방문자들 추가
    const filter = {
        state: { eq: "active" }
    };
    const allData = await API.graphql(graphqlOperation(listTutees, { filter: filter }));
    this.allTutees = allData.data.listTutees.items;
    this.allTutees.map(tutee => this.addTutee(tutee));

  }

  createAnims(charName) {
    ['idle','down'/*,'left','right','up'*/].map(direction => {
      this.allCharacters.map(char => {
        const walkSprite = this.anims.create({
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

  addTutee({x, y, id, nickname, character}) {

    console.log(`@ Lobby.addTutee >> :`, {x, y, id, nickname, character});
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

  createCollider(tutee) {
    if(this.new_lobby && this.new_lobby.getLayer('wall_layer')) {
      console.log(`wall_layer : `, this.new_lobby.getLayer('wall_layer'))
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
      duration: distance * 10
    });
  }

  addNewLobby() {

    const newLobbyWallPaperTiles = this.new_lobby.addTilesetImage('wallpapers', 'new-lobby-wallpaper-sheet');

    const groundLayer = this.new_lobby.createLayer('ground_layer', newLobbyWallPaperTiles);
    const ceilLayer = this.new_lobby.createLayer('ceil_layer', newLobbyWallPaperTiles);
    ceilLayer.setCollisionBetween(1, 1280);
    // ceilLayer.setCollisionByExclusion([-1]);
    const wallLayer = this.new_lobby.createLayer('wall_layer', newLobbyWallPaperTiles);
    // wallLayer.setCollision([602,603,604,640,641,642,643,644,645,646,680,681,682,683,684,685,686]);
    wallLayer.setCollisionBetween(121, 688)
    // wallLayer.setCollisionByExclusion([-1]);

    this.physics.world.setBounds(0, 0, this.new_lobby.widthInPixels, this.new_lobby.heightInPixels);
  }

  update(time, delta) {
    // const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;
    
    // this.nicknameText.setPosition(this.tutees.body.x-10, this.tutees.body.y-20)
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