class PersonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PersonScene' });
    }

    init(data) {
        this.source = data.source || ''; // 传入的人物姓名
    }

    create() {
        // 设置白色背景
        this.cameras.main.setBackgroundColor('#ffffff');

        // 加载并渲染人物信息
        this.loadAndRenderPerson(this.source);

        // 返回按钮
        const backButton = this.add.text(50, 30, '返回', {
            fontSize: '27px',
            fill: '#fff',
            backgroundColor: '#2a3b4d',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MiniGame4');
        });
    }

    async loadAndRenderPerson(name) {
        const key = '40ccf727947c8660e48118608057a9141efeef1f';
        const centerX = this.cameras.main.width / 2;
        let startY = 100;

        let uri = null;
        try {
            const searchRes = await fetch(`https://data1.library.sh.cn/persons/data?fname=${encodeURIComponent(name)}&key=${key}`);
            const searchData = await searchRes.json();
            if (searchData.result == 0 && searchData.data.length > 0) {
                uri = searchData.data[0].uri;
            } else {
                this.add.text(centerX, startY, '未找到人物 URI', { fontSize: '20px', fill: '#f00' }).setOrigin(0.5, 0);
                return;
            }
        } catch (err) {
            console.error('获取 URI 出错', err);
            this.add.text(centerX, startY, '获取 URI 出错', { fontSize: '20px', fill: '#f00' }).setOrigin(0.5, 0);
            return;
        }

        let person = null;
        try {
            const detailRes = await fetch(`https://data1.library.sh.cn/shnh/wkl/webapi/persons/detail?uri=${encodeURIComponent(uri)}&key=${key}`);
            const detailData = await detailRes.json();
            if (detailData.result == 0) {
                person = detailData.data;
            } else {
                this.add.text(centerX, startY, '人物详情为空', { fontSize: '20px', fill: '#f00' }).setOrigin(0.5, 0);
                return;
            }
        } catch (err) {
            console.error('获取人物详情出错', err);
            this.add.text(centerX, startY, '获取人物详情出错', { fontSize: '20px', fill: '#f00' }).setOrigin(0.5, 0);
            return;
        }

        // 渲染字段
        const addField = (label, value) => {
            if (!value) return;
            const text = this.add.text(centerX, startY+10, `${label}: ${value}`, {
                fontSize: '18px',
                fill: '#000',
                wordWrap: { width: 800 },
                align: 'center',
                lineSpacing: 4
            }).setOrigin(0.5, 0); // 顶部对齐
             startY += 30; // 每行间距
            
        };

        addField('姓名', person.chs_name);
        addField('英文名', person.en_name);
        addField('异名', person.name?.map(n => n.label).join(', '));
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
                const img = this.add.image(centerX, startY, 'personImg');
                img.setDisplaySize(200, 200);
                img.setOrigin(0.5, 0); // 顶部对齐
                startY += 200 + 10; // 图片高度 + 间距
            });
            this.load.start();
        }
    }
}
