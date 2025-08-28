class Scene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3' });
    }

    create() {

        const { width, height } = this.sys.game.config;
        // 添加背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background3'
        );
        this.background.setDisplaySize(width, height);

        // 添加NPC
        this.npc = this.add.image(600, 500, 'npc1').setScale(0.2).setInteractive();

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
                "小杏！你来得太是时候了。疫情蔓延，正需要这辟疫香囊！！",
                "但切记，香囊需麝香、薄荷、陈皮三味主药才能起效！如今市面混乱，麝香多有掺假",
                "据《上海中药炮制规范》记载，真麝香囊孔细密如金粟！快，用这面鉴药镜照看分明！",
            ], () => {
                this.scene.start('MiniGame2');
            });
        });

        // 添加提示文本
        this.add.text(
            600,
            400,
            '点击NPC',
            { fontSize: '16px', fill: '#fff', backgroundColor: '#000' }
        ).setOrigin(0.5);
    }
}