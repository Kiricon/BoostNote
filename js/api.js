// The root URL for the RESTful services
var rootURL = "http://dev.boostnote.net/api";
function emptyNote(){
    $('#titleinput').val("");
    $('#notedescription').val("");
    $("#insertimage").val("");
    $(".imagehere").empty();
    $("#mySingleField").val("");
    $('.tagit-choice').remove();
    $('#onlysupport').remove();
    $('#notedescription').css('height', '20px');
    $('#private').val("0");
    $('#private').attr("style","background:url(img/unlock.png) no-repeat center");
    if($('#updatesubmit').length){
    $('#updatesubmit').unbind('click');
    $('#updatesubmit').remove();
    $('#tray').append('<paper-button raisedButton class="colored" label="Submit" onclick="toggleDialog(paper-dialog-transition-bottom)" id="notesubmit" class="submitbutton"></paper-button>');
    $('#notesubmit').click(function (){
        if($.trim($('#titleinput').val()) == '') //check for empty title
        { alert("the Title Cannot be left empty!");}

        else{
            insertNote();
            addNote();
        }
        document.querySelector('#addtoast').show()
    });
    }
    if($('#hexload').length){
        $('#hexload').remove();
    }

    if($('#accomplishsubmit').length){
        $('#accomplishsubmit').unbind('click');
        $('#accomplishsubmit').remove();
        $('#tray').append('<paper-button raisedButton class="colored" label="Submit" onclick="toggleDialog(paper-dialog-transition-bottom)" id="notesubmit" class="submitbutton"></paper-button>');
        $('#notesubmit').click(function (){
            if($.trim($('#titleinput').val()) == '') //check for empty title
            { alert("the Title Cannot be left empty!");}

            else{
                insertNote();
                addNote();
            }
            document.querySelector('#addtoast').show()
        });
    }

}

function findMyNotes() {
    console.log('findMyNotes');
    $.ajax({
        type: 'GET',
        url: rootURL +'/my',
        dataType: "json", // data type of response
        success: renderNotes
    });
}

function findAllNotes(loadnum) {
    console.log('findAllNotes');
    $.ajax({
        type: 'GET',
        url: rootURL +'/all/'+loadnum,
        dataType: "json", // data type of response
        success: function(data, textStatus, jgXHR) {
            renderAllNotes(data);
        }
    });
}

function findSupportedNotes(loadnum) {
    console.log('findAllNotes');
    $.ajax({
        type: 'GET',
        url: rootURL +'/supported/'+loadnum,
        dataType: "json", // data type of response
        success: function(data, textStatus, jgXHR) {
            renderAllNotes(data);
        }
    });
}

function findAccomplished() {
    console.log('findAllNotes');
    $.ajax({
        type: 'GET',
        url: rootURL +'/accomplished',
        dataType: "json", // data type of response
        success: renderAccomplishedNotes
    });
}

function findTopNotes(loadnum) {
    console.log('findAllNotes');
    $.ajax({
        type: 'GET',
        url: rootURL +'/top/'+loadnum,
        dataType: "json", // data type of response
        success: renderAllNotes
    });
}

function sendEmail() {
        console.log('findAllNotes');
        $.ajax({
            type: 'GET',
            url: rootURL +'/email',
            dataType: "text", // data type of response
            success: function(data, textStatus, jgXHR) {
                alert('it worked');
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Registration error: '  + textStatus + errorThrown + jqXHR);
                alert('Registration error: ' + textStatus + errorThrown + jqXHR);
            }

        });
}

function searchNotes(search, numvar) {
    console.log('http://dev.boostnote.net/search/'+ search +'/'+numvar);
    $.ajax({
        type: 'GET',
        url:'http://dev.boostnote.net/search/'+ search +'/'+numvar,
        dataType: "json", // data type of response
        success: function(data, textStatus, jgXHR) {
            renderAllNotes(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Search error: '  + textStatus + errorThrown + jqXHR.error);
            alert('Search error: ' + textStatus + errorThrown + jqXHR.error);
        }
    });
}

function searchTopNotes(search, numvar) {
    console.log('search');
    $.ajax({
        type: 'GET',
        url:'http://dev.boostnote.net/top/'+ search +'/'+numvar,
        dataType: "json", // data type of response
        success: renderAllNotes
    });
}



function Login(username, password) {
    console.log('Login');
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + username + '/' + password,
        dataType: "text", // data type of response
        success: function(data, textStatus, jgXHR) {
            if(data == 'true'){
                location.reload();
            }
            else{
                console.log(data.username);
                alert('Invalid Login credentials');
            }
        }
    });
}

function Register() {
    console.log('Register');
    $.ajax({
        type: 'POST',
        url: rootURL + '/Register',
        contentType: 'application/json',
        data: regToJSON(),
        dataType: "json",
        success: function(data, textStatus, jgXHR) {
        location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Registration error: '  + textStatus + errorThrown + jqXHR);
           alert('Invalid Registration Credentials');
        }
    });
}

