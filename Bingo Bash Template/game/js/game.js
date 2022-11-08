////////////////////////////////////////////////////////////
// GAME v1.8
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

var totalRevealBalls = 35; //number of balls to reveal (0 - 75);
var revealTimer = 4; //reveal number timer eg 5 secs
var totalPlayers = 8; //total other players
var freeCenterBall = true; //enable free center ball
var highlightNumber = true; //toggle highlight number
var autoSelectNumber = false; //toggle auto select number

var enablePower = true; //toggle power for game
var powerData = {total:5, //total power badge appear in card
				value:5, //power bar start value
				updateTime:1, //power bar update time
				updateValue:2, //power bar update value
				powerValue:30}; //match power total value

var winScore = 500; //member reward system score

var ballStatusText = "[NUMBER] BALLS LEFT"; //balls left display text
var bingoStatusText = "[NUMBER] BINGO\"S LEFT"; //bingo status display text

var exitMessage = "ARE YOUR SURE\nYOU WANT TO QUIT THE GAME?"; //go to main page message
var resultCompleteText = "YOU WIN!"; //result complete text display
var resultPlayerCompleteText = '[USER] WON!';  //result player complete text display
var resultFailText = "YOU DIDN\"T WIN!";  //result fail text display
var resultNoWinnerText = "NO WINNER!"; //result when no winner
var resultScore = {enable:false, score:500, text:"YOU WONT [NUMBER]PTS"}; //result win score base on total ball reveal

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText = "SHARE THIS GAME"; //social share message
var shareTitle = "Play Bingo Bash HTML5 Game.";//social share score title
var shareMessage = "The excitement never ends in this Bingo Bash HTML5 Game! Try it now!"; //social share score message
				
/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
var playerData = {complete:false};
var gameData = {paused:true, totalNum:75, bingo_arr:[], numbers_arr:[], numberIndex:0, balls_arr:[], reveal_arr:[], players_arr:[], historyBall_arr:[], playerBlink_arr:[], otherPlayersBlink_arr:[], stars_arr:[], complete:false, noWinner:false, firstReveal:true, power:0, powerTween:0, power_arr:[], powerType_arr:[]};
var patternData = {pattern_arr:[], index:0, count:0};

$.balls = {};
$.numbers = {};
$.player = [];
$.cards = {};
$.pattern = {};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	if($.browser.mobile || isTablet){
		
	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }
	}
	
	buttonLocal.cursor = "pointer";
	buttonLocal.addEventListener("click", function(evt) {
		playSound('soundButton');
		socketData.online = false;
		toggleMainButton('default');
	});

	buttonOnline.cursor = "pointer";
	buttonOnline.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkQuickGameMode();
	});

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');

		if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
			if(multiplayerSettings.localPlay){
				toggleMainButton('local');
			}else{
				checkQuickGameMode();
			}
		}else{
			//memberpayment
			playerData.score = 0;
			if(typeof memberData != 'undefined' && memberSettings.enableMembership){
				if(!checkMemberGameType()){
					goMemberPage('user');
					return;
				}else{
					playerData.chance--;
					updateUserPoint();
					goPage('game');
				}
			}else{
				goPage('game');
			}
		}
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		toggleConfirm(true);
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		toggleConfirm(false);
		stopGame();
		goPage('main');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			exitSocketRoom();
		}
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		toggleConfirm(false);
	});
	
	buttonBingo.cursor = "pointer";
	buttonBingo.addEventListener("click", function(evt) {
		checkPlayerBingo(true);
	});
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}

function toggleMainButton(con){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
		gameLogsTxt.visible = true;
		gameLogsTxt.text = '';
	}

	buttonStart.visible = false;
	buttonLocalContainer.visible = false;

	if(con == 'start'){
		buttonStart.visible = true;
	}else if(con == 'local'){
		buttonLocalContainer.visible = true;
	}
}

function checkQuickGameMode(){
	socketData.online = true;
	if(!multiplayerSettings.enterName){
		buttonStart.visible = false;
		buttonLocalContainer.visible = false;

		addSocketRandomUser();
	}else{
		goPage('name');
	}
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	$('#roomWrapper').hide();
	$('#roomWrapper .innerContent').hide();
	gameLogsTxt.visible = false;

	mainContainer.visible = false;
	nameContainer.visible = false;
	roomContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			startStarFalling();
			toggleMainButton('start');
		break;

		case 'name':
			targetContainer = nameContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .nameContent').show();
			$('#roomWrapper .fontNameError').html('');
			$('#enterName').show();
		break;
			
		case 'room':
			targetContainer = roomContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .roomContent').show();
			switchSocketRoomContent('lists');
		break;
		
		case 'game':
			targetContainer = gameContainer;
			stopStarFalling();

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {

			}else{
				startGame();
			}
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			
			var finalScore = 0;
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(gameData.noWinner){
					resultTitleTxt.text = resultNoWinnerText;
				}else{
					resultTitleTxt.text = resultPlayerCompleteText.replace('[USER]', socketData.winners);
					if(playerData.complete){
						resultTitleTxt.text = resultCompleteText;
						finalScore = 1;
						
						if(resultScore.enable){
							finalScore = (totalRevealBalls - gameData.reveal_arr.length) / 100 * resultScore.score;
							resultTitleTxt.text = resultScore.text.replace('[NUMBER]', finalScore);
						}
					}
				}
			}else{
				if(gameData.noWinner){
					resultTitleTxt.text = resultNoWinnerText;
				}else{
					if(playerData.complete){
						resultTitleTxt.text = resultCompleteText;
						finalScore = 1;
						
						if(resultScore.enable){
							finalScore = (totalRevealBalls - gameData.reveal_arr.length) / 100 * resultScore.score;
							resultTitleTxt.text = resultScore.text.replace('[NUMBER]', finalScore);
						}
					}else{
						resultTitleTxt.text = resultFailText;
					}
				}
			}

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.host){
					postSocketCloseRoom();
				}
			}
			
			saveGame(finalScore);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		gameData.paused = false;
	}
}

