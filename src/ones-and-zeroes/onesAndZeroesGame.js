import * as React from 'react';
import {Tile} from './tile';
import './style.scss'
import {delay, getRange, getUniqueEntries} from '../common/utilities';
import {AnimatedSlide} from "../common/components/animated-slide/animated-slide";
import {Aftermath} from "./aftermath";
import {PlayerNames, SlideStates} from "../common/enums";

export class OnesAndZeroesGame extends React.Component {

    players = getUniqueEntries(PlayerNames, 2).map((player, i) => ({
        name: player.name,
        icon: player.icon,
        index: i,
        flag: player.icon
    }));

    constructor(props) {
        super(props);
        this.state = {...this.getNewGameState()};
    }

    getNewGameState() {
        return {
            board: getRange(9).map(i => ({
                number: i,
                claimedBy: undefined
            })),
            playerOnTurn: this.players[0],
            winner: undefined,
            slideState: SlideStates.startIdle,
            isBoardLocked: false
        };
    }

    renderTile(tile) {
        return <Tile value={tile.claimedBy?.flag}
                     onClick={() => this.handleTileClick(tile.number)}
                     key={tile.number}/>;
    }

    async handleTileClick(tileNumber) {
        if (this.state.isBoardLocked) {
            return;
        }

        this.setState({
            board: this.state.board.slice().map(t => {
                if (t.number === tileNumber) {
                    t.claimedBy = this.state.playerOnTurn;
                }
                return t;
            })
        });
        const winner = this.getWinState();
        if (winner) {
            this.setState({isBoardLocked: true});
            await delay(1500);
            this.setState({
                winner: winner || 'tie',
                loser: this.players.find(p => p !== winner),
                slideState: SlideStates.forwardSlide
            });

            return;
        }

        const nextPlayer = this.players[(this.state.playerOnTurn.index + 1) % this.players.length];
        this.setState({playerOnTurn: nextPlayer});
    }

    getWinState() {
        const boardArray = this.state.board.sort((a, b) => a.number - b.number);
        const winner = this.players.find(p => {
            return [0, 3, 6].some(row => boardArray.slice(row, 3 + row)
                    .filter(t => t.claimedBy === p).length === 3)
                || [0, 1, 2].some(column => [boardArray[column], boardArray[3 + column], boardArray[6 + column]]
                    .filter(t => t.claimedBy === p).length === 3)
                || [boardArray[0], boardArray[4], boardArray[8]].filter(t => t.claimedBy === p).length === 3
                || [boardArray[2], boardArray[4], boardArray[6]].filter(t => t.claimedBy === p).length === 3;
        });

        if (!winner && boardArray.filter(t => t.claimedBy).length < 9) {
            return;
        }

        return winner;
    }

    handleResetClick() {
        this.setState({slideState: SlideStates.backwardSlide});
    }

    handleStartBackwardSlide() {
        if (!this.state.winner) {
            return;
        }
        this.setState({...this.getNewGameState()});
    }

    render() {
        let statusMessage = `${this.state.playerOnTurn.icon} ${this.state.playerOnTurn.name} to pick a tile`;
        return (
            <div className="screen-container">
                <AnimatedSlide onEndBackwardSlide={() => this.handleStartBackwardSlide()}
                               slideState={this.state.slideState}
                               value={[
                                   <div className="game-container">
                                       <div className="status-text">{statusMessage}</div>
                                       <div className="tiles-container">
                                           {this.state.board.map(t => this.renderTile(t))}
                                       </div>
                                   </div>,

                                   <div className="game-container">
                                       <Aftermath board={this.state.board}
                                                  winner={this.state.winner}
                                                  loser={this.state.loser}
                                                  onClick={() => this.handleResetClick()}/>
                                   </div>
                               ]}>
                </AnimatedSlide>
            </div>
        );
    }

}
