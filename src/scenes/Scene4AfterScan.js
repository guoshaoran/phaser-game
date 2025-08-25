class Scene4AfterScan extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4AfterScan' });
    }

    create() {
        const { width, height } = this.sys.game.config;

        // 背景同 scene4
        this.background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'background4'
        );
        this.background.setDisplaySize(width, height);

        // 添加NPC
        this.npc = this.add.image(500, 500, 'npc2').setScale(0.8).setInteractive();
        
        // 弹出扫描结果对话
        const dialog = new Dialog(this);
        dialog.show([
            "扫描完成。确认物品：明末《急救仙方》香囊残卷能量印记。",
            "检测到秘方被撕裂为四个部分，能量结构不稳定。",
            "需依据中药‘君臣佐使’配伍原理，将其重组复原。"
        ], () => {
            this.scene.start('MiniGame3');
        });
    }
}