function resizeSocketLog(){
	gameLogsTxt.font = "30px the_bold_fontbold";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.color = "#000";

	if(curPage == 'main'){
		gameLogsTxt.x = canvasW/2;
		gameLogsTxt.y = canvasH/100 * 78;
	}else if(curPage == 'game'){
		gameLogsTxt.font = "15px the_bold_fontbold";
		gameLogsTxt.textAlign = "left";

		gameLogsTxt.x = canvasW/100 * 72;
		gameLogsTxt.y = canvasH/100 * 70;
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */

function startGame(){
	playerData.complete = false;
	
	gameData.paused = false;
	gameData.numberIndex = 0;

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		
	}else{
		shuffle(gameData.numbers_arr);
	}

	gameData.balls_arr = [];
	gameData.historyBall_arr = [];
	gameData.otherPlayersBlink_arr = [];
	gameData.playerBlink_arr = [];
	gameData.reveal_arr = [];
	gameData.complete = false;
	gameData.noWinner = false;
	gameData.firstReveal = true;
	gameData.power = gameData.powerTween = powerData.value;
	
	for(var n=0; n<gameData.totalNum; n++){
		$.numbers[n].color = '#2B80B9';
	}
	
	for(var n=0; n<35; n++){
		//gameData.reveal_arr.push(gameData.numbers_arr[n]);	
	}
	
	itemWin.visible = false;
	buttonBingoWin.visible = false;
	ballStatusTxt.text = ballStatusShadowTxt.text = ballStatusText.replace('[NUMBER]', totalRevealBalls);
	updatePowerStatus();
	
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		
	}else{
		createPlayerCard();
	}
	createOtherPlayersCard();

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			shuffle(gameData.numbers_arr);
			postSocketUpdate('revealnumbers', gameData.numbers_arr);
		}
	}
	
	displayWinPattern();
	if(!enablePower){
		powerContainer.visible = false;	
	}
}

function dropBalls(){
	animateNewBall();

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			toggleRevealTimer(true);	
		}
	}else{
		toggleRevealTimer(true);
	}
	if(enablePower){
		togglePowerTimer(true);
	}
	playSound('soundBalls');
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll();
	
	historyBallContainer.removeAllChildren();
	otherPlayersContainer.removeAllChildren();
	playerContainer.removeAllChildren();
	ballsContainer.removeAllChildren();
}

/*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * LOOP UPDATE GAME - This is the function that runs to update game loop
 * 
 */
function updateGame(){
	for(var n=0;n<gameData.stars_arr.length;n++){
		var curStar = gameData.stars_arr[n];
		curStar.y += curStar.speed;
		curStar.rotation += curStar.speed;
		if(curStar.y > canvasH){
			resetStar(curStar);	
		}
	}
}

/*!
 * 
 * GENERATE BINGO NUMBERS - This is the function that runs to generate bingo numbers
 * 
 */
function generateBingoNumbers(){
	var startX = canvasW/100*14.8;
	var startY = canvasH/100*31;
	var curX = startX;
	var curY = startY;
	var spaceX = 35.5;
	var spaceY = 22;
	var rowCount = 0;
	var columnCount = 0;
	
	for(var n=0; n<5;n++){
		gameData.bingo_arr[n] = [];
	}
	
	for(var n=0; n<gameData.totalNum; n++){
		gameData.numbers_arr.push(n+1);
		
		$.numbers[n] = new createjs.Text();
		$.numbers[n].font = "18px the_bold_fontbold";
		$.numbers[n].textAlign = "center";
		$.numbers[n].textBaseline='alphabetic';
		$.numbers[n].text = n+1;
		$.numbers[n].x = curX;
		$.numbers[n].y = curY;
		
		gameData.bingo_arr[columnCount].push(n+1);
		
		curY += spaceY;
		rowCount++;
		if(rowCount >= 15){
			rowCount = 0;	
			curX += spaceX;
			curY = startY;
			columnCount++;
		}
		
		bingoContainer.addChild($.numbers[n]);
	}
}

/*!
 * 
 * CREATE PLAYER CARD - This is the function that runs to create player card
 * 
 */
function createPlayerCard(){
	playerContainer.addChild(itemBingo, powerBadgeContainer, buttonBingo, buttonBingoWin, winPatternContainer);
	powerBadgeContainer.removeAllChildren();
	
	var startX = canvasW/100*4;
	var startY = canvasH/100*17.5;
	var curX = startX;
	var curY = startY;
	var spaceX = 64.8;
	var spaceY = 62;
	
	var buttonWidth = 55;
	var buttonHeight = 55;
	var extraY = 12;
	var allSlots_arr = [];
	playerData.storeNumbers = []
	
	for(var c=0; c<5; c++){
		$.player[c] = [];
		$.pattern[c] = [];
		playerData.storeNumbers[c] = [];
		
		shuffle(gameData.bingo_arr[c]);
		curY = startY;
		
		for(var r=0; r<5; r++){
			allSlots_arr.push({c:c, r:r});
			$.player[c][r] = new createjs.Text();
			$.player[c][r].font = "38px the_bold_fontbold";
			$.player[c][r].color = "#111";
			$.player[c][r].textAlign = "center";
			$.player[c][r].textBaseline='alphabetic';
			$.player[c][r].text = gameData.bingo_arr[c][r];
			$.player[c][r].x = curX;
			$.player[c][r].y = curY;	
			$.player[c][r].number = Number(gameData.bingo_arr[c][r]);
			playerData.storeNumbers[c][r] = {number:Number(gameData.bingo_arr[c][r]), checked:false};
			
			var newSelected = itemSelect.clone();
			newSelected.x = curX;
			newSelected.y = curY-extraY;
			newSelected.visible = false;
			
			$.pattern[c][r] = itemSelect.clone();
			$.pattern[c][r].x = curX;
			$.pattern[c][r].y = curY-extraY;
			$.pattern[c][r].alpha = 0;
			winPatternContainer.addChild($.pattern[c][r]);
			
			var newSelectedWin = itemSelectWin.clone();
			newSelectedWin.x = curX;
			newSelectedWin.y = curY-extraY;
			newSelectedWin.alpha = 0;
			
			$.player[c][r].checked = false;
			$.player[c][r].isCenter = false;
			$.player[c][r].thisColumn = c;
			$.player[c][r].thisRow = r;
			
			if(c == 2 && r == 2){
				if(freeCenterBall){
					//newSelectedWin.visible = false;
					$.player[c][r].isCenter = true;
					$.player[c][r].checked = true;
					$.player[c][r].visible = false;
					
					allSlots_arr.splice(allSlots_arr.length, 1);
				}
			}
			$.player[c][r].selected = newSelected;
			$.player[c][r].selectedwin = newSelectedWin;
			
			$.player[c][r].hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0-(buttonWidth/2), 0-((buttonHeight/2)+extraY), buttonWidth, buttonHeight));
			$.player[c][r].cursor = "pointer";
			$.player[c][r].addEventListener("click", function(evt) {
				checkPlayerNumber(evt.currentTarget);
			});
			
			curY += spaceY;
			playerContainer.addChild(newSelected, $.player[c][r], newSelectedWin);	
		}
		
		curX += spaceX;
	}
	
	powerBadgeContainer.visible = false;
	if(enablePower){
		powerBadgeContainer.visible = true;
		shuffle(allSlots_arr);
		for(var n=0; n<powerData.total; n++){
			if(freeCenterBall && $.player[allSlots_arr[n].c][allSlots_arr[n].r].isCenter){
				
			}else{
				var newPowerBadge = itemPowerBadge.clone();
				newPowerBadge.x = $.player[allSlots_arr[n].c][allSlots_arr[n].r].x;
				newPowerBadge.y = $.player[allSlots_arr[n].c][allSlots_arr[n].r].y-10;
				$.player[allSlots_arr[n].c][allSlots_arr[n].r].power = true;
				powerBadgeContainer.addChild(newPowerBadge);
			}
		}
	}
	
	checkPlayerBingo(false);

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('playercards', playerData.storeNumbers);
	}
}

