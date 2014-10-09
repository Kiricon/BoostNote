<?php
require 'Slim/Slim.php';
require 'password.php';
\Slim\Slim::registerAutoloader();
######################################
#### Connection to SQL Database ######
######################################
function getConnection() {
    $dbhost="mysql.growinglove.net";
    $dbuser="vincentius";
    $dbpass="Knowp@1n";
    $dbname="productiveme";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

header('Access-Control-Allow-Origin: *');

######################################
### REST API calls that  are made ####
######################################
$app = new \Slim\Slim(array(
    'cookies.encrypt' => true,
    'cookies.secret_key' => 'Knowp@1n',
    'cookies.cipher' => MCRYPT_RIJNDAEL_256,
    'cookies.cipher_mode' => MCRYPT_MODE_CBC
));
$app->get('/', function () {
    if(isset($_COOKIE["uname"]) && isset($_COOKIE["boosttoken"])){
        if(validCookies()){
            $appcookie = \Slim\Slim::getInstance();
            $token = date('Y-m-d-H-i-s').uniqid();
            setToken(getUserId(), $token);
            $appcookie->setCookie('boosttoken', $token, '60 days');
            require 'index.html';

        }
        else {
            require 'logreg.html';

        }
    }
    else{
        require 'logreg.html';

    }
});
$app->get('/api/my', 'getNotes');
$app->get('/api/form', function () {
    require 'form.html';
});
$app->get('/api/all/:loadnum', 'getAllNotes');
$app->get('/api/top/:loadnum', 'getTopNotes');
$app->get('/api/supported/:loadnum', 'getSupportedNotes');
$app->get('/api/supported', 'getSupported');
$app->get('/api/email', 'sendEmail');
$app->get('/api/getuser', 'getUserId');
$app->get('/api/accomplished', 'getAccomplished');
$app->get('/api/:uname/:pword', 'Login');
$app->get('/api/getUserInfo', 'getUserInfo');
$app->get('/search/:search/:loadnum', 'getSearch');
$app->get('/top/:search/:loadnum', 'getTopSearch');
$app->get('/boostcheck/:noteid', 'checkBoost');
$app->get('/cookie/:uname/:pword', 'setCookies');
$app->get('/note/:notid', 'getNoteInfo');
$app->get('/looknote/:notid/:notecolor', 'lookNote');
$app->get('/:username', 'userProfile');
$app->get('/support/:userid', 'supportCount');
$app->get('/prof/:userid/:loadnum', 'getAllProfileNotes');
$app->post('/api/Register', 'Register');
$app->post('/api', 'addNote');
$app->post('/api/upload', 'upload2');
$app->post('/api/boost', 'addBoost');
$app->post('/api/crop', 'cropProfile');
$app->post('/support/:profileid', 'support');
$app->put('/api/:noteid', 'updateNote');
$app->put('/api', 'boostNote');
$app->put('/accomplish/:noteid', 'accomplishNote');
$app->put('/wallpaper', 'setWallpaper');
$app->put('/email', 'updateEmail');
$app->put('/password', 'updatePassword');
$app->put('/profile', 'setProfilePicture');
$app->delete("/api",   "deleteNote");
$app->delete("/api/support/:profileid", "unsupport");

//skyler's slim calls for registration
$app->get('/checkUser/:user', 'checkUser');
$app->get('/checkEmail/:email', 'checkEmail');

$app->run();

###########################################################################
##### Functions that run when API is called ###############################
###########################################################################
function phas(){
    $hash = password_hash("niggertits", PASSWORD_DEFAULT)."\n";
    if (password_verify("niggertits", $hash)) {
        echo "valid";
    } else {
        echo "invalid";
    }
}
function setCookies($uname, $token) {
    $appcookie = \Slim\Slim::getInstance();
    $appcookie->setCookie('uname', $uname, '60 days');
    $appcookie->setCookie('boosttoken', $token, '60 days');
}
function Login($uname, $pword){
    $sql ="SELECT * FROM Accounts WHERE username=:uname";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uname", $uname);
        //$stmt->bindParam("pword", password_hash($pword, PASSWORD_BCRYPT));
        $stmt->execute();
        //$account = $stmt->fetchColumn();
        $account = $stmt->fetchObject();
        $db = null;
        if(password_verify($pword, $account->password)){
            echo "true";
            $token = date('Y-m-d-H-i-s').uniqid();
            setToken($account->id, $token);
            setCookies($account->username, $token);
        }else{
            echo "false";
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function setToken($id, $token){
    $sql = "UPDATE Accounts SET token=:token WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("token", $token);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function passwordCheck($uname, $pword) {
    $sql ="SELECT password FROM Accounts WHERE username=:uname";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uname", $uname);
        $stmt->execute();
        $account = $stmt->fetchColumn();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    if(password_verify($pword, $account)){
        return true;
    }else{
        return false;
    }
}

function getUserId(){
    $appcookie = \Slim\Slim::getInstance();
    $sql ="SELECT id FROM Accounts WHERE username=:uname AND token=:token";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uname", $appcookie->getCookie('uname'));
        $stmt->bindParam("token", $appcookie->getCookie('boosttoken'));
        $stmt->execute();
        //$account = $stmt->fetchColumn();
        $account = $stmt->fetchColumn();
        $db = null;
        return $account;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function userProfile($username){
    require('profile.html');
    $sql ="SELECT * FROM Accounts LEFT JOIN Support ON Accounts.id=Support.supported AND Support.supporter=".getUserId()." WHERE username=:user ";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("user", $username);
        $stmt->execute();
        $account = $stmt->fetchObject();
        $db = null;
        echo "<div id='profile' class='".$account->id."'><img src='../".$account->profile."' /></div>";
        echo '<div id="hexload" style="width: 100px; margin-left: auto; margin-right:auto;"><img class="hexigon" src="img/hexagone.png" style="margin: 10px auto; width: 100px;"><br/><h2>Loading...</h2></div>';
        echo "<div class='notes' style='opacity: 0;'></div>";
        echo "<style>body{background: url('../".$account->wallpaper."') fixed; background-size: 100% 100%; background-color: #d8d8d8;}</style>";
        echo "<script>$('.header').append('<div class=usertitle>".$account->username."</div>'); document.title='".$account->username."'; $('#favicon').attr('href', '".$account->profile."'); $('#support span').addClass('".$account->id."'); getProfileNotes(".$account->id.",0); getSupportNum(".$account->id.")</script>";
        if($account->supporter){
            echo "<script>$('#support').unbind('click');$('#support span').text('Unsupport'); $('#support').attr('id','unsupport'); $('#unsupport').bind('click', unclick);</script>";
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getAllProfileNotes($userid, $loadnum) {
    $sql = "select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id LEFT JOIN Boosts ON Boosts.boosted=Notes.note_id AND Boosts.booster=".getUserId()."  WHERE private=0 AND user_id=".$userid." ORDER BY date DESC LIMIT ".$loadnum.",25";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function supportCount($userid) {
    $sql = "SELECT COUNT(supported) FROM Support WHERE supported=".$userid."";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $num = $stmt->fetchColumn();
        $db = null;
        echo $num;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function validCookies(){
    $appcookie = \Slim\Slim::getInstance();
    $sql ="SELECT id FROM Accounts WHERE username=:uname AND token=:token";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uname", $appcookie->getCookie('uname'));
        $stmt->bindParam("token", $appcookie->getCookie('boosttoken'));
        $stmt->execute();
        //$account = $stmt->fetchColumn();
        $account = $stmt->fetchColumn();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
   // echo ($account)? true : false;
    return ($account)? true : false;
}

function getUserInfo() {
    $sql ="SELECT * FROM Accounts WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", getUserId());
        $stmt->execute();
        $account = $stmt->fetchObject();
        $db = null;
        echo json_encode($account);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function Register() {
    $request = \Slim\Slim::getInstance()->request();
    $account = json_decode($request->getBody());
    if($account->uname == "" || $account->email == "" || $account->pword == ""){
        return false;
    }else{
    $token = date('Y-m-d-H-i-s').uniqid();
    $sql = "INSERT INTO Accounts (username, password, email, token, profile) VALUES (:uname, :pword, :email, :token, :profile)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uname", $account->uname);
        $stmt->bindParam("pword", password_hash($account->pword, PASSWORD_BCRYPT));
        $stmt->bindParam("email", $account->email);
        $stmt->bindParam("token", $token);
        $stmt->bindParam("profile", $account->profile);
        $stmt->execute();
        $db = null;
        setCookies($account->uname, $token);
        echo json_encode($account);
    } catch(PDOException $e) {
        echo "yee";
        echo '<script>alert('.$e->getMessage().');</script>';
        //  echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    }
}

function checkUser($user){
    $sql ="SELECT COUNT(*) AS numFound FROM Accounts WHERE username=:user";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("user", $user);
        $stmt->execute();
        $account = $stmt->fetchColumn();
        $db = null;
        echo ($account)? 'true': 'false';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    return ($account)? 'true': 'false';

}

function checkEmail($email){
    $sql ="SELECT COUNT(*) AS numFound FROM Accounts WHERE email=:email";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("email", $email);
        $stmt->execute();
        $account = $stmt->fetchColumn();
        $db = null;
        echo ($account)? 'true': 'false';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    return ($account)? 'true': 'false';
}

function getNotes() {
    $sql = "SELECT * FROM Notes WHERE user_id=".getUserId()." AND active=0 ORDER BY date DESC";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getAllNotes($loadnum) {
    $sql = "select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id LEFT JOIN Boosts ON Boosts.boosted=Notes.note_id AND Boosts.booster=".getUserId()."  WHERE private=0 ORDER BY date DESC LIMIT ".$loadnum.",25";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getSupportedNotes($loadnum){
    $sql ="select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id LEFT JOIN Boosts ON Boosts.boosted=Notes.note_id AND Boosts.booster=".getUserId()." LEFT JOIN Support ON Support.supported = Notes.user_id AND Support.supporter=".getUserId()." WHERE private=0 AND supporter=".getUserId()." ORDER BY date DESC LIMIT ".$loadnum.",25";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getSupported() {
    $sql = "select * FROM Support JOIN Accounts ON Support.supported=Accounts.id WHERE supporter =".getUserId()."";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $users = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($users);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getNoteInfo($noteid) {
    require('note.html');
    $sql = "select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id LEFT JOIN Boosts ON Boosts.boosted=Notes.note_id AND Boosts.booster=".getUserId()."  WHERE private=0 AND note_id=".$noteid."";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '<script type="text/javascript" src="http://dev.boostnote.net/js/note.js"></script>';
        echo '<script type="text/javascript" src="/js/api.js"></script>';
        echo '<div id="idk"></div>';
        echo "<script>renderLookNote({'note': ".json_encode($note)."}, '3f51b5')</script>";
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function lookNote($noteid, $notecolor) {
    $sql = "select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id LEFT JOIN Boosts ON Boosts.boosted=Notes.note_id AND Boosts.booster=".getUserId()."  WHERE private=0 AND note_id=".$noteid."";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        /*
        echo '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>';
        echo '<script type="text/javascript" src="http://dev.boostnote.net/js/api.js"></script>'; */
        echo '<script type="text/javascript" src="http://dev.boostnote.net/js/looknote.js"></script>';
        echo '<div id="idk"></div>';
        echo "<script>renderLookNote({'note': ".json_encode($note)."}, '".$notecolor."')</script>";
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


function getTopNotes($loadnum) {
    $sql = "select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id WHERE private=0 ORDER BY boost DESC LIMIT ".$loadnum.",25";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function sendEmail() {
    require_once('PHPMailer/class.phpmailer.php');

    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->CharSet="UTF-8";
    $mail->SMTPSecure = 'ssl';
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 465;
    $mail->Username = 'ss4dom@gmail.com';
    $mail->Password = 'Sleep1sdeath';
    $mail->SMTPAuth = true;

    $mail->From = 'ss4dom@gmail.com';
    $mail->FromName = 'BoostNote Admin';
    $mail->AddAddress('kiricon@live.com');
    $mail->AddReplyTo('phoenixd110@gmail.com', 'Information');

    $mail->IsHTML(true);
    $mail->Subject    = "PHPMailer Test Subject via Sendmail, basic";
    $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!";
    $mail->Body    = "Hello";

    if(!$mail->Send())
    {
        echo "Mailer Error: " . $mail->ErrorInfo;
    }
    else
    {
        echo "Message sent!";
    }
}

function getSearch($search, $loadnum) {
    $sql = "select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id WHERE private=0 AND tags LIKE '%".$search."%' ORDER BY date DESC LIMIT ".$loadnum.",25";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getTopSearch($search, $loadnum) {
    $sql = "select * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id WHERE private=0 AND tags LIKE '%".$search."%' ORDER BY boost DESC LIMIT ".$loadnum.",25";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getAccomplished() {
    $sql = "SELECT * FROM Notes JOIN Accounts ON Notes.user_id=Accounts.id AND user_id=".getUserId()." AND active=1 LEFT JOIN Boosts ON Boosts.boosted=Notes.note_id AND Boosts.booster=".getUserId()." ORDER BY date DESC";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $note = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"note": ' . json_encode($note) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function accomplishNote($noteid) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $note = json_decode($body);
    $sql = "UPDATE Notes SET title=:title, description=:description, img=:img, tags=:tags, private=:private, active=1  WHERE note_id=:noteid AND user_id=".getUserId()."";

    //sanitizing inputs from XSS
    $note->title = htmlspecialchars($note->title, ENT_QUOTES, 'UTF-8');
    $note->description = htmlspecialchars($note->description, ENT_QUOTES, 'UTF-8');

    //really??! did they circumvent the warnings?
    //fill empty titles i guess!!!
    if($note->title=="")
    {$note->title="what part of \"not empty\" is confusing you?!";}

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("title", $note->title);
        $stmt->bindParam("description", $note->description);
        $stmt->bindParam("img", $note->img);
        $stmt->bindParam("tags", $note->tags);
        $stmt->bindParam("private", $note->private);
        $stmt->bindParam("noteid", $noteid);
        $stmt->execute();
        $db = null;
        echo json_encode($note);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function setWallpaper() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $wallpaper = json_decode($body);
    $sql = "UPDATE Accounts SET wallpaper=:wallpaper WHERE id=".getUserId()."";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("wallpaper", $wallpaper->src);
        $stmt->execute();
        $db = null;
        echo $wallpaper->src;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function setProfilePicture() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $profile = json_decode($body);
    $sql = "UPDATE Accounts SET profile=:profile WHERE id=".getUserId()."";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("profile", $profile->src);
        $stmt->execute();
        $db = null;
        echo $profile->src;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function support($profileid) {
    $sql = "INSERT INTO Support (supporter, supported) VALUES (".getUserId().", :supported)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("supported", $profileid);
        $stmt->execute();
        $db = null;
        echo "worked";
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateEmail() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $email = json_decode($body);
    $sql = "UPDATE Accounts SET email=:email WHERE id=".getUserId()."";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("email", $email->address);
        $stmt->execute();
        $db = null;
        echo $email->address;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updatePassword() {
    $appcookie = \Slim\Slim::getInstance();
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $account = json_decode($body);
    $uname = $appcookie->getCookie('uname');
    $pword = $account->opword;
    if(passwordCheck($uname,$pword)){
    $sql = "UPDATE Accounts SET password=:pword WHERE id=".getUserId()."";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("pword", password_hash($account->newpword, PASSWORD_BCRYPT));
        $stmt->execute();
        $db = null;
        echo "true";
    } catch(PDOException $e) {
        echo 'false';
    }

    }else{
        echo "false";
    }
}

function addUserBoost($boostno) {
    $sql = "UPDATE Accounts SET exp= exp + :boost WHERE id=".getUserId()."";

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("boost", $boostno);
        $stmt->execute();
        $db = null;
        echo "boost added";
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addNote() {
    $request = \Slim\Slim::getInstance()->request();
    $note = json_decode($request->getBody());
    $sql = "INSERT INTO Notes (user_id, title, description, img, tags, private) VALUES (".getUserId().", :title, :description, :img, :tags, :private)";

    //sanitizing inputs from XSS
    $note->title = htmlspecialchars($note->title, ENT_QUOTES, 'UTF-8');
    $note->description = htmlspecialchars($note->description, ENT_QUOTES, 'UTF-8');

    //really??! did they circumvent the warnings?
    //fill empty titles i guess!!!
    if($note->title=="")
    {$note->title="what part of \"not empty\" is confusing you?!";}

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("title", $note->title);
        $stmt->bindParam("description", $note->description);
        $stmt->bindParam("img", $note->img);
        $stmt->bindParam("tags", $note->tags);
        $stmt->bindParam("private", $note->private);
        $stmt->execute();
        $db = null;
        echo json_encode($note);
    } catch(PDOException $e) {
        echo "yee";
        echo '<script>alert('.$e->getMessage().');</script>';
        //  echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function uploadImage() {
    if(is_array($_FILES)) {
        if(is_uploaded_file($_FILES['userImage']['tmp_name'])) {

            $sourcePath = $_FILES['userImage']['tmp_name'];
            $path = $_FILES['userImage']['name'];
            $ext = pathinfo($path, PATHINFO_EXTENSION);
            $targetPath = "uploads/".date('Y-m-d-H-i-s').uniqid().$_FILES['userImage']['name'];
            if($ext == "png" || $ext == "gif" || $ext == "jpg" || $ext == "jpeg" || $ext == "webm"){
                if(move_uploaded_file($sourcePath,$targetPath)) {
                    echo $targetPath;

                }
                else {
                    echo "stage3";
                }
            }else {
                echo "stage2";
            }

        }
        else {
            echo "stage1";
        }
    }
}

function upload2() {
    $allowedExts = array("gif", "jpeg", "jpg", "png");
    $temp = explode(".", $_FILES["file"]["name"]);
    $extension = end($temp);

    if ((($_FILES["file"]["type"] == "image/gif")
            || ($_FILES["file"]["type"] == "image/jpeg")
            || ($_FILES["file"]["type"] == "image/jpg")
            || ($_FILES["file"]["type"] == "image/pjpeg")
            || ($_FILES["file"]["type"] == "image/x-png")
            || ($_FILES["file"]["type"] == "image/png")
            || ($_FILES["file"]["type"] == "image/gif"))
        && ($_FILES["file"]["size"] < 5000000)
        && in_array($extension, $allowedExts)) {
        if ($_FILES["file"]["error"] > 0) {
            echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
        } else {
            $targetPath = "uploads/".date('Y-m-d-H-i-s').uniqid().$_FILES['file']['name'];
            if (file_exists($targetPath)) {
                echo $targetPath . " already exists. ";
            } else {
                move_uploaded_file($_FILES["file"]["tmp_name"], $targetPath);
                echo $targetPath;
            }
        }
    } else {
        echo "img/wrong.gif";
    }
}
function cropProfile() {
    $request = \Slim\Slim::getInstance()->request();
    $crop = json_decode($request->getBody());
    $targ_w = $targ_h = 100;
    $jpeg_quality = 90;
    $newx = $crop->x - 5;
    $newy = $crop->y - 5;

    $img_r = imagecreatefromjpeg($crop->src);

    $dst_r = ImageCreateTrueColor( $targ_w, $targ_h );

    imagecopyresampled($dst_r,$img_r,0,0,$newx,$newy,
        $targ_w,$targ_h,$crop->w,$crop->h);

   // header('Content-type: image/jpeg');
    $targetPath = "uploads/".date('Y-m-d-H-i-s').uniqid().'profile.jpg';
    imagejpeg($dst_r, $targetPath);
    echo $targetPath;
}

function updateNote($noteid) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $note = json_decode($body);
    $sql = "UPDATE Notes SET title=:title, description=:description, img=:img, tags=:tags, private=:private  WHERE note_id=:noteid AND user_id=".getUserId()."";

    //sanitizing inputs from XSS
    $note->title = htmlspecialchars($note->title, ENT_QUOTES, 'UTF-8');
    $note->description = htmlspecialchars($note->description, ENT_QUOTES, 'UTF-8');

    //really??! did they circumvent the warnings?
    //fill empty titles i guess!!!
    if($note->title=="")
    {$note->title="what part of \"not empty\" is confusing you?!";}

    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("title", $note->title);
        $stmt->bindParam("description", $note->description);
        $stmt->bindParam("img", $note->img);
        $stmt->bindParam("tags", $note->tags);
        $stmt->bindParam("private", $note->private);
        $stmt->bindParam("noteid", $noteid);
        $stmt->execute();
        $db = null;
        echo json_encode($note);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function boostNote() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $boost = json_decode($body);
    if(checkBoost($boost->noteid) == 1){
        echo '["error":{"text":Already Boosted}}';
    }else{
        $sql = "UPDATE Notes SET boost = boost + 1, date = date WHERE note_id=:noteid";
        try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("noteid", $boost->noteid);
            $stmt->execute();
            $db = null;
            echo json_encode($boost);
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }

        $sql = "INSERT INTO Boosts (booster, boosted) VALUES (".getUserId().", :noteid)";
        try {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("noteid", $boost->noteid);
            $stmt->execute();
            $db = null;
            echo json_encode($boost);
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
}

function addBoost() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $boost = json_decode($body);
    $sql = "INSERT INTO Boosts (user_id, note_id) VALUES (".getUserId().", :noteid)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("noteid", $boost->noteid);
        $stmt->execute();
        $db = null;
        echo json_encode($boost);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function checkBoost($noteid){
    $sql ="SELECT * FROM Boosts WHERE note_id=:noteid AND user_id=".getUserId()." ";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("noteid", $noteid);
        $stmt->execute();
        $boostCheck = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo ($boostCheck)? "true" : "false";
        //echo "true";
    } catch(PDOException $e) {
        echo "false";
    }
    //echo ($boostCheck)? "true" : "false";
}


function deleteNote() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $note = json_decode($body);
    $sql = "DELETE FROM Notes WHERE note_id=:noteid AND user_id=".getUserId();


    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("noteid", $note->noteid);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function unsupport($supported) {
    $sql = "DELETE FROM Support WHERE supported=:supported AND supporter=".getUserId();
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("supported", $supported);
        $stmt->execute();
        $db = null;
        echo "success";
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function deleteNote2($noteid) {
    $sql = "DELETE FROM Notes WHERE note_id=:noteid AND user_id=".getUserId();
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("noteid", $noteid);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
$app->notFound(function () {
echo "That's what you get when the Wutang raised you";
});
?>