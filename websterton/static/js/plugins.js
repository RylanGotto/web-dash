// place any jQuery/helper plugins in here, instead of separate, slower script files.
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
			list = {};
		$("input[type='checkbox']:checked").each(
			function(){
			  id = $(this).attr('id');
			  type = $(this).attr('data-type');
			  list[type] = id;
			}
		);
		list['user_id'] = $('#user_id').val();
			$.get("http://localhost:5000/theme_manager/test", list).done(function(data){
			
	    });

		});


});