/*!
 * 
 * CREATE OTHER PLAYER CARD - This is the function that runs to create other player card
 * 
 */
function createOtherPlayersCard(){
	gameData.players_arr = [];
		
	var startContainerX = 0
	var startContainerY = 0;
	var containerX = startContainerX;
	var containerY = startContainerY;
	var containerSpaceX = 110;
	var containerSpaceY = 128;
	
	var culColumn = 0;
	
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		containerSpaceY = 145;
		
		for(var t=0; t<socketData.players.length; t++){
			gameData.players_arr.push({id:t, array:[], bingo:false})
			
			if(socketData.players[t].index != socketData.index){
				$.cards[t] = new createjs.Container();
				$.cards[t].x = containerX;
				$.cards[t].y = containerY;
				var startX = 17.2;
				var startY = 41.5;
				var curX = startX;
				var curY = startY;
				var spaceX = 18;
				var spaceY = 17;
				var extraY = 5;
				var newCard = itemBingoMini.clone();
				newCard.x = 0;
				newCard.y = 0;
				$.cards[t].addChild(newCard);
				for(var c=0; c<5; c++){
					gameData.players_arr[t].array[c] = [];
					shuffle(gameData.bingo_arr[c]);
					curY = startY;
					for(var r=0; r<5; r++){
						gameData.players_arr[t].array[c][r] = new createjs.Text();
						gameData.players_arr[t].array[c][r].font = "9px the_bold_fontbold";
						gameData.players_arr[t].array[c][r].color = "#111";
						gameData.players_arr[t].array[c][r].textAlign = "center";
						gameData.players_arr[t].array[c][r].textBaseline='alphabetic';
						gameData.players_arr[t].array[c][r].text = socketData.players[t].data[c][r].number;
						gameData.players_arr[t].array[c][r].x = curX;
						gameData.players_arr[t].array[c][r].y = curY;	
						//gameData.players_arr[t].array[c][r].number = Number(gameData.bingo_arr[c][r]);
						gameData.players_arr[t].array[c][r].number = socketData.players[t].data[c][r].number;
						
						var newSelected = itemSelectSmall.clone();
						newSelected.x = curX;
						newSelected.y = curY-extraY;
						newSelected.visible = false;
						var newSelectedWin = itemSelectWinSmall.clone();
						newSelectedWin.x = curX;
						newSelectedWin.y = curY-extraY;
						newSelectedWin.alpha = 0;
						gameData.players_arr[t].array[c][r].checked = false;
						gameData.players_arr[t].array[c][r].isCenter = false;
						if(c == 2 && r == 2){
							if(freeCenterBall){
								//newSelectedWin.visible = false;
								gameData.players_arr[t].array[c][r].isCenter = true;
								gameData.players_arr[t].array[c][r].checked = true;
								gameData.players_arr[t].array[c][r].visible = false;
							}
						}
						gameData.players_arr[t].array[c][r].selected = newSelected;
						gameData.players_arr[t].array[c][r].selectedwin = newSelectedWin;
						curY += spaceY;
						$.cards[t].addChild(newSelected, gameData.players_arr[t].array[c][r], newSelectedWin);	
					}
					curX += spaceX;
				}
				containerX += containerSpaceX;
				culColumn++;
				if(culColumn > 1){
					culColumn = 0;
					containerX = startContainerX;
					containerY += containerSpaceY;	
				}
				
				var userName = socketData.players[t].username.length > 8 ? socketData.players[t].username.substring(0, 8)+'...' : socketData.players[t].username;
				var userNameTxt = new createjs.Text();
				userNameTxt.font = "18px the_bold_fontbold";
				userNameTxt.color = "#fff";
				userNameTxt.textAlign = "left";
				userNameTxt.textBaseline='alphabetic';
				userNameTxt.text = userName;
				userNameTxt.x = $.cards[t].x;
				userNameTxt.y = $.cards[t].y;
				
				otherPlayersContainer.addChild($.cards[t], userNameTxt);
			}
		}
	}else{
		for(var t=0; t<totalPlayers; t++){
			$.cards[t] = new createjs.Container();
			$.cards[t].x = containerX;
			$.cards[t].y = containerY;
			
			gameData.players_arr.push({id:t, array:[], bingo:false})
			
			var startX = 17.2;
			var startY = 41.5;
			var curX = startX;
			var curY = startY;
			var spaceX = 18;
			var spaceY = 17;
			
			var extraY = 5;
			
			var newCard = itemBingoMini.clone();
			newCard.x = newCard.y = 0;
			$.cards[t].addChild(newCard);
			
			for(var c=0; c<5; c++){
				gameData.players_arr[t].array[c] = [];
				shuffle(gameData.bingo_arr[c]);
				curY = startY;
				
				for(var r=0; r<5; r++){
					gameData.players_arr[t].array[c][r] = new createjs.Text();
					gameData.players_arr[t].array[c][r].font = "9px the_bold_fontbold";
					gameData.players_arr[t].array[c][r].color = "#111";
					gameData.players_arr[t].array[c][r].textAlign = "center";
					gameData.players_arr[t].array[c][r].textBaseline='alphabetic';
					gameData.players_arr[t].array[c][r].text = gameData.bingo_arr[c][r];
					gameData.players_arr[t].array[c][r].x = curX;
					gameData.players_arr[t].array[c][r].y = curY;	
					gameData.players_arr[t].array[c][r].number = Number(gameData.bingo_arr[c][r]);
					
					var newSelected = itemSelectSmall.clone();
					newSelected.x = curX;
					newSelected.y = curY-extraY;
					newSelected.visible = false;
					
					var newSelectedWin = itemSelectWinSmall.clone();
					newSelectedWin.x = curX;
					newSelectedWin.y = curY-extraY;
					newSelectedWin.alpha = 0;
					
					gameData.players_arr[t].array[c][r].checked = false;
					gameData.players_arr[t].array[c][r].isCenter = false;
					
					if(c == 2 && r == 2){
						if(freeCenterBall){
							//newSelectedWin.visible = false;
							gameData.players_arr[t].array[c][r].isCenter = true;
							gameData.players_arr[t].array[c][r].checked = true;
							gameData.players_arr[t].array[c][r].visible = false;
						}
					}
					gameData.players_arr[t].array[c][r].selected = newSelected;
					gameData.players_arr[t].array[c][r].selectedwin = newSelectedWin;
					
					curY += spaceY;
					$.cards[t].addChild(newSelected, gameData.players_arr[t].array[c][r], newSelectedWin);	
				}
				
				curX += spaceX;
			}
			
			containerX += containerSpaceX;
			culColumn++;
			
			if(culColumn > 1){
				culColumn = 0;
				containerX = startContainerX;
				containerY += containerSpaceY;	
			}
			
			otherPlayersContainer.addChild($.cards[t]);
		}
	}
}

