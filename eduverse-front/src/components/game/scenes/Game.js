import Phaser from 'phaser';
import Tutee from '../entities/Tutee';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {

    this.tutee = 'Adam';
  }

  preload() {

    this.load.tilemapTiledJSON('lobby-map', 'assets/tilemaps/lobby.json');

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

  create(data) {

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

    this.addLobby();
    this.addTutee();
  }

  addTutee() {
    this.tutees = new Tutee(this, 100, 100, `${this.tutee}-idle-sheet`);

    this.children.moveTo(this.tutees, this.children.getIndex(this.lobby.getLayer('Interior').tilemapLayer));

    const wallCollider = this.physics.add.collider(this.tutees, this.lobby.getLayer('Wall').tilemapLayer);
    const boundaryCollider = this.physics.add.collider(this.tutees, this.lobby.getLayer('Boundary').tilemapLayer);

    // this.cameras.main.startFollow(this.tutees);
    // this.hero = new Hero(this, this.spawnPos.x+10, this.spawnPos.y);
  }


  addLobby() {
    this.lobby = this.make.tilemap({key: 'lobby-map'});
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

  update(time, delta) {
    const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;

  }
}

export default Game;