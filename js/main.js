/* SCRIPT THAT STARTS OFF EVERYTHING */
StartUp();


function StartUp(){
      getAccount();
        findMyNotes();
    $(".ui-autocomplete-input").attr("placeholder", "#tag");
    $("#notedescription").on("focus", (function(){
        $(this).css("height", "100px");
    }));
    $("#notedescription").focusout(function(){
        if($(this).val() == "" || $(this).val() == null){
            $(this).css('height', "20");
        }
    });

    $(document).scroll(function() {
        if ($(this).scrollTop() > 57 && $(window).width() <= 790) {
           // $('.navigation').css('position','fixed');
            //$('.navigation').css('-webkit-backface-visibility', 'hidden');

            $('.navigation').css('top','0px');
           // $('.navigation').css('left', '0px');
        }
        else {
            var height = 57 - $(this).scrollTop();
            $('.navigation').css('top', height);
        }
    });
        $('#notesubmit').click(notesub);
        $('#noteForm').submit(notesub);
    function notesub(){
        if($.trim($('#titleinput').val()) == ''){
            alert("the Title Cannot be left empty!");
            //toggleDialog('headerWarning');
            //document.querySelector('#notitle').show()
        }else{
            if($(".imagehere").is(":empty")){
                addNote();
            }
            else {
                console.log('its happening');
                $(".imagehere div").prepend('<span class="uploading"></span>');
                $(".imagehere img").css('opacity', '0.7');

                var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />');

                $("body").append(iframe);

                var form = $('#noteForm');
                form.attr("action", "http://dev.boostnote.net/api/upload");
                form.attr("method", "post");

                form.attr("encoding", "multipart/form-data");
                form.attr("enctype", "multipart/form-data");

                form.attr("target", "postiframe");
                form.attr("file", $('.inputFile').val());
                form.submit();

                $("#postiframe").load(function () {
                    console.log('this happend too!');
                    var iframeSrc = this.contentWindow.document.body.innerHTML;
                    $("#insertimage").val(iframeSrc);
                    $(".uploading").remove();

                    addNote();
                });
            }

        }
        return false;
    }
        $(".inputFile").change(function(){
        readURL(this);
        });
        $("#private").click(function(){
        if($(this).val() == 0){
            $(this).val("1");
            $(this).attr("style", "background:url(img/lock.png) no-repeat center");
        }else {
            $(this).val("0");
            $(this).attr("style","background:url(img/unlock.png) no-repeat center");
        }
            return false;
        });
        $('.wall').click(function (){
            $(document).scrollTop(0);
            emptyNote();
            $('.notes').empty();
            $('.notes').before('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
            $('.notes').css("opacity", "0");
            findAllNotes(0);
            $('.makenote').hide();
            $("#search").remove();
            $('#maincontent').prepend('<div id="searchcontainter"><form id="search"><select name="searchtype" id="searchtype"><option value="recent">Most Recent</option><option value="popular">Most Popular</option></select><input type="text" placeholder="Search..."></form></div>');
            $('#searchtype').change(function() {
                var loadspot = 25;
               if($(this).val() == 'recent'){
                   if($('#search input').val() != ''){
                       $('.notes').empty();
                       $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                       $('.notes').css("opacity", "0");
                       var inputsearch = $('#search input').val();
                       searchNotes(inputsearch, 0);
                   }else{
                       $('.notes').empty();
                       $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                       $('.notes').css("opacity", "0");
                    findAllNotes(0);
                       $(window).unbind('.myScroll');
                       $(window).bind('scroll.myScroll',function() {
                           if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexloader').length) {
                               $('.notes').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                               findAllNotes(loadspot);
                               loadspot += 25;
                           }
                       });
                   }
               }else if($(this).val() == 'popular'){
                   if($('#search input').val() != ''){
                       $('.notes').empty();
                       $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                       $('.notes').css("opacity", "0");
                       var inputsearch = $('#search input').val();
                       searchTopNotes(inputsearch, 0);
                       $(window).unbind('.myScroll');
                       $(window).bind('scroll.myScroll',function() {
                           if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexloader').length) {
                               $('.notes').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                               findTopNotes(inputsearch, loadspot);
                               loadspot += 25;
                           }
                       });
                   }else {
                       $('.notes').empty();
                       $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                       $('.notes').css("opacity", "0");
                   findTopNotes(0);
                       $(window).unbind('.myScroll');
                       $(window).bind('scroll.myScroll',function() {
                           if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexloader').length) {
                               $('.notes').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                               findTopNotes(loadspot);
                               loadspot += 25;
                           }
                       });
                   }
               }
            });
            $('#search').submit(function(){
                var loadnum = 25;
                var inputsearch = $('#search input').val();
                if($('#searchtype').val() == 'recent'){
                    $('.notes').empty();
                    $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                    $('.notes').css("opacity", "0");
                    searchNotes(inputsearch, 0);
                    $(window).unbind('.myScroll');
                    $(window).bind('scroll.myScroll',function() {
                        if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexloader').length) {
                            $('.notes').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                            searchNotes(inputsearch, loadnum);
                            loadspot += 25;
                        }
                    });
                }else if($('#searchtype').val() == 'popular'){
                $('.notes').empty();
                $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                $('.notes').css("opacity", "0");
                    searchTopNotes(inputsearch, 0);
                    $(window).unbind('.myScroll');
                    $(window).bind('scroll.myScroll',function() {
                        if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexloader').length) {
                            $('.notes').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                            findTopNotes(inputsearch, loadspot);
                            loadspot += 25;
                        }
                    });
                }
                return false;
            });
            var loadspot = 25;
            $(window).bind('scroll.myScroll',function() {
                if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexloader').length) {
                    $('.notes').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                    findAllNotes(loadspot);
                    loadspot += 25;
                }
            });
        });

    $('.popular').click(function (){
        $(document).scrollTop(0);
        emptyNote();
        $('.notes').empty();
        $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
        $('.notes').css("opacity", "0");
        findAccomplished();
        $('.makenote').hide();
        $("#search").remove();
        $(window).unbind('.myScroll');
    });

        $('.my').click(function (){
            $(document).scrollTop(0);
            emptyNote();
            $('.notes').empty();
            $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto; margin-top: 30px;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
            $('.notes').css("opacity", "0");
            findMyNotes();
            $('.makenote').show();
            $("#search").remove();
            $(window).unbind('.myScroll');
        });
    $('#settingsbutton').click(function(e){
        if(e.target.id === "settingsbutton" || e.target.id === "gearicon"){
            displaySettings();
        }
    });
    $('#logout').click(function(){
        document.cookie = 'uname=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
        document.cookie = 'pword=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
        window.location.reload();

    });
    $('#accsettings').click(function(){
        emptyNote();
       $('#selectdiv').remove();
       profileSettings();
    });
    $('.friends').click(function(){
        $('#selectdiv').remove();
        $('.notes').empty();
        $('.notes').css("opacity", "0");
        findSupportedNotes(0);
        $('.makenote').hide(); 
        $("#search").remove();
        emptyNote();
        $('.makenote').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
        $('.makenote').after('<div id="onlysupport">Only people you support</div>');
        $(window).unbind('.myScroll');
        var loadspot = 25;
        $(window).bind('scroll.myScroll',function() {
            if($(window).scrollTop() + $(window).height() == $(document).height() && !$('#hexloader').length) {
                $('.notes').after('<div id="hexloader" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>');
                findSupportedNotes(loadspot);
                loadspot += 25;
            }
        });
    });
    $('#about').click(function(){
        emptyNote();
        $('#selectdiv').remove();
        displayAbout();
    });
    $('.navitem').click(function(){
        emptyNote();
       $('#selectdiv').remove();
       $(this).append('<div id="selectdiv" style="width: 100%; height: 3px; background: #00c4d4; margin-top: 54px;"></div>');
    });
}