/*!
 * 
 * CHECK PLAYER CARD - This is the function that runs to check player card
 * 
 */
function checkPlayerNumber(obj){
	if(gameData.reveal_arr.indexOf(obj.number) != -1 && !obj.checked){
		playSound('soundSelect');
		TweenMax.killTweensOf(obj.selected);

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			playerData.storeNumbers[obj.thisColumn][obj.thisRow].checked = true;
			postSocketUpdate('updateusernumbers', playerData.storeNumbers);
		}
		
		obj.checked = true;
		obj.selected.alpha = 1;
		obj.selected.visible = true;
		
		checkPlayerBingo(false);
		if(enablePower){
			if(obj.power){
				playSound('soundFill');
				updatePowerValue(powerData.powerValue);	
			}
		}
	}
}

function highlightPlayerNumber(){
	for(var c=0; c<5; c++){
		for(var r=0; r<5; r++){
			if(gameData.reveal_arr.indexOf($.player[c][r].number) != -1 && !$.player[c][r].checked){
				$.player[c][r].selected.visible = true;
				animateSelectBlink($.player[c][r].selected);
			}
			
		}	
	}
}

function animateSelectBlink(obj){
	var tweenSpeed = .2;
	TweenMax.to(obj, tweenSpeed, {alpha:.3, overwrite:true, onComplete:function(){
		TweenMax.to(obj, tweenSpeed, {alpha:.5, overwrite:true, onComplete:animateSelectBlink, onCompleteParams:[obj]});
	}});	
}

function autoSelectPlayerNumber(){
	for(var c=0; c<5; c++){
		for(var r=0; r<5; r++){
			if(gameData.reveal_arr.indexOf($.player[c][r].number) != -1){
				TweenMax.killTweensOf($.player[c][r].selected);
				$.player[c][r].selected.alpha = 1;
				$.player[c][r].checked = true;
				$.player[c][r].selected.visible = true;
			}
			
		}	
	}
}

