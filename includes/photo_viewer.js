/*  JavaScript Document                      */

var currentPanel = 1;
var totalPanels = 0;
var autoPlay = true;
var timePassed = 0;
var timeToChange = 6;
var photoWidth = 0;

$(document).ready(function(){
	
	// // Set up debugger
	// /* debug */ $('.autoPlay').html('autoPlay = '+window.autoPlay);
	// /* debug */ $('.timePassed').html('timePassed = '+window.timePassed);
	// /* debug */ $('.timeToChange').html('timeToChange = '+window.timeToChange);
	// /* debug */ $('.currentPanel').html('currentPanel = '+window.currentPanel);
	// /* debug */ $('.wrapPhotos').html('wrapPhotos = '+window.wrapPhotos);
	setInterval(autoAdvance, 1000);
	
	window.photoWidth = $('.photo_viewer_container').width();  // NEW
	
	$('.photo_viewer_container').hover(
		function(){
			window.autoPlay = false;
			$(this).removeClass('autoplay');
		},
		function(){
			window.autoPlay = true; window.timePassed = 0;
			$(this).addClass('autoplay');
		}
	);
	
	// Generate Navigation links
	$('.photo_viewer_panels .photo_viewer_panel').each(function(index){
		$('.photo_viewer_nav').append('<a class="photo_viewer_nav_item" ></a>');
		totalPanels = index + 1;
		$('.totalPanels').html('totalPanels = '+totalPanels);
	});
	
	// Generate Photo Lineup
	$('img.photo_viewer_panel_photo').each(function(index){
		$('.photo_viewer_photos').append('<img class="photo_viewer_photo" src="'+$(this).attr('src')+'" alt="'+$(this).attr('alt')+'" width="700" height="350" />');
		//$('.photo_viewer_photos').css('width', photoPosition+photoWidth);
	});
	
	// Duplicate first and last photos and add place them at the beginning and end of the lineup
	$('.photo_viewer_photos img:last-child').clone().insertBefore('.photo_viewer_photos img:first-child');
	$('.photo_viewer_photos img:nth-child(2)').clone().insertAfter('.photo_viewer_photos img:last-child');
	
	// Position all photos
	$('.photo_viewer_photos img').each(function(index){
		var photoPosition = index * window.photoWidth;
		$(this).css('left',photoPosition+'px');
		$('.photo_viewer_photos').css('width',photoPosition+window.photoWidth+'px');
	});
	
	// position second photo as first
	$('.photo_viewer_photos').css('left','-'+window.photoWidth+'px');

	// Set up Navigation Links
	$('.photo_viewer_nav a.photo_viewer_nav_item').click(function(test){
		// Set the navigation state
		$('.photo_viewer_nav a.photo_viewer_nav_item').removeClass('selected');
		$(this).addClass('selected');
		var navClicked = $(this).index();
		var distanceToMove = window.photoWidth*(-1);
		var newPhotoPosition = (navClicked*distanceToMove)-window.photoWidth + 'px';  //NEW subtract window.width
		var newCaption = $('.photo_viewer_panel_caption').get(navClicked);
				
		// Animate photos
		if( window.currentPanel == window.totalPanels && navClicked == 0){
			newPhotoPosition = (window.photoWidth*(window.totalPanels+1)*-1)+'px';
			$('.photo_viewer_photos').animate({left: newPhotoPosition}, 1000, function(){
				$('.photo_viewer_photos').css('left','-'+window.photoWidth+'px');
			});
		}else if( window.currentPanel == 1 && navClicked == (window.totalPanels-1)){
			newPhotoPosition = '0px';
			$('.photo_viewer_photos').animate({left: newPhotoPosition}, 1000, function(){
				$('.photo_viewer_photos').css('left','-'+(window.photoWidth*window.totalPanels)+'px');
			});
		}else{
			$('.photo_viewer_photos').animate({left: newPhotoPosition}, 1000);
		}
		
		window.currentPanel = navClicked + 1;
		/* debug */ $('.currentPanel').html('currentPanel = '+window.currentPanel);  //.....................
		
		// Animate the caption
		$('.photo_viewer_caption').animate({top: '340px'}, 500, function(){
			var newHTML = $(newCaption).html();
			$('.photo_viewer_caption_content').html(newHTML);
			setCaption();
		});
	});
	
	// Preload all images, then initialize photo_viewer
	$('.photo_viewer_panels img').imgpreload(function(){
		initializephoto_viewer();
	});

});

function autoAdvance(){
	
	if (window.timePassed == window.timeToChange){
		window.timePassed = 0;
		if (window.autoPlay == true){
			if(window.currentPanel == window.totalPanels){
				$('.photo_viewer_nav a.photo_viewer_nav_item:nth-child(1)').trigger('click');
			}else{
				$('.photo_viewer_nav a.photo_viewer_nav_item:nth-child('+(window.currentPanel+1)+')').trigger('click');
			}
		}
	}else{
		window.timePassed += 1;
	}
	/* debug */ $('.timePassed').html('timePassed = '+window.timePassed);
	/* debug */ $('.autoPlay').html('autoPlay = '+window.autoPlay);

}

function initializephoto_viewer(){
	$('.photo_viewer_caption_content').html(
		$('.photo_viewer_panels .photo_viewer_panel:first .photo_viewer_panel_caption').html()
	);
	$('.photo_viewer_nav a.photo_viewer_nav_item:first').addClass('selected');
	$('.photo_viewer_photos').fadeIn(1500);
	setCaption();
}

function setCaption(){
	var captionHeight = $('.photo_viewer_caption').height();
	var photo_viewerHeight = $('.photo_viewer_container').height();
	var newCaptionTop = photo_viewerHeight - captionHeight - 15;
	$('.photo_viewer_caption').delay(100).animate({top: newCaptionTop}, 500);
}
