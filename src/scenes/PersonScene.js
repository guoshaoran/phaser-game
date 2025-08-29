class PersonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PersonScene' });
    }

    init(data) {
        this.source = data.source || ''; // 人物姓名
    }

create() {
    // 白色背景
    this.cameras.main.setBackgroundColor('#ffffff');

    // 返回按钮
    const backButton = this.add.text(50, 10, '返回', {
        fontSize: '27px',
        fill: '#fff',
        backgroundColor: '#2a3b4d',
        padding: { x: 10, y: 5 }
    }).setInteractive();

    backButton.on('pointerdown', () => {
        this.scene.start('MiniGame4');
    });

    // 返回按钮高度，用于确定内容开始位置
    const backButtonBottom = backButton.y + backButton.height + 10; // 10px 间距

    // 创建内容容器，从返回按钮下方开始
    this.contentContainer = this.add.container(0, backButtonBottom);
    this.contentStartY = 60; // 容器内部的 Y 起点

    // 滚动控制
    this.scrollMinY = 0;
    this.scrollMaxY = 0;
    this.targetY = 0;
    this.smoothFactor = 0.1;

    // 鼠标滚轮滚动
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

    // 加载人物信息
    this.loadAndRenderPerson(this.source);
}


    update() {
        // 平滑滚动
        this.contentContainer.y += (this.targetY - this.contentContainer.y) * this.smoothFactor;
    }

    limitScroll() {
        if (this.targetY > this.scrollMinY) this.targetY = this.scrollMinY;
        if (this.targetY < this.scrollMaxY) this.targetY = this.scrollMaxY;
    }

    async loadAndRenderPerson(name) {
        const key = '40ccf727947c8660e48118608057a9141efeef1f';
        const startX = 50;

        let uri = null;
        try {
            const searchRes = await fetch(`https://data1.library.sh.cn/persons/data?fname=${encodeURIComponent(name)}&key=${key}`);
            const searchData = await searchRes.json();
            if (searchData.result == 0 && searchData.data.length > 0) {
                uri = searchData.data[0].uri;
            } else {
                this.addTextLine('未找到人物 URI');
                return;
            }
        } catch (err) {
            console.error('获取 URI 出错', err);
            this.addTextLine('获取 URI 出错');
            return;
        }

        let person = null;
        try {
            const detailRes = await fetch(`https://data1.library.sh.cn/shnh/wkl/webapi/persons/detail?uri=${encodeURIComponent(uri)}&key=${key}`);
            const detailData = await detailRes.json();
            if (detailData.result == 0) {
                person = detailData.data;
            } else {
                this.addTextLine('人物详情为空');
                return;
            }
        } catch (err) {
            console.error('获取人物详情出错', err);
            this.addTextLine('获取人物详情出错');
            return;
        }

        // 添加字段
        const addField = (label, value) => {
            if (!value) return;
            if (Array.isArray(value)) value = value.join(', ');
            this.addTextLine(`${label}: ${value}`);
        };

        addField('姓名', person.chs_name);
        addField('英文名', person.en_name);
        addField('异名', person.name?.map(n => n.label));
        addField('出生年', person.birthday);
        addField('死亡年', person.deathday);
        addField('籍贯', person.nativePlace);
        addField('职业', person.speciality);
        addField('朝代', person.temporal);
        addField('性别', person.gender);
        addField('民族', person.ethnicity);

        if (person.createdWork) {
            const works = Array.isArray(person.createdWork) ? person.createdWork.join(', ') : person.createdWork;
            addField('作品', works);
        }

        if (person.officialEvent && person.officialEvent.length > 0) {
            const positions = person.officialEvent.map(p => p.officialPosition).join(', ');
            addField('职衔', positions);
        }

        if (person.friendOf && person.friendOf.length > 0) {
            const friends = person.friendOf.map(f => f.name).join(', ');
            addField('友人', friends);
        }

        if (person.spouseOf && person.spouseOf.length > 0) {
            const spouses = person.spouseOf.map(s => s.name).join(', ');
            addField('配偶', spouses);
        }

        // 渲染图片
        if (person.img) {
            this.load.image('personImg', person.img);
            this.load.once('complete', () => {
                const img = this.add.image(this.cameras.main.width / 2, this.contentStartY, 'personImg');
                img.setDisplaySize(200, 200);
                img.setOrigin(0.5, 0);
                this.contentStartY += 200 + 10;
                // 更新滚动最大值
                const camHeight = this.cameras.main.height;
                this.scrollMaxY = Math.min(0, camHeight - this.contentStartY - 60);
            });
            this.load.start();
        } else {
            // 更新滚动最大值
            const camHeight = this.cameras.main.height;
            this.scrollMaxY = Math.min(0, camHeight - this.contentStartY - 60);
        }
    }

        // 按字符数换行，不依赖字体宽度
    addTextLine(text, fontSize = 18, color = '#000', charsPerLine = 30) {
        // 手动拆分文本
        const lines = [];
        for (let i = 0; i < text.length; i += charsPerLine) {
            lines.push(text.substr(i, charsPerLine));
        }

        // 逐行添加到容器
        for (const line of lines) {
            const txt = this.add.text(50, this.contentStartY, line, {
                fontSize: fontSize + 'px',
                fill: color,
                align: 'left'
            });
            this.contentContainer.add(txt);
            this.contentStartY += txt.height + 4; // 行间距
        }

        // 更新滚动最大值
        const camHeight = this.cameras.main.height;
        this.scrollMaxY = Math.min(0, camHeight - this.contentStartY - 60);
    }

}