function userExists(username){
    //console.log('usercheck');
    $.ajax({
        type: 'GET',
        //so the ../ is nessesary cause rootURL is /api and slim is only 1 deep cause its lame
        url: rootURL + '/../checkUser/' + username,
        //dataType: "json", // data type of response
        success: function(data) {
            if(data == 'true'){
               // console.log(data+": username is taken");
                $('#runame').removeClass().addClass('inputRed');
            }
            else{
                //console.log(data+": username "+username+" is free");
                $('#runame').removeClass().addClass('inputGreen');
            }
        }
    });
}

function emailExists(email){
    //console.log('usercheck');
    $.ajax({
        type: 'GET',
        //so the ../ is nessesary cause rootURL is /api and slim is only 1 deep cause its lame
        url: rootURL + '/../checkEmail/' + email,
        //dataType: "json", // data type of response
        success: function(data) {
            if(data == 'true'){
                // console.log(data+": username is taken");
                $('#email').removeClass().addClass('inputRed');
            }
            else{
                //console.log(data+": username "+username+" is free");
                $('#email').removeClass().addClass('inputGreen');
            }
        }
    });
}

function getAccount() {
    console.log('getInfo');
    $.ajax({
        type: 'GET',
        url: rootURL + '/getUserInfo',
        dataType: "json", // data type of response
        success: function(data, textStatus, jgXHR) {
            setInfo(data.username, data.profile, data.wallpaper);
            getSupportNum(data.id);
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
            $('.status p').append('<br /><span class="supnum">Supporters: '+data+'</span>');
        }
    });
}

function getProfile() {
    console.log('getProfile');
    $.ajax({
        type: 'GET',
        url: rootURL + '/getUserInfo',
        dataType: "json", // data type of response
        success: function(data, textStatus, jgXHR) {
            setProfile(data.username, data.profile, data.email);
        }
    });
}

function addNote() {
    console.log('addNote');
    console.log(formToJSON());
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function(data, textStatus, jqXHR){
            findMyNotes();
            emptyNote();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('addNote error: '  + textStatus + errorThrown + jqXHR);
            alert('addNote error: ' + textStatus + errorThrown + jqXHR);
        }
    });
}


/*
function addImage() {
    //e.preventDefault();
    return $.ajax({
        url: "http://dev.boostnote.net/api/upload",
        type: "POST",
        data: new FormData($("#noteForm")[0]),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
           $("#insertimage").val(data);
            $(".uploading").remove();
            insertNote();
            addNote();
        },
        error: function(){
            alert("File didn't upload");
        }
    });
} */

function addProfile() {
    //e.preventDefault();
    return $.ajax({
        url: "http://dev.boostnote.net/api/upload",
        type: "POST",
        data: new FormData($("#uploadForm")[0]),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            alert(data);
            $('#uploadsrc').val(data);
            cropProfile();
        },
        error: function(){
            alert("File didn't upload");
        }
    });
}

function addWallpaper() {
    //e.preventDefault();
    return $.ajax({
        url: "http://dev.boostnote.net/api/upload",
        type: "POST",
        data: new FormData($("#setWallpaper")[0]),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            $('#setWallpaper').remove();
            $('body').attr('style', 'background:url('+data+') fixed; background-size: 100% 100%;');
            var srcpaper = JSON.stringify({"src": data});
            setWallpaper(srcpaper);
        },
        error: function(){
            alert("File didn't upload");
        }
    });
}

function updateWallpaper() {
    //e.preventDefault();
    var formData = new FormData();
    formData.append('wallpaper.jpg',$("#updateWallpaper")[0]);
    return $.ajax({
        url: "http://dev.boostnote.net/api/upload",
        type: "POST",
        data: new FormData($("#updateWallpaper")[0]),
        //data: formData,
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            $('#setWallpaper').remove();
            $('body').attr('style', 'background:url('+data+') fixed; background-size: 100% 100%;');
            var srcpaper = JSON.stringify({"src": data});
            setWallpaper(srcpaper);
        },
        error: function(){
            alert("File didn't upload");
        }
    });
}

function cropProfile() {
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL +"/crop",
        dataType: "text",
        data: profileJSON(),
        success: function(data, textStatus, jqXHR){
            $('#uploadsrc').val(data);
            $('#uploadsrc').trigger('change');
            $('#profilePicture img').attr('src', data);
            $('.status img').attr('src', data);
            console.log(data);
            $('#profile').css("display", "none");
            if(displayShare()){
                displayShare();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('addNote error: '  + textStatus + errorThrown + jqXHR);
            alert('addNote error: ' + textStatus + errorThrown + jqXHR);
        }
    });
}


