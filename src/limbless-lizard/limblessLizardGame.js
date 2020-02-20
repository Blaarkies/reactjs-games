import * as React from 'react';
import './style.scss'
import {Directions, KeyboardKeys} from "../common/enums";
import {
    getAdditionLocations, getArrangedRectangleCorners,
    getDirection,
    getDistance,
    getFromEnd,
    getMultiplicationLocation,
    getRandomInt, getRandomSign,
    getRange, getTranslatedLocation
} from "../common/utilities";
import {clearScreen, drawApples, drawBuildings, drawSnake} from "./render";
import {Aftermath} from "./aftermath";

export class LimblessLizardGame extends React.Component {

    gameTimerIntervalHandle;
    textures = {
        snakeHead: React.createRef(),
        snakeSkin: React.createRef(),
        apple: React.createRef(),
        stone: React.createRef()
    };
    colors = {};
    ctx;

    snake;
    buildings;
    apples;

    keyboardInput = {
        ArrowLeftPressed: false,
        ArrowRightPressed: false,
    };
    touchInput = {
        lastInputScreenX: 0,
        timeStamp: 0,
        timeoutHandle: 0
    };

    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.respondKeydown = this.respondKeydown.bind(this);
        this.respondKeyup = this.respondKeyup.bind(this);

        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('keydown', this.respondKeydown);
        window.addEventListener('keyup', this.respondKeyup);

        const lastHighScore = localStorage.getItem('lastScore');
        this.state = {
            score: 0,
            lastHighScore: lastHighScore,
            canvas: React.createRef(),
            canvasWidth: 800,
            canvasHeight: 600
        };

