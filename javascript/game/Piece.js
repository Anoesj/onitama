export class Piece {
  constructor (type, x, y, player, game, index) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.player = player;
    this.game = game;
    this.index = index;

    this.element = document.createElement('div');
    this.element.dataset.x = x;
    this.element.dataset.y = y;
    this.element.classList.add('piece');
    this.element.classList.add(this.type);
    this.element.dataset.owner = this.player.id;
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
    this.game.board.appendChild(this.element);

    this.game.tiles[this.x + '-' + this.y].classList.add('has-piece');

    if (this.player.id === 2) {
      this.element.addEventListener('mouseenter', () => {
        if (this.game.activePlayer !== player.id) { return; }

        // Hover actions while having no selected piece but a selected card.
        if (!this.player.activePiece && this.player.activeCard) {
          this.highlightCard(this.player.activeCard);
        }
      });

      this.element.addEventListener('mouseleave', () => {
        if (!this.player.activePiece) {
          this.removeHoverAndHighlights();
        }
      });

      this.element.addEventListener('click', () => {
        this.pieceClick();
      });
    }

    this.game.on('tile-click', (tile) => {
      this.tileClick(tile);
    });
  }

  pieceClick () {
    // Click to remove selection.
    if (this.player.activePiece && this.player.activePiece === this) {
      this.clickToRemoveSelection();
    }
    else {
      // Clean up dangling highlights.
      this.removeHoverAndHighlights();

      if (this.player.activeCard) {
        this.highlightCard(this.player.activeCard);
      }

      // Cleaning up old active piece.
      if (this.player.activePiece) {
        this.player.activePiece.element.classList.remove('selected');
      }

      // Setting the new context.
      this.player.activePiece = this;
      this.element.classList.add('selected');
    }
  }

  tileClick (tile) {
    if (this.player.activePiece === this && this.player.activeCard) {
      this.player.activeCard.sets.forEach((set) => {
        let x = this.x + set.x;
        let y = this.y + set.y;

        if (parseInt(tile.dataset.x) === x && parseInt(tile.dataset.y) === y) {
          this.game.transition({
            player: this.player.id,
            piece: this.index,
            card: this.player.activeCard.name,
            x: x,
            y: y
          });
        }
      });
    }
  }

  capture () {
    this.x = -1;
    this.y = -1;
    this.element.style = 'display: none;';

    if (this.type === 'master') {
      if (this.player.id === 1) {
        alert('You have won')
      }
      else {
        alert('You have lost')
      }

    }
  }

  clickToRemoveSelection () {
    this.player.activePiece.element.classList.remove('selected');
    this.player.activePiece = false;
    this.removeHoverAndHighlights();
  }

  setPosition(x, y) {
    this.game.tiles[this.x + '-' + this.y].classList.remove('has-piece');

    this.x = x;
    this.y = y;
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
    this.removeHoverAndHighlights();
    if (this.player.activeCard) {
      this.player.activeCard.element.classList.remove('selected');
      this.game.swapCard(this.player.activeCard);
      this.player.activeCard = false;
    }

    if (this.player.activePiece) {
      this.player.activePiece.element.classList.remove('selected');
      this.player.activePiece = false;
    }
  }

  highlightCard (card) {
    this.game.tiles[this.x + '-' + this.y].classList.add('hover');

    card.sets.forEach((set) => {
      let setX = this.x + set.x;
      let setY = this.y + set.y;

      if (this.player.id === 1) {
        setX = this.game.mirrorCoordinate(setX);
        setY = this.game.mirrorCoordinate(setY);
      }

      // When on the board.
      if (setX > 0 && setY > 0 && setX < 6 && setY < 6) {
        let isValid = true;
        this.game.player1.pieces.forEach((piece) => {
          if (piece.x === setX && piece.y === setY  && this.player.id === 1) {
            isValid = false;
          }
        });

        this.game.player2.pieces.forEach((piece) => {
          if (piece.x === setX && piece.y === setY && this.player.id === 2) {
            isValid = false;
          }
        });

        if (isValid) {
          this.game.tiles[setX + '-' + setY].classList.add('highlight');
        }
      }
    });
  }

  removeHoverAndHighlights() {
    let tiles = this.game.board.querySelectorAll('.tile');

    Array.from(tiles).forEach((tile) => {
      tile.classList.remove('hover');
      tile.classList.remove('highlight');
    })
  }
}