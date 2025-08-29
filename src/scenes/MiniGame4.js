class MiniGame4 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame4' });
    }

    init() {
        // 初始化全局状态
        if (!window.gameState) window.gameState = {};
        if (!window.gameState.miniGame4) {
            window.gameState.miniGame4 = {
                selectedQuestions: [],
                currentQuestionIndex: 0
            };
        }
    }

    create() {
        // 获取题库，确保是数组
        this.questionBank = this.cache.json.get('question') || [];

        // 初始化题目列表
        if (window.gameState.miniGame4.selectedQuestions.length === 0 && this.questionBank.length > 0) {
            window.gameState.miniGame4.selectedQuestions = Phaser.Utils.Array.Shuffle(this.questionBank).slice(0, 5);
        }
        this.selectedQuestions = window.gameState.miniGame4.selectedQuestions;
        this.currentQuestionIndex = window.gameState.miniGame4.currentQuestionIndex || 0;

        // 背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background5'
        );
        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // 显示当前题目
        this.showQuestion();

        // 返回按钮
        this.addBackButton();
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            this.showCompletionDialog();
            return;
        }

        const questionData = this.selectedQuestions[this.currentQuestionIndex];

        // 销毁上一次的问题、选项和提示
        if (this.questionText) this.questionText.destroy();
        if (this.optionTexts) this.optionTexts.forEach(t => t.destroy());
        if (this.feedbackText) this.feedbackText.destroy();
        if (this.sourceText) this.sourceText.destroy();

        // source 文本，蓝色下划线，可点击
        this.sourceText = this.add.text(
            this.cameras.main.centerX,
            60,
            questionData.source || "未知来源",
            { fontSize: '18px', fill: '#00f', fontStyle: 'normal', underline: true }
        ).setOrigin(0.5).setInteractive();

        this.sourceText.on('pointerdown', () => {
            let targetScene = null;
            switch (questionData.category) {
                case "古籍": targetScene = "BookScene"; break;
                case "人物": targetScene = "PersonScene"; break;
                case "家谱": targetScene = "HomeScene"; break;
                default:
                    console.warn("未知分类，无法跳转：", questionData.category);
                    return;
            }

            // 跳转到对应场景并传递 source 参数
            this.scene.launch(targetScene, { 
                source: questionData.source, 
                fromScene: this.scene.key 
            });
            this.scene.pause(); // 暂停当前 Scene
        });

        // 问题文本
        this.questionText = this.add.text(
            this.cameras.main.centerX,
            100,
            questionData.title,
            { fontSize: '18px', fill: '#000', backgroundColor: '#fff', wordWrap: { width: 600 }, padding: { x: 10, y: 10 } }
        ).setOrigin(0.5);

        // 选项
        this.optionTexts = [];
        questionData.options.forEach((option, index) => {
            const optionText = this.add.text(
                this.cameras.main.centerX,
                200 + index * 50,
                option,
                { fontSize: '18px', fill: '#fff', backgroundColor: '#000', padding: { x: 10, y: 5 } }
            ).setOrigin(0.5).setInteractive();

            optionText.on('pointerdown', () => {
                if (this.feedbackText) this.feedbackText.destroy();

                if (option.startsWith(questionData.answer)) {
                    optionText.setBackgroundColor('#0a0');
                    this.feedbackText = this.add.text(
                        this.cameras.main.centerX,
                        400,
                        "正确！",
                        { fontSize: '30px', fill: '#0f0' }
                    ).setOrigin(0.5);

                    this.time.delayedCall(800, () => {
                        this.currentQuestionIndex++;
                        window.gameState.miniGame4.currentQuestionIndex = this.currentQuestionIndex;
                        this.showQuestion();
                    });
                } else {
                    optionText.setBackgroundColor('#a00');
                    this.feedbackText = this.add.text(
                        this.cameras.main.centerX,
                        400,
                        "错误！",
                        { fontSize: '30px', fill: '#f00' }
                    ).setOrigin(0.5);
                }
            });

            this.optionTexts.push(optionText);
        });
    }

    showCompletionDialog() {
        const dialog = new Dialog(this);
        dialog.show([
            "回答完毕！恭喜你完成了所有任务。",
            "游戏结束。"
        ], () => {
            if (!window.gameState.completedGames) window.gameState.completedGames = {};
            window.gameState.completedGames.miniGame4 = true;

            this.time.delayedCall(2000, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    addBackButton() {
        const backButton = this.add.text(50, 30, '返回', {
            fontSize: '27px',
            fill: '#fff',
            backgroundColor: '#2a3b4d',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('Scene4');
        });
    }

    // 在被其他 Scene 返回时恢复
    resumeFromOtherScene() {
        this.scene.resume();
    }
}
