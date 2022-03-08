import Phaser from "phaser";
import { BOTTOM_SPEECH_POSITION, NPC_CONFIG, ZOOM_SCALE } from "../common";

export default class DialogModalPlugin extends Phaser.Plugins.BasePlugin {
  
  text;
  dialog;
  graphics;
  closeBtn;
  positionX;
  positionY;
  
  constructor(pluginManager) {
    super(pluginManager);
    
    this.pluginManager = pluginManager;

    // if (!this.scene.sys.settings.isBooted) {
    //   this.scene.sys.events.once('boot', this.boot, this);
    // }
    
  }

  // register (PluginManager) {
  //   PluginManager.register('DialogModalPlugin', DialogModalPlugin, 'dialogModal');
  // };

  boot() {
    var eventEmitter = this.systems.events;
    eventEmitter.on('destroy', this.destroy, this);
  }

  start() {
    var eventEmitter = this.systems.events;
    eventEmitter.on('destroy', this.destroy, this);
  }

  shutdown() {
    if (this.timedEvent) this.timedEvent.remove();
    if (this.text) this.text.destroy();
  }

  destroy() {
    this.shutdown();
    this.scene = undefined;
  }

  // Initialize the dialog modal
  init(opts) {
    this.scene = this.pluginManager.game.scene.getScene('LobbyScene');
    this.systems = this.scene.sys;
    // Check to see if any optional parameters were passed
    if (!opts) opts = {};
    // set properties from opts object or use defaults
    this.face = opts.face || 'carry';
    this.borderThickness = opts.borderThickness || 3;
    this.borderColor = opts.borderColor || 0x907748;
    this.borderAlpha = opts.borderAlpha || 1;
    this.windowAlpha = opts.windowAlpha || 0.8;
    this.windowColor = opts.windowColor || 0x303030;
    this.windowHeight = opts.windowHeight || 100;
    this.padding = opts.padding || 20;
    this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
    this.dialogSpeed = opts.dialogSpeed || 5;

    this.eventCounter = 0;
    this.visible = true;
    // this.text;
    // this.dialog;
    // this.graphics;
    // this.closeBtn;
  }

  toggleWindow() {
    this.visible = !this.visible;
    if (this.text) this.text.visible = this.visible;
    if (this.graphics) this.graphics.visible = this.visible;
    if (this.closeBtn) this.closeBtn.visible = this.visible;
  }

  // Slowly displays the text in the window to make it appear annimated
  _animateText() {
    this.eventCounter++;
    this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
    if (this.eventCounter === this.dialog.length) {
      this.timedEvent.remove();
    }
  }

  // Sets the text for the dialog window
  setText(text, animate) {
    // Create the dialog window
    this._createWindow();

    // Reset the dialog
    this.eventCounter = 0;
    this.dialog = text.split('');
    if (this.timedEvent) this.timedEvent.remove();

    var tempText = animate ? '' : text;
    this._setText(tempText);

    if (animate) {
      this.timedEvent = this.scene.time.addEvent({
        delay: 150 - (this.dialogSpeed * 30),
        callback: this._animateText,
        callbackScope: this,
        loop: true
      });
    }
  }

  // Calcuate the position of the text in the dialog window
  _setText(text) {
    // Reset the dialog
    if (this.text) this.text.destroy();

    let hasDisplayName = NPC_CONFIG.filter(item=>item.name === this.face);
    let displayName = '안내자';
    if(hasDisplayName.length > 0 && hasDisplayName[0].displayName) {
      displayName = hasDisplayName[0].displayName;
    }
    var x = this.positionX + 10 + 100; //this.padding + 10;
    var y = this.positionY + 10; //this._getGameHeight() - this.windowHeight - this.padding + 10;

    this.npcDisplayName = this.scene.make.bitmapText({
      font: 'DungGeunMo_skyblue',
      text: displayName,
      size: 12
    }, true).setX(x).setY(y).setDepth(300);

    this.text = this.scene.make.bitmapText({
      font: 'DungGeunMo',
	    text: text,
      size: 12
      },
      true
    ).setX(x).setY(y+20).setDepth(300);

    // this.text = this.scene.make.text({
    //   x,
    //   y,
    //   text,
    //   style: {
    //     wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 - 100 }
    //   }
    // });
  }

