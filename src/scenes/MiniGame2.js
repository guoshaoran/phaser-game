class MiniGame2 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame2' });
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.zhong = this.sound.add('zhong', { loop: true, volume: 0.7 });

        // 初始化游戏状态
        if (!window.gameState) window.gameState = {};
        if (!gameState.completedGames) gameState.completedGames = {};
        this.collectedItems = 0;

        // 添加背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'game2'
        ).setDisplaySize(width, height);

        // 弹出提示对话框
        const startDialog = new Dialog(this);
        startDialog.show([
            "第二关：古寺试香",
            "请将真麝香、鲜薄荷、十年陈皮拖动到指定区域"
        ], () => {
            // 对话框结束后再创建说明文字、物品、目标区域等
            this.add.text(
                this.cameras.main.centerX,
                50,
                '拖动物品到指定位置',
                { fontSize: '24px', fill: '#fff' }
            ).setOrigin(0.5);

            // 创建可拖动物品
            this.item1 = this.add.image(100, 300, 'item1').setInteractive();
            this.item2 = this.add.image(250, 300, 'item2').setInteractive();
            this.item3 = this.add.image(100, 500, 'item3').setInteractive();
            this.item4 = this.add.image(250, 500, 'item4').setInteractive();

            // 记录原始位置
            [this.item1, this.item2, this.item3, this.item4].forEach(item => {
                item.originalPos = { x: item.x, y: item.y };
            });

            // 设置发光效果（除了 item1）
            [this.item1, this.item2, this.item3, this.item4].forEach(item => {
                if (item.texture.key !== 'item1') {
                    item.setTint(0xffff00); // 发光颜色
                    this.tweens.add({
                        targets: item,
                        alpha: { from: 0.6, to: 1 },
                        duration: 500,
                        yoyo: true,
                        repeat: -1
                    });
                }
            });

            // 设置可拖拽
            this.input.setDraggable([this.item1, this.item2, this.item3, this.item4]);

            // 创建目标区域
            this.targetZone = this.add.rectangle(700, 300, 120, 120, 0x00ff00, 0.3);
            this.add.text(700, 300, '目标区域', { fontSize: '14px', fill: '#000' }).setOrigin(0.5);

            // 拖拽事件
            this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
            });

            this.input.on('dragend', this.handleDragEnd, this);

        });
    }

    handleDragEnd(pointer, gameObject) {
        if (Phaser.Geom.Rectangle.Overlaps(
            gameObject.getBounds(),
            this.targetZone.getBounds()
        )) {
            // === item1：假药，弹回去 ===
            if (gameObject === this.item1) {
                gameObject.x = gameObject.originalPos.x;
                gameObject.y = gameObject.originalPos.y;

                const dialog = new Dialog(this);
                dialog.show([
                    "当心！《本草通玄·卷三》早有警示：",
                    "伪麝香多掺木屑，气味刺鼻不均，绝不可用！"
                ]);
            }
            // === 其他真药：吸附 ===
            else {
                gameObject.x = this.targetZone.x;
                gameObject.y = this.targetZone.y;
                gameObject.disableInteractive();

                this.collectedItems++;

                if (this.collectedItems >= 3) {
                    // 三个真药材齐全后
                    const dialog = new Dialog(this);
                    dialog.show([
                        "真麝香金粟细孔，崇明薄荷清气上扬，",
                        "还有这枚盖着‘沪产橘’印的十年陈皮…齐了！"
                    ], () => {
                        // 显示香囊
                        const xiang = this.add.image(
                            this.cameras.main.centerX,
                            this.cameras.main.centerY,
                            'xiang'
                        ).setScale(1.2).setDepth(5).setAlpha(0);

                        this.tweens.add({
                            targets: xiang,
                            alpha: 1,
                            duration: 800
                        });
                        // 播放音效
                        this.zhong.play();

                        const finalDialog = new Dialog(this);
                        finalDialog.show([
                            "“半偈重圆，在云巅”？",
                            "云巅…是指哪里？"
                        ], () => {
                            gameState.completedGames.miniGame2 = true;
                            this.zhong.stop();
                            this.scene.start('Scene4');
                        });
                    });
                }
            }
        } else {
            // 拖到目标区域外回到原位
            gameObject.x = gameObject.originalPos.x;
            gameObject.y = gameObject.originalPos.y;
        }
    }

}