function checkPlayerBingo(con){
	var totalBingo = 0;
	var totalBingoLeft = 0;
	gameData.power_arr = [];
	gameData.powerType_arr = [];
	
	//column
	for(var c=0; c<5; c++){
		gameData.playerBlink_arr = [];
		var curTotalBingo = 0;
		for(var r=0; r<5; r++){
			totalBingo++;
			if($.player[c][r].checked){
				gameData.playerBlink_arr.push($.player[c][r]);
				curTotalBingo++;
			}else{
				gameData.power_arr.push({type:'c'+c, obj:$.player[c][r]});	
			}
		}
		
		gameData.powerType_arr.push({type:'c'+c, total:curTotalBingo});
		if(curTotalBingo > totalBingoLeft){
			totalBingoLeft = curTotalBingo;
		}
		
		if(curTotalBingo >= 5){
			if(con)
			startAnimateBingo(gameData.playerBlink_arr);
		}
	}
	
	//row
	for(var r=0; r<5; r++){
		gameData.playerBlink_arr = [];
		var curTotalBingo = 0;
		for(var c=0; c<5; c++){
			totalBingo++;
			if($.player[c][r].checked){
				gameData.playerBlink_arr.push($.player[c][r]);
				curTotalBingo++;
			}else{
				gameData.power_arr.push({type:'r'+r, obj:$.player[c][r]});
			}
		}
		
		gameData.powerType_arr.push({type:'r'+r, total:curTotalBingo});
		if(curTotalBingo > totalBingoLeft){
			totalBingoLeft = curTotalBingo;
		}
		
		if(curTotalBingo >= 5){
			if(con)
			startAnimateBingo(gameData.playerBlink_arr);
		}
	}
	
	//cross
	var curTotalBingo = 0;
	var rowNum = 0;
	gameData.playerBlink_arr = [];
	for(var c=0; c<5; c++){
		totalBingo++;
		if($.player[c][rowNum].checked){
			gameData.playerBlink_arr.push($.player[c][rowNum]);
			curTotalBingo++;	
		}else{
			gameData.power_arr.push({type:'cross0', obj:$.player[c][rowNum]});
		}
		rowNum++;
		
		gameData.powerType_arr.push({type:'cross0', total:curTotalBingo});
		if(curTotalBingo > totalBingoLeft){
			totalBingoLeft = curTotalBingo;
		}
		
		if(curTotalBingo >= 5){
			if(con)
			startAnimateBingo(gameData.playerBlink_arr);
		}
	}
	
	//cross
	var curTotalBingo = 0;
	var rowNum = 4;
	gameData.playerBlink_arr = [];
	for(var c=0; c<5; c++){
		totalBingo++;
		if($.player[c][rowNum].checked){
			gameData.playerBlink_arr.push($.player[c][rowNum]);
			curTotalBingo++;	
		}else{
			gameData.power_arr.push({type:'cross1', obj:$.player[c][rowNum]});	
		}
		rowNum--;
		
		gameData.powerType_arr.push({type:'cross1', total:curTotalBingo});
		if(curTotalBingo > totalBingoLeft){
			totalBingoLeft = curTotalBingo;
		}
		
		if(curTotalBingo >= 5){
			if(con)
			startAnimateBingo(gameData.playerBlink_arr);
		}
	}
	
	//five
	var curTotalBingo = 0;
	gameData.playerBlink_arr = [];
	var five_arr = [{c:0, r:0},{c:0, r:4},{c:2, r:2},{c:4, r:0},{c:4, r:4}];
	
	for(var c=0; c<5; c++){
		totalBingo++;
		if($.player[five_arr[c].c][five_arr[c].r].checked){
			gameData.playerBlink_arr.push($.player[five_arr[c].c][five_arr[c].r]);
			curTotalBingo++;
		}else{
			gameData.power_arr.push({type:'five', obj:$.player[five_arr[c].c][five_arr[c].r]});	
		}
		
		gameData.powerType_arr.push({type:'five', total:curTotalBingo});
		if(curTotalBingo > totalBingoLeft){
			totalBingoLeft = curTotalBingo;
		}
		
		if(curTotalBingo >= 5){
			if(con)
			startAnimateBingo(gameData.playerBlink_arr);
		}
	}
	
	bingoStatusTxt.text = bingoStatusShadowTxt.text = bingoStatusText.replace('[NUMBER]', 5 - totalBingoLeft);
	if(5 - totalBingoLeft == 0 && !gameData.complete){
		buttonBingoWin.visible = true;
		animateBingoBlink(buttonBingoWin);	
	}
}

/*!
 * 
 * CHECK OTHER PLAYER CARD - This is the function that runs to check other player card
 * 
 */
function checkOtherPlayersNumber(){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		for(var t=0; t<socketData.players.length; t++){
			if(socketData.players[t].index != socketData.index){
				for(var c=0; c<5; c++){
					for(var r=0; r<5; r++){
						if(socketData.players[t].data[c][r].checked){
							gameData.players_arr[t].array[c][r].selected.visible = true;
							gameData.players_arr[t].array[c][r].checked = true;	   
						}
					}
				}
			}
		}
	}else{
		for(var t=0; t<totalPlayers; t++){
			for(var c=0; c<5; c++){
				for(var r=0; r<5; r++){
					var curNumber = Number(gameData.players_arr[t].array[c][r].text);
					if(gameData.reveal_arr.indexOf(curNumber) != -1){
						if(c == 2 && r == 2){
							
						}else{
							gameData.players_arr[t].array[c][r].selected.visible = true;
							gameData.players_arr[t].array[c][r].checked = true;
						}
					}
				}
			}
		}
	}
}


