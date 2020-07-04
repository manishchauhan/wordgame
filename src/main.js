let config = {
    type: Phaser.AUTO,
    width: window.innerWidth ,
    height: window.innerHeight ,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [wordGame],
   
};
let game = new Phaser.Game(config);
