// place any jQuery/helper plugins in here, instead of separate, slower script files.
function set_delete_monitored_reddit_action(){
  $('.fa-times-circle-o').on('click', function(){

  $(this).parent('.info').hide('slow', function(){
  			$(this).remove();
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

		  	  list[reddit_name + ' new'] = upvote_limit;
		  	  $(".info").each(
				function(){

				  reddit_name_exists = $(this).find('h3').html();
				  upvote_limit_exists = $(this).find('input[type="number"]').val();
				  list[reddit_name_exists] = upvote_limit_exists;
				}
		);

		      $.get("http://localhost:5000/user_manager/save_new_reddit", list).done(function(data){

		      		$('.reddits').prepend('<li style="pointer: cursor;"><form id="monitored-reddits"><div id="focuses" style="opacity: 1;"><div class="prompt1" style="opacity: 1; display: block;"><div id="" class="container info">' + 
			          '<i class="fa fa-times-circle-o"></i>' + 
			          '<input class="check_box" type="checkbox" style="display:none;"/ >' +
			          '<h3 style="display: inline-block;">'+ reddit_name + '</h3><input style="width:75px;display: inline-block; float: right; " type="number" value="' + upvote_limit  + '" />' + 
			          '</div></div></div></div></form></li>').hide().fadeIn('slow');  
		      		$('#num_reddits').html($('.info').size());
		      		set_delete_monitored_reddit_action();
		    		
			
	    		}).fail(function(){
	    			$('#search_alert').fadeIn('slow').delay(800).fadeOut('slow');
	    		});
	    	}

		 });
}

function set_save_settings_action(){
	$('#save-settings').on('click', function(){
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

		list['user_id'] = $('#user_id').val();
		console.log(list);

		
		$.get("http://localhost:5000/user_manager/save_user_settings", list).done(function(data){

    	});

		});
	    
}

function set_change_background_behaviour(){
    	$.get("http://localhost:5000/user_manager/get_new_background", {user_id: $('#user_id').val(), current_theme: $('#current_theme').val() }).done(function(data){
			$('body').css({'background-image': 'url('+data+')'});
	
	    });
}

function limit_checkbox_to_one_checked(){
	$('input.feeling-checkbox').on('change', function() {
    	$('input.feeling-checkbox').not(this).prop('checked', false);  
	});

}

$(document).ready(function (){
    
    	$(document).on({
     		ajaxStart: function() { $('.fa-spinner').fadeIn('slow');  },
     		ajaxStop: function() { $('.fa-spinner').fadeOut('slow'); }    
		});

		limit_checkbox_to_one_checked();
		set_add_monitored_reddit_action();
		set_save_settings_action();
		set_change_background_behaviour();

});