function recentNotes(){
    findAllNotes();
}

function setInfo(username, profile, wallpaper){
    $('.status').append('<img src="'+profile+'" class="profilepicture" /><p style="float:left;"><span id="username">'+username+'</span></p>');
    $('.status').click(function(){
        window.location = '/'+username;
    });
    if(wallpaper && $(window).width() > 790){
        $('body').attr('style', 'background:url('+wallpaper+') fixed; background-size: 100% 100%;');
    }else if($(window).width() > 790){
        $('#maincontent').prepend('<form id="setWallpaper"><div class="wallpaperbtn raisedbutton"><span>Set a Wallpaper</span></div><input id="wallpaperInput" name="file" type="file" accept="image/x-png, image/gif, image/jpeg" style="display: none;"></form>');
        $('.wallpaperbtn').click(function (){
           $('#wallpaperInput').trigger('click');
        });
        $('#wallpaperInput').change(function(){
            var iframe = $('<iframe name="wallpapersetiframe" id="wallpapersetiframe" style="display: none" />');

            $("body").append(iframe);

            var form = $('#setWallpaper');
            form.attr("action", "http://dev.boostnote.net/api/upload");
            form.attr("method", "post");

            form.attr("encoding", "multipart/form-data");
            form.attr("enctype", "multipart/form-data");

            form.attr("target", "wallpapersetiframe");
            form.attr("file", $('#wallpaperInput').val());
            form.submit();

            $("#wallpapersetiframe").load(function () {
                var iframeSrc = this.contentWindow.document.body.innerHTML;
                $('#setWallpaper').remove();
                $('body').attr('style', 'background:url('+iframeSrc+') fixed; background-size: 100% 100%;');
                var srcpaper = JSON.stringify({"src": iframeSrc});
                setWallpaper(srcpaper);
            });

            return false;
        });
    }
}
function renderNotes(data) {
    $('.notes').empty();
    console.log('render all notes');
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    var list = data == null ? [] : (data.note instanceof Array ? data.note : [data.note]);

    $.each(list, function(index, note) {
        var imagehtml = "";
        var locked = "";
        var tags = "";
        var accomplished = "";
        if (note.active == 1){
            accomplished = "<div class='accomplishedNote'>Accomplished!</div>";
        }
        if(note.img != "none" && note.img != undefined && note.img != "" ){
            imagehtml = "<img class='noteimg' src='"+note.img+"'></img>";
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

        if(note.private != 0){
            locked = "<span class='privatenote'></span>";
        }
        var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig;
        var replaceDes = note.description.replace(regex, "<a href='$1' target='_blank'>$1</a>");
        var notecode = "<div class='note ' id="+note.note_id+">"+accomplished+"<div class='notetitle'>"+note.title+"</div>"+imagehtml+"<p style='padding: 5px 10px;'>"+replaceDes+"</p>"+locked+" \
            <button class='accomplish' type='submit' name='accomplished' value='"+note.note_id+"'></button> \
            <button type='submit' name='edit' value='"+note.note_id+"' class='editbutton'></button><button name='close' value='"+note.note_id+"' class='closebutton'></button><br/><div class='displaytags'>"+tags+"</div><div id='noteboostnum'>"+note.boost+"</div></div>";
        $('.notes').append(notecode);
    });

    $('.accomplish').click(function (){
        var description = $(this).siblings('p').text();
        var notetitle = $(this).siblings('.notetitle').text();
        var noteid = $(this).val()
        var img = $(this).siblings('img').attr('src');
        var tags = $(this).siblings('.displaytags').text();
        var tagstring = tags.split(" #");
        var taglength = tagstring.length;
        var i = 1;
        while(i < taglength){
            $('#singleFieldTags').tagit('createTag', tagstring[i]);
            i++;
        }
        if($(this).siblings('.privatenote').length){
            $('#private').val("1");
            $('#private').attr("style", "background:url(img/lock.png) no-repeat center");
        }
        $('#titleinput').val(notetitle);
        $('#notedescription').val(description);

        if(img != undefined){
            $("#insertimage").val(img);
            $("#originalimage").val(img);
            $('.imagehere').append('<div><span id="killimage" title="remove"></span><img id="displayimg" src="'+img+'" class="resultImage"></div>');
            $('#killimage').click(function() {
                $(this).parent().remove();
            });
        }
        $('#notesubmit').unbind('click');
        $('#notesubmit').remove();
        $('#tray').append('<div id="accomplishsubmit" class="submitbutton raisedbutton "><span>Accomplish</span></div>')
        $(this).parent().hide();
        $('#accomplishsubmit').click(function(){
            if($.trim($('#titleinput').val()) == '') //check for empty title
            {
                alert("the Title Cannot be left empty!");
            }

            else{
                if($(".imagehere").is(":empty") || $('#originalimage').val() == $('#insertimage').val()){
                    accomplishNote(noteid);
                }
                else {
                    $(".makenote").prepend('<div class="uploading">Uploading Image...</div>');
                    accomplishImage(noteid);
                }
            }
        });
        $(document).scrollTop(0);

    });
    $('.closebutton').click(function (){
        var noteid = $(this).val();
        deleteNote(noteid);
        document.querySelector('#deletetoast').show()
    });

    $('.editbutton').click(function (){
        var description = $(this).siblings('p').text();
        var notetitle = $(this).siblings('.notetitle').text();
        var noteid = $(this).val()
        var img = $(this).siblings('img').attr('src');
        var tags = $(this).siblings('.displaytags').text();
        var tagstring = tags.split(" #");
        var taglength = tagstring.length;
        var i = 1;
        while(i < taglength){
            $('#singleFieldTags').tagit('createTag', tagstring[i]);
            i++;
        }
        if($(this).siblings('.privatenote').length){
            $('#private').val("1");
            $('#private').attr("style", "background:url(img/lock.png) no-repeat center");
        }
        $('#titleinput').val(notetitle);
        $('#notedescription').val(description);

        if(img != undefined){
        $("#insertimage").val(img);
        $("#originalimage").val(img);
        $('.imagehere').append('<div><span id="killimage" title="remove"></span><img id="displayimg" src="'+img+'" class="resultImage"></div>');
        $('#killimage').click(function() {
            $(this).parent().remove();
        });
        }
        $('#notesubmit').unbind('click');
        $('#content span').text('Update');
       // $('#notesubmit').attr('id', 'updatesubmit');
        $('#notesubmit').remove();
        $('#tray').append('<div id="updatesubmit" class="submitbutton raisedbutton"><span>Update</span></div>')
        $(this).parent().hide();
        $('#updatesubmit').click(function(){
            if($.trim($('#titleinput').val()) == '') //check for empty title
            { alert("the Title Cannot be left empty!");
                //toggleDialog('headerWarning');
                //document.querySelector('#notitle').show()
            }

            else{
                if($(".imagehere").is(":empty") || $('#originalimage').val() == $('#insertimage').val()){
                    updateNote(noteid);
                }
                else {
                    $(".makenote").prepend('<div class="uploading">Uploading Image...</div>');
                    updateImage(noteid);
                }
            }
        });
        $(document).scrollTop(0);
    });
    $(".notes").masonry('destroy');
    var total = $(".note img").length;
    if(total != null && total != undefined && total != 0){
    $(".note img").load(function(){
        total--;
        if(total ==0){

            $(".notes").masonry({
                itemSelector: '.note'
            });
            $('#hexloader').remove();
            $('.notes').css("opacity", "1");
        }
    });
    }else {

        $(".notes").masonry({
            itemSelector: '.note'
        });
        $('#hexloader').remove();
        $('.notes').css("opacity", "1");
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
            href: linklocation,
            padding: 8

        }) ;
        window.history.replaceState(null, null, 'note/'+$(this).parent().attr('id'));
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
    });
    var allnotes = $(notecode);
    if(oldtotal){
       // $('#hexload').remove();
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
            href: linklocation,
            padding: 8

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
            $('#hexloader').remove();
            $('.notes').css("opacity", "0.98");
        }
    });
    }else {
        $(".notes").masonry({
            itemSelector: '.note'
        });
        $('#hexloader').remove();
        $('.notes').css("opacity", "0.98");
    }

}

