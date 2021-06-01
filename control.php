<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
$connection = mysqli_connect('localhost','dandemo_main','---','dandemo_synk','3306');
if(!$connection){
    die("Failed to connect to database.");
}
function updateOnline($pin){
    $connection = mysqli_connect('localhost','dandemo_main','---','dandemo_synk','3306');
    $query = "SELECT * FROM participants WHERE pin='$pin'";
    $result = mysqli_query($connection,$query);
    $ready = 0;
    $wait = 0;
    $online = 0;
    $total = 0;
    $inactive = 0;
    while($row = mysqli_fetch_assoc($result)){
        $status = $row['status'];
        if($status == "READY"){
            $ready++;
        } elseif($status == "WAIT"){
            $wait++;
        } elseif($status == "INACTIVE"){
            $inactive++;
        }
    }
    $total = $ready+$wait+$inactive;
        $quer = "UPDATE presentations SET wait='$wait',ready='$ready',inactive='$inactive' WHERE pin='$pin'";
        $resul = mysqli_query($connection,$quer);
        if(!$resul){
            die("FAIL");
        }
}
if(isset($_POST['action'])){
    $pin = mysqli_real_escape_string($connection,$_GET['pin']);
    if($_POST['action'] == "nextSlide"){
        $query = "SELECT * FROM presentations WHERE pin='$pin' LIMIT 1";
        $result = mysqli_query($connection,$query);
        $slide = (int) mysqli_fetch_assoc($result)['current_slide'];
        $nextslide = $slide+1;
        $query = "UPDATE presentations SET current_slide='$nextslide' WHERE pin='$pin'";
        updateOnline($pin);
        $result = mysqli_query($connection,$query);
        $next = "UPDATE slides SET sketch='' WHERE pin='$pin'";
        $nextres = mysqli_query($connection,$next);
        if($result){
            die("TRUE");
        } else {
            die("FALSE");
        }
    }
    if($_POST['action'] == "prevSlide"){
        $query = "SELECT * FROM presentations WHERE pin='$pin' LIMIT 1";
        $result = mysqli_query($connection,$query);
        $slide = (int) mysqli_fetch_assoc($result)['current_slide'];
        $nextslide = $slide-1;
        $query = "UPDATE presentations SET current_slide='$nextslide' WHERE pin='$pin'";
        updateOnline($pin);
        $result = mysqli_query($connection,$query);
        $next = "UPDATE slides SET sketch='' WHERE pin='$pin'";
        $nextres = mysqli_query($connection,$next);
        if($result){
            die("TRUE");
        } else {
            die("FALSE");
        }
    }
    $query = "SELECT * FROM participants WHERE pin='$pin'";
    $result = mysqli_query($connection,$query);
    while($row = mysqli_fetch_assoc($result)){
        $id = $row['id'];
        $q = "UPDATE participants SET status='INACTIVE' WHERE id='$id'";
        $r = mysqli_query($connection,$q);
    }
}else {
    die("Failed to receive POST data.");
}
?>