  // Creates the dialog window
  _createWindow() {
    var gameHeight = this._getGameHeight();
    var gameWidth = this._getGameWidth();
    var windowDimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
    this.graphics = this.scene.add.graphics().setDepth(200);

    this._createOuterWindow(windowDimensions);
    this._createInnerWindow(windowDimensions);
    // this._createCloseModalButtonBorder();
    this._createCloseModalButton();
    this.faceImage = this.scene.add.image(windowDimensions.x + 40, windowDimensions.y + 30,`${this.face}-face`).setScale(BOTTOM_SPEECH_POSITION.scale).setDepth(300)
  }

  // Gets the width of the game (based on the scene)
  _getGameWidth() {
    return this.scene.sys.game.config.width/ZOOM_SCALE;
  }

  // Gets the height of the game (based on the scene)
  _getGameHeight() {
    return this.scene.sys.game.config.height/ZOOM_SCALE;
  }

  // Calculates where to place the dialog window based on the game size
  _calculateWindowDimensions(width, height) {
    var rectWidth = width - (this.padding * 2);
    var rectHeight = this.windowHeight;
    // console.log("@ width, height > ", width, height)
    // console.log("@ this.scene.cameras.main.midPoint >", this.scene.cameras.main.midPoint)
    // console.log("@ this.windowHeight >", this.windowHeight)

    var wannaBeX = this.scene.cameras.main.midPoint.x - (rectWidth/2);
    var wannaBeY = this.scene.cameras.main.midPoint.y + (height/2) - rectHeight - this.padding;

    this.positionX = wannaBeX;
    this.positionY = wannaBeY;
    this.rectWidth = rectWidth;

    var x = wannaBeX;
    var y = wannaBeY; //height - this.windowHeight - this.padding;
    
    return {
      x,
      y,
      rectWidth,
      rectHeight
    };
  }

  // Creates the inner dialog window (where the text is displayed)
  _createInnerWindow({ x, y, rectWidth, rectHeight }) {
    this.graphics.fillStyle(this.windowColor, this.windowAlpha);
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
  }

  // Creates the border rectangle of the dialog window
  _createOuterWindow({ x, y, rectWidth, rectHeight }) {
    this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
    this.graphics.strokeRect(x, y, rectWidth, rectHeight);
  }

  // Creates the close dialog button border
  _createCloseModalButtonBorder() {
    var x = this._getGameWidth() - this.padding - 20;
    var y = this._getGameHeight() - this.windowHeight - this.padding;
    this.graphics.strokeRect(x, y, 20, 20);
  }

  // Creates the close dialog window button
  _createCloseModalButton() {
    var self = this;
    this.closeBtn = this.scene.make.text({
      x: this.positionX + this.rectWidth - 14,
      y: this.positionY + 3,
      text: 'X',
      style: {
        font: 'bold 12px Arial',
        fill: this.closeBtnColor
      }
    }).setDepth(300);
    this.closeBtn.setInteractive();

    this.closeBtn.on('pointerover', function () {
      this.setTint(0xff0000);
    });
    this.closeBtn.on('pointerout', function () {
      this.clearTint();
    });
    this.closeBtn.on('pointerdown', function () {
      // self.toggleWindow();
      self.removeDialog();
      // if (self.timedEvent) self.timedEvent.remove();
      // if (self.text) self.text.destroy();

      // if (self.text) self.text.setVisible(false);
      // if (self.graphics) self.graphics.setVisible(false);
      // if (self.closeBtn) self.closeBtn.setVisible(false);
      // if (self.faceImage) self.faceImage.destroy();
    });
  }

  removeDialog() {
    let self = this;
    if (self.timedEvent) self.timedEvent.remove();
    if (self.text) self.text.destroy();
    if (self.npcDisplayName) self.npcDisplayName.destroy();

    if (self.text) self.text.setVisible(false);
    if (self.graphics) self.graphics.setVisible(false);
    if (self.closeBtn) self.closeBtn.setVisible(false);
    if (self.faceImage) self.faceImage.destroy();
  }

}


