// Import phaser
import Phaser from 'phaser-ce';

// Import styles
import '../scss/index.scss';

// States
import Start from './states/start';

class Game extends Phaser.Game {

  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth;
    const height = docElement.clientHeight;

    super(width, height, Phaser.AUTO, document.body);

    this.state.add('Start', Start, false);

    this.state.start('Start');
  }

}

const game = new Game();

export default game;
