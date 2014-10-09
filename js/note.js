
function renderLookNote(data, notecolor) {
    console.log('render All notes');
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    var list = data == null ? [] : (data.note instanceof Array ? data.note : [data.note]);
    var notecode = "";
    $.each(list, function(index, note) {
        console.log('this far atleast');
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
        notecode += "<div class='note ' id="+note.note_id+" style='width: 100% !important; color: black; margin: 78px auto !important; background: #"+notecolor+"'>"+accomplished+"<div id='noteprofile'><a href='http://dev.boostnote.net/"+note.username+"'><img src='http://dev.boostnote.net/"+note.profile+"'><div id='profileName'>"+note.username+"</div></a></div><div class='notetitle'>"+note.title+"</div>"+imagehtml+"<p style='padding: 5px 15px;'>"+replaceDes+"</p> \
            <div class='displaytags'>"+tags+"</div><div id='boostno' "+boostcolor+">"+note.boost+"</div>"+boosted+"</div></div>";
        $('body').append(notecode);
        console.log('got this far');
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
}
