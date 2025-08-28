// 游戏配置
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000',
    scene: [BootScene, MenuScene,StartScene,Scene1, Scene2,Scene3,Scene4,Scene4Scan,Scene4AfterScan, MiniGame1, MiniGame2, MiniGame3, MiniGame4,BookScene ,PersonScene,HomeScene],
    input: {
        mouse: true,
        touch: true
    }
};

// 创建游戏实例
const game = new Phaser.Game(config);

// 全局游戏状态
window.gameState = {
    currentScene: null,
    completedGames: {
        miniGame1: false,
        miniGame2: false,
        miniGame3: false,
        miniGame4: false
    }
};