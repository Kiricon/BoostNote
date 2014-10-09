function profileSettings(){
    $('.makenote').hide();
    $("#search").remove();
    $('.notes').empty();
    $('#selectnav').remove();
    $('.notes').append('<div id="settingsContainer"><div id="settingsSection"><div id="profilePicture"><span id="imageEdit"></span><img src="" /></div>' +
        '<div id="profileUsername"></div>' +
        '<div id="profileEmail"><span></span> <a href="#" id="editEmail">edit</a></div>' +
        '<form id="updateWallpaper"><div class="updateWallpaper raisedbutton"><span>Update Wallpaper</span></div><input id="wallpaperInput" name="file" type="file" accept="image/x-png, image/gif, image/jpeg" style="display: none;"></form>' +
        '<div class="removeWallpaper raisedbutton"><span>Remove Wallpaper</span></div>' +
        '<div class="updatePassword raisedbutton"><span>Update Password</span></div>' +
        '' +
        '</div></div>');
    getProfile();
    $('#profilePicture img').click(function(){
        if(!$('#profile').length){
        updateProfile();
        }
    });
    $('.updateWallpaper').click(function (){
        $('#wallpaperInput').trigger('click');
    });
    $('#wallpaperInput').change(function(){
        var iframe = $('<iframe name="wallpaperiframe" id="wallpaperiframe" style="display: none" />');

        $("body").append(iframe);

        var form = $('#updateWallpaper');
        form.attr("action", "http://dev.boostnote.net/api/upload");
        form.attr("method", "post");

        form.attr("encoding", "multipart/form-data");
        form.attr("enctype", "multipart/form-data");

        form.attr("target", "wallpaperiframe");
        form.attr("file", $('#wallpaperInput').val());
        form.submit();

        $("#wallpaperiframe").load(function () {
            var iframeSrc = this.contentWindow.document.body.innerHTML;
            $('#setWallpaper').remove();
            $('body').attr('style', 'background:url('+iframeSrc+') fixed; background-size: 100% 100%;');
            var srcpaper = JSON.stringify({"src": iframeSrc});
            setWallpaper(srcpaper);
        });

        return false;
    });

    $('.removeWallpaper').click(function (){
        $('body').attr('style', 'background:#d8d8d8');
        var srcpaper = JSON.stringify({"src": ""});
        setWallpaper(srcpaper)
    });

    $('#editEmail').click(function(){
        if(!$('#emailForm').length){
        $('#profileEmail').after('<div class="inputEmail" id="emailForm"><form><input type="text" placeholder="New Email Address"><div class="ateateEmail raisedbutton"><span>Update Email</span></div></form></div>');
        $('.updateEmail').click(function(){
            var data = $('.inputEmail input').val();
            var email = JSON.stringify({"address": data});
            updateEmail(email);
        });
        }
    });

    $('.updatePassword').click(function (){
        if(!$('#passwordForm').length){
       $(this).after('<div class="inputPassword" id="passwordForm">' +
           '<form>' +
           '<input type="password" placeholder="Current Password" id="opword"><br/>' +
           '<input type="password" placeholder="New Password" id="newpword"><br/>' +
           '<input type="password" placeholder="New Password" id="newpword2"><br/>' +
           '<div class="submitPasswordUpdate raisedbutton"><span>Update Password</span></div>' +
           '' +
           '</form>' +
           '</div>');
        $('.submitPasswordUpdate').click(function(){
            var passwords = JSON.stringify({
                "opword" : $('#opword').val(),
                "newpword": $('#newpword').val()
            });
            updatePassword(passwords);
        });

        $('#newpword').keyup(validatePass);
        $('#newpword2').keyup(validatePass);
        }
    });


}

function setProfile(username, profile, email) {
    $('#profilePicture img').attr('src', profile);
    $('#profileUsername').text(username);
    $('#profileEmail span').text(email);
}

function displayAbout(){
    $('.makenote').hide();
    $("#search").remove();
    $('.notes').empty();
    $('#selectnav').remove();
    $('.notes').append('<div id="settingsContainer"><div id="aboutSection"><h2>BoostNote</h2><br/> BoostNote was invented so that we can all become more productive. ' +
        'By combining all the connectivity of a social network, and the utility of a note taking system, it\'s easier to find the motivation to achieve your goals. ' +
        'Use the website to share your goals, and keep your friends up to date on your latest activities. Use it as a source of inspiration, or simply use it to support others. ' +
        'No matter what you\'re reason for using this site, know that you\'re one step closer to achieving your goals.' +
        '<div><h2>Dominic Valenciana</h2></div>' +
        'This website was designed, developed and published by Dominic Valenciana.' +
        ' ' +
        '</div></div>');
}

function displaySettings(){
    $('.makenote').hide();
    $("#search").remove();
    $('.notes').empty();
    $('#selectnav').remove();
    $('.notes').append('<div id="settingsContainer"><div id="SettingsSection">' +
        '<div class="settingsSelect" id="AccSettingsButton">Account Settings<img src="http://dental.anatomage.com/images/mdstudio/right-normal.png"></img></div>' +
        '<div class="settingsSelect" id="AboutSettingsButton">About<img src="http://dental.anatomage.com/images/mdstudio/right-normal.png"></img></div>' +
        '<div class="settingsSelect" id="LogoutButton">Logout<img src="http://dental.anatomage.com/images/mdstudio/right-normal.png"></img></div>'+
        '</div></div>');
    $('#AccSettingsButton').click(profileSettings);
    $('#AboutSettingsButton').click(displayAbout);
    $('#LogoutButton').click(function(){
        document.cookie = 'uname=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
        document.cookie = 'pword=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
        window.location.reload();

    });
}

