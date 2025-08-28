class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 显示加载界面
        const loadingText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '加载中...',
            { fontSize: '24px', fill: '#fff' }
        ).setOrigin(0.5);

        // 加载资源
        AssetLoader.preload(this);
    }

    create() {
        // 资源加载完成，转到菜单场景
        this.scene.start('MenuScene');
    }
}