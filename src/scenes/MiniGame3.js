class MiniGame3 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame3' });
    }

    create() {
        const { width, height } = this.sys.game.config;

        // 添加背景
        this.background = this.add.image(width / 2, height / 2, 'background5');
        this.background.setDisplaySize(width, height);

        // 弹出提示对话框
        const startDialog = new Dialog(this);
        startDialog.show([
            "第三关：云巅解偈",
            "请拼合悬浮的绢布碎片"
        ], () => {
            this.setupPuzzleArea();
            this.createPieces();
            this.createQuestionTip();
        });
    }

    setupPuzzleArea() {
        const { width, height } = this.sys.game.config;
        this.rows = 2;
        this.cols = 2;

        this.puzzleAreaWidth = 400;
        this.puzzleAreaHeight = 400;

        this.pieceWidth = 200;
        this.pieceHeight = 200;

        this.puzzleAreaX = width - this.puzzleAreaWidth - 50; // 右下角
        this.puzzleAreaY = height - this.puzzleAreaHeight - 50;

        // 绘制灰色方框
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

    createPieces() {
        const { width, height } = this.sys.game.config;
        this.pieces = [];

        const positions = [
            { key: 'piece1', x: 100, y: height - 400 },
            { key: 'piece2', x: 450, y: height - 400 },
            { key: 'piece3', x: 100, y: height - 100 },
            { key: 'piece4', x: 450, y: height - 100 },
        ];

        positions.forEach(pos => {
            const piece = this.add.image(pos.x, pos.y, pos.key)
                .setDisplaySize(this.pieceWidth, this.pieceHeight)
                .setInteractive({ draggable: true })
                .setData('key', pos.key)
                .setData('placed', false);

            // 目标位置绑定到灰色方框
            let targetX = this.puzzleAreaX;
            let targetY = this.puzzleAreaY;
            switch(pos.key) {
                case 'piece1': targetX += 0; targetY += 0; break;
                case 'piece2': targetX += 200; targetY += 0; break;
                case 'piece3': targetX += 0; targetY += 200; break;
                case 'piece4': targetX += 200; targetY += 200; break;
            }
            piece.setData('targetX', targetX + this.pieceWidth / 2);
            piece.setData('targetY', targetY + this.pieceHeight / 2);

            this.input.setDraggable(piece);
            this.pieces.push(piece);
        });

        // 拖拽事件
        this.input.on('drag', (pointer, piece, dragX, dragY) => {
            if (!piece.getData('placed')) {
                piece.x = dragX;
                piece.y = dragY;
            }
        });

        this.input.on('dragend', (pointer, piece) => {
            const targetX = piece.getData('targetX');
            const targetY = piece.getData('targetY');
            const dist = Phaser.Math.Distance.Between(piece.x, piece.y, targetX, targetY);
            if (dist < 20) {
                piece.x = targetX;
                piece.y = targetY;
                piece.setData('placed', true);
                this.checkPuzzleComplete();
            }
        });
    }

        createQuestionTip() {
        const { width } = this.sys.game.config;
        // 问号按钮
        const question = this.add.image(50, 50, 'question').setInteractive();
        let tipsPage = null;

        question.on('pointerdown', () => {
            // 创建容器
            tipsPage = this.add.container(100, 100);
            tipsPage.setDepth(10);

            // 背景先添加到容器中
            const bg = this.add.rectangle(0, 0, 600, 400, 0xffffff).setOrigin(0);
            bg.setStrokeStyle(2, 0x000000);
            tipsPage.add(bg);

            // 左侧图片
            const leftX = 50, leftY = 50;
            ['piece1','piece2','piece3','piece4'].forEach((key, i) => {
                const img = this.add.image(leftX, leftY + i*90, key)
                    .setDisplaySize(60,60)
                    .setOrigin(0);
                tipsPage.add(img);
            });

        // 辅助函数：每 n 个字符换行
        function splitByChars(str, n) {
            const result = [];
            for (let i = 0; i < str.length; i += n) {
                result.push(str.substr(i, n));
            }
            return result.join('\n');
        }

        const texts = [
            "\n君：方剂中针对主病或主证起主要治疗作用的药物",
            "\n臣：一是辅助君药加强治疗主病或主证；二是针对重要的兼病或兼证进行治疗",
            "\n佐：包括佐助药（协助君、臣药治疗兼证）、佐制药,（减轻或消除君、臣药的毒性或烈性）、反佐药（在病重邪甚时，为防止药物拒药而使用的与君药药性相反但能在治疗中起相成作用的药物）",
            "\n使:一是引经药，能引导方中其他药物直达病所；二是调和药，可调和方中诸药的性能，使其协同发挥作用",
        ];

        texts.forEach((textStr, i) => {
            const text = this.add.text(
                120,             // X 坐标
                50 + i * 90,    // Y 坐标，行距稍微加大
                splitByChars(textStr, 30), // 每30字符换行
                {
                    fontSize: '15px',
                    fill: '#000',
                    lineSpacing: 6
                }
            ).setOrigin(0);
            tipsPage.add(text);
        });

        });

        question.on('pointerup', () => {
            if (tipsPage) {
                tipsPage.destroy();
                tipsPage = null;
            }
        });
    }


    checkPuzzleComplete() {
        if (this.pieces.every(p => p.getData('placed'))) {
            const dialog = new Dialog(this);
            dialog.show([
                "乖孙，此方赠天下人，便是医者本心！",
                "现在请开始知识问答。"
            ], () => {
                gameState.completedGames.miniGame3 = true;
                this.scene.start('MiniGame4');
            });
        }
    }
}
