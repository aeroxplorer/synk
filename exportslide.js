function toBlob(dataURI) {
    console.log(dataURI);
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: mimeString });
    return blob;
}
var totalSlides = document.querySelectorAll(".main-slide").length;
var onSlide = 0;
function presentationExport(){
    var accepted = "qwertyuiopasdfghjklzxcvbnm1234567890";
    var pin = "";
    for(var x=0;x<6;x++){
        var selected = Math.round(Math.random()*accepted.length);
        pin += accepted.substring(selected,selected+1);
    }
    var makePres = new XMLHttpRequest();
    makePres.open("POST","http://synk.aeroxplorer.com/api/newpres.php");
    makePres.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    makePres.send("pin=" + pin);
    makePres.onload = function(){
        if(this.responseText != "TRUE"){
            window.alert("Error when creating presentation: " + this.responseText);
        } else {
            for (var x = 0; x < document.querySelectorAll(".main-slide").length; x++) {
                var slideNum;
                slideNum = x + 1;
                // getSlideData(x,pin);
                timeline = window.btoa(document.querySelectorAll(".timeline")[x].innerHTML);
                var xhr = new XMLHttpRequest();
                var fd = new FormData();
                fd.append("slideNum", x);
                fd.append("timeline", timeline);
                fd.append("pin", pin);
                fd.append("image", toBlob(document.querySelectorAll(".single-slide")[x].querySelector("img").src));
                xhr.open("POST", "http://synk.aeroxplorer.com/api/newslide.php");
                xhr.send(fd);
                xhr.onload = function () {
                    if (this.responseText != "TRUE") {
                        window.alert("FAILED TO LOAD: " + this.responseText);
                    } else {
                        success++;
                        onSlide = x + 1;
                    }
                }
            }
            window.alert("Ready to Present!");
            window.location.href = "exported.html?pin=" + pin.toUpperCase();
            //window.alert("WORKED!");
        }
    }
}
function continueExport(IMG,x,pin) {
    success = 1;
    console.log(IMG);
    timeline = window.btoa(document.querySelectorAll(".timeline")[x].innerHTML);
    console.log("TIMELINE", timeline);
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    fd.append("slideNum", x);
    fd.append("timeline", timeline);
    fd.append("pin", pin);
    fd.append("image", toBlob(IMG));
    xhr.open("POST", "http://synk.aeroxplorer.com/api/newslide.php");
    //xhr.setRequestHeader("Content-type", "multipart/form-data");
    xhr.send(fd);
    xhr.onload = function () {
        if (this.responseText != "TRUE") {
            window.alert("FAILED TO LOAD: " + this.responseText);
        } else {
            success++;
            onSlide = x+1;
            if(onSlide == totalSlides){
                window.alert("Successful Import");
                window.location.href="exported.html?pin="+pin.toUpperCase();
            }
        }
    }
}