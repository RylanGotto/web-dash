// place any jQuery/helper plugins in here, instead of separate, slower script files.
function set_exit_click(){
  $('.fa-times-circle-o').on('click', function(){
  $(this).parent('.info').hide('slow');
  $(this).parent('.info').destroy();

});
}

$(document).ready(function (){
    $.fn.changeBackground = function(){
    	$.get("http://localhost:5000/theme_manager/get_new_background", {user_id: $('#user_id').val(), current_theme: $('#current_theme').val() }).done(function(data){
			$('body').css({'background-image': 'url('+data+')'});
	
	    });
    }
    $.fn.changeBackground();

	$('input.feeling-checkbox').on('change', function() {
    	$('input.feeling-checkbox').not(this).prop('checked', false);  
	});



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



			$.get("http://localhost:5000/theme_manager/test", list).done(function(data){
			
	    });

		});

	$('#search, #search_limit').keypress(function(e){
	var key = e.which;
 	if(key == 13)  // the enter key code
  	{
  	  var desc = $('#search').val();
      var limit = $('#search_limit').val();

      
      $('.reddits').prepend('<li style="pointer: cursor;"><div id="" class="container info">' + 
          '<i class="fa fa-times-circle-o"></i>' + 
          '<input class="check_box" type="checkbox" style=""/ >' +
          '<h3>'+ desc + ' <span class="minutes" >complete me in <mins>' + limit  + '</mins></span></h3>' + 
          '</div> </div></li>').hide().fadeIn('slow');  
    }
    set_exit_click();
  	
  });


});
