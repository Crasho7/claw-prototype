import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Claw Machine',
    description: '',
    parent: 'game-container',
    width: 430,
    height: 932,
    backgroundColor: '#000000',
    physics:{
        default: 'arcade',
        arcade:{
            gravity: { y : 0 },
            debug: false
        }
    },
    pixelArt: false,
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            