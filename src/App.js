import React, { Component } from "react";
import "./App.scss";
import Player from "./components/player";

const MAX_SCORE = 10;
const initState = {
  players: [
    {
      playerName: "Player 1",
      score: 0,
      current: 0,
      active: true,
      winner: false
    },
    {
      playerName: "Player 2",
      score: 0,
      current: 0,
      active: false,
      winner: false
    }
  ],
  dice1: 0,
  dice2: 0
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initState;

    this.rollDice = this.rollDice.bind(this);
    this.nextPlayer = this.nextPlayer.bind(this);
    this.holdDice = this.holdDice.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  rollDice() {
    if (this.state.players.find(player => player.winner)) return;

    let dice1 = Math.floor(Math.random() * 6) + 1;
    this.setState({ dice1 });
    let dice2 = Math.floor(Math.random() * 6) + 1;
    this.setState({ dice2 });

    if (dice1 !== 1 || dice2 !== 1) {
      let players = this.state.players.map(player => {
        if (player.active) {
          return {
            ...player,
            current: player.current + dice1 + dice2
          };
        }
        return player;
      });
      this.setState({ players });
    } else {
      this.nextPlayer();
    }
  }

  nextPlayer() {
    let players = this.state.players.map(player => {
      if (player.active) {
        return {
          ...player,
          active: !player.active,
          current: 0
        };
      }
      return {
        ...player,
        current: 0,
        active: !player.active
      };
    });
    this.setState({ players, dice1: 0, dice2: 0 });
  }

  holdDice() {
    if (this.state.players.find(player => player.winner)) return;

    let players = this.state.players.map(player => {
      if (player.active) {
        return {
          ...player,
          score: player.score + player.current
        };
      }
      return player;
    });
    this.setState({ players }, () => {
      let hasWinner = this.state.players.find(
        player => player.score >= MAX_SCORE
      );
      if (hasWinner) {
        let players = this.state.players.map(player => {
          if (player.active) {
            return {
              ...player,
              playerName: "WINNER",
              winner: true
            };
          }
          return player;
        });
        this.setState({ players, dice1: 0, dice2: 0 });
      } else {
        this.nextPlayer();
      }
    });
  }

  newGame() {
    this.setState(initState);
  }

  render() {
    let { players, dice1, dice2 } = this.state;

    return (
      <div className="wrapper clearfix">
        {players.map(player => {
          return (
            <Player
              key={player.playerName}
              score={player.score}
              current={player.current}
              active={player.active}
              playerName={player.playerName}
              winner={player.winner}
            />
          );
        })}

        <button className="btn-new" onClick={this.newGame}>
          <i className="ion-ios-plus-outline" />
          New game
        </button>
        <button className="btn-roll" onClick={this.rollDice}>
          <i className="ion-ios-loop" />
          Roll dice
        </button>
        <button className="btn-hold" onClick={this.holdDice}>
          <i className="ion-ios-download-outline" />
          Hold
        </button>
        {dice1 !== 0 && (
          <img
            src={require(`./assets/img/dice-${dice1}.png`)}
            alt="Dice"
            className="dice1"
          />
        )}
        {dice2 !== 0 && (
          <img
            src={require(`./assets/img/dice-${dice2}.png`)}
            alt="Dice"
            className="dice2"
          />
        )}
      </div>
    );
  }
}

export default App;
