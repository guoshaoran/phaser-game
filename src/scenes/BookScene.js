class BookScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BookScene' });
    }

    init(data) {
        this.source = data.source || '';
    }

    create() {
        // 设置白色背景
        this.cameras.main.setBackgroundColor('#ffffff');

        // 返回按钮
        const backButton = this.add.text(50, 30, '返回', {
            fontSize: '27px',
            fill: '#fff',
            backgroundColor: '#2a3b4d',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MiniGame4'); // 回到答题场景
        });

        // 加载文献信息
        this.loadInstances(this.source);
    }

    async loadInstances(freetext) {
        const key = '40ccf727947c8660e48118608057a9141efeef1f';
        const centerX = this.cameras.main.width / 2; // 水平居中
        let startY = 100;

        try {
            const res = await fetch(`https://data1.library.sh.cn/gj/webapi/instances?freetext=${encodeURIComponent(freetext)}&key=${key}`);
            const data = await res.json();

            if (!data.data || data.data.length === 0) {
                this.add.text(centerX, startY, '没有找到相关文献', {
                    fontSize: '20px',
                    fill: '#f00',
                    wordWrap: { width: 800 },
                    align: 'center'
                }).setOrigin(0.5, 0); // 顶部对齐
                return;
            }

            data.data.forEach(item => {
                const container = [];

                if (item.dtitle) container.push(`标题: ${item.dtitle}`);
                if (item.edition) container.push(`版本: ${item.edition}`);
                if (item.label) container.push(`说明: ${item.label}`);
                if (item.temporalValue) container.push(`时间: ${item.temporalValue}`);
                if (item.creator && item.creator.length > 0) container.push(`作者: ${item.creator.map(c => c.label).join(', ')}`);
                if (item.contributor && item.contributor.length > 0) container.push(`贡献者: ${item.contributor.map(c => c.label).join(', ')}`);

                // 每条文献显示
                container.forEach(line => {
                    this.add.text(centerX, startY+10, line, {
                        fontSize: '18px',
                        fill: '#000',
                        wordWrap: { width: 800 },
                        align: 'center'
                    }).setOrigin(0.5, 0); // 顶部对齐

                    startY += 28; // 每行间距，可根据字体大小微调
                });

                startY += 20; // 每条文献间隔
            });

        } catch (err) {
            console.error('获取实例数据出错', err);
            this.add.text(centerX, startY, '数据加载失败', {
                fontSize: '20px',
                fill: '#f00',
                wordWrap: { width: 800 },
                align: 'center'
            }).setOrigin(0.5, 0); // 顶部对齐
        }
    }
}
