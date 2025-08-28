class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    init(data) {
        this.source = data.source || ''; // 家谱名
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
            this.scene.start('MiniGame4');
        });

        // 加载家谱人物
        this.loadWorkPersons(this.source);
    }

    async loadWorkPersons(workName) {
        const key = "40ccf727947c8660e48118608057a9141efeef1f";
        const centerX = this.cameras.main.width / 2; // 水平居中
        let startY = 100;

        try {
            // 1️⃣ 获取作品相关人物 URI 列表
            const workRes = await fetch(`https://data1.library.sh.cn/jp/work/data?${encodeURIComponent(workName)}&key=${key}`);
            const Data = await workRes.json();
            const workData = Data["@graph"];

            if (!workData || workData.length === 0) {
                this.add.text(centerX, startY, `未找到《${workName}》相关人物`, { 
                    fontSize: '20px', fill: '#f00', align: 'center', wordWrap: { width: 800 } 
                }).setOrigin(0.5);
                return;
            }

            this.add.text(centerX, startY+10, `《${workName}》相关人物：`, { 
                fontSize: '22px', fill: '#000', align: 'center', wordWrap: { width: 800 } 
            }).setOrigin(0.5,0);
            startY += 40;

            // 2️⃣ 遍历每个 URI 调人物详情接口
            for (let item of workData.slice(0, 10)) {
                const personUri = item["@id"];
                if (!personUri) continue;

                try {
                    const detailRes = await fetch(
                        `https://data1.library.sh.cn/shnh/wkl/webapi/persons/detail?uri=${encodeURIComponent(personUri)}&key=${key}`
                    );
                    const detailData = await detailRes.json();

                    if (detailData && detailData.data && detailData.data.chs_name) {
                        const name = detailData.data.chs_name;

                        // 显示人物名，水平居中
                        this.add.text(centerX, startY+10, name, {
                            fontSize: '18px',
                            fill: '#000',
                            align: 'center',
                            wordWrap: { width: 800 }
                        }).setOrigin(0.5);
                        startY += 30; // 每行间距
                    }
                } catch (err) {
                    console.error("获取人物详情出错:", err);
                    this.add.text(centerX, startY, '人物详情加载失败', { 
                        fontSize: '18px', fill: '#f00', align: 'center', wordWrap: { width: 800 } 
                    }).setOrigin(0.5);
                    startY += 30;
                }
            }
        } catch (err) {
            console.error("获取作品数据出错:", err);
            this.add.text(centerX, startY, '作品数据加载失败', { 
                fontSize: '20px', fill: '#f00', align: 'center', wordWrap: { width: 800 } 
            }).setOrigin(0.5);
        }
    }
}
