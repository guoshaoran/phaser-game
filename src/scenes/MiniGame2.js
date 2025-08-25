class MiniGame2 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame2' });
        this.collectedItems = 0; // 已正确放入的物品数
    }
    
    create() {
        const { width, height } = this.sys.game.config;

        // 添加背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'game2'
        );
        this.background.setDisplaySize(width, height);

        // 添加说明
        this.add.text(
            this.cameras.main.centerX, 
            50, 
            '拖动物品到指定位置', 
            { fontSize: '24px', fill: '#fff' }
        ).setOrigin(0.5);
        
        // 创建可拖动物品（分别保存，不要覆盖）
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
            if (item.texture.key !== 'item1') {   // 除了 item1，其它都发光
                item.setTint(0xffff00); // 设置发光颜色
                this.tweens.add({
                    targets: item,
                    alpha: { from: 0.6, to: 1 },  // 闪烁效果
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // 统一设置可拖拽
        this.input.setDraggable([this.item1, this.item2, this.item3, this.item4]);
        
        // 创建目标区域
        this.targetZone = this.add.rectangle(700, 300, 120, 120, 0x00ff00, 0.3);
        this.add.text(700, 300, '目标区域', { fontSize: '14px', fill: '#000' }).setOrigin(0.5);
        
        // 拖拽功能
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        // 拖拽结束检查
        this.input.on('dragend', (pointer, gameObject) => {
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

                    if (this.collectedItems < 3) {
            
                        
                    } else {
                        // 三个真药材齐全后
                        const dialog = new Dialog(this);
                        dialog.show([
                            "真麝香金粟细孔，崇明薄荷清气上扬，",
                            "还有这枚盖着‘沪产橘’印的十年陈皮…齐了！"
                        ], () => {
                            // 显示书本图片
                            const xiang = this.add.image(
                                this.cameras.main.centerX,
                                this.cameras.main.centerY,
                                'xiang'
                            ).setScale(1.2);
                            xiang.setDepth(5);

                           xiang.setAlpha(0);
                                            this.tweens.add({
                                                targets: xiang,
                                                alpha: 1,
                                                duration: 800
                                            });

                            const finalDialog = new Dialog(this);
                            finalDialog.show([
                                "“半偈重圆，在云巅”？",
                                "云巅…是指哪里？"
                            ], () => {
                                gameState.completedGames.miniGame2 = true;
                                this.scene.start('Scene4');
                            });
                        });
                    }
                }
            } else {
                // 如果拖到目标区域外，物品回到原位
                gameObject.x = gameObject.originalPos.x;
                gameObject.y = gameObject.originalPos.y;
            }
        });
        
        // 添加返回按钮
        this.addBackButton();
    }
    
    addBackButton() {
        const backButton = this.add.text(50, 30, '返回', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#2a3b4d',
            padding: { x: 10, y: 5 }
        }).setInteractive();
        
        backButton.on('pointerdown', () => {
            this.scene.start('Scene2');
        });
    }
}
