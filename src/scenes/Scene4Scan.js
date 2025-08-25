class Scene4Scan extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4Scan' });
    }

    create() {
        const { width, height } = this.sys.game.config;

        // 背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background5'
        );
        this.background.setDisplaySize(width, height);

        // 香囊图
        this.xiang = this.add.image(width/2, height/2, 'xiang').setScale(1.5);

        // 扫描线
        this.line = this.add.image(width/2, height/2 - 200, 'line')
            .setScale(0.8)
            .setAlpha(0.8);

        // 扫描线动画（上下摆动）
        this.tweens.add({
            targets: this.line,
            y: height/2 + 200,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 发光闪烁
        this.tweens.add({
            targets: this.line,
            alpha: { from: 0.3, to: 1 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        // 3 秒后结束扫描，返回 Scene4
        this.time.delayedCall(3000, () => {
            this.scene.start('Scene4AfterScan');
        });
    }
}