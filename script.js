/*
Be A Cat
This is a game where you need to pick up all the paws
Author: ericmgs
Date: 29 Dez 2018
*/

function playDogSound() {
	var dogSound = new Audio("sounds/dog.mp3");
	dogSound.play();
}

function playCatSound() {
	var catSound = new Audio("sounds/cat.mp3");
	catSound.play();
}

function startBackgroundMusic() {
	var backgroundMusic = new Audio("sounds/backgroundMusic.mp3");
	backgroundMusic.addEventListener("ended", function() {
    	this.currentTime = 0;
    	this.play();
	}, false);
	backgroundMusic.play();
}

function updateAddItemTime(itemTime, score) {
	itemTime.value = 4000 * (1 - (score.value / 100)) + 1000;
}

function updateScore(score) {
	document.getElementById("score").innerHTML = score + "% CUTE";
}

function verifyScore(score) {
	if(score <= 0)
		return -1;
	else if(score >= 100)
		return 1;
	else
		return 0;
}

function moveLeft(speed) {
	var cat = document.getElementById("cat");
	var catStyle = getComputedStyle(cat);
	var catWidth = Number(catStyle.width.slice(0,-2));
	var catPos = Number(catStyle.left.slice(0,-2));
	
	/* The anchor of the image is in the center
	   then the real position is (catPos - (catWidth / 2))
	   and position 0 is (catWidth / 2)
	*/
	if((catPos - (catWidth / 2)) - speed <= 0) //if it exceeds the left limit
		catPos = catWidth / 2; //the image goes to position 0
	else
		catPos -= speed;

	cat.style.left = catPos + "px";
}

function moveRight(speed) {
	var cat = document.getElementById("cat");
	var catStyle = getComputedStyle(cat);
	var catWidth = Number(catStyle.width.slice(0,-2));
	var catPos = Number(catStyle.left.slice(0,-2));
	var screenWidth = Number(innerWidth);

	/* The anchor of the image is in the center
	   then the real position is (catPos + (catWidth / 2))
	   and the max position is (screenWidth - (catWidth / 2))
	*/
	if((catPos + (catWidth / 2)) + speed >= screenWidth) //if it exceeds the right limit
		catPos = (screenWidth - (catWidth / 2)); //the image goes to the max position
	else
		catPos += speed;

	cat.style.left = catPos + "px";
}

function addItem(array, speedRange) {
	/* Creates a new object with three attributes
	"item" that is the image
	"speed" that defines the fall speed of the image
	"status" that defines if the item is a good item or a bad item
	*/
	var element = new Object(); 
	element.item = document.createElement("img");	
	element.item.className = "item";

	// Define item image
	var randomImg = parseInt(Math.random() * 10);
	switch(randomImg) {
		case 0:
			element.item.src = "img/items/pawBlack.png";
			break;
		case 1:
			element.item.src = "img/items/pawBrown1.png";
			break;
		case 2:
			element.item.src = "img/items/pawBrown2.png";
			break;
		case 3:
			element.item.src = "img/items/pawBrown3.png";
			break;
		case 4:
			element.item.src = "img/items/pawYellow.png";
			break;
		case 5:
			element.item.src = "img/items/pawDarkGray.png";
			break;
		case 6:
			element.item.src = "img/items/pawLightGray.png";
			break;
		case 7:
		case 8:
		case 9:
			element.item.src = "img/items/dog.gif";
			element.item.style.width = "120px";
			break;
	}

	// Define item status
	if(randomImg < 7)
		element.status = 1; // The item is good
	else
		element.status = 0; // The item is bad

	// Define item position
	var itemStyle = getComputedStyle(element.item);
	var itemWidth = Number(itemStyle.width.slice(0,-2));
	var screenWidth = Number(innerWidth);
	var randomPos = (Math.random() * 10000);
	// position range: min = itemWidth, max = screenWidth - itemWidth
	var itemPos = (randomPos % (screenWidth - (2 * itemWidth))) + itemWidth;
	element.item.style.left = itemPos + "px";

	// Define item speed
	var randomSpeed = (Math.random() * 1000) % speedRange;
	element.speed = randomSpeed;

	// Append element and show it
	array.push(element);
	document.body.appendChild(array[array.length - 1].item);
}

