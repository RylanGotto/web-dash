// place any jQuery/helper plugins in here, instead of separate, slower script files.



$(document).ready(function (){
  var clock;
      clock = $('.clock').FlipClock({
            autoStart: false,
            countdown: true,
            callbacks: {
              stop: function() {
                $('.fa-pencil-square-o').click();
                             
              }
            }
        });



    $( "#sortable1, #sortable2" ).sortable({
      connectWith: ".connectedSortable",
            cursor: 'pointer',
            axis: 'y',
      stop: function( event, ui ) { 
        console.log(this);
        var check = $('#sortable2').children().length;
        if(check === 2){
          $('#sortable2 > li:nth-child(1)').hide('fast').remove();
        };
        
        var clock;
        clock = $('.clock').FlipClock({
            autoStart: false,
            countdown: true,
            callbacks: {
              stop: function() {
                $('.fa-pencil-square-o').click();
                if(parseInt(clock.getTime()) === 0){
                  $('#player')[0].play();
                }
                
                
              }
            }
        });

        var limit = $('mins').html();
        var a = limit.split(':')
        
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) + 1; 
       
        clock.setTime(seconds);
        clock.start();
        clock.stop();

         $('.fa-play').on('click', function(){
          clock.start();
        });
        $('.fa-pause').on('click', function(){
          clock.stop();

        });

      }
    }).disableSelection();


    

});

$( "#draggable" ).on( "dragstop", function( event, ui ) { alert('done');} );
$(document).on({
     ajaxStart: function() { $('.fa-spinner').fadeIn('slow');  },
     ajaxStop: function() { $('.fa-spinner').fadeOut('slow'); }    
});


function set_exit_click(){
  $('.fa-times-circle-o').on('click', function(){
  $(this).parent('.info').hide('slow');
});
}

function clear_stories(){
  $('.info').find('.check_box').each(function(){
        if (this.checked === false){
          
          $(this).parent('.info').hide('fast');

        }else{

          $(this).parent('.info').appendTo('.favorites');

        }
      });
}

function add_fav_handler(){
  $('.add_favs').on('click', function(){
          $('.show_favs').css('color','#66FF66');
          $(this).css('display', 'none');
          $(this).parents('.info').find('.check_box').prop('checked', true);
          $(this).parents('.info').hide('slow', function(){
              $(this).appendTo('.favorites').show();
          });

});

}


$('.fa-reddit').on('click', function(){
  $.when($('.task_manager, .calender').fadeOut('fast')).done(function(){
    $('.reddit_reader').fadeIn('fast');
  });
});

$('.fa-pencil-square-o').on('click', function(){
  $.when($('.reddit_reader, .calender').fadeOut('fast')).done(function(){
    $('.task_manager').fadeIn('fast');
  });
});

$('.fa-calendar').on('click', function(){
  $.when($('.reddit_reader, .task_manager').fadeOut('fast')).done(function(){
    $('.calender').fadeIn('fast');
  });
});


$('.show_favs').on('click', function(){
  $('.show_favs').css('color','white');
  $('.favorites').show('slow');
  $('.ogp, .reddits').hide('slow');
});



$('.fa-times-circle-o').on('click', function(){

  clear_stories();

});

$('#search, #search_limit').keypress(function(e){
	var key = e.which;
 	if(key == 13)  // the enter key code
  	{
      
      $('.favorites').hide();
      clear_stories();

      $('.ogp, .reddits').empty().show();
  		$.get("http://localhost:5000/get_stories", {subreddit: $('#search').val(), limit: $('#search_limit').val() } ).done(function(data){

			

  		data['stories']['ogp_stories'].forEach(function(entry) {
    		


    		$('.ogp').prepend('<div class="container info">' + 
    			'<i class="fa fa-times-circle-o"></i>' + 
          '<input class="check_box" type="checkbox" style=""/ >' +
    			'<a href="'+ entry.ogp_data.url +'" target="_blank"><h3>' + entry.reddit_info.title + '</h3></a>' + 
    			'<div class="col-md-1">' +
    			'<img class="img-rounded" style="" src="' + entry.ogp_data.image + '" />' + 
    			'</div><div class="col-md-9">' + '<code>' + entry.reddit_info.ups +  'upvotes</code>' + '<i class="fa fa-star-o add_favs"></i> ' +
    			'<p>' +  entry.ogp_data.description +'</p>' + 
          
    			'</div> </div>').hide().fadeIn('slow');  


		});

		data['stories']['reddit_stories'].forEach(function(entry) {
    		


    		$('.reddits').prepend('<div class="container info">' + 
    			'<i class="fa fa-times-circle-o"></i>' + 
          '<input class="check_box" type="checkbox" style=""/ >' +
    			'<a href="'+ entry.reddit_info.url +'" target="_blank"><h3>' + entry.reddit_info.title + '</h3></a>' + 
    			'<div class="col-md-1">' +
    			'<img class="img-rounded" style="" src="http://a0.web.wt-cdn.com/post_items/images/000/014/681/large/Screen-Shot-2012-06-13-at-3.30.31-PM.jpg" />' + 
    			'</div><div class="col-md-9">' + '<code>' + entry.reddit_info.ups+  'upvotes</code>' + '<i class="fa fa-star-o add_favs"></i> ' +

    			'</div> </div>').hide().fadeIn('slow');  


		});
    set_exit_click();
		add_fav_handler();
		});
  	}

});


$('#task_desc, #task_limit').keypress(function(e){
  var key = e.which;
  if(key == 13)  // the enter key code
    {
      var desc = $('#task_desc').val();
      var limit = $('#task_limit').val();
      
      $('.tasks').prepend('<li style="pointer: cursor;"><div id="" class="container info">' + 
          '<i class="fa fa-times-circle-o"></i>' + 
          '<input class="check_box" type="checkbox" style=""/ >' +
          '<h3>'+ desc + ' <span class="minutes" >complete me in <mins>' + limit  + '</mins></span></h3>' + 
          '</div> </div></li>').hide().fadeIn('slow');  
    }
    set_exit_click();

});







 	  

