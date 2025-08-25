class MiniGame1 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame1' });
        this.clickedItems = 0;
        this.totalItems = 3; // 只需要找到三味药材
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

        // 添加发光物品
        this.createItems();
        
        // 添加返回按钮
        this.addBackButton();
    }
    
    createItems() {
        const positions = [
            { x: 200, y: 320 }, // 第1个抽屉
            { x: 380, y: 280 }, // 第2个抽屉
            { x: 550, y: 260 }, // 第3个抽屉
            { x: 200, y: 500 }, // 其他抽屉（假设）
            { x: 380, y: 450 }, // ...
            { x: 550, y: 400 },
        ];
        
        this.items = [];
        
        positions.forEach((pos, index) => {
            const item = this.add.image(pos.x, pos.y, 'item').setInteractive();
            item.setData('index', index + 1); // index 从 1 开始，代表第几个抽屉
            
            // 添加发光效果
           this.tweens.add({
            targets: item,
            alpha: { from: 0.3, to: 1 },  // 从更暗到最亮
            duration: 600,                // 更快闪烁
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
        const index = item.getData('index'); // 第几个抽屉

        item.disableInteractive();
        item.setTint(0xffffff);
        this.tweens.killTweensOf(item);

        let dialogText = [];

        // 根据点击的抽屉不同，显示不同对白
        if (index === 1) {
            dialogText = [
                "“这就是‘一两切三百六十片’的雷允上绝技？",
                "薄如蝉翼，透光可见，果然是上好的蟾酥片！”"
            ];
            this.clickedItems++;
        } else if (index === 2) {
            dialogText = [
                "“松江珠母贝磨制的珍珠粉，莹白生光，",
                "明代就是贡品，名不虚传。”"
            ];
            this.clickedItems++;
        } else if (index === 3) {
            dialogText = [
                "“崇明湿地的薄荷，这浓郁的辛凉之气，",
                "挥发油含量果然冠绝全国。”"
            ];
            this.clickedItems++;
        } else {
            dialogText = [
                " “这里似乎没有什么特别的东西。”"
            ];
        }

        // 弹出对白对话框
        const dialog = new Dialog(this);
        dialog.show(dialogText, () => {
            // 如果三味药材都找齐了
            if (this.clickedItems >= this.totalItems) {
                 // 在场景中央显示一本 book 图片
                const book = this.add.image(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    'book'
                ).setScale(2.8);

                // 渐显动画，让书出现更自然
                book.setAlpha(0);
                this.tweens.add({
                    targets: book,
                    alpha: 1,
                    duration: 800
                });
                const completeDialog = new Dialog(this);
                completeDialog.show([
                    " “‘龙华古寺，香随佛音’…下一站，是龙华寺！”"
                ], () => {
                    gameState.completedGames.miniGame1 = true;
                    this.scene.start('Scene3');
                });
            }
        });
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
