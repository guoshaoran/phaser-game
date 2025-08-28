class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }
    
    create() {
        const { width, height } = this.sys.game.config;

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

        // 添加背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background1'
        );
        this.background.setDisplaySize(width, height);

        // 添加书本
        this.book = this.add.image(387, 200, 'book')
            .setScale(1)
            .setInteractive();

        // 书本悬停效果
        this.book.on('pointerover', () => {
            this.book.setScale(0.55);
            this.book.setTint(0xffffaa);
        });
        this.book.on('pointerout', () => {
            this.book.setScale(1);
            this.book.clearTint();
        });
        
        // =========================
        // 第一个对话框（进入场景时出现）
        // =========================
        const firstDialog = new Dialog(this);
        firstDialog.show([
            "小杏，豫园药柜第三屉，有祖父未配完的香囊方。",
            "若逢疫情再起，望汝续此薪火…"
        ], () => {
            // 第一个对话框结束后，在屏幕上方显示提示文字
            this.tipText = this.add.text(
                width / 2,
                50,
                '点击书本',
                { fontSize: '20px', fill: '#fff', backgroundColor: '#000' }
            ).setOrigin(0.5);
        });

        // =========================
        // 书本点击事件
        // =========================
        this.book.on('pointerdown', () => {
            // 点击后提示文字消失
            if (this.tipText) {
                this.tipText.destroy();
            }

            // 出现第二个对话框
            const secondDialog = new Dialog(this);
            secondDialog.show([
                "这是…曾祖父的手迹？",
                "‘龙华麝香，崇明薄荷，松江珍珠’…后面的字都模糊了。",
                "薪火相传…我一定能找到完整的秘方！"
            ], () => {
                // 对话框结束后切换场景
                this.rainSound.stop();
                this.thunderSound.stop();
                this.scene.start('Scene2');
            });
        });
    }
}