function checkOtherPlayersBingo(){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		for(var t=0; t<socketData.players.length; t++){
			if(socketData.players[t].index != socketData.index){
				//column
				for(var c=0; c<5; c++){
					gameData.otherPlayersBlink_arr = [];
					var curTotalBingo = 0;
					gameData.userblink_arr = [];
					for(var r=0; r<5; r++){
						if(gameData.players_arr[t].array[c][r].checked){
							gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[c][r]);
							curTotalBingo++;	
						}
					}
					if(curTotalBingo >= 5){
						gameData.players_arr[t].bingo = true;
						startAnimateBingo(gameData.otherPlayersBlink_arr, t);
					}
				}
				//row
				for(var c=0; c<5; c++){
					var curTotalBingo = 0;
					gameData.otherPlayersBlink_arr = [];
					for(var r=0; r<5; r++){
						if(gameData.players_arr[t].array[r][c].checked){
							gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[r][c]);
							curTotalBingo++;	
						}
					}
					if(curTotalBingo >= 5){
						gameData.players_arr[t].bingo = true;
						startAnimateBingo(gameData.otherPlayersBlink_arr, t);
					}
				}
				//cross
				var curTotalBingo = 0;
				var rowNum = 0;
				gameData.otherPlayersBlink_arr = [];
				for(var c=0; c<5; c++){
					if(gameData.players_arr[t].array[c][rowNum].checked){
						gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[c][rowNum]);
						curTotalBingo++;	
					}
					rowNum++;
					if(curTotalBingo >= 5){
						gameData.players_arr[t].bingo = true;
						startAnimateBingo(gameData.otherPlayersBlink_arr, t);
					}
				}
				//cross
				var curTotalBingo = 0;
				var rowNum = 4;
				gameData.otherPlayersBlink_arr = [];
				for(var c=0; c<5; c++){
					if(gameData.players_arr[t].array[c][rowNum].checked){
						gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[c][rowNum]);
						curTotalBingo++;	
					}
					rowNum--;
					if(curTotalBingo >= 5){
						gameData.players_arr[t].bingo = true;
						startAnimateBingo(gameData.otherPlayersBlink_arr, t);
					}
				}
				//five
				var curTotalBingo = 0;
				gameData.otherPlayersBlink_arr = [];
				var five_arr = [{c:0, r:0},{c:0, r:4},{c:2, r:2},{c:4, r:0},{c:4, r:4}];
				for(var c=0; c<5; c++){
					if($.player[five_arr[c].c][five_arr[c].r].checked){
						gameData.otherPlayersBlink_arr.push($.player[five_arr[c].c][five_arr[c].r]);
						curTotalBingo++;	
					}
					if(curTotalBingo >= 5){
						startAnimateBingo(gameData.otherPlayersBlink_arr, t);
					}
				}
			}
		}
	}else{
		for(var t=0; t<totalPlayers; t++){
			//column
			for(var c=0; c<5; c++){
				gameData.otherPlayersBlink_arr = [];
				var curTotalBingo = 0;
				gameData.userblink_arr = [];
				for(var r=0; r<5; r++){
					if(gameData.players_arr[t].array[c][r].checked){
						gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[c][r]);
						curTotalBingo++;	
					}
				}
				
				if(curTotalBingo >= 5){
					gameData.players_arr[t].bingo = true;
					startAnimateBingo(gameData.otherPlayersBlink_arr, t);
				}
			}
			
			//row
			for(var c=0; c<5; c++){
				var curTotalBingo = 0;
				gameData.otherPlayersBlink_arr = [];
				for(var r=0; r<5; r++){
					if(gameData.players_arr[t].array[r][c].checked){
						gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[r][c]);
						curTotalBingo++;	
					}
				}
				
				if(curTotalBingo >= 5){
					gameData.players_arr[t].bingo = true;
					startAnimateBingo(gameData.otherPlayersBlink_arr, t);
				}
			}
			
			//cross
			var curTotalBingo = 0;
			var rowNum = 0;
			gameData.otherPlayersBlink_arr = [];
			for(var c=0; c<5; c++){
				if(gameData.players_arr[t].array[c][rowNum].checked){
					gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[c][rowNum]);
					curTotalBingo++;	
				}
				rowNum++;
				
				if(curTotalBingo >= 5){
					gameData.players_arr[t].bingo = true;
					startAnimateBingo(gameData.otherPlayersBlink_arr, t);
				}
			}
			
			//cross
			var curTotalBingo = 0;
			var rowNum = 4;
			gameData.otherPlayersBlink_arr = [];
			for(var c=0; c<5; c++){
				if(gameData.players_arr[t].array[c][rowNum].checked){
					gameData.otherPlayersBlink_arr.push(gameData.players_arr[t].array[c][rowNum]);
					curTotalBingo++;	
				}
				rowNum--;
				
				if(curTotalBingo >= 5){
					gameData.players_arr[t].bingo = true;
					startAnimateBingo(gameData.otherPlayersBlink_arr, t);
				}
			}
			
			//five
			var curTotalBingo = 0;
			gameData.otherPlayersBlink_arr = [];
			var five_arr = [{c:0, r:0},{c:0, r:4},{c:2, r:2},{c:4, r:0},{c:4, r:4}];
			
			for(var c=0; c<5; c++){
				if($.player[five_arr[c].c][five_arr[c].r].checked){
					gameData.otherPlayersBlink_arr.push($.player[five_arr[c].c][five_arr[c].r]);
					curTotalBingo++;	
				}
				
				if(curTotalBingo >= 5){
					startAnimateBingo(gameData.otherPlayersBlink_arr, t);
				}
			}
		}
	}
}

/*!
 * 
 * ANIMATE BINGO - This is the function that runs to animate bingo
 * 
 */
function startAnimateBingo(array, t){
	if(!gameData.complete){
		gameData.complete = true;
		playSound('soundBingo');
		toggleRevealTimer(false);
		togglePowerTimer(false);
		
		for(var n=0; n<array.length; n++){
			array[n].selected.alpha = 0;
			animateBingoBlink(array[n].selectedwin);
			if(t == undefined){
				playerContainer.addChild(array[n].selectedwin);	
			}
		}
		
		itemWin.visible = true;
		itemWin.alpha = 0;
		itemWin.scaleX = itemWin.scaleY = 0;
		var scaleNum = 0;
		if(t != undefined){
			itemWin.x = otherPlayersContainer.x + ($.cards[t].x + 53);
			itemWin.y = otherPlayersContainer.y + ($.cards[t].y + 61);
			scaleNum = .25;
		}else{
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				postSocketUpdate('bingo');
			}
			buttonBingoWin.visible = false;
			playerData.complete = true;
			itemWin.x = playerContainer.x + 179;
			itemWin.y = playerContainer.y + 212;
			scaleNum = 1;	
		}
		TweenMax.to(itemWin, .3, {delay:2, alpha:1, scaleX:scaleNum, scaleY:scaleNum, overwrite:true});
		
		startStarFalling();
		endGame();
	}
}

function animateBingoBlink(obj){
	var tweenSpeed = .2;
	TweenMax.to(obj, tweenSpeed, {alpha:.3, overwrite:true, onComplete:function(){
		TweenMax.to(obj, tweenSpeed, {alpha:1, overwrite:true, onComplete:animateBingoBlink, onCompleteParams:[obj]});
	}});	
}

function animateBingoText(obj){
	var tweenSpeed = .1;
	TweenMax.to(obj, tweenSpeed, {alpha:.5, overwrite:true, onComplete:function(){
		TweenMax.to(obj, tweenSpeed, {alpha:1, overwrite:true, onComplete:animateBingoText, onCompleteParams:[obj]});
	}});	
}

/*!
 * 
 * STAR FALLING - This is the function that runs for star falling
 * 
 */
function startStarFalling(){
	for(var n=0; n<25; n++){
		var newStar = itemStar.clone();
		resetStar(newStar)
		gameData.stars_arr.push(newStar);
		starContainer.addChild(newStar);
	}
}

function stopStarFalling(){
	gameData.stars_arr.length = 0;
	starContainer.removeAllChildren();	
}

function resetStar(obj){
	obj.scaleX = obj.scaleY = (Math.floor(Math.random()*5)*.1)+.5;
	obj.y = -50;
	obj.x = randomIntFromInterval(100, 1200);
	obj.speed = (Math.floor(Math.random()*8))+3;
}

/*!
 * 
 * CREATE BALLS - This is the function that runs to create balls
 * 
 */
