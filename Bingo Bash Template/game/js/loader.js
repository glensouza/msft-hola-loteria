////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
 function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/button_start.png', id:'buttonStart'},
			{src:'assets/button_online.png', id:'buttonOnline'},
			{src:'assets/button_local.png', id:'buttonLocal'},
			
			{src:'assets/item_game.png', id:'itemGame'},
			{src:'assets/item_bingo.png', id:'itemBingo'},
			{src:'assets/item_bingo_mini.png', id:'itemBingoMini'},
			{src:'assets/item_select.png', id:'itemSelect'},
			{src:'assets/item_select_win.png', id:'itemSelectWin'},
			{src:'assets/item_select_small.png', id:'itemSelectSmall'},
			{src:'assets/item_select_win_small.png', id:'itemSelectWinSmall'},
			{src:'assets/button_bingo.png', id:'buttonBingo'},
			{src:'assets/button_bingo_win.png', id:'buttonBingoWin'},
			
			{src:'assets/item_power_bar.png', id:'itemPowerBlank'},
			{src:'assets/item_power_fill.png', id:'itemPowerFill'},
			{src:'assets/item_power_badge.png', id:'itemPowerBadge'},
			
			{src:'assets/item_ball_b.png', id:'itemBallB'},
			{src:'assets/item_ball_i.png', id:'itemBallI'},
			{src:'assets/item_ball_n.png', id:'itemBallN'},
			{src:'assets/item_ball_g.png', id:'itemBallG'},
			{src:'assets/item_ball_o.png', id:'itemBallO'},
			{src:'assets/item_ball_power.png', id:'itemBallPower'},
			
			{src:'assets/item_win.png', id:'itemWin'},
			{src:'assets/item_star.png', id:'itemStar'},
			
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/item_exit.png', id:'itemExit'},
			
			{src:'assets/item_result.png', id:'itemResult'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}];
	
	//memberpayment
	if(typeof memberData != 'undefined' && memberSettings.enableMembership){
		addMemberRewardAssets();
	}

	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/music.ogg', id:'musicGame'});
		manifest.push({src:'assets/sounds/click.ogg', id:'soundClick'});
		manifest.push({src:'assets/sounds/balls.ogg', id:'soundBalls'});
		manifest.push({src:'assets/sounds/bingo.ogg', id:'soundBingo'});
		manifest.push({src:'assets/sounds/draw.ogg', id:'soundDraw'});
		manifest.push({src:'assets/sounds/reveal.ogg', id:'soundReveal'});
		manifest.push({src:'assets/sounds/select.ogg', id:'soundSelect'});
		manifest.push({src:'assets/sounds/bounce.ogg', id:'soundBounce'});
		manifest.push({src:'assets/sounds/power.ogg', id:'soundPower'});
		manifest.push({src:'assets/sounds/fill.ogg', id:'soundFill'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}