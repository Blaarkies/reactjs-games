import * as React from 'react';
import './style.scss'
import {KeyboardKeys} from "../common/enums";
import {getDirection, getDistance, getFromEnd, getRandomInt, getRange} from "../common/utilities";

export class LimblessLizardGame extends React.Component {

    canvas = React.createRef();
    snakeHeadTexture = React.createRef();
    intervalHandle;
    snake = {
        head: [400, 600 - 50],
        tail: [],
        direction: Math.PI * 1.5
    };
    apples = [];
    buildings = [
        [150, 100, 200, 300],
        [500, 400, 700, 450]
    ];

    constructor(props) {
        super(props);

        window.addEventListener("keydown", event => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            this.handleKeyPress(event);
        });
        this.addTailToSnake(this.getMovedSegment(this.snake.head, this.snake.direction + Math.PI, 20));
        // this.state = {...this.getNewGameState()};
    }

    addTailToSnake(location) {
        this.snake.tail.push(...getRange(15).map(_ => location));
    }

    getNewGameState() {
        return {};
    }

    handleResetClick() {
        // this.setState({slideState: SlideStates.backwardSlide});
    }

    componentDidMount() {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");

        let tick = 0;
        this.intervalHandle = setInterval(_ => {
            this.spawnApples(tick);

            this.checkCollisions(this.snake, this.apples, this.buildings);

            this.updateHead(tick, this.snake);
            this.updateTail(this.snake);

            this.clearScreen(ctx, canvas);

            this.drawApples(ctx, this.apples);
            this.drawSnake(ctx, this.snake);
            this.drawBuildings(ctx, this.buildings);
            tick++;
        }, 33);
    }

    componentWillUnmount() {
        clearInterval(this.intervalHandle);
    }

    render() {
        return (
            <div className="screen-container">
                <div className="game-container">
                    <div className="status-text">Limbless Lizard Game</div>
                    <div className="canvas-container"
                         onMouseDown={event => this.handleMousePress(event)}
                         onMouseMove={event => this.handleMouseMove(event)}>
                        <canvas ref={this.canvas} width={800} height={600}/>
                        <img ref={this.snakeHeadTexture}
                             src={require('../assets/snakeHead.png')}
                             className="snake-head-texture-keeper"/>
                    </div>
                </div>
            </div>
        );
    }

    checkCollisions(snake, apples, buildings) {
        const appleEaten = apples.filter(a => !a.isEaten).find(apple => getDistance(snake.head, apple.location) < 20);
        if (appleEaten) {
            appleEaten.isEaten = true;

            this.addTailToSnake(snake.tail[snake.tail.length - 1]);
        }

        let headRadius = 10;
        let headX = snake.head[0];
        let headY = snake.head[1];
        const snakeIsOutOfBounds = headX < headRadius || headX > 800 - headRadius
            || headY < headRadius || headY > 600 - headRadius;
        if (snakeIsOutOfBounds) {
            clearInterval(this.intervalHandle);
        }

        const snakeHitBuilding = this.getHitBuilding(buildings, headRadius, headX, headY);
        if (snakeHitBuilding) {
            clearInterval(this.intervalHandle);
        }

        const snakeHitTail = snake.tail.slice(1).find(t =>
            getDistance(snake.head, t) < 16
        );
        if (snakeHitTail) {
            clearInterval(this.intervalHandle);
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
            let colliderRadius = 20;
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

    handleKeyPress(event) {
        switch (KeyboardKeys[event.key]) {
            case KeyboardKeys.ArrowUp:
                break;
            case KeyboardKeys.ArrowDown:
                break;
            case KeyboardKeys.ArrowLeft:
                this.rotateHead(-0.1);
                break;
            case KeyboardKeys.ArrowRight:
                this.rotateHead(+0.1);
                break;
            default:
                break;
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
        const speed = 3;

        const amplitude = 0.05;
        const timePeriod = 0.2;
        const signal = Math.sin(tick * timePeriod) * amplitude;
        snake.direction += signal;
        snake.head = this.getMovedSegment(snake.head, snake.direction, speed);

        const lastSegments = [getFromEnd(snake.tail, 1), getFromEnd(snake.tail)];
        const tailTipDirection = getDirection(...lastSegments);
        snake.tail[snake.tail.length - 1] = this.getMovedSegment(lastSegments[1], tailTipDirection, speed);
    }

    getMovedSegment(segment, direction, speed) {
        const x = segment[0];
        const y = segment[1];
        return [x + Math.cos(direction) * speed, y + Math.sin(direction) * speed];
    }

    updateTail(snake) {
        if (getDistance(snake.head, snake.tail[0]) < 20) {
            return;
        }
        snake.tail.unshift(this.getMovedSegment(snake.head, snake.direction + Math.PI, 20));
        snake.tail.pop();
    }

    drawSnake(ctx, snake) {
        const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 300);
        gradient.addColorStop(0, '#141');
        gradient.addColorStop(0.5, '#161');
        gradient.addColorStop(1.0, '#343');

        ctx.strokeStyle = gradient;
        ctx.lineCap = "round";
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(...snake.head);
        snake.tail.forEach(t => ctx.lineTo(...t));
        ctx.stroke();

        const angle = -Math.PI * 0.5 + snake.direction;
        let headTexture = this.snakeHeadTexture.current;
        const headSize = [30, 45];
        ctx.save();
        ctx.translate(...snake.head);
        ctx.rotate(angle);
        ctx.translate(-headSize[0] * 0.5, -headSize[1] * 0.5);
        ctx.drawImage(headTexture, 0, 0, 140, 212, 0, 0, ...headSize);
        ctx.restore();
    }

    clearScreen(ctx, canvas) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawApples(ctx, apples) {
        ctx.strokeStyle = '#911';
        ctx.lineWidth = 8;

        apples.filter(a => !a.isEaten)
            .forEach(a => {
                ctx.beginPath();
                ctx.arc(...a.location, 6, 0, 2 * Math.PI);
                ctx.stroke();
            });
    }

    drawBuildings(ctx, buildings) {
        ctx.fillStyle = '#ABC';

        buildings.forEach(b => {
            ctx.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
        });
    }
}