function validatePass(){
    //only colorize if  both are more than 6 characters
    if($('#newpword2').val().length >= 6 && $('#newpword2').val().length >= 6)
    {
        //turn green if both the same
        if($('#newpword').val() == $('#newpword2').val())
        {
            $('#newpword').removeClass().addClass('inputGreen');
            $('#newpword2').removeClass().addClass('inputGreen');
        }

        //otherwise, red
        else
        {
            $('#newpword').removeClass().addClass('inputRed');
            $('#newpword2').removeClass().addClass('inputRed');
        }
    }

    //too short
    else
    {
        $('#newpword').removeClass().addClass('inputGray');
        $('#newpword2').removeClass().addClass('inputGray');
    }
}

function profileJSON() {
    return JSON.stringify({
        "src": $('#uploadsrc').val(),
        "x": $('#x').val(),
        "y": $('#y').val(),
        "w": $('#w').val(),
        "h": $('#h').val()
    });
}

function updateProfile(){
    $('#settingsSection').append('<div id="profile"><div><h2>Update your profile picture</h2></div>' +
        '<img id="target" src="img/thumbnail.png">' +
        '<form id="uploadForm">' +
        '<input name="file" type="file" class="inputProfile" accept="image/x-png, image/jpeg" />' +
        '</form>' +
        '<div class="btnSubmit raisedbutton updateProfile"><span>Update Profile Picture</span></div>' +
        ' <div id="preview-pane">' +
        '<input type="hidden" id="uploadsrc" name="uploadsrc" />'+
        '<input type="hidden" id="x" name="x" />' +
        '<input type="hidden" id="y" name="y" />' +
        '<input type="hidden" id="w" name="w" />' +
        '<input type="hidden" id="h" name="h" />'+
        ' <div class="preview-container" style="display:none;">' +
        ' <img src="img/thumbnail.png" class="jcrop-preview" alt="Preview" style="display:none;" />' +
        '</div>'+
        '</div>' +
        '</div>' +
        '');
    $('#uploadsrc').change(function(){
        var data = JSON.stringify({
            'src': $(this).val()
        });
        updateProfilePicture(data);
    });
    $('.btnSubmit').click(function (){
        var iframe = $('<iframe name="profileiframe" id="profileiframe" style="display: none" />');

        $("body").append(iframe);

        var form = $('#uploadForm');
        form.attr("action", "http://dev.boostnote.net/api/upload");
        form.attr("method", "post");

        form.attr("encoding", "multipart/form-data");
        form.attr("enctype", "multipart/form-data");

        form.attr("target", "profileiframe");
        form.attr("file", $('.inputProfile').val());
        form.submit();

        $("#profileiframe").load(function () {
            var iframeSrc = this.contentWindow.document.body.innerHTML;
            $('#uploadsrc').val(iframeSrc);
            cropProfile();
        });

        return false;
    });

    $(document).ready(function (e){

        $(".inputProfile").change(function(){
            readURL(this);
        });

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#target').attr('src', e.target.result);
                    $('#target').css('display', 'block');
                    $('.jcrop-preview').attr('src', e.target.result);
                    $('.jcrop-preview').css('display', 'block');
                    $('.preview-container').css('display', 'block');
                    jcropMake();
                }

                reader.readAsDataURL(input.files[0]);
            }
        }
    });

    function jcropMake(){

        // Create variables (in this scope) to hold the API and image size
        var jcrop_api,
            boundx,
            boundy,

        // Grab some information about the preview pane
            $preview = $('#preview-pane'),
            $pcnt = $('#preview-pane .preview-container'),
            $pimg = $('#preview-pane .preview-container img'),

            xsize = $pcnt.width(),
            ysize = $pcnt.height();
        var leftsize = xsize / 2;

        console.log('init',[xsize,ysize]);
        $('#target').Jcrop({
            onChange: updatePreview,
            onSelect: updatePreview,
            setSelect: [5, 100, 100, 5],
            aspectRatio: 1
        },function(){
            // Use the API to get the real image size
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            // Store the API in the jcrop_api variable
            jcrop_api = this;

            // Move the preview into the jcrop container for css positioning
            $preview.appendTo(jcrop_api.ui.holder);
        });

        function updatePreview(c)
        {
            $('#x').val(c.x);
            $('#y').val(c.y);
            $('#w').val(c.w);
            $('#h').val(c.h);
            if (parseInt(c.w) > 0)
            {

                var rx = xsize / c.w;
                var ry = ysize / c.h;

                $pimg.css({
                    width: Math.round(rx * boundx) + 'px',
                    height: Math.round(ry * boundy) + 'px',
                    marginLeft: '-' + Math.round(rx * c.x) + 'px',
                    marginTop: '-' + Math.round(ry * c.y) + 'px'
                });
            }
        }

    }
}
