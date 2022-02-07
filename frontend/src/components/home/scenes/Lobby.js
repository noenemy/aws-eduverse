import Phaser from 'phaser';
import Tutee from '../entities/Tutee';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateTutee, onUpdateTutee } from '../../../graphql/subscriptions';
import { listTutees } from '../../../graphql/queries';
class Lobby extends Phaser.Scene {

  tuteeMap = {}

  constructor() {
    super({ key: 'LobbyScene' });

    this.tutees = [];
    this.tutee = 'Adam';

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

    this.load.tilemapTiledJSON('lobby-map', 'assets/tilemaps/lobby.json');
    this.load.tilemapTiledJSON('new-lobby-map', 'assets/tilemaps/new_lobby.json');

    this.load.spritesheet('new-lobby-wallpaper-sheet', 'assets/tilesets/wallpapers.png', {
      frameWidth: 16,
      frameHeight: 16,
      // margin: 1,
      // spacing: 2,
    });

    this.load.spritesheet('lobby-interior-sheet', 'assets/tilesets/Interiors_free_16x16.png', {
      frameWidth: 16,
      frameHeight: 16,
      // margin: 1,
      // spacing: 2,
    });

    this.load.spritesheet('lobby-builder-sheet', 'assets/tilesets/Room_Builder_free_16x16.png', {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      // spacing: 2,
    });

    this.load.spritesheet(`${this.tutee}-idle-sheet`, `assets/${this.tutee}/${this.tutee}_run_16x16.png`, {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.spritesheet(`${this.tutee}-run-sheet`, `assets/${this.tutee}/${this.tutee}_run_16x16.png`, {
      frameWidth: 16,
      frameHeight: 32,
    });

  }

  async create(data) {

    this.debug = this.add.graphics();
    
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: `${this.tutee}-right`,
      frames: this.anims.generateFrameNumbers(`${this.tutee}-run-sheet`, {
        start: 0,
        end: 5
      }),
      repeat: -1
    });

    this.anims.create({
      key: `${this.tutee}-up`,
      frames: this.anims.generateFrameNumbers(`${this.tutee}-run-sheet`, {
        start: 6,
        end: 11,
      }),
      repeat: -1
    });

    this.anims.create({
      key: `${this.tutee}-left`,
      frames: this.anims.generateFrameNumbers(`${this.tutee}-run-sheet`, {
        start: 12,
        end: 17
      }),
      repeat: -1
    });

    this.anims.create({
      key: `${this.tutee}-down`,
      frames: this.anims.generateFrameNumbers(`${this.tutee}-run-sheet`, {
        start: 18,
        end: 23
      }),
      repeat: -1
    });

    this.anims.create({
      key: `${this.tutee}-idle`,
      frames: this.anims.generateFrameNumbers(`${this.tutee}-idle-sheet`, {
        start: 18,
        end: 23
      }),
    });

    this.lobby = this.make.tilemap({key: 'lobby-map'});
    this.new_lobby = this.make.tilemap({key: 'new-lobby-map'});

    this.addLobby();

    this.addNewLobby();


    console.log("@ mainTutee > ", this.mainTutee);

    // 로비 입장하면 나 추가
    this.addTutee(this.mainTutee);

    // 기존 방문자들 추가
    const filter = {
        state: { eq: "active" }
    };
    const allData = await API.graphql(graphqlOperation(listTutees, { filter: filter }));
    this.allTutees = allData.data.listTutees.items;
    this.allTutees.map(tutee => this.addTutee(tutee));

  }

  getLobby() {
    return this.lobby;
  }

