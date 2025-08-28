class Dialog {
    // 静态属性，标记当前是否有对话框存在
    static isActive = false;

    constructor(scene, options = {}) {
        this.scene = scene;
        this.boxWidth = options.width || 700;
        this.boxHeight = options.height || 150;
        this.textStyle = options.textStyle || {
            fontSize: '18px',
            fill: '#fff',
            wordWrap: { width: 650 },
            lineSpacing: 8   // 行间距
        };
        this.boxColor = options.boxColor || 0x000000;  // 黑色
        this.boxAlpha = options.boxAlpha !== undefined ? options.boxAlpha : 1; // 不透明
        this.borderColor = options.borderColor || 0xffffff;  // 白色边框
        this.borderThickness = options.borderThickness || 3; // 边框粗细
    }

    show(lines, onComplete) {
        // 如果已有对话框存在，则不创建新的
        if (Dialog.isActive) return;
        Dialog.isActive = true;

        // 边框绘制
        this.border = this.scene.add.graphics();
        this.border.lineStyle(this.borderThickness, this.borderColor, 1);
        this.border.strokeRect(
            this.scene.cameras.main.centerX - this.boxWidth / 2,
            450 - this.boxHeight / 2,
            this.boxWidth,
            this.boxHeight
        );

        // 创建对话框（黑色背景）
        this.dialogBox = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            450,
            this.boxWidth,
            this.boxHeight,
            this.boxColor,
            this.boxAlpha
        );

        // 确保背景盖住边框内部（层级调整：背景置于边框下层）
        this.dialogBox.setDepth(0);
        this.border.setDepth(1);

        // 创建文本
        this.text = this.scene.add.text(
            this.scene.cameras.main.centerX,
            450 - this.boxHeight / 2 + 20,   // 对话框顶部往下 20px
            '',
            this.textStyle
        ).setOrigin(0.5,0).setDepth(2);

        this.lineIndex = 0;
        this.charIndex = 0;
        this.currentText = '\n';  // 第一行为空
        this.lines = lines;
        this.onComplete = onComplete;

        // 开始逐字显示
        this.timer = this.scene.time.addEvent({
            delay: 50,
            callback: this.typeText,
            callbackScope: this,
            loop: true
        });
    }

    typeText() {
        if (this.lineIndex < this.lines.length) {
            if (this.charIndex < this.lines[this.lineIndex].length) {
                this.currentText += this.lines[this.lineIndex][this.charIndex];
                this.text.setText(this.currentText);
                this.charIndex++;
            } else {
                this.currentText += '\n';
                this.lineIndex++;
                this.charIndex = 0;
            }
        } else {
            this.timer.remove();
            this.showContinuePrompt();
        }
    }

    showContinuePrompt() {
        this.continueText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            500,
            '点击继续',
            {
                fontSize: '16px',
                fill: '#ff0'
            }
        ).setOrigin(0.5).setInteractive().setDepth(2);

        this.continueText.on('pointerdown', () => {
            this.destroy();
            if (this.onComplete) this.onComplete();
        });
    }

    destroy() {
        if (this.border) this.border.destroy();
        if (this.dialogBox) this.dialogBox.destroy();
        if (this.text) this.text.destroy();
        if (this.continueText) this.continueText.destroy();

        // 对话框销毁后标记为 inactive
        Dialog.isActive = false;
    }
}