        this.snake = this.getDefaultSnake();
        this.buildings = this.getRandomBuildings();
        this.apples = [];
    }

    componentDidMount() {
        this.updateWindowDimensions();

        const canvas = this.state.canvas.current;
        this.ctx = canvas.getContext('2d');

        this.textures.snakeSkin.current.onload = event =>
            this.colors.snakeSkinPattern = this.ctx.createPattern(event.target, 'repeat');

        this.textures.stone.current.onload = event =>
            this.colors.stonePattern = this.ctx.createPattern(event.target, 'repeat');

        this.startGame();
    }

    componentWillUnmount() {
        clearInterval(this.gameTimerIntervalHandle);
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener('keydown', this.respondKeydown);
        window.removeEventListener('keyup', this.respondKeyup);
    }

    updateWindowDimensions() {
        const freeHeight = window.innerHeight
            - document.getElementsByClassName('score-board')[0].clientHeight - 30
            - document.getElementsByClassName('control-board')[0].clientHeight - 30;
        const freeWidth = window.innerWidth - 20;

        const ratio43 = 1.3333;
        const currentRatio = freeWidth / freeHeight;
        if (currentRatio > ratio43) {
            this.setState({
                height: freeHeight + 'px',
                width: freeHeight * ratio43 + 'px'
            });
        } else {
            this.setState({
                height: freeWidth / ratio43 + 'px',
                width: freeWidth + 'px'
            });
        }
    }

    respondKeyup(event) {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }
        const enumKey = KeyboardKeys[event.key];
        if (enumKey === KeyboardKeys.ArrowLeft) {
            this.keyboardInput.ArrowLeftPressed = false;
        } else if (enumKey === KeyboardKeys.ArrowRight) {
            this.keyboardInput.ArrowRightPressed = false;
        }
    }

    respondKeydown(event) {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }
        const enumKey = KeyboardKeys[event.key];
        if (enumKey === KeyboardKeys.ArrowLeft) {
            this.keyboardInput.ArrowLeftPressed = true;
        } else if (enumKey === KeyboardKeys.ArrowRight) {
            this.keyboardInput.ArrowRightPressed = true;
        } else if (enumKey === KeyboardKeys.f) {
            if (this.state.showAftermath) {
                this.handleReset();
            }
        }
    }

    addTailToSnake(snake, location) {
        snake.tail.push(...getRange(8).map(_ => location));
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
            head: [this.state.canvasWidth * .5, this.state.canvasHeight - 15],
            tail: [],
            direction: Math.PI * 1.5 - 0.3
        };
        this.addTailToSnake(snake, getTranslatedLocation(snake.head, snake.direction + Math.PI, 20));
        return snake;
    }

    startGame() {
        const ctx = this.ctx;
        const canvas = this.ctx.canvas;
        let tick = 0;
        this.gameTimerIntervalHandle = setInterval(_ => {
            this.spawnApples(tick);

            this.checkCollisions(this.snake, this.apples, this.buildings);

            this.handleUserKeysInput();
            this.updateHead(tick, this.snake);
            this.updateTail(this.snake);

            clearScreen(ctx, canvas);
            drawApples(ctx, this.apples, this.textures.apple.current);
            drawSnake(ctx, this.snake, this.colors.snakeSkinPattern, this.textures.snakeHead.current);
            drawBuildings(ctx, this.buildings, this.colors.stonePattern);
            tick++;
        }, 17);
    }

    render() {
        const afterMathComponent = this.state?.showAftermath
            ? <Aftermath onClick={() => this.handleReset()}/> : null;

        return (
            <div className="screen-container"
                 onTouchMove={event => this.touchMoved(event)}>
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
                    <div className="overlap-container place-self-center"
                         style={{height: this.state.height, width: this.state.width,}}>
                        <div className="canvas-container"
                             onMouseDown={event => this.handleMousePress(event)}
                             onMouseMove={event => this.handleMouseMove(event)}>
                            <canvas ref={this.state.canvas} width={800} height={600}
                                    style={{height: this.state.height, width: this.state.width,}}/>
                        </div>

                        {afterMathComponent}
                    </div>

                    <div className="control-board">
                        <div className="info-text">
                            <div className="input-mode-keyboard">Turn using the keyboard left/right arrows, or click
                                these
                                on-screen buttons
                            </div>
                            <div className="input-mode-mobile">Turn by swiping left/right on the game screen, or press
                                these on-screen buttons
                            </div>
                        </div>
                        <button onPointerDown={() => this.keyboardInput.ArrowLeftPressed = true}
                                onPointerUp={() => this.keyboardInput.ArrowLeftPressed = false}>
                            <div>↺</div>
                        </button>
                        <button onPointerDown={() => this.keyboardInput.ArrowRightPressed = true}
                                onPointerUp={() => this.keyboardInput.ArrowRightPressed = false}>
                            <div>↻</div>
                        </button>
                    </div>
                </div>

                <div className="texture-keeper">
                    <img ref={this.textures.snakeHead} src={require('../assets/snakeHead.png')} alt="no texture"/>
                    <img ref={this.textures.snakeSkin} src={require('../assets/snakeSkin.png')} alt="no texture"/>
                    <img ref={this.textures.apple} src={require('../assets/apple.png')} alt="no texture"/>
                    <img ref={this.textures.stone} src={require('../assets/stone.png')} alt="no texture"/>
                </div>
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
        const snakeIsOutOfBounds = headX < headRadius || headX > this.state.canvasWidth - headRadius
            || headY < headRadius || headY > this.state.canvasHeight - headRadius;
        if (snakeIsOutOfBounds) {
            this.showAftermath();
        }

        const snakeHitBuilding = this.getHitBuilding(buildings, headRadius, headX, headY);
        if (snakeHitBuilding) {
            this.showAftermath();
        }

        const snakeHitTail = snake.tail.find((t, i) =>
            i > 10 && getDistance(snake.head, t) < 16);
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
        let liveApples = this.apples.filter(a => !a.isEaten);
        if (liveApples.length > 1) {
            return;
        }

        let canvasWidth = this.state.canvasWidth;
        let canvasHeight = this.state.canvasHeight;
        const mapCenter = getMultiplicationLocation([canvasWidth, canvasHeight], .5);

        let retryCount = 0;
        let appleLocation;
        while (!appleLocation) {
            let colliderRadius = 34;
            const location = [
                getRandomInt(this.state.canvasWidth - colliderRadius * 2) + colliderRadius,
                getRandomInt(this.state.canvasHeight - colliderRadius * 2) + colliderRadius
            ];
            appleLocation = (
                getDistance(location, mapCenter) > Math.max(...mapCenter)
                || this.getHitBuilding(this.buildings, colliderRadius * 1.5, ...location)
                || this.buildings
                    .filter(b => [b.slice(0, 2), b.slice(2, 4)].some((corner, i, a) =>
                        getDistance(corner, location) < getDistance(...a) * .5))
                    .length > 1
                || (this.apples.length < 100
                    && this.apples.some(a => getDistance(a.location, location) < colliderRadius))
            )
                ? undefined
                : location;

            retryCount++;
            if (retryCount > 10) {
                appleLocation = getFromEnd(this.snake.tail).slice();
            }
        }

        this.apples.push({
            id: tick,
            isEaten: false,
            location: appleLocation,
            direction: Math.random() * Math.PI * 2
        });
    }

    handleUserKeysInput() {
        if (this.keyboardInput.ArrowLeftPressed) {
            this.rotateHead(-0.049);
        } else if (this.keyboardInput.ArrowRightPressed) {
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
        snake.head = getTranslatedLocation(snake.head, snake.direction, speed);

        const lastSegments = [getFromEnd(snake.tail, 1), getFromEnd(snake.tail)];
        const tailTipDirection = getDirection(...lastSegments);
        snake.tail[snake.tail.length - 1] = getTranslatedLocation(lastSegments[1], tailTipDirection, speed);
    }

    updateTail(snake) {
        if (getDistance(snake.head, snake.tail[0]) < 10) {
            return;
        }
        snake.tail.unshift(snake.head.slice());
        snake.tail.pop();
    }

    showAftermath() {
        clearInterval(this.gameTimerIntervalHandle);
        this.setState({showAftermath: true});

        if (this.state.score > this.state.lastHighScore) {
            localStorage.setItem('lastScore', this.state.score);
        }
    }

    getRandomBuildings() {
        let canvasWidth = this.state.canvasWidth;
        let canvasHeight = this.state.canvasHeight;

        return getRange(3).map(_ => {
            let location = [getRandomInt(canvasWidth), getRandomInt(canvasHeight)];
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

            const locationInFrontOfHead = [this.snake.head[0], this.snake.head[1] - 100];
            let safeZoneRadius = 250;
            if (getDistance(location, locationInFrontOfHead) < safeZoneRadius) {
                location = getTranslatedLocation(
                    location,
                    getDirection(locationInFrontOfHead, location) + Math.PI,
                    safeZoneRadius - getDistance(location, locationInFrontOfHead)
                );
            }
            return {
                center: location,
                size: orientation
            };
        })
            .flatMap(building => {
                const oldBuilding = [
                    ...getAdditionLocations(building.center, getMultiplicationLocation(building.size, -.5)),
                    ...getAdditionLocations(building.center, getMultiplicationLocation(building.size, .5))
                ];

                let newBuilding;
                if (Math.random() > .5) {
                    const mapCenter = getMultiplicationLocation([canvasWidth, canvasHeight], .5);
                    const direction = getDirection(building.center, mapCenter);

                    if (direction < -Math.PI * .5) {
                        const botLeftCorner = getAdditionLocations(building.center,
                            [-building.size[0] * .5, building.size[1] * .5]);
                        newBuilding = this.getNewBuildingExtension(botLeftCorner, building.center);

                    } else if (direction < 0) {
                        const botRightCorner = getAdditionLocations(building.center,
                            [building.size[0] * .5, building.size[1] * .5]);
                        newBuilding = this.getNewBuildingExtension(botRightCorner, building.center);

                    } else if (direction < Math.PI * .5) {
                        const topRightCorner = getAdditionLocations(building.center,
                            [building.size[0] * .5, -building.size[1] * .5]);
                        newBuilding = this.getNewBuildingExtension(topRightCorner, building.center);

                    } else if (direction < Math.PI) {
                        const topLeftCorner = getAdditionLocations(building.center,
                            getMultiplicationLocation(building.size, -.5));
                        newBuilding = this.getNewBuildingExtension(topLeftCorner, building.center);

                    }
                }

                return newBuilding ? [oldBuilding, newBuilding] : [oldBuilding];
            });
    }

    getNewBuildingExtension(corner, buildingCenter, extensionSize = getRandomInt(75) + 113) {
        const direction = getDirection(buildingCenter, corner);
        const directionNormal = direction + Math.PI * .5 * getRandomSign();
        const newCorner = getTranslatedLocation(corner, directionNormal, extensionSize);
        return getArrangedRectangleCorners(corner, newCorner);
    }

    touchMoved(event) {
        clearTimeout(this.touchInput.timeoutHandle);

        const direction = this.touchInput.lastInputScreenX > event.touches[0].screenX
            ? Directions.Left
            : Directions.Right;

        this.keyboardInput.ArrowLeftPressed = direction === Directions.Left;
        this.keyboardInput.ArrowRightPressed = direction === Directions.Right;
        this.touchInput.lastInputScreenX = event.touches[0].screenX;

        this.touchInput.timeoutHandle = setTimeout(_ => this.keyboardInput.ArrowLeftPressed
                = this.keyboardInput.ArrowRightPressed
                = false,
            100);
    }
}
