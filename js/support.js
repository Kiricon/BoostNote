/**
 * Created by ergo on 9/1/14.
 */
$('.support').click(function(){
    emptyNote();
    $('#selectdiv').remove();
    $('.makenote').hide();
    $("#search").remove();
    $('.notes').empty();
    $('#selectnav').remove();
    $('.notes').append('<div id="supporting">' +
        '<div><span class="supportTitle">People you support</span></div>' +
        '<div class="supportPeople"></div>' +
        '</div>');
    getSupported();
});

function getSupported(){
    console.log('Supported');
    $.ajax({
        type: 'GET',
        url: 'http://dev.boostnote.net/api/supported',
        dataType: "json",
        success: function(data, textStatus, jgXHR) {
            $.each(data, function(){
                $('.supportPeople').append('<div class="user">' +
                    '<a href="/'+this.username+'"><div>' +
                    '<img class="proimg" src="'+this.profile+'">' +
                    '<span>'+this.username+'</span></div></a>' +
                    '<img id="'+this.id+'" class="deleteUser" src="img/redminus.png">' +
                    '</div>');
            });
            $('.deleteUser').click(function(){
                var acvar = $(this).attr('id');
                unsupport(acvar);
                $(this).addClass('spin');
                $(this).siblings('a').css('width', '0%');
                $(this).parent().fadeOut(500);
                var parent = $(this).parent();
                setTimeout(function(){
                    parent.remove();
                }, 600);
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
        }
    });
}

function unsupport(supported){
    $.ajax({
        type: 'DELETE',
        url: 'http://dev.boostnote.net/api/support/'+supported,
        dataType: "text",
        success: function(data, textStatus, jgXHR) {
        },
        error: function(jqXHR, textStatus, errorThrown){
        }
    });
}