function setWallpaper(wallpaper) {
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: "http://dev.boostnote.net/wallpaper",
        dataType: "text",
        data: wallpaper,
        success: function(data, textStatus, jqXHR){
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('addNote error: '  + textStatus + errorThrown.text + jqXHR.text);
            alert('addNote error: ' + textStatus + errorThrown + jqXHR);
        }
    });
}

function updateProfilePicture(profile) {
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: "http://dev.boostnote.net/profile",
        dataType: "text",
        data: profile,
        success: function(data, textStatus, jqXHR){
            $('#profile').remove();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('addNote error: '  + textStatus + errorThrown.text + jqXHR.text);
            alert('addNote error: ' + textStatus + errorThrown + jqXHR);
        }
    });
}

function updateEmail(email) {
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: "http://dev.boostnote.net/email",
        dataType: "text",
        data: email,
        success: function(data, textStatus, jqXHR){
            $('.inputEmail').remove();
            $('#profileEmail span').text(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('addNote error: '  + textStatus + errorThrown.text + jqXHR.text);
            alert('addNote error: ' + textStatus + errorThrown + jqXHR);
        }
    });
}

function updatePassword(passwords) {
    console.log('updatePassword')
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: "http://dev.boostnote.net/password",
        dataType: "text",
        data: passwords,
        success: function(data, textStatus, jqXHR){
        if(data == "true"){
            $('.inputPassword').remove();
            alert('password has been update');
        }else {
            alert('incorrect Password');
            $('#opword').val("");
            $('#newpword').val("");
        }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('addNote error: '  + textStatus + errorThrown.text + jqXHR.text);
            alert('addNote error: ' + textStatus + errorThrown + jqXHR);
        }
    });
}

function updateImage(noteid) {
    //e.preventDefault();
    return $.ajax({
        url: "http://dev.boostnote.net/api/upload",
        type: "POST",
        data: new FormData($("#noteForm")[0]),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            $("#insertimage").val(data);
            $(".uploading").remove();
            updateNote(noteid);
        },
        error: function(){
            alert("File didn't upload");
        }
    });
}


function accomplishImage(noteid) {
    //e.preventDefault();
    return $.ajax({
        url: "http://dev.boostnote.net/api/upload",
        type: "POST",
        data: new FormData($("#noteForm")[0]),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data){
            $("#insertimage").val(data);
            $(".uploading").remove();
            accomplishNote(noteid);
        },
        error: function(){
            alert("File didn't upload");
        }
    });
}

function updateNote(noteid) {
    console.log('updateNote');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL + '/' + noteid,
        dataType: "json",
        data: formToJSON(),
        success: function(data, textStatus, jqXHR){
            $('#updatesubmit').unbind('click');
            $('#tray').append('<div id="notesubmit" class="submitbutton raisedbutton"><span>Submit</span></div>');
            $('#notesubmit').click(function (){
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
            });
            emptyNote();
            findMyNotes();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('updateNote error: ' + textStatus + errorThrown);
        }
    });
}

function accomplishNote(noteid) {
    console.log('updateNote');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: 'http://dev.boostnote.net/accomplish/' + noteid,
        dataType: "json",
        data: formToJSON(),
        success: function(data, textStatus, jqXHR){
            $('#accomplishsubmit').unbind('click');
            $('#tray').append('<div id="notesubmit" class="submitbutton raisedbutton"><span>Submit</span></div>');
            $('#notesubmit').click(function (){
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
            });
            emptyNote();
            findMyNotes();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('AccomplishNote error: ' + textStatus + errorThrown);
        }
    });
}

function boostNote(datasend) {
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: datasend,
        success: function(dataz, textStatus, jqXHR){
            alert(dataz);
        },
        error: function(jqXHR, textStatus, errorThrown){
        }
    });
}

function boostCheck(noteid) {
    console.log('boostCheck');
    $.ajax({
        type: 'GET',
        url: "http://dev.boostnote.net/boostcheck/"+noteid,
        dataType: "text",
        success: function(dataz, textStatus, jqXHR){
            if(dataz == "true"){
            $('.'+noteid).siblings('#boostno').css('color', 'white');
           /* $('#'+noteid).attr('class','boosted');
            $('#'+noteid).unbind('click'); */
            $('.'+noteid).remove();
            }else{

            }
        },
        error: function(jqXHR, textStatus, errorThrown){

        }
    });
}

function deleteNote(noteid) {
    console.log('deleteNote');
    var jsontitle = JSON.stringify({ noteid: noteid });
    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: rootURL,
        data: jsontitle,
        success: function(data, textStatus, jqXHR){
            findMyNotes();
            $(".notes").masonry({
                itemSelector: '.note'
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('deleteNote error');
        }
    });
}

function deleteAccomplishedNote(noteid) {
    console.log('deleteNote');
    var jsontitle = JSON.stringify({ noteid: noteid });
    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: rootURL,
        data: jsontitle,
        success: function(data, textStatus, jqXHR){
            $('.notes').empty();
            findAccomplished();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('deleteNote error');
        }
    });
}