  addTutee({x, y, id, nickname}) {

    console.log(`@ Lobby >> this.tutee icon: ${this.tutee}`);
    console.log(`@ Lobby >> addTutee id: ${id}, x : ${x}, y: ${y}, nickname: ${nickname}`);

    this.tuteeMap[id] = new Tutee(this, x, y, `${this.tutee}-idle-sheet`, id);

    const isMainPlayer = this.nickname === nickname;  //서버를 다녀와야 id가 발급되므로 nickname 이 unique 해야할 듯
    if(isMainPlayer) {
      this.mainPlayerId = id;
      this.tuteeMap[id].setupMyAnimations();
    } else {
      this.tuteeMap[id].setupOtherAnimations();
    }
  
    this.add.text(x, y, nickname);

    // this.children.moveTo(tt, this.children.getIndex(this.lobby.getLayer('Interior').tilemapLayer));

    // const wallCollider = this.physics.add.collider(tt, this.lobby.getLayer('Wall').tilemapLayer);
    // const boundaryCollider = this.physics.add.collider(tt, this.lobby.getLayer('Boundary').tilemapLayer);

    // this.cameras.main.startFollow(this.tutees);
    // this.hero = new Hero(this, this.spawnPos.x+10, this.spawnPos.y);
  }

  removeTutee(id) {
    if(this.tuteeMap[id]) {
      this.tuteeMap[id].destroy();
      delete this.tuteeMap[id];
    }
  }

  moveTutee(id, x, y, to) {
    console.log(`@@@ Lobby.moveTutee: this.tuteeMap[${id}] current position >> `, this.tuteeMap[id].body.x, this.tuteeMap[id].body.y)
    this.tuteeMap[id].setMovingStateTo(to, x, y);

    let target = new Phaser.Math.Vector2();
    
    target.x = x;
    target.y = y;
    // this.physics.moveToObject(this.tuteeMap[id], target, 600, 900);


    // if(this.text) this.text.destroy();
    // this.text = this.add.text(x, y, `${x},${y}`)

    if(this.debug) {
      this.debug.clear().lineStyle(1, 0x00ff00);
      this.debug.lineBetween(0, target.y, 800, target.y);
      this.debug.lineBetween(target.x, 0, target.x, 600);
      if(this.movetext) this.movetext.destroy();
      this.movetext = this.add.text(target.x, target.y, `${target.x},${target.y}`)
    }

    // const tween = this.add.tween({
    //   targets: this.tuteeMap[id],
    //   x: distance,
    //   duration: distance*10
    // });
    // this.tuteeMap[id].setTween(tween);
    
  }


  addLobby() {
    
    const lobbyBuilderTiles = this.lobby.addTilesetImage('Room_Builder_free_16x16', 'lobby-builder-sheet');
    const lobbyInteriorTiles = this.lobby.addTilesetImage('Interiors_free_16x16', 'lobby-interior-sheet');


    const groundLayer = this.lobby.createLayer('Ground', lobbyBuilderTiles);
    const wallLayer = this.lobby.createLayer('Wall', lobbyBuilderTiles);
    wallLayer.setCollision([ 295, 329 ], true);
    const furnitureLayer = this.lobby.createLayer('Furniture', lobbyInteriorTiles);
    // furnitureLayer.setCollisionBetween(0, 9999, true);
    const interiorLayer =this.lobby.createLayer('Interior', lobbyInteriorTiles);
    const boundaryLayer = this.lobby.createLayer('Boundary', lobbyBuilderTiles);
    boundaryLayer.setCollisionBetween(1, 68, true);

    this.physics.world.setBounds(0, 0, this.lobby.widthInPixels, this.lobby.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, true, true);
  }

  addNewLobby() {

    const newLobbyWallPaperTiles = this.new_lobby.addTilesetImage('wallpapers', 'new-lobby-wallpaper-sheet');
    const groundLayer = this.new_lobby.createLayer('ground_layer', newLobbyWallPaperTiles);
    const ceilLayer = this.new_lobby.createLayer('ceil_layer', newLobbyWallPaperTiles);
    const wallLayer = this.new_lobby.createLayer('wall_layer', newLobbyWallPaperTiles);
    

    this.physics.world.setBounds(0, 0, this.new_lobby.widthInPixels, this.new_lobby.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, true, true);

  }

  update(time, delta) {
    const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;
    
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
        if(tutee.id !== this.mainTutee.id) {
          console.log("@@@ onUpdateTutee >> ", tutee);
          this.moveTutee(tutee.id, tutee.x, tutee.y, tutee.to)
        }
      }
    })
  }
}

export default Lobby;