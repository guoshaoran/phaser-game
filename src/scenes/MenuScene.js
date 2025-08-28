class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // 设置黑色背景
        this.cameras.main.setBackgroundColor('#000000');


        // 添加开始文字
        this.startText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '点击开始游戏',
            {
                fontSize: '32px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 4
            }
        ).setOrigin(0.5,0).setInteractive();

        // 添加点击事件
        this.startText.on('pointerdown', () => {

            this.scene.start('StartScene');
        });

        // 添加标题
        this.add.text(
            this.cameras.main.centerX,
            100+10,
            '杏林寻宝',
            {
                fontSize: '48px',
                fill: '#fff',
                stroke: '#2a3b4d',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
    }
}