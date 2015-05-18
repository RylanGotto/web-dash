// place any jQuery/helper plugins in here, instead of separate, slower script files.
function set_delete_monitored_reddit_action(){
  $('.fa-times-circle-o').on('click', function(){
  			  list = {};
  			  reddit_name = $(this).siblings('h3').html();
  			  list[reddit_name] = reddit_name;
  	$(this).parent('.info').hide('slow', function(){
  			  $(this).remove();

  			  $.get("http://localhost:5000/user_manager/remove_reddit", list).done(function(data){
  			  		$('#search_alert').html(reddit_name + ' removed!').fadeIn('slow').delay(800).fadeOut('slow');
  			  });
  			  $('#num_reddits').html($('.info').size());
  	});
  });
}

function set_add_monitored_reddit_action(){
	$('#upvote_thresh_hold, #reddit_name').keypress(function(e){
			var key = e.which;
		 	if(key == 13)  // the enter key code
		  	{



		      list = {};
		      upvote_limit = $('#upvote_thresh_hold').val();
		  	  reddit_name = $('#reddit_name').val();

		  	  list[reddit_name] = upvote_limit;
		  	 

		      $.get("http://localhost:5000/user_manager/save_new_reddit", list).done(function(data){

		      		$('.reddits').prepend('<li style="pointer: cursor;"><form id="monitored-reddits"><div id="focuses" style="opacity: 1;"><div class="prompt1" style="opacity: 1; display: block;"><div id="" class="container info">' + 
			          '<i class="fa fa-times-circle-o"></i>' + 
			          '<input class="check_box" type="checkbox" style="display:none;"/ >' +
			          '<h3 style="display: inline-block;">'+ reddit_name + '</h3><input style="margin-right: 1rem; width:75px;display: inline-block; float: right; " type="number" value="' + upvote_limit  + '" />' + 
			          '</div></div></div></form></li>').hide().fadeIn('slow');  
		      		$('#num_reddits').html($('.info').size());
		      		set_delete_monitored_reddit_action();
		    		$('#search_alert').html('Saved!').fadeIn('slow').delay(800).fadeOut('slow');
			
	    		}).fail(function(){
	    			$('#search_alert').html('Cannot save two of the same reddits!').fadeIn('slow').delay(800).fadeOut('slow');
	    		});
	    	}

		 });
}

function set_save_settings_action(){
	$('#save-settings').on('click', function(e){
		e.preventDefault();
		var data = {};
		list = {};
		var ar = $("#news-feed-form").serializeArray();
		ar.forEach(function(item){
			list[item['name']] = item['name'];
		});
			
		$(".how-are-you-feeling-wrap input[type='checkbox']:checked").each(
			function(){
			  id = $(this).attr('id');
			  type = $(this).attr('data-type');
			  list[type] = id;
			}
		);

		console.log(list);

		user_location = $('#location').val();
		list['location'] = user_location;
		loadWeather(user_location,'')

		$.get("http://localhost:5000/user_manager/save_user_settings", list).done(function(data){});
	

		});
	    
}

function set_change_background_behaviour(){
    	$.get("http://localhost:5000/user_manager/get_new_background", {current_theme: $('#current_theme').val() }).done(function(data){
			$('body').css({'background-image': 'url('+data+')'});
	
	    });
}

function limit_checkbox_to_one_checked(){
	$('input.feeling-checkbox').on('change', function() {
    	$('input.feeling-checkbox').not(this).prop('checked', false);  
	});

}

function set_refresh_background_action(){
	$('.fa-refresh').on('click', function(){
		set_change_background_behaviour();
	});
}
$.get("http://localhost:5000/user_manager/get_quote").done(function(data){
			data = jQuery.parseJSON(data)
			$('#quote').html(data['quote']);
			$('#quote_author').html(" - " + data['author']);

	
	    }).fail(function(){
	    	
	    });

$(document).ready(function (){
    	$('#num_reddits').html($('.info').size());
    	$(document).on({
     		ajaxStart: function() { $('.fa-spinner').fadeIn('slow');  },
     		ajaxStop: function() { $('.fa-spinner').fadeOut('slow'); }    
		});

    	

		limit_checkbox_to_one_checked();
		set_add_monitored_reddit_action();
		set_save_settings_action();
		set_change_background_behaviour();
		set_delete_monitored_reddit_action();
		set_refresh_background_action();


});

/* Does your browser support geolocation? */
if ("geolocation" in navigator) {
  $('.js-geolocation').show(); 
} else {
  $('.js-geolocation').hide();
}

/* Where in the world are you? */
$('.js-geolocation').on('click', function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
  });
});

/* 
* Test Locations
* Austin lat/long: 30.2676,-97.74298
* Austin WOEID: 2357536
*/
$(document).ready(function() {
	$.get("http://localhost:5000/user_manager/get_user_location").done(function(data){
			
			loadWeather(data,'');
	
	    }).fail(function(){
	    	loadWeather('Seattle','');
	    });
   //@params location, woeid
});

function loadWeather(location, woeid) {
  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'c',
    success: function(weather) {
      html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2><p style="  position: relative; top: -3rem;" >in ' + weather.city;
      
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}






