class AssetLoader {
    static preload(scene) {
        // 加载音频
        scene.load.audio('thunder', 'assets/sounds/thunder.mp3');
        scene.load.audio('rain', 'assets/sounds/rain.mp3');
        scene.load.audio('zhong', 'assets/sounds/zhong.mp3');
        // 加载图像
        scene.load.image('background1', 'assets/images/background1.png');
        scene.load.image('background2', 'assets/images/background2.png');
        scene.load.image('game1', 'assets/images/game1.png');
        scene.load.image('background3', 'assets/images/background3.png');
        scene.load.image('game2', 'assets/images/game2.png');
        scene.load.image('background4', 'assets/images/background4.png');
        scene.load.image('background5', 'assets/images/background5.png');
        scene.load.image('background6', 'assets/images/background6.png');

        scene.load.image('line', 'assets/images/line.png');
        scene.load.image('book', 'assets/images/book.png');

        scene.load.image('npc', 'assets/images/npc.png');
        scene.load.image('npc1', 'assets/images/npc1.png');
        scene.load.image('npc2', 'assets/images/npc2.png');

        scene.load.image('item', 'assets/images/item.png');

        scene.load.image('xiang', 'assets/images/xiang.png');

        scene.load.image('item1', 'assets/images/item1.png');
        scene.load.image('item2', 'assets/images/item2.png');
        scene.load.image('item3', 'assets/images/item3.png');
        scene.load.image('item4', 'assets/images/item4.png');

        scene.load.image('yao1', 'assets/images/yao1.png');
        scene.load.image('yao2', 'assets/images/yao2.png');
        scene.load.image('yao3', 'assets/images/yao3.png');
        

        scene.load.image('piece1', 'assets/images/piece1.png');
        scene.load.image('piece2', 'assets/images/piece2.png');
        scene.load.image('piece3', 'assets/images/piece3.png');
        scene.load.image('piece4', 'assets/images/piece4.png');
        scene.load.image('question', 'assets/images/question.png'); 

        //scene.load.json('questionBank', 'assets/data/questionBank.json');
        scene.load.json('question', 'assets/data/question.json');
    }
}