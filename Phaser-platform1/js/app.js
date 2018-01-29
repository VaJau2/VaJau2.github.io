var game = new Phaser.Game(
    800,
    600,
    Phaser.AUTO,
    'game',
    {
        preload: preload,
        create: create,
        update: update
    }
);

var score = 0;
var scoreText;

function preload() {
    game.load.image('sky','assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {

    //------------------------Игровой-мир----------------


    //  Мы будем использовать физику, для этого добавим в наш мир
    //  аркадную физику
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //  Установим небо в качесте фона
    game.add.sprite(0, 0, 'sky');
    // Создаем группу для выступов на которые мы будем прыгать
    platforms = game.add.group();
     //  Добавляем физику для всех объектов группы
     platforms.enableBody = true;
    // Создаем пол
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    //  Подгоняем размер пола по размерам игры (оригинальный спрайт размером 400x32)
    ground.scale.setTo(2,2);
    //  Предотвращаем "перемещение" пола
    ground.body.immovable = true;
    //  Создаем два выступа и предотвращаем их "перемещение"
    var ledge = platforms.create(400,400,'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150,250,'ground');
    ledge.body.immovable = true;

    //------------------------Звездочки----------------

    stars = game.add.group();
    stars.enableBody = true;

    for (var i = 0; i < 12; i++) {
        //  Создаем звезду и добавляем её в группу "stars"
        var star = stars.create(i * 70, 0, 'star');
        //  Добавляем гравитацию
        star.body.gravity.y = 200;
        // Для каждой звезды указываем свою амплитуду отскока
        star.body.bounce.y = 0.1 + Math.random() * 0.1;
    }

    //------------------------Игрок----------------

    // Персонаж и настройки для него
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    // Добавляем физику для персонажа
    game.physics.arcade.enable(player);
    //  Настройки. Добавим небольшой отскок при приземлении.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
     //  Добавим две анимации для движения влево и вправо
     player.animations.add('left', [0, 1, 2, 3], 10, true);
     player.animations.add('right', [5, 6, 7, 8], 10, true);

     cursors = game.input.keyboard.createCursorKeys();

     player.body.velocity.x = 0;

      //------------------------Интерфейс----------------
     scoreText = game.add.text(16,16,'очочки: 0', {fontSize: '30px', fill: '#CCC'});

 }

 function update() {

    //  Проверка на столкновение игрока и звездочек с полом
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    //проверка на пересечение звезд и игрока
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    if(cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if(cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else {
        player.animations.stop();
        player.frame = 4;
        player.body.velocity.x = 0;
    }

    //Прыжок
    if(cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -300;
    }

    function collectStar (player, star) {
     // Removes the star from the screen
     star.kill();
     score += 1;
     scoreText.text = 'очочки: ' + score;
 }
}