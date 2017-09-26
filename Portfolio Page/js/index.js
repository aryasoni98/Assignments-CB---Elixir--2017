//Function to reduce the size of navbar whule scrolling down
$(window).scroll(function() {
  if ($(document).scrollTop() > 50) {
    $('nav').addClass('shrink');
  } else {
    $('nav').removeClass('shrink');
  }
});

//Funtion to hide navbar when user clicks on any navbar-link
$('.nav a').click(function(){
    $('.navbar-collapse').collapse('hide');
});

//JQUERY Function for smooth scrolling
$(document).ready(function(){
  $('.navbar a').on('click',function(e){
    e.preventDefault();
    $('#Portfolio').css('margin-top',80);
    $('#contact-section').css('padding-top',65);
    var hash=this.hash;
    
    $('html, body').animate({ 
      scrollTop:  $(hash).offset().top }, 1000)
  });
});


//Function to get the project name in the modal dynamically


$(document).on("click",".portfolio-link",function(){
    $('#projectName').empty();  
    var id=$(this).attr("href");
    var text=$(id).text();
    $('#projectName').append(text);
        
});