function renderAccomplishedNotes(data) {
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
        notecode += "<div class='note ' id="+note.note_id+">"+accomplished+"<button class='deletenote' value='"+note.note_id+"'></button><div id='noteprofile'><a href='http://dev.boostnote.net/"+note.username+"'><img src='"+note.profile+"'><div id='profileName'>"+note.username+"</div></a></div><div class='notetitle'>"+note.title+"</div>"+imagehtml+"<p style='padding: 5px 15px;'>"+replaceDes+"</p> \
            <div class='displaytags'>"+tags+"</div><div id='boostno' "+boostcolor+">"+note.boost+"</div>"+boosted+"</div></div>";
    });
    var allnotes = $(notecode);
    if(oldtotal){
      //  $('#hexload').remove();
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
            href: linklocation,
            padding: 8

        }) ;
        window.history.replaceState(null, null, 'note/'+$(this).parent().attr('id'));
    });
    $('.deletenote').click(function(){
       var notenum = $(this).val();
       deleteAccomplishedNote(notenum);
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
                $('#hexloader').remove();
                $('.notes').css("opacity", "0.98");
            }
        });
    }
    else {
        $(".notes").masonry({
            itemSelector: '.note'
        });
        $('#hexloader').remove();
        $('.notes').css("opacity", "0.98");
    }

}

// Helper function to serialize all the form fields into a JSON string d
function formToJSON() {
    return JSON.stringify({
        "title": $("#titleinput").val(),
        "description": $("#notedescription").val(),
        "img": $("#insertimage").val(),
        "private": $("#private").val(),
        "tags": $("#mySingleField").val()
    });
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.imagehere').empty();
            $('.imagehere').append('<div><span id="killimage" title="remove"></span><img src="'+e.target.result+'" class="resultImage"></div>');
            $('#insertimage').val(e.target.result);
            $('#killimage').click(function() {
               $(this).parent().remove();
            });
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function arraytag() {
    var string = $("#mySingleField").val();
    var array = string.split(',');
    var arraylength = array.length;
    alert(arraylength+": "+array[2]);
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


