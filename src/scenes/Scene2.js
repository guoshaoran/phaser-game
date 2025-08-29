class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    create() {

        const { width, height } = this.sys.game.config;
        // 添加背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background2'
        );
        this.background.setDisplaySize(width, height);

        // 添加NPC
        this.npc = this.add.image(450, 400, 'npc').setScale(0.2).setInteractive();

        // NPC悬停效果
        this.npc.on('pointerover', () => {
            this.npc.setScale(0.25);
        });

        this.npc.on('pointerout', () => {
            this.npc.setScale(0.2);
            this.npc.clearTint();
        });

        // NPC点击事件
        this.npc.on('pointerdown', () => {
            const dialog = new Dialog(this);
            dialog.show([
                "小杏师傅，你来得正好！！《本草纲目拾遗》里记载得清清楚楚：‘蟾酥薄切需如蝉翼般",
                "透光，珍珠研磨要似星尘般细腻，薄荷则务必取霜降后叶片，香气最浓’——时间紧迫，",
                "快按这标准把它们找出来吧！"
            ], () => {
                this.scene.start('MiniGame1');
            });
        });

        const bookImage = this.add.image(300, 350, 'book1')
        .setScale(1.5)
        .setInteractive({ useHandCursor: true });

        bookImage.on('pointerdown', () => {
            this.scene.start('BookScene', {
                source: "本草纲目拾遗",
                fromScene: this.scene.key
            });
        });
        // 添加提示文本
        this.add.text(
            450,
            350 ,
            '点击NPC',
            { fontSize: '16px', fill: '#fff', backgroundColor: '#000' }
        ).setOrigin(0.5);
        this.add.text(
            300,
            300 ,
            '点击图书查看详情',
            { fontSize: '16px', fill: '#fff', backgroundColor: '#000' }
        ).setOrigin(0.5);
    }
}