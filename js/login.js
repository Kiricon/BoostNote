/**
 * Created by ergo on 6/25/14.
 */
$('#mailme').click(function (){
   sendEmail();
});
// ################ paper button click listeners ##################
$('#showlogin').click(function(){
    document.getElementById("logform").style.display="block";
    document.getElementById("regform").style.display="none";
});

$('#showreg').click(function(){
    document.getElementById("logform").style.display="none";
    document.getElementById("regform").style.display="block";
});

$('#login').click(function (){$("#loginForm").submit(); });
//$('#register').click(function (){$("#registerForm").submit(); });
$('#register').click(function(){
    if(validateRegister()){
   setProfile();
    }
});
// ######################### END ###################################

// ################### Form submit Handlers ########################
$("#loginForm").submit(function(){
    var uname = $('#uname').val();
    var pword = $('#pword').val();
    Login(uname, pword);
    return false;
});

$("#registerForm").submit(function(){

/*    if(validateRegister()) //all checks passed, registration can be completed!
    { */
        Register(); //do the thing!
        $('#showlogin').click(); //go back to the login screen!
   // }
    return false; //prevent redirect
});

function profileJSON() {
    return JSON.stringify({
        "src": $('#uploadsrc').val(),
        "x": $('#x').val(),
        "y": $('#y').val(),
        "w": $('#w').val(),
        "h": $('#h').val()
    });
}
// ######################### END ###################################

// ################### Validating Functions ########################

function validateRegister()
{
    var usrValid = $('#runame').hasClass('inputGreen'); //username will only be green (without tampering) if available
   var emailValid = $("#email").hasClass('inputGreen');//tampering to manually change class will result in failed SQL anyways!
    var password = $('#rpword').val();
    var password2 = $('#rpword2').val();
    $('.errormessage').remove();
    if(password == password2) { //passwords must match!
        if(password.length >= 6) { //password must be at least or longer than 6 characters
            if(usrValid) {//just as it implies
                if(emailValid) {//same here, if email is Valid
                    return true; //all checks passed! we csn now register
                } else $('.logreg p').after("<div class='errormessage'>Invalid Email Address</div>");
            } else $('.logreg p').after('<div class="errormessage">Invalid Username</div>');
        } else $('.logreg p').after("<div class='errormessage'> Your password isn't long enough</div>");
    } else $('.logreg p').after("<div class='errormessage'> The Passwords don't match</div>");

    return false; //return after error is displayed
}

function validatePass()
{
    //only colorize if  both are more than 6 characters
    if($('#rpword').val().length >= 6 && $('#rpword2').val().length >= 6)
    {
        //turn green if both the same
        if($('#rpword').val() == $('#rpword2').val())
        {
            $('#rpword').removeClass().addClass('inputGreen');
            $('#rpword2').removeClass().addClass('inputGreen');
        }

        //otherwise, red
        else
        {
            $('#rpword').removeClass().addClass('inputRed');
            $('#rpword2').removeClass().addClass('inputRed');
        }
    }

    //too short
    else
    {
        $('#rpword').removeClass().addClass('inputGray');
        $('#rpword2').removeClass().addClass('inputGray');
    }
}
// ######################### END ###################################

//###################### changing input colors! ####################

//checks usernames to see if it exists already.
$("#runame").keyup(function(){
    var user = $('#runame').val();
    if(user.length == 0) {$('#runame').removeClass().addClass('inputGray');} //remove border and prevent check if empty
    else {userExists(user);}
});

$("#email").keyup(function(){
    var email = $('#email').val();
    if(email.length == 0 || validateEmail(email)) {$('#email').removeClass().addClass('inputGray');} //remove border and prevent check if empty
    else {emailExists(email);}
});

//if either password field changes
$('#rpword').keyup(validatePass);
$('#rpword2').keyup(validatePass);
// REG TO JSON ##############################

function regToJSON(){
    return JSON.stringify({
        "uname": $('#runame').val(),
        "pword": $('#rpword').val(),
        "email": $('#email').val(),
        "profile": $('#uploadsrc').val()
    });
}
// ######################### END ###################################
function displayShare(){
    $('.middiv').append('<div id="share"> <h1>It might get a bit lonely, before you start how about you invite some friends to join you?</h1><br/>' +
        '<div class="regenter raisedbutton" id="regenter"><span>Get Started!</span></div>' +
        '</div>'
    );
    $('#regenter').click(function(){
       Register();
    });
}
function setProfile(){
    $('.logreg').css('display', 'none');
    $('.middiv').append('<div id="profile"><div><h2>You\'re not done yet! Set a profile picture!</h2></div>' +
        '<img id="target" src="img/thumbnail.png">' +
        '<form id="uploadForm">' +
        '<input name="file" type="file" class="inputFile" />' +
        '</form>' +
        '<div class="btnSubmit raisedbutton"><span>Next</span></div>' +
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

    $('.btnSubmit').click(function (){
        if($('#uploadsrc').hasClass('changed')){
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
        }else{
            $('#uploadsrc').val("img/thumbnail.png");
            $('#profile').css("display", "none");
            displayShare();
        }

        return false;
    });
    $(document).ready(function (e){

        $(".inputFile").change(function(){
            readURL(this);
            $('#uploadsrc').addClass('changed');
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

        /*
        $("#uploadForm").on('submit',(function(e){
            e.preventDefault();
            $.ajax({
                url: "http://dev.boostnote.net/api/upload",
                type: "POST",
                data:  new FormData(this),
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){
                    alert(data);
                },
                error: function(){
                    alert("File didn't upload");
                }
            });
        }));  */
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
        };

    }
}

function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return true;
    }
    return false;
}