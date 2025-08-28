class MiniGame1 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame1' });
        this.clickedItems = 0;
        this.totalItems = 3; // 只需要找到三味药材
        this.collectedYao = {}; // 记录已收集的药材
    }

    create() {
        const { width, height } = this.sys.game.config;

        // 添加背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'game1'
        );
        this.background.setDisplaySize(width, height);

        // 添加香囊 (收集的目标位置)
        this.xiang = this.add.image(
            this.cameras.main.centerX,
            height - 100,
            'xiang'
        ).setScale(1.5);

        // 先弹出提示对话框
        const startDialog = new Dialog(this);
        startDialog.show([
            "第一关：豫园寻药",
            "请点击闪烁的抽屉，找到蟾酥片、珍珠粉和薄荷叶。"
        ], () => {
            // 对话结束后才开始创建物品
            this.createItems();
        });
    }

    createItems() {
        const positions = [
            { x: 200, y: 320 }, // 第1个抽屉
            { x: 380, y: 280 }, // 第2个抽屉
            { x: 550, y: 260 }, // 第3个抽屉
            { x: 200, y: 500 }, 
            { x: 380, y: 450 }, 
            { x: 550, y: 400 },
        ];

        this.items = [];

        positions.forEach((pos, index) => {
            const item = this.add.image(pos.x, pos.y, 'item').setInteractive();
            item.setData('index', index + 1);

            // 添加发光效果
            this.tweens.add({
                targets: item,
                alpha: { from: 0.3, to: 1 },
                duration: 600,
                yoyo: true,
                repeat: -1
            });

            // 物品点击事件
            item.on('pointerdown', () => {
                this.handleItemClick(item);
            });

            this.items.push(item);
        });
    }

    handleItemClick(item) {
        const index = item.getData('index');
        item.disableInteractive();
        item.setTint(0xffffff);
        this.tweens.killTweensOf(item);

        let dialogText = [];
        let yaoKey = null; // 药材 key

        if (index === 1) {
            dialogText = [
                "“这就是‘一两切三百六十片’的雷允上绝技？",
                "薄如蝉翼，透光可见，果然是上好的蟾酥片！”"
            ];
            yaoKey = 'yao1';
        } else if (index === 2) {
            dialogText = [
                "“松江珠母贝磨制的珍珠粉，莹白生光，",
                "明代就是贡品，名不虚传。”"
            ];
            yaoKey = 'yao2';
        } else if (index === 3) {
            dialogText = [
                "“崇明湿地的薄荷，这浓郁的辛凉之气，",
                "挥发油含量果然冠绝全国。”"
            ];
            yaoKey = 'yao3';
        } else {
            dialogText = [
                " “这里似乎没有什么特别的东西。”"
            ];
        }

        // 弹出对白
        const dialog = new Dialog(this);
        dialog.show(dialogText, () => {
            if (yaoKey) {
                this.clickedItems++;
                this.spawnYao(yaoKey, item.x, item.y);
            }

            // 如果三味药材都找齐了
            if (this.clickedItems >= this.totalItems) {
                // 让香囊发光
                this.tweens.add({
                    targets: this.xiang,
                    alpha: { from: 0.5, to: 1 },
                    scale: { from: 1.5, to: 1.8 },
                    duration: 600,
                    yoyo: true,
                    repeat: -1
                });

                // 延迟 1 秒再生成书
                this.time.delayedCall(1000, () => {
                    const book = this.add.image(
                        this.cameras.main.centerX,
                        this.cameras.main.centerY - 100,
                        'book'
                    ).setScale(1.2);

                    // 给书一个小的淡入动画
                    book.setAlpha(0);
                    this.tweens.add({
                        targets: book,
                        alpha: 1,
                        scale: { from: 0.5, to: 1.2 },
                        duration: 800,
                        ease: 'Back.Out',
                        onComplete: () => {
                            // 书出现后再弹出对白
                            const completeDialog = new Dialog(this);
                            completeDialog.show([
                                " “‘龙华古寺，香随佛音’…下一站，是龙华寺！”"
                            ], () => {
                                gameState.completedGames.miniGame1 = true;
                                this.scene.start('Scene3');
                            });
                        }
                    });
                });
            }
        });
    }

    spawnYao(yaoKey, startX, startY) {
        // 在点击位置生成药材
        const yao = this.add.image(startX, startY, yaoKey).setScale(1.2);

        // 移动到香囊位置，并闪烁
        this.tweens.add({
            targets: yao,
            x: this.xiang.x,
            y: this.xiang.y,
            duration: 1000,
            onComplete: () => {
                this.tweens.add({
                    targets: yao,
                    alpha: { from: 0.5, to: 1 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // 记录到已收集药材
        this.collectedYao[yaoKey] = yao;
    }

}
