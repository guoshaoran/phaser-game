class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
    }
    
    create() {

        const { width, height } = this.sys.game.config;
        // 添加背景
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background4'
        );
        this.background.setDisplaySize(width, height);

        // 添加NPC
        this.npc = this.add.image(500, 500, 'npc2').setScale(0.8).setInteractive();
        
        // NPC悬停效果
        this.npc.on('pointerover', () => {
            this.npc.setScale(0.85);
        });
        
        this.npc.on('pointerout', () => {
            this.npc.setScale(0.8);
            this.npc.clearTint();
        });
        

        // NPC点击事件 → 跳转到扫描场景
        this.npc.on('pointerdown', () => {
            this.scene.start('Scene4Scan');
        });
        
        // 添加提示文本
        this.add.text(
            500, 
            450 ,
            '点击NPC', 
            { fontSize: '16px', fill: '#fff', backgroundColor: '#000' }
        ).setOrigin(0.5);
    }
}