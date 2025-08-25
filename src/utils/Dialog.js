class Dialog {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.boxWidth = options.width || 700;
        this.boxHeight = options.height || 150;
        this.textStyle = options.textStyle || {
            fontSize: '18px',
            fill: '#fff',
            wordWrap: { width: 650 }
        };
        this.boxColor = options.boxColor || 0x000000;
        this.boxAlpha = options.boxAlpha || 0.7;
    }
    
    show(lines, onComplete) {
        // 创建对话框
        this.dialogBox = this.scene.add.rectangle(
            this.scene.cameras.main.centerX, 
            450, 
            this.boxWidth, 
            this.boxHeight, 
            this.boxColor, 
            this.boxAlpha
        );
        
        // 创建文本
        this.text = this.scene.add.text(
            this.scene.cameras.main.centerX, 
            430, 
            '', 
            this.textStyle
        ).setOrigin(0.5);
        
        this.lineIndex = 0;
        this.charIndex = 0;
        this.currentText = '';
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
        ).setOrigin(0.5).setInteractive();
        
        this.continueText.on('pointerdown', () => {
            this.destroy();
            if (this.onComplete) {
                this.onComplete();
            }
        });
    }
    
    destroy() {
        if (this.dialogBox) this.dialogBox.destroy();
        if (this.text) this.text.destroy();
        if (this.continueText) this.continueText.destroy();
    }
}