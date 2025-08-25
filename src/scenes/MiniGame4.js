class MiniGame4 extends Phaser.Scene {
    constructor() {
        super({ key: 'MiniGame4' });
    }


    create() {
        // 获取题库
        this.questionBank = this.cache.json.get('questionBank');

        // 随机选取5道题
        this.selectedQuestions = Phaser.Utils.Array.Shuffle(this.questionBank).slice(0, 5);
        this.currentQuestionIndex = 0;

        // 背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background5'
        );
        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // 显示第一题
        this.showQuestion();

        // 添加返回按钮
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

        // 问题
        this.questionText = this.add.text(
            this.cameras.main.centerX,
            100,
            questionData.question,
            { fontSize: '20px', fill: '#fff', wordWrap: { width: 600 } }
        ).setOrigin(0.5);

        // 选项
        this.optionTexts = [];
        questionData.options.forEach((option, index) => {
            const optionText = this.add.text(
                this.cameras.main.centerX,
                180 + index * 40,
                option.text,
                { fontSize: '18px', fill: '#fff', backgroundColor: '#2a3b4d', padding: { x: 10, y: 5 } }
            ).setOrigin(0.5).setInteractive();

            optionText.on('pointerdown', () => {
                // 销毁之前的反馈提示
                if (this.feedbackText) this.feedbackText.destroy();

                if (option.correct) {
                    optionText.setBackgroundColor('#0a0'); // 绿色
                    this.feedbackText = this.add.text(
                        this.cameras.main.centerX,
                        350,
                        "正确！",
                        { fontSize: '22px', fill: '#0f0' }
                    ).setOrigin(0.5);

                    this.time.delayedCall(800, () => {
                        this.currentQuestionIndex++;
                        this.showQuestion();
                    });
                } else {
                    optionText.setBackgroundColor('#a00'); // 红色
                    this.feedbackText = this.add.text(
                        this.cameras.main.centerX,
                        350,
                        "错误！",
                        { fontSize: '22px', fill: '#f00' }
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
            if (!window.gameState) window.gameState = {};
            if (!window.gameState.completedGames) window.gameState.completedGames = {};
            window.gameState.completedGames.miniGame4 = true;

            this.time.delayedCall(2000, () => {
                this.scene.start('MenuScene');
            });
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
