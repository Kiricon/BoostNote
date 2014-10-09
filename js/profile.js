/**
 * Created by ergo on 9/1/14.
 */
var loadspot = 25;
$(window).bind('scroll.myScroll',function() {
    if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexload').length) {
        var accid = $('#profile').attr('class');
        $('.notes').after('<div id="hexload" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
        getProfileNotes(accid, loadspot);
        loadspot += 25;
    }
});
var unclick = function(){
    $(this).children('span').text('Support');
    $(this).attr('id','support');
    $(this).unbind('click');
    $(this).bind('click', click);
    var accid = $(this).children('span').attr('class');
    unsupport(accid);
}
var click = function(){
    $(this).children('span').text('Unsupport');
    $(this).attr('id','unsupport');
    var accid = $(this).children('span').attr('class');
    $(this).unbind('click');
    $(this).bind('click', unclick);
    support(accid);
}
$('#support').bind('click', click);

function support(profileid){
    console.log('Support');
    $.ajax({
        type: 'POST',
        url: 'http://dev.boostnote.net/support/'+profileid,
        dataType: "text",
        success: function(data, textStatus, jgXHR) {
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

function getProfileNotes(userid, loadnum){
    $.ajax({
        type: 'GET',
        url: 'http://dev.boostnote.net/prof/'+userid+'/'+loadnum,
        dataType: "json",
        success: function(data, textStatus, jgXHR) {
            renderAllNotes(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
        }
    });
}

function getSupportNum(userid) {
    console.log('getSupportNum');
    $.ajax({
        type: 'GET',
        url: 'http://dev.boostnote.net/support/'+userid,
        dataType: "text", // data type of response
        success: function(data, textStatus, jgXHR) {
            $('#profile').append('<span class="supnum">Supporters: '+data+'</span>');
        }
    });
}

function renderAllNotes(data) {
    console.log('render All notes');
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    var oldtotal = $(".note img").length;
    var list = data == null ? [] : (data.note instanceof Array ? data.note : [data.note]);
    var notecode = "";
    $.each(list, function(index, note) {
        var imagehtml = "";
        var tags = "";
        var accomplished = "";
        var boosted = "<button href='#' class='boost "+note.note_id+"' value='"+note.note_id+"'></button>";
        var boostcolor = "";
        if(note.boosted){
            boosted = "";
            boostcolor = "style='color: white;'";
        }
        if (note.active == 1){
            accomplished = "<div class='accomplishedNote' title='Accomplished'><img alt='This note was accomplished' src='../img/star_full.png'></div>";
        }
        if(note.img != "none" && note.img != undefined && note.img != "" ){
            imagehtml = "<img class='noteimg' src='http://dev.boostnote.net/"+note.img+"'></img>";
        }
        if(note.tags != "none" && note.tags != undefined && note.tags != ""){
            var array = note.tags.split(',');
            var length = array.length;
            var i = 0;
            while(i < length){
                tags +=" #"+array[i];
                i++;
            }
        }
        var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig;
        var replaceDes = note.description.replace(regex, "<a href='$1' target='_blank'>$1</a>");
        notecode += "<div class='note ' id="+note.note_id+">"+accomplished+"<div id='noteprofile'><a href='http://dev.boostnote.net/"+note.username+"'><img src='"+note.profile+"'><div id='profileName'>"+note.username+"</div></a></div><div class='notetitle'>"+note.title+"</div>"+imagehtml+"<p style='padding: 5px 15px;'>"+replaceDes+"</p> \
            <div class='displaytags'>"+tags+"</div><div id='boostno' "+boostcolor+">"+note.boost+"</div>"+boosted+"</div></div>";
        /*  if(oldtotal){

         }else{
         $('.notes').append(notecode);
         }
         boostCheck(note.note_id); */
    });
    var allnotes = $(notecode);
    if(oldtotal){
        $('#hexload').remove();
        $('.notes').append(allnotes).masonry('appended', allnotes);
    }else{
        $('.notes').append(allnotes);
    }

    $('.noteimg, .note p, .notetitle').click(function() {
        var x = $(this).parent().css('backgroundColor');
        var notecolor = hexc(x);
        var linklocation = 'http://dev.boostnote.net/looknote/'+$(this).parent().attr('id')+'/'+notecolor;
        $.fancybox({
            afterClose: function(){
                history.replaceState(null, null, '/');
            },
            type: 'ajax',
            href: linklocation

        }) ;
        window.history.replaceState(null, null, 'note/'+$(this).parent().attr('id'));
    });

    $(".boost").click(function (){
        $(this).unbind('click');
        var boostdata = JSON.stringify({
            "noteid": $(this).val()
        });
        boostNote(boostdata);
        var yee = $(this).siblings('#boostno').text();
        yee = Number(yee) + 1;
        $(this).siblings('#boostno').text(yee);
        $(this).siblings('#boostno').css('color', 'white');
        $(this).remove();

    });
    if(!oldtotal){$(".notes").masonry('destroy');}
    var total = $(".note img").length - oldtotal;
    if(total != null && total != undefined && total != 0){
        $(".note img").load(function(){
            total--;
            if(total == 0){
                $(".notes").masonry({
                    itemSelector: '.note'
                });
                $('#hexload').remove();
                $('.notes').css("opacity", "0.98");
            }
        });
    }
    else {
        $(".notes").masonry({
            itemSelector: '.note'
        });
        $('#hexload').remove();
        $('.notes').css("opacity", "0.98");
    }

}

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return notecolor = parts.join('');
}