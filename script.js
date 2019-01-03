function Item(context, areaWidth, areaHeight) {
	this.image = new Image();
	this.size = 0.12;
	this.speed = Math.random() + 1;
	this.status = "good";

	this.load = function() {
		this.image.src = this.imageSource();
		this.width = this.image.width * this.size;
		this.height = this.image.height * this.size;
		this.y = 0;
		this.x = this.newPos();
	}

	this.imageSource = function() {
		var randomImg = parseInt(Math.random() * 10);
		switch(randomImg) {
			case 0: return "img/items/pawBlack.png";
			case 1: return "img/items/pawBrown1.png";
			case 2: return "img/items/pawBrown2.png";
			case 3: return "img/items/pawBrown3.png";
			case 4: return "img/items/pawYellow.png";
			case 5: return "img/items/pawDarkGray.png";
			case 6: return "img/items/pawLightGray.png";
			case 7:
			case 8:
			case 9:
				this.size *= 2;
				this.status = "bad";
				return "img/items/dog.gif";
		}
	}

	this.update = function() {
		this.moveDown();
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	this.moveDown = function() {
		this.y += this.speed;
		this.verifyLimit();
	}

	this.verifyLimit = function() {
		if(this.y + this.height > areaHeight)
			return false;
		return true;
	}

	this.newPos = function() {
		var max = areaWidth - this.width;
		return (Math.random() * 10000) % max;
	}
}

function Cat(context, areaWidth, areaHeight) {
	this.image = new Image();
	this.image.src = "img/cat.png";
	this.size = 0.5;
	this.speed = 20;

	this.load = function() {
		this.width = this.image.width * this.size;
		this.height = this.image.height * this.size;
		this.x = (areaWidth / 2) - (this.width / 2);
		this.y = areaHeight - this.height;

		this.eventListener(this);
		this.blinkTimer = setInterval(this.blink, 3000, this);

	}

	this.update = function() {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	this.moveRight = function() {
		this.x += this.speed;
		this.verifyRightLimit();
	}

	this.moveLeft = function() {
		this.x -= this.speed;
		this.verifyLeftLimit();
	}

	this.verifyLeftLimit = function() {
		if(this.x < 0)
			this.x = 0;
	}

	this.verifyRightLimit = function() {
		if(this.x + this.width > areaWidth)
			this.x = areaWidth - this.width;	
	}

	this.eventListener = function(object) {
		addEventListener("keydown", function(event) {
			if(event.code == "ArrowLeft") 
	    		object.moveLeft();
			else if(event.code == "ArrowRight")
				object.moveRight();
		});
	}
	
	this.blink = function(object) {
		object.image.src = "img/catClosedEyes.png";
		object.openEyesTimer = setTimeout(object.openEyes, 100, object);
	}

	this.openEyes = function(object) {
		object.image.src = "img/cat.png";
	}
}

function GameArea() {
	this.canvas = document.createElement("canvas");
	this.canvas.className = "layer";
	this.canvas.width = innerWidth;
	this.canvas.height = innerHeight;

	this.context = this.canvas.getContext("2d");
	this.components = new Array();

	this.start = function() {
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	}

	this.clear = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	this.update = function() {
		this.clear();
		var i;
		for(i = 0; i < this.components.length; i ++)
			this.components[i].update();
	}

	this.addItem = function(item) {
		this.components.push(item);
	}

	this.removeItem = function(item) {
		var index = this.components.indexOf(item);
		if (index > -1)
			this.components.splice(index, 1);
	}
}

function Score() {
	this.canvas = document.createElement("canvas");
	this.canvas.className = "layer";
	this.canvas.width = innerWidth;
	this.canvas.height = innerHeight;
	this.context = this.canvas.getContext("2d");

	this.width = 130;
	this.height = 50;
	this.x = this.canvas.width - this.width - 20;
	this.y = 20;
	this.value = 50;
	this.change = 2;
	this.color = "#F4DF62";
	this.fontSize = 20;

	document.body.insertBefore(this.canvas, document.body.childNodes[0]);

	this.increase = function() {
		this.value += this.change;
		this.update();
	}

	this.decrease = function(status) {
		if(status == "good")
			this.value -= this.change;
		else
			this.value -= 5 * this.change;
		this.update();
	}

	this.clear = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	this.update = function() {
		this.clear();
		this.context.fillStyle = this.color;
		this.context.fillRect(this.x, this.y, this.width, this.height);
		this.context.font = this.fontSize + "px Arial";
		this.context.strokeText(this.value + "% CUTE", this.x + 10, this.y + this.height * 0.65);
	}
}

sounds = {
	backgroundMusic : new Audio("sounds/backgroundMusic.mp3"),
	dogSound : new Audio("sounds/dog.mp3"),

	playBackgroundMusic : function() {
		this.backgroundMusic.addEventListener("ended", function() {
    		this.currentTime = 0;
    		this.play();
		}, false);
		this.backgroundMusic.play();
	},

	stopBakcroundMusic : function() {
		this.backgroundMusic.pause();
	},

	playDogSound : function() {
		this.dogSound.play();
	}
}

game = {
	timeAddItem : 1000,

	start : function() {
		sounds.playBackgroundMusic();
		score = new Score();
		score.update();

		gameArea = new GameArea();
		gameArea.start();

		cat = new Cat(gameArea.context, gameArea.canvas.width, gameArea.canvas.height);
		cat.load();
		gameArea.addItem(cat);

		this.updateInterval = setInterval(this.update, 20);
		this.newItemInterval = setInterval(this.newItem, this.timeAddItem);
	},

	stop : function() {
		clearTimeout(this.updateInterval);
		clearTimeout(this.newItemInterval);
		gameArea.clear();
		sounds.stopBakcroundMusic();
	},

	newItem : function() {
		newItem = new Item(gameArea.context, gameArea.canvas.width, gameArea.canvas.height);
		newItem.load();
		gameArea.addItem(newItem);
	},

	update : function() {
		gameArea.update();
		
		var i;
		for(i = 1; i < gameArea.components.length; i++)
			game.verifyItem(gameArea.components[i]);
	},

	verifyItem : function(item) {
		if(item.verifyLimit() == false) {
			if(item.status == "good")
				score.decrease(item.status);
			gameArea.removeItem(item);
			this.verifyScore();
		}
		else if(item.y + item.height >= cat.y)
			if((item.x + item.width >= cat.x) && (item.x <= cat.x + cat.width)){
				if(item.status == "good")
					score.increase();
				else {
					sounds.playDogSound();
					score.decrease(item.status);
				}
				gameArea.removeItem(item);
				this.verifyScore();
			}
	},

	verifyScore : function() {
		if(score.value <= 0) {
			this.stop();
			document.getElement("winnerDialog").style.display = "initial";
		}
		else if(score.value >= 100) {
			this.stop();
			document.getElement("loserDialog").style.display = "initial";
		}
	}	
}

function init() {
	document.getElementById("initialDialog").style.display = "none";
	game.start();
}