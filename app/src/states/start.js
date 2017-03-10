import Phaser from 'phaser-ce';
import PhaserDebug from 'phaser-debug';

export default class Start extends Phaser.State {

  init() {
    this.stage.backgroundColor = '#292929';
  }

  preload() {
    // Plugins
    this.add.plugin(PhaserDebug);

    // Resize content
    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.scale.setResizeCallback(() => {
      this.scale.setMaximum();
    });
  }

  // render() { }

}
