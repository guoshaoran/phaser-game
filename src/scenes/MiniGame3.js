class MiniGame3 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame3' });
    }

    preload() {
        // 确保拼图图片已加载
        this.load.image('background5', 'path/to/background5.png');
        this.load.image('puzzle_full', 'path/to/puzzle.png');
    }

    create() {
        const { width, height } = this.sys.game.config;

        // 添加背景
        this.background = this.add.image(width / 2, height / 2, 'background5');
        this.background.setDisplaySize(width, height);

        // 添加说明文字
        this.add.text(width / 2, 50, '完成拼图游戏', { fontSize: '32px', color: '#000' })
            .setOrigin(0.5);

        // 拼图设置
        this.rows = 2;
        this.cols = 2;

        // 拼图区域占屏幕比例
        this.puzzleAreaWidth = width * 0.5;
        this.puzzleAreaHeight = height * 0.4;

        this.pieceWidth = this.puzzleAreaWidth / this.cols;
        this.pieceHeight = this.puzzleAreaHeight / this.rows;

        this.puzzleAreaX = width / 2 - this.puzzleAreaWidth / 2;
        this.puzzleAreaY = height / 2 - this.puzzleAreaHeight / 2;

        // 绘制灰色方框
        this.drawPuzzleTargets();

        // 创建碎片
        this.createPuzzle('puzzle_full');
    }

    drawPuzzleTargets() {
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x999999);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = this.puzzleAreaX + col * this.pieceWidth + this.pieceWidth / 2;
                const y = this.puzzleAreaY + row * this.pieceHeight + this.pieceHeight / 2;
                graphics.strokeRect(
                    x - this.pieceWidth / 2,
                    y - this.pieceHeight / 2,
                    this.pieceWidth,
                    this.pieceHeight
                );
            }
        }
    }

            createPuzzle(key) {
            this.pieces = [];

            const texture = this.textures.get(key);
            if (!texture) {
                console.error('Texture not found:', key);
                return;
            }

            const img = texture.getSourceImage();
            if (!img) {
                console.error('Image source not found for key:', key);
                return;
            }

            const imgWidth = img.width;
            const imgHeight = img.height;

            // 先计算整体缩放比例，让图片铺满灰色边框区域
            const scaleX = this.puzzleAreaWidth / imgWidth;
            const scaleY = this.puzzleAreaHeight / imgHeight;

            // 将整体图片缩放到目标区域大小
            const scaledWidth = imgWidth * scaleX;
            const scaledHeight = imgHeight * scaleY;

            // 每块拼图的尺寸
            const pieceWidth = scaledWidth / this.cols;
            const pieceHeight = scaledHeight / this.rows;

            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const targetX = this.puzzleAreaX + col * pieceWidth + pieceWidth / 2;
                    const targetY = this.puzzleAreaY + row * pieceHeight + pieceHeight / 2;

                    // 随机起始位置
                    const startX = Phaser.Math.Between(50, this.sys.game.config.width - 50);
                    const startY = Phaser.Math.Between(150, this.sys.game.config.height - 50);

                    // 计算原图上对应裁剪区域
                    const cropWidth = imgWidth / this.cols;
                    const cropHeight = imgHeight / this.rows;
                    const cropX = col * cropWidth;
                    const cropY = row * cropHeight;

                    const piece = this.add.image(startX, startY, key)
                        .setDisplaySize(pieceWidth, pieceHeight) // 先按目标大小显示
                        .setCrop(cropX, cropY, cropWidth, cropHeight) // 再裁剪原图块
                        .setInteractive({ draggable: true })
                        .setData('correctX', targetX)
                        .setData('correctY', targetY)
                        .setData('placed', false);

                    this.input.setDraggable(piece);
                    this.pieces.push(piece);
                }
            }

            // 拖动事件
            this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
                if (!gameObject.getData('placed')) {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                }
            });

            this.input.on('dragend', (pointer, gameObject) => {
                const targetX = gameObject.getData('correctX');
                const targetY = gameObject.getData('correctY');
                const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, targetX, targetY);

                if (distance < 20) {
                    gameObject.x = targetX;
                    gameObject.y = targetY;
                    gameObject.setData('placed', true);
                    this.checkPuzzleComplete();
                }
            });
        }


    checkPuzzleComplete() {
        // 加保护，确保 this.pieces 是数组
        if (!Array.isArray(this.pieces) || this.pieces.length === 0) return;

        const allCorrect = this.pieces.every(piece => piece.getData('placed') === true);
        if (allCorrect) {
            if (typeof Dialog === 'undefined') {
                console.log("Puzzle completed! Dialog not found.");
                gameState.completedGames.miniGame3 = true;
                this.scene.start('MiniGame4');
                return;
            }

            const dialog = new Dialog(this);
            dialog.show([
                "乖孙，此方赠天下人，便是医者本心！",
                "现在请开始知识问答。"
            ], () => {
                this.scene.start('MiniGame4');
            });
        }
    }
}
