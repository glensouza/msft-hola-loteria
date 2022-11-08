////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);	
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, confirmContainer, resultContainer;
var guideline, bg, logo, buttonStart, buttonContinue, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	buttonLocalContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	ballsContainer = new createjs.Container();
	historyBallContainer = new createjs.Container();
	bingoContainer = new createjs.Container();
	playerContainer = new createjs.Container();
	otherPlayersContainer = new createjs.Container();
	winPatternContainer = new createjs.Container();
	powerContainer = new createjs.Container();
	powerBadgeContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	starContainer = new createjs.Container();
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100 * 77;

	buttonLocal = new createjs.Bitmap(loader.getResult('buttonLocal'));
	centerReg(buttonLocal);

	buttonOnline = new createjs.Bitmap(loader.getResult('buttonOnline'));
	centerReg(buttonOnline);

	buttonLocal.x = canvasW/2 - 150;
	buttonLocal.y = canvasH/100 * 77;

	buttonOnline.x = canvasW/2 + 150;
	buttonOnline.y = canvasH/100 * 77;
	
	//game
	itemGame = new createjs.Bitmap(loader.getResult('itemGame'));
	
	itemBingo = new createjs.Bitmap(loader.getResult('itemBingo'));
	itemBingoMini = new createjs.Bitmap(loader.getResult('itemBingoMini'));
	buttonBingo = new createjs.Bitmap(loader.getResult('buttonBingo'));
	centerReg(buttonBingo);
	itemBingoMini.x = -200;
	buttonBingoWin = new createjs.Bitmap(loader.getResult('buttonBingoWin'));
	centerReg(buttonBingoWin);
	
	itemSelect = new createjs.Bitmap(loader.getResult('itemSelect'));
	centerReg(itemSelect);
	itemSelect.x = -200;
	
	itemSelectWin = new createjs.Bitmap(loader.getResult('itemSelectWin'));
	centerReg(itemSelectWin);
	itemSelectWin.x = -200;
	
	itemSelectSmall = new createjs.Bitmap(loader.getResult('itemSelectSmall'));
	centerReg(itemSelectSmall);
	itemSelectSmall.x = -200;
	
	itemSelectWinSmall = new createjs.Bitmap(loader.getResult('itemSelectWinSmall'));
	centerReg(itemSelectWinSmall);
	itemSelectWinSmall.x = -200;
	
	playerContainer.addChild(itemBingo, buttonBingo);
	buttonBingo.x = buttonBingoWin.x = canvasW/100 * 14;
	buttonBingo.y = buttonBingoWin.y = canvasH/100 * 59;
	playerContainer.x = canvasW/100 * 42;
	playerContainer.y = canvasH/100 * 21;
	
	otherPlayersContainer.x = canvasW/100 * 72;
	otherPlayersContainer.y = canvasH/100 * 21;
	
	itemBallB = new createjs.Bitmap(loader.getResult('itemBallB'));
	centerReg(itemBallB);
	itemBallI = new createjs.Bitmap(loader.getResult('itemBallI'));
	centerReg(itemBallI);
	itemBallN = new createjs.Bitmap(loader.getResult('itemBallN'));
	centerReg(itemBallN);
	itemBallG = new createjs.Bitmap(loader.getResult('itemBallG'));
	centerReg(itemBallG);
	itemBallO = new createjs.Bitmap(loader.getResult('itemBallO'));
	centerReg(itemBallO);
	itemBallB.x = -200;
	itemBallI.x = -200;
	itemBallN.x = -200;
	itemBallG.x = -200;
	itemBallO.x = -200;
	
	historyMask = new createjs.Shape();
	historyMask.graphics.beginFill('red').drawRoundRectComplex(165, 557, 187, 62, 12, 12, 12, 12);
	//historyBallContainer.addChild(historyMask);
	
	itemWin = new createjs.Bitmap(loader.getResult('itemWin'));
	centerReg(itemWin);
	itemStar = new createjs.Bitmap(loader.getResult('itemStar'));
	centerReg(itemStar);
	itemStar.x = -200;
	
	ballStatusTxt = new createjs.Text();
	ballStatusTxt.font = "33px the_bold_fontbold";
	ballStatusTxt.color = "#fff";
	ballStatusTxt.textAlign = "center";
	ballStatusTxt.textBaseline='alphabetic';
	ballStatusTxt.text = '16 Balls Left';
	ballStatusTxt.x = canvasW/100 * 20.5;
	ballStatusTxt.y = canvasH/100 * 20;
	
	ballStatusShadowTxt = new createjs.Text();
	ballStatusShadowTxt.font = "33px the_bold_fontbold";
	ballStatusShadowTxt.color = "#333";
	ballStatusShadowTxt.textAlign = "center";
	ballStatusShadowTxt.textBaseline='alphabetic';
	ballStatusShadowTxt.text = '16 Balls Left';
	ballStatusShadowTxt.x = ballStatusTxt.x;
	ballStatusShadowTxt.y = ballStatusTxt.y + 4;
	
	bingoStatusTxt = new createjs.Text();
	bingoStatusTxt.font = "33px the_bold_fontbold";
	bingoStatusTxt.color = "#fff";
	bingoStatusTxt.textAlign = "left";
	bingoStatusTxt.textBaseline='alphabetic';
	bingoStatusTxt.text = '16 Balls Left';
	bingoStatusTxt.x = canvasW/100 * 42;
	bingoStatusTxt.y = canvasH/100 * 19.5;
	
	bingoStatusShadowTxt = new createjs.Text();
	bingoStatusShadowTxt.font = "33px the_bold_fontbold";
	bingoStatusShadowTxt.color = "#333";
	bingoStatusShadowTxt.textAlign = "left";
	bingoStatusShadowTxt.textBaseline='alphabetic';
	bingoStatusShadowTxt.text = '16 Balls Left';
	bingoStatusShadowTxt.x = bingoStatusTxt.x;
	bingoStatusShadowTxt.y = bingoStatusTxt.y + 4;
	
	itemPowerBlank = new createjs.Bitmap(loader.getResult('itemPowerBlank'));
	itemPowerFill = new createjs.Bitmap(loader.getResult('itemPowerFill'));
	powerMask = new createjs.Shape();
	powerMask.graphics.beginFill('red').drawRect(0, 0, 117, 34);
	itemPowerFill.mask = powerMask;
	powerContainer.addChild(itemPowerBlank, itemPowerFill);
	powerContainer.x = canvasW/100 * 60.7;
	powerContainer.y = canvasH/100 * 16;
	
	itemPowerBadge = new createjs.Bitmap(loader.getResult('itemPowerBadge'));
	centerReg(itemPowerBadge);
	itemBallPower = new createjs.Bitmap(loader.getResult('itemBallPower'));
	centerReg(itemBallPower);
	itemBallPower.x = -200;
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemResult'));
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "60px the_bold_fontbold";
	resultTitleTxt.color = "#fff";
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = 'STAGE 1 COMPLETE';
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100 * 45;
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "30px the_bold_fontbold";
	resultShareTxt.color = "#fff";
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = shareText;
	resultShareTxt.x = canvasW/2;
	resultShareTxt.y = canvasH/100 * 52;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	buttonFacebook.x = canvasW/100 * 44;
	buttonTwitter.x = canvasW/2;
	buttonWhatsapp.x = canvasW/100 * 56;
	buttonFacebook.y = buttonTwitter.y = buttonWhatsapp.y = canvasH/100*58;
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	createHitarea(buttonContinue);
	buttonContinue.x = canvasW/2;
	buttonContinue.y = canvasH/100 * 70;
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	buttonConfirm.x = canvasW/100* 39;
	buttonConfirm.y = canvasH/100 * 67;
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	buttonCancel.x = canvasW/100 * 61;
	buttonCancel.y = canvasH/100 * 67;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "40px the_bold_fontbold";
	confirmMessageTxt.color = "#fff";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.lineHeight = 40;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *47;
	
	confirmContainer.addChild(itemExit, buttonConfirm, buttonCancel, confirmMessageTxt);
	confirmContainer.visible = false;

	//room
	nameContainer = new createjs.Container();
	roomContainer = new createjs.Container();

	gameLogsTxt = new createjs.Text();
	gameLogsTxt.font = "30px the_bold_fontbold";
	gameLogsTxt.color = "#fff";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.textBaseline='alphabetic';
	gameLogsTxt.text = '';
	gameLogsTxt.x = canvasW/2;
	gameLogsTxt.y = canvasH/100 * 60;
	
	if(guide){
		guideline = new createjs.Shape();
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	buttonLocalContainer.addChild(buttonLocal, buttonOnline);
	mainContainer.addChild(logo, buttonStart, buttonLocalContainer);
	gameContainer.addChild(itemBallPower, itemStar, itemBingoMini, itemBallB, itemBallI, itemBallN, itemBallG, itemBallO, itemSelect, itemSelectWin, itemSelectSmall, itemSelectWinSmall, ballsContainer, itemGame, historyBallContainer, bingoContainer, playerContainer, otherPlayersContainer, itemWin, powerContainer, ballStatusShadowTxt, ballStatusTxt, bingoStatusShadowTxt, bingoStatusTxt);
	resultContainer.addChild(itemResult, resultTitleTxt, buttonContinue);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(bg, mainContainer, nameContainer, roomContainer, gameContainer, resultContainer, starContainer, gameLogsTxt, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		buttonSettings.x = (canvasW - offset.x) - 60;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 60;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*3);
		}

		resizeSocketLog()
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));
}