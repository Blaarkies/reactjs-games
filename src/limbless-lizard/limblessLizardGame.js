import * as React from 'react';
import './style.scss'
import {KeyboardKeys} from "../common/enums";
import {getDirection, getDistance, getFromEnd, getRandomInt, getRange} from "../common/utilities";
import {clearScreen, drawApples, drawBuildings, drawSnake} from "./render";
import {Aftermath} from "./aftermath";

export class LimblessLizardGame extends React.Component {

    canvas = React.createRef();
    snakeHeadTexture = React.createRef();
    intervalHandle;
    colors = {};
    ctx;

    snake = this.getDefaultSnake();
    buildings = this.getRandomBuildings();
    apples = [];

    keysPressed = {
        ArrowLeft: false,
        ArrowRight: false,
    };
    lastSwipe = {
        screenX: 0,
        timeStamp: 0
    };

    constructor(props) {
        super(props);

        window.addEventListener("keydown", event => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            const enumKey = KeyboardKeys[event.key];
            if (enumKey === KeyboardKeys.ArrowLeft) {
                this.keysPressed.ArrowLeft = true;
            } else if (enumKey === KeyboardKeys.ArrowRight) {
                this.keysPressed.ArrowRight = true;
            }
        });

        window.addEventListener("keyup", event => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            const enumKey = KeyboardKeys[event.key];
            if (enumKey === KeyboardKeys.ArrowLeft) {
                this.keysPressed.ArrowLeft = false;
            } else if (enumKey === KeyboardKeys.ArrowRight) {
                this.keysPressed.ArrowRight = false;
            }
        });

        const lastHighScore = localStorage.getItem('lastScore');
        this.state = {
            score: 0,
            lastHighScore: lastHighScore
        };
    }

    addTailToSnake(snake, location) {
        snake.tail.push(...getRange(15).map(_ => location));
    }

    handleReset() {
        const lastHighScore = localStorage.getItem('lastScore');
        this.setState({
            score: 0,
            lastHighScore: lastHighScore,
            showAftermath: false
        });
        this.snake = this.getDefaultSnake();
        this.buildings = this.getRandomBuildings();
        this.apples = [];
        this.startGame();
    }

    getDefaultSnake() {
        const snake = {
            head: [400, 600 - 50],
            tail: [],
            direction: Math.PI * 1.5
        };
        this.addTailToSnake(snake, this.getMovedSegment(snake.head, snake.direction + Math.PI, 20));
        return snake;
    }

    componentDidMount() {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 300);
        gradient.addColorStop(0, '#141');
        gradient.addColorStop(0.5, '#161');
        gradient.addColorStop(1.0, '#343');
        this.colors.gradient = gradient;
        this.ctx = ctx;

        this.startGame();
    }

    startGame() {
        const ctx = this.ctx;
        const canvas = this.ctx.canvas;
        let tick = 0;
        this.intervalHandle = setInterval(_ => {
            this.spawnApples(tick);

            this.checkCollisions(this.snake, this.apples, this.buildings);

            this.handleUserKeysInput();
            this.updateHead(tick, this.snake);
            this.updateTail(this.snake);

            clearScreen(ctx, canvas);
            drawApples(ctx, this.apples);
            drawSnake(ctx, this.snake, this.colors.gradient, this.snakeHeadTexture.current);
            drawBuildings(ctx, this.buildings);
            tick++;
        }, 17);
    }

    componentWillUnmount() {
        clearInterval(this.intervalHandle);
    }

    render() {
        const afterMathComponent = this.state?.showAftermath
            ? <Aftermath onClick={() => this.handleReset()}/> : null;

        return (
            <div className="screen-container"
                // onTouchMove={event => this.touchMoved(event)}
            >
                <div className="game-container">
                    <div className="score-board">
                        <div>
                            <span className="score-text">Score</span>
                            <span className="score-value">{this.state.score}</span>
                        </div>
                        <div>
                            <span className="score-text">High Score</span>
                            <span className="score-value">{this.state.lastHighScore}</span>
                        </div>
                    </div>
                    <div className="overlap-container">
                        <div className="canvas-container"
                             onMouseDown={event => this.handleMousePress(event)}
                             onMouseMove={event => this.handleMouseMove(event)}>
                            <canvas ref={this.canvas} width={800} height={600}/>
                        </div>

                        {afterMathComponent}
                    </div>

                    <div className="control-board">
                        <div className="info-text">
                            <div className="input-mode-keyboard">Turn using the keyboard, or the onscreen buttons
                            </div>
                            <div className="input-mode-mobile">Turn using the onscreen buttons</div>
                        </div>
                        <button onPointerDown={() => this.keysPressed.ArrowLeft = true}
                                onPointerUp={() => this.keysPressed.ArrowLeft = false}>
                            ↺
                        </button>
                        <button onPointerDown={() => this.keysPressed.ArrowRight = true}
                                onPointerUp={() => this.keysPressed.ArrowRight = false}>
                            ↻
                        </button>
                    </div>
                </div>

                <img ref={this.snakeHeadTexture}
                     src={require('../assets/snakeHead.png')}
                     className="snake-head-texture-keeper"/>
            </div>
        );
    }

    checkCollisions(snake, apples, buildings) {
        const appleEaten = apples.filter(a => !a.isEaten)
            .find(apple => getDistance(snake.head, apple.location) < 20);
        if (appleEaten) {
            appleEaten.isEaten = true;
            this.addTailToSnake(snake, snake.tail[snake.tail.length - 1]);
            this.setState({score: this.state.score + 33});
        }

        let headRadius = 10;
        let headX = snake.head[0];
        let headY = snake.head[1];
        const snakeIsOutOfBounds = headX < headRadius || headX > 800 - headRadius
            || headY < headRadius || headY > 600 - headRadius;
        if (snakeIsOutOfBounds) {
            this.showAftermath();
        }

        const snakeHitBuilding = this.getHitBuilding(buildings, headRadius, headX, headY);
        if (snakeHitBuilding) {
            this.showAftermath();
        }

        const snakeHitTail = snake.tail.slice(1).find(t =>
            getDistance(snake.head, t) < 16
        );
        if (snakeHitTail) {
            this.showAftermath();
        }
    }

    getHitBuilding(buildings, colliderRadius, x, y) {
        return buildings.find(b => x > b[0] - colliderRadius
            && x < b[2] + colliderRadius
            && y > b[1] - colliderRadius
            && y < b[3] + colliderRadius);
    }

    spawnApples(tick) {
        if (this.apples.filter(a => !a.isEaten).length > 1) {
            return;
        }

        let appleLocation;
        while (!appleLocation) {
            let colliderRadius = 30;
            const location = [getRandomInt(800 - colliderRadius * 2) + colliderRadius,
                getRandomInt(600 - colliderRadius * 2) + colliderRadius];
            appleLocation = this.getHitBuilding(this.buildings, colliderRadius, ...location)
                ? undefined
                : location;
        }

        this.apples.push({
            id: tick,
            isEaten: false,
            location: appleLocation
        });
    }

    handleUserKeysInput() {
        if (this.keysPressed.ArrowLeft) {
            this.rotateHead(-0.049);
        } else if (this.keysPressed.ArrowRight) {
            this.rotateHead(+0.049);
        }
    }

    handleMousePress(event) {
        // console.log(event);
    }

    handleMouseMove(event) {
        // console.log(event);
    }

    rotateHead(angle) {
        this.snake.direction += angle;
    }

    updateHead(tick, snake) {
        const speed = 1.5;

        const amplitude = 0.03;
        const timePeriod = 0.1;
        const signal = Math.sin(tick * timePeriod) * amplitude;
        snake.direction += signal;
        snake.head = this.getMovedSegment(snake.head, snake.direction, speed);

        const lastSegments = [getFromEnd(snake.tail, 1), getFromEnd(snake.tail)];
        const tailTipDirection = getDirection(...lastSegments);
        snake.tail[snake.tail.length - 1] = this.getMovedSegment(lastSegments[1], tailTipDirection, speed);
    }

    updateTail(snake) {
        if (getDistance(snake.head, snake.tail[0]) < 20) {
            return;
        }
        snake.tail.unshift(this.getMovedSegment(snake.head, snake.direction + Math.PI, 20));
        snake.tail.pop();
    }

    getMovedSegment(segment, direction, speed) {
        const x = segment[0];
        const y = segment[1];
        return [x + Math.cos(direction) * speed, y + Math.sin(direction) * speed];
    }

    showAftermath() {
        clearInterval(this.intervalHandle);
        this.setState({showAftermath: true});

        if (this.state.score > this.state.lastHighScore) {
            localStorage.setItem('lastScore', this.state.score);
        }
    }

    getRandomBuildings() {
        return getRange(getRandomInt(4) + 2).map(_ => {
            const colliderRadius = 0;
            let location = [getRandomInt(800 - colliderRadius * 2) + colliderRadius,
                getRandomInt(600 - colliderRadius * 2) + colliderRadius];

            let orientation;
            switch (getRandomInt(2)) {
                case 0:
                    orientation = [250, 50];
                    break;
                case 1:
                    orientation = [50, 250];
                    break;
                case 2:
                    orientation = [50, 50];
                    break;
                default:
                    break;
            }

            if (getDistance(location, this.snake.head) < 300) {
                location = this.getMovedSegment(
                    location,
                    -getDirection(this.snake.head, location),
                    900
                );
            }
            return [...location, location[0] + orientation[0], location[1] + orientation[1]];
        });
    }

    touchMoved(event) {
        console.log(this.lastSwipe.timeStamp - event.timeStamp);
        if (this.lastSwipe.timeStamp < event.timeStamp - 100) {
            this.lastSwipe.timeStamp = event.timeStamp;
            this.lastSwipe.screenX = event.touches[0].screenX;
            this.keysPressed.ArrowLeft = false;
            this.keysPressed.ArrowRight = false;
        } else {
            const direction = this.lastSwipe.screenX > event.touches[0].screenX
                ? 'left'
                : 'right';

            this.keysPressed.ArrowLeft = direction === 'left';
            this.keysPressed.ArrowRight = direction === 'right';
        }
    }
}
