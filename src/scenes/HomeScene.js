class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    init(data) {
        this.source = data.source || '';
        this.fromScene = data.fromScene || 'MiniGame4';
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        // 返回按钮
        const backButton = this.add.text(50, 30, '返回', {
            fontSize: '27px',
            fill: '#fff',
            backgroundColor: '#2a3b4d',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start(this.fromScene, { source: this.source });
        });

        // 返回按钮底部坐标
        const startY = backButton.y + backButton.height + 10;

        // 创建内容容器
        this.contentContainer = this.add.container(0, 60);
        this.contentStartY = 60;

        // 滚动控制变量
        this.scrollMinY = 0;
        this.scrollMaxY = 0;
        this.targetY = 0;
        this.smoothFactor = 0.1;

        // 鼠标滚轮事件
        this.input.on('wheel', (pointer, deltaX, deltaY) => {
            this.targetY -= deltaY;
            this.limitScroll();
        });

        // 拖动滑动
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

        // 加载家谱人物
        this.loadWorkPersons(this.source);
    }

    update() {
        // 平滑滚动
        this.contentContainer.y += (this.targetY - this.contentContainer.y) * this.smoothFactor;
    }

    limitScroll() {
        if (this.targetY > this.scrollMinY) this.targetY = this.scrollMinY;
        if (this.targetY < this.scrollMaxY) this.targetY = this.scrollMaxY;
    }

    async loadWorkPersons(workName) {
        const key = "40ccf727947c8660e48118608057a9141efeef1f";
        const startX = 50; // 左对齐
        try {
            // 获取作品相关人物 URI 列表
            const workRes = await fetch(
                `https://data1.library.sh.cn/jp/work/data?${encodeURIComponent(workName)}&key=${key}`
            );
            const Data = await workRes.json();
            const workData = Data["@graph"];

            if (!workData || workData.length === 0) {
                this.addTextLine(`未找到《${workName}》相关人物`);
                return;
            }

            // 标题
            this.addTextLine(`《${workName}》相关人物(100人)：`, 22, '#000');

            // 遍历人物
            for (let item of workData.slice(0, 100)) {
                const personUri = item["@id"];
                if (!personUri) continue;

                try {
                    const detailRes = await fetch(
                        `https://data1.library.sh.cn/shnh/wkl/webapi/persons/detail?uri=${encodeURIComponent(personUri)}&key=${key}`
                    );
                    const detailData = await detailRes.json();

                    if (detailData && detailData.data && detailData.data.chs_name) {
                        this.addTextLine(detailData.data.chs_name, 18, '#000');
                    }
                } catch (err) {
                    console.error("获取人物详情出错:", err);
                    this.addTextLine('人物详情加载失败', 18, '#f00');
                }
            }

            // 计算滚动最大值
            const camHeight = this.cameras.main.height;
            this.scrollMaxY = Math.min(0, camHeight - this.contentStartY - 60);

        } catch (err) {
            console.error("获取作品数据出错:", err);
            this.addTextLine('作品数据加载失败', 20, '#f00');
        }
    }

    // 添加左对齐文本到容器
        addTextLine(text, fontSize = 18, color = '#000') {
            const maxChars = 30;
            const lines = [];

            for (let i = 0; i < text.length; i += maxChars) {
                lines.push(text.slice(i, i + maxChars));
            }

            lines.forEach(line => {
                const txt = this.add.text(50, this.contentStartY, line, {
                    fontSize: `${fontSize}px`,
                    fill: color,
                    align: 'left'
                });
                this.contentContainer.add(txt);
                this.contentStartY += txt.height + 4;
            });

            // 更新滚动最大值
            const camHeight = this.cameras.main.height;
            this.scrollMaxY = Math.min(0, camHeight - this.contentStartY - this.contentContainer.y);
        }

}