function createBall(){
	if(gameData.numberIndex > gameData.numbers_arr.length-1){
		return;
	}
	
	$.balls[gameData.numberIndex] = new createjs.Container();
	
	var curNumber = Number(gameData.numbers_arr[gameData.numberIndex]);
	var newBall = getBallObject(curNumber);
	newBall.x = newBall.y = 0;
	
	var newText = new createjs.Text();
	newText.font = "25px the_bold_fontbold";
	newText.color = "#000";
	newText.textAlign = "center";
	newText.textBaseline='alphabetic';
	newText.text = curNumber;
	newText.x = 0;
	newText.y = 20;	
	newText.alpha = 0;
	
	$.balls[gameData.numberIndex].addChild(newBall, newText);
	$.balls[gameData.numberIndex].x = 445;
	$.balls[gameData.numberIndex].y = -90;
	
	gameData.balls_arr.push({obj:$.balls[gameData.numberIndex], state:0, text:newText});
	ballsContainer.addChild($.balls[gameData.numberIndex]);
	gameData.numberIndex++;
}

function getBallObject(number){
	if(number >= 1 && number <= 15){
		return itemBallB.clone();
	}else if(number >= 16 && number <= 30){
		return itemBallI.clone();
	}else if(number >= 31 && number <= 45){
		return itemBallN.clone();
	}else if(number >= 46 && number <= 60){
		return itemBallG.clone();
	}else if(number >= 61 && number <= 75){
		return itemBallO.clone();
	}
}

/*!
 * 
 * ANIMATE BALLS - This is the function that runs to animate balls
 * 
 */
function animateNewBall(){
	var totalBalls = gameData.balls_arr.length;
	
	for(var n=gameData.numberIndex; n<totalRevealBalls; n++){
		if(gameData.balls_arr.length < 7){
			createBall();	
		}else{
			n = gameData.numbers_arr.length;
		}
	}
	
	var endX = 445;
	var endY = 370;
	var countNum = 0;
	for(var n=0; n<gameData.balls_arr.length;n++){
		var curBall = gameData.balls_arr[n].obj;
		var curState = gameData.balls_arr[n].state;
		if(curState == 0){
			TweenMax.to(curBall, 1, {delay:0, x:endX, y:endY, ease:Bounce.easeOut, overwrite:true});
			endY -= 85;
			countNum++;
		}
	}
}

function revealBall(){
	if(gameData.balls_arr.length == 0){
		return;	
	}
	
	var revealNum = 0;
	var lowerY = 465;
	
	if(gameData.balls_arr[revealNum].state == 1){
		revealNum = 1;
		var path = [{x:445,y:465},{x:445,y:510},{x:436,y:582},{x:360,y:605},{x:330,y:605}];
		TweenMax.to(gameData.balls_arr[0].obj, .8, {bezier:{type:"soft", values:path, autoRotate:false}, ease:Linear.easeNone, overwrite:true, onComplete:removeBall});
	}
	
	if(gameData.balls_arr[revealNum] == undefined){
		return;	
	}
	
	gameData.balls_arr[revealNum].state = 1;
	var curBall = gameData.balls_arr[revealNum].obj;
	var curText = gameData.balls_arr[revealNum].text;
	gameData.reveal_arr.push(Number(curText.text));
	ballStatusTxt.text = ballStatusShadowTxt.text = ballStatusText.replace('[NUMBER]', totalRevealBalls - gameData.reveal_arr.length);
	playSound('soundBounce');
	
	TweenMax.to(curText, .5, {alpha:1, overwrite:true});	
	TweenMax.to(curBall, 1, {x:445, y:lowerY, ease:Bounce.easeOut, overwrite:true, onComplete:revealBingo, onCompleteParams:[Number(curText.text)]});
	animateNewBall();
}

function revealBingo(num){
	playSound('soundReveal');
	$.numbers[num-1].color = '#fff';
	
	if(highlightNumber){
		highlightPlayerNumber();
	}
	if(autoSelectNumber){
		autoSelectPlayerNumber();
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		
	}else{
		checkOtherPlayersNumber();
		checkOtherPlayersBingo();
	}
}

function removeBall(){
	var position = [{x:137,y:592},{x:200,y:592},{x:260,y:592},{x:320,y:592}];
	var newBall = gameData.balls_arr[0].obj.clone(true);
	newBall.scaleX = newBall.scaleY = .65;
	newBall.rotation = 0;
	newBall.x = position[3].x+60;
	newBall.y = position[2].y;
	newBall.mask = historyMask;
	
	gameData.historyBall_arr.push(newBall);
	historyBallContainer.addChild(newBall);
	
	ballsContainer.removeChild(gameData.balls_arr[0].obj);
	gameData.balls_arr.splice(0,1);
	
	//history
	if(gameData.historyBall_arr.length > 4){
		historyBallContainer.removeChild(gameData.historyBall_arr[0]);
		gameData.historyBall_arr.splice(0,1);
	}
	
	for(var n=0; n<gameData.historyBall_arr.length;n++){
		var curIndex = n;
		if(gameData.historyBall_arr.length <= 3){
			curIndex++;	
		}
		TweenMax.to(gameData.historyBall_arr[n], .5, {x:position[curIndex].x, y:position[curIndex].y, overwrite:true});
	}
	
	if(gameData.balls_arr.length == 0 && !gameData.complete){
		playSound('soundDraw');
		gameData.noWinner = true;
		gameData.complete = true;
		
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				postSocketUpdate('nowinner');
			}
		}else{
			endGame();
		}
	}
}

/*!
 * 
 * REVEAL TIMER - This is the function that runs for reveal timer
 * 
 */
function toggleRevealTimer(con){
	if(con){
		startRevealTimer();
	}else{
		TweenMax.killTweensOf(ballsContainer);	
	}
}

function startRevealTimer(){
	var revealTimerNum = revealTimer;
	if(gameData.firstReveal){
		gameData.firstReveal = false;
		revealTimerNum = 3;
	}
	TweenMax.to(ballsContainer, revealTimerNum, {overwrite:true, onComplete:revealTimerComplete});
}

function revealTimerComplete(){
	if(!gameData.complete){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.host){
				revealBall();
				startRevealTimer();
				
				postSocketUpdate('revealballs');
			}
		}else{
			revealBall();
			startRevealTimer();
		}
	}
}

/*!
 * 
 * END GAME - This is the function that runs to end game
 * 
 */
function endGame(){
	TweenMax.to(gameContainer, 4, {overwrite:true, onComplete:function(){
		//memberpayment
		if(playerData.complete){
			playerData.score = winScore;
		}
		
		if(typeof memberData != 'undefined' && memberSettings.enableMembership){
			updateUserPoint();
		}
		
		goPage('result');	
	}});	
}

