class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        const { width, height } = this.sys.game.config;

        // 黑色背景
        this.cameras.main.setBackgroundColor('#000000');

        // 白色大字
        const text = this.add.text(
            width / 2,
            height / 2+20,
            "\n你是见习药师小杏，\n为了复原曾祖父失传的辟疫香囊秘方，\n你踏上了旅途。",
            {
                fontSize: '28px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: width - 100 }
            }
        ).setOrigin(0.5);
     
        
        // 提示文字
        const tip = this.add.text(
            width / 2,
            height / 2 + 120,
            "点击屏幕继续",
            {
                fontSize: '20px',
                fill: '#ffff00'
            }
        ).setOrigin(0.5);

        // 点击进入 Scene1
        this.input.once('pointerdown', () => {

            this.scene.start('Scene1');
        });
    }
}
