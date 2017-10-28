import {Connection} from '/javascript/connection/Connection.js';
import {Game} from '/javascript/game/Game.js';

let connection = new Connection();
let game;

connection.on('started', () => {
  if (connection.role === 'initiator') {
    game = new Game('#board');
    let cardNames = game.cards.map((card) => card.name);
    connection.sendMessage('startGame', {
      cardNames: cardNames
    });
  }
});

let commands = {
  startGame: (options) => {
    new Game('#board', {
      cardNames: options.cardNames
    });
  }
};

connection.on('message', (message) => {
  if (message.command && message.options && commands[message.command]) {
    commands[message.command](message.options);
  }
});