function togglePowerTimer(con){
	if(con){
		startPowerTimer();
	}else{
		TweenMax.killTweensOf(powerContainer);	
	}
}

/*!
 * 
 * GAME POWER - This is the function that runs for game power
 * 
 */
function startPowerTimer(){
	TweenMax.to(powerContainer, powerData.updateTime, {overwrite:true, onComplete:powerTimeComplete});
}

function powerTimeComplete(){
	if(!gameData.complete){
		updatePowerValue(powerData.updateValue);
		updatePowerStatus();
		startPowerTimer();
	}
}

function updatePowerValue(value){
	gameData.powerTween += value;
	TweenMax.to(gameData, 1, {power:gameData.powerTween, overwrite:true, onUpdate:updatePowerStatus});	
}

function updatePowerStatus(){
	powerMask.graphics.clear();
	
	var percent = (gameData.power/100) * 117;
	powerMask.graphics.beginFill('red').drawRect(0, 0, percent, 34);
	
	if(gameData.power >= 100){
		gameData.power = gameData.powerTween = 0;
		updatePowerValue(0);
		
		sortOnObject(gameData.powerType_arr, 'total', true);
		shuffle(gameData.power_arr);
		
		var powerAdded = false;
		for(var n = 0; n<gameData.powerType_arr.length;n++){
			for(var p = 0; p<gameData.power_arr.length; p++){
				if(gameData.powerType_arr[n].type == gameData.power_arr[p].type && !powerAdded && !gameData.power_arr[p].obj.selected.visible){
					playSound('soundPower');
					
					//add
					powerAdded = true;
					var newPower = itemBallPower.clone();
					newPower.x = gameData.power_arr[p].obj.x;
					newPower.y = gameData.power_arr[p].obj.y - 12;
					newPower.alpha = 0;
					newPower.scaleX = newPower.scaleY = .5;
					playerContainer.addChild(newPower);
					
					TweenMax.to(newPower, .5, {alpha:1, scaleX:1, scaleY:1, overwrite:true, onComplete:powerTweenComplete, onCompleteParams:[p]});	
				}
			}
		}
	}
}

function powerTweenComplete(p){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		var thisColumn = gameData.power_arr[p].obj.thisColumn;
		var thisRow = gameData.power_arr[p].obj.thisRow;
		playerData.storeNumbers[thisColumn][thisRow].checked = true;

		postSocketUpdate('updateusernumbers', playerData.storeNumbers);
	}

	gameData.power_arr[p].obj.checked = true;
	gameData.power_arr[p].obj.selected.alpha = 1;
	gameData.power_arr[p].obj.selected.visible = true;
	checkPlayerBingo(false);
}

/*!
 * 
 * WIN PATTERN - This is the function that runs for win pattern
 * 
 */
function displayWinPattern(){
	for(var c=0; c<5; c++){
		for(var r=0; r<5; r++){
			$.pattern[c][r].alpha = 0;
		}	
	}
	
	patternData.index = 0;
	patternData.pattern_arr.length = 0;
	patternData.pattern_arr.push({type:'c', total:25});
	patternData.pattern_arr.push({type:'r', total:25});
	patternData.pattern_arr.push({type:'cross0', total:5});
	patternData.pattern_arr.push({type:'cross1', total:5});
	patternData.pattern_arr.push({type:'five', total:5});
	showPattern();
}

function showPattern(){
	patternData.count = 0;
	
	if(patternData.pattern_arr[patternData.index].type == 'c'){
		var delayNum = 1;
		for(var c=0; c<5; c++){
			for(var r=0; r<5; r++){
				TweenMax.to($.pattern[c][r], .2, {delay:(r*.3)+delayNum, alpha:1, overwrite:true, onComplete:patternCompleteTween, onCompleteParams:[$.pattern[c][r]]});
			}	
		}
	}else if(patternData.pattern_arr[patternData.index].type == 'r'){
		for(var r=0; r<5; r++){
			for(var c=0; c<5; c++){
			
				TweenMax.to($.pattern[r][c], .2, {delay:r*.3, alpha:1, overwrite:true, onComplete:patternCompleteTween, onCompleteParams:[$.pattern[r][c]]});
			}	
		}
	}else if(patternData.pattern_arr[patternData.index].type == 'cross0'){
		var rowNum = 0;
		for(var c=0; c<5; c++){
			TweenMax.to($.pattern[c][rowNum], .2, {delay:r*.3, alpha:1, overwrite:true, onComplete:patternCompleteTween, onCompleteParams:[$.pattern[c][rowNum]]});
			rowNum++;
		}
	}else if(patternData.pattern_arr[patternData.index].type == 'cross1'){
		var rowNum = 4;
		for(var c=0; c<5; c++){
			TweenMax.to($.pattern[c][rowNum], .2, {delay:r*.3, alpha:1, overwrite:true, onComplete:patternCompleteTween, onCompleteParams:[$.pattern[c][rowNum]]});
			rowNum--;
		}	
	}else if(patternData.pattern_arr[patternData.index].type == 'five'){
		var five_arr = [{c:0, r:0},{c:0, r:4},{c:2, r:2},{c:4, r:0},{c:4, r:4}];
		for(var c=0; c<5; c++){
			TweenMax.to($.pattern[five_arr[c].c][five_arr[c].r], .2, {delay:r*.3, alpha:1, overwrite:true, onComplete:patternCompleteTween, onCompleteParams:[$.pattern[five_arr[c].c][five_arr[c].r]]});
		}	
	}
}

function patternCompleteTween(obj){
	TweenMax.to(obj, .1, {overwrite:true, onComplete:hidePattern, onCompleteParams:[obj]});
}

function hidePattern(obj){
	obj.alpha = 0;
	patternData.count++;
	
	if(patternData.pattern_arr[patternData.index].total == patternData.count){
		patternData.index++;
		
		if(patternData.index < patternData.pattern_arr.length){
			showPattern();
		}else{
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.host){
					dropBalls();
					postSocketUpdate('dropballs');
				}
			}else{
				dropBalls();
			}
		}
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}



/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = shareTitle;
	var text = shareMessage;
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}