function verifyItem(element) {
	var cat = document.getElementById("cat");
	var catStyle = getComputedStyle(cat);
	var catHeight = Number(catStyle.height.slice(0,-2));
	var catWidth = Number(catStyle.width.slice(0,-2));
	var catPosLeft = Number(catStyle.left.slice(0,-2));
	var catLeft = catPosLeft - (catWidth / 2);
	var catRight = catPosLeft + (catWidth / 2);

	var itemStyle = getComputedStyle(element.item);
	var itemPosBottom = Number(itemStyle.bottom.slice(0,-2));
	var itemPosLeft = Number(itemStyle.left.slice(0,-2));

	// The item was lost
	if(itemPosBottom <= 0)
		return -1;
	// The item was picked up
	else if(itemPosBottom <= catHeight)
		if(itemPosLeft >= catLeft && itemPosLeft <= catRight)
			return 1;
		else
			return 0;
	else
		return 0;
}

function moveItem(element) {
	var itemStyle = getComputedStyle(element.item);
	var itemPosBottom = Number(itemStyle.bottom.slice(0,-2));

	itemPosBottom -= element.speed;
	element.item.style.bottom = itemPosBottom + "px";
}

function game(array, score, scoreChange, itemTime) {
	var i; //counter
	var itemStatus;
	var gameStatus;

	// Move all items
	for(i = 0; i < array.length; i ++)
		moveItem(array[i]);

	// Verify the status of all items
	for(i = 0; i < array.length; i ++) {
		itemStatus = verifyItem(array[i]);

		// If the item was picked up or lost
		if(itemStatus != 0) {
			// If the item was picked up
			if(itemStatus == 1) {
				if(array[i].status == 1) // If the item is good
					score.value += scoreChange;
				else {
					score.value -= (5 * scoreChange);
					playDogSound();
				}
			}
			// Else the item was lost
			else {
				if(array[i].status == 1) {
					score.value -= scoreChange;
				}
			}

			// Remove item
			document.body.removeChild(array[i].item);
			array.splice(i, 1);

			updateScore(score.value);
			gameStatus = verifyScore(score.value);
			if(gameStatus != 0) {
				clearTimeout(timerAddItem);
				clearTimeout(timerGame);
				if(gameStatus == 1) {
					alert("ganhou");
				}
				else {
					alert("perdeu");
				}
			}

			updateAddItemTime(itemTime, score);
		}
	}
}

function init() {
	//Game constants
	const catSpeed = 50; //pixels
	const gameUpdateTime = 100; //miliseconds
	const itemSpeedRange = 30;
	const scoreChange = 2;

	//Game variables
	var gameScore = new Object(); // Simulating a pointer variable
	gameScore.value = 50;
	var timeAddItem = new Object(); // Simulating a pointer variable
	timeAddItem.value = 3000; //miliseconds
	var items = new Array();

	//Start music
	startBackgroundMusic();

	//Update screen items
	document.getElementById("initialDialog").style.display = "none";
	document.getElementById("cat").style.display = "initial";
	document.getElementById("score").style.display = "initial";
	updateScore(gameScore.value);

	//Adds keyboard event
	document.addEventListener("keydown", function(event){
		if(event.code == "ArrowLeft")
	    	moveLeft(catSpeed);
		else if(event.code == "ArrowRight")
			moveRight(catSpeed);
	});
	
	//Timers
	timerAddItem = setInterval(addItem, timeAddItem.value, items, itemSpeedRange);
	timerGame = setInterval(game, gameUpdateTime, items, gameScore, scoreChange, timeAddItem);
}