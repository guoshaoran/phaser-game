class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // 设置黑色背景
        this.cameras.main.setBackgroundColor('#000000');
        
        // 播放雨声和雷声
        this.rainSound = this.sound.add('rain', { loop: true, volume: 0.7 });
        this.thunderSound = this.sound.add('thunder', { volume: 0.8 });
        this.rainSound.play();
        
        // 雷声延迟播放
        this.time.delayedCall(1500, () => {
            this.thunderSound.play();
            
            // 添加闪电效果
            this.flash = this.add.rectangle(0, 0, 800, 600, 0xffffff, 0.8);
            this.flash.setOrigin(0);
            this.tweens.add({
                targets: this.flash,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.flash.destroy();
                }
            });
        });
        
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
        ).setOrigin(0.5).setInteractive();
        
        // 添加点击事件
        this.startText.on('pointerdown', () => {
            this.rainSound.stop();
            this.scene.start('Scene1');
        });
        
        // 添加标题
        this.add.text(
            this.cameras.main.centerX,
            100,
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