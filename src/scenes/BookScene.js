class BookScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BookScene' });
    }

    init(data) {
        this.source = data.source || '';
        this.fromScene = data.fromScene || 'MiniGame4';
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        // 返回按钮固定在顶部
        const backButton = this.add.text(50, 10, '返回', {
            fontSize: '27px',
            fill: '#fff',
            backgroundColor: '#2a3b4d',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start(this.fromScene, { source: this.source });
        });

        // 内容容器从按钮下方开始
        this.contentContainer = this.add.container(0, 60); // 按钮下方 60px
        this.contentStartY = 60;

        // 滚动控制变量
        this.scrollMinY = 0;
        this.scrollMaxY = 0;
        this.targetY = 0;
        this.smoothFactor = 0.1;

        // 鼠标滚轮
        this.input.on('wheel', (pointer, deltaX, deltaY) => {
            this.targetY -= deltaY;
            this.limitScroll();
        });

        // 拖动
        this.isDragging = false;
        this.dragStartY = 0;
        this.containerStartY = 0;

        this.input.on('pointerdown', pointer => {
            this.isDragging = true;
            this.dragStartY = pointer.y;
            this.containerStartY = this.targetY;
        });

        this.input.on('pointermove', pointer => {
            if (this.isDragging) {
                const delta = pointer.y - this.dragStartY;
                this.targetY = this.containerStartY + delta;
                this.limitScroll();
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        this.loadInstances(this.source);
    }


    update() {
        // 平滑滚动
        this.contentContainer.y += (this.targetY - this.contentContainer.y) * this.smoothFactor;
    }

    limitScroll() {
        if (this.targetY > this.scrollMinY) this.targetY = this.scrollMinY;
        if (this.targetY < this.scrollMaxY) this.targetY = this.scrollMaxY;
    }

    async loadInstances(freetext) {
        const key = '40ccf727947c8660e48118608057a9141efeef1f';
        try {
            const res = await fetch(
                `https://data1.library.sh.cn/gj/webapi/instances?freetext=${encodeURIComponent(freetext)}&key=${key}`
            );
            const data = await res.json();

            if (!data.data || data.data.length === 0) {
                this.addTextLine('没有找到相关文献');
                return;
            }

            data.data.forEach(item => {
                const lines = [];
                if (item.dtitle) lines.push(`标题: ${item.dtitle}`);
                if (item.edition) lines.push(`版本: ${item.edition}`);
                if (item.label) lines.push(`说明: ${item.label}`);
                if (item.temporalValue) lines.push(`时间: ${item.temporalValue}`);
                if (item.creator && item.creator.length > 0)
                    lines.push(`作者: ${item.creator.map(c => c.label).join(', ')}`);
                if (item.contributor && item.contributor.length > 0)
                    lines.push(`贡献者: ${item.contributor.map(c => c.label).join(', ')}`);

                lines.forEach(line => this.addTextLine(line));
                this.contentStartY += 20; // 文献间距
            });

            // 动态计算滚动最大值
            const camHeight = this.cameras.main.height;
            this.scrollMaxY = Math.min(0, camHeight - this.contentStartY - 60);
        } catch (err) {
            console.error('获取实例数据出错', err);
            this.addTextLine('数据加载失败');
        }
    }

    addTextLine(text) {
    const maxChars = 30;
    const lines = [];

    for (let i = 0; i < text.length; i += maxChars) {
        lines.push(text.slice(i, i + maxChars));
    }

    lines.forEach(line => {
        const txt = this.add.text(50, this.contentStartY, line, {
            fontSize: '18px',
            fill: '#000',
            align: 'left'
        });
        this.contentContainer.add(txt);
        this.contentStartY += txt.height + 4;
    });
}

}
