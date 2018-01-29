var game = new Phaser.Game (
	480,
	640,
	Phaser.AUTO,
	'game',
	{
		preload: preload,
		create: create, 
		update: update
	});

var playerPlatform;
var compPlatform;
var ball;

var compPlatformSpeed = 250;
var ballSpeed = 300;
var ballReleased = false;

var playerScore = 0;
var playerScoreText;
var compScore = 0;
var compScoreText;

//создание платформы (игрока или врага)
function setBet(someBet) {
	someBet.anchor.setTo(0.5, 0.5);
	someBet.body.collideWorldBounds = true;
	someBet.body.bounce.setTo(1, 1);
	someBet.body.immovable = true;
}

function releaseBall() {
	if(!ballReleased) {
		let randomValue1 = Math.random();
		if(randomValue1 > 0.5) {
			ball.body.velocity.x = ballSpeed;
		}
		else {
			ball.body.velocity.x = -ballSpeed;
		}
		let randomValue2 = Math.random();
		if(randomValue2 > 0.5) {
			ball.body.velocity.y = ballSpeed;
		}
		else {
			ball.body.velocity.y = -ballSpeed;
		}
		ballReleased = true;
	}
}

function checkGoal() {
	if (ball.y < 15) { 
		playerScore++;
		playerScoreText.text = 'игрок: ' + playerScore;
		setBall();
	} else if (ball.y > 625) {
		compScore++;
		compScoreText.text = 'ИИ: ' + compScore;
		setBall();
	}
}

function setBall() {
	if (ballReleased) {
		ball.x = game.world.centerX;
		ball.y = game.world.centerY;
		ball.body.velocity.x = 0;
		ball.body.velocity.y = 0;
		ballReleased = false;
	}

}

function preload() {

	game.load.image('platform','assets/platform.png');
	game.load.image('ball','assets/ball.png');
	game.load.image('sky','assets/sky.jpg');
}

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	//добавляем задний фон
	game.add.tileSprite(0,0,480,640,'sky');

	//создаем группу платформ
	platforms = game.add.group();
	platforms.enableBody = true;

	//добавляем в группу игрока
	playerPlatform = platforms.create(game.world.centerX, 600, 'platform');
	setBet(playerPlatform);
	
	//добавляем в группу соперника
	compPlatform = platforms.create(game.world.centerX, 30, 'platform');
	setBet(compPlatform);

	//создаем отдельный шарик
	ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
	ball.anchor.setTo(0.5,0.5);
	game.physics.arcade.enable(ball);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(1,1);

	game.input.onDown.add(releaseBall, this);

	playerScoreText = game.add.text(16,16,'игрок: 0', {fontSize: '15px', fill: '#CCC'});
	compScoreText = game.add.text(16,32,'ИИ: 0', {fontSize: '15px', fill: '#CCC'});
}

function update() {
	//запуск шарика по клику мыши
	playerPlatform.x = game.input.x;

	//ограничение шарика по краям экрана (штоб дальше них не заходил)
	var playerPlatformHalfWidth = playerPlatform.width / 2;

	if(playerPlatform.x < playerPlatformHalfWidth) {
		playerPlatform.x = playerPlatformHalfWidth;
	}
	else if(playerPlatform.x > game.width - playerPlatformHalfWidth) {
		playerPlatform.x = game.width - playerPlatformHalfWidth;
	}

	//сложнейший ИИ для соперника
	if(compPlatform.x - ball.x < -15) {
		compPlatform.body.velocity.x = compPlatformSpeed;
	}
	else if(compPlatform.x - ball.x > 15) {
		compPlatform.body.velocity.x = - compPlatformSpeed;
	}
	else {
		compPlatform.body.velocity.x = 0;
	}

	//game.physics.collide(ball, playerPlatform, ballHitsBet, null,this);
	//game.physics.collide(ball, compPlatform, ballHitsBet, null, this);
	game.physics.arcade.collide(playerPlatform, ball);
	game.physics.arcade.collide(compPlatform, ball);

	checkGoal();
}