//const { default: html2canvas } = require("html2canvas");

function textBox(){
    document.querySelectorAll(".main-slide")[currentSlide].innerHTML += '<div class="text-box"><textarea onclick="editMe(event)" onkeyup="mergeThis(event)" data-font-size="17" data-font="" data-background-color="" data-color="" data-text-decoration="" data-text-align="" class="text-field" onmousedown = "mousedownX(event)" placeholder = "Double-click to add text..."></textarea><div class="handle ne"></div><div class="handle nw"></div><div class="handle sw"></div><div class="handle se"></div></div>';
}
function mergeThis(e){
    e.target.innerHTML = e.target.value;
}
// resize elemnts
function mousedownX(e) {
    let isResizing = false;
    let isTyping = false;
    e.target = editingElem;
    e.target.onfocus = function(){
        e.target.style.border = "solid 1px black";
        e.target.parentElement.querySelector(".nw").style.display = "block";
        e.target.parentElement.querySelector(".ne").style.display = "block";
        e.target.parentElement.querySelector(".sw").style.display = "block";
        e.target.parentElement.querySelector(".se").style.display = "block";
    }
    e.target.onblur = function(){
        if(!isResizing && !isTyping){
            e.target.style.border = "none";
            e.target.parentElement.querySelector(".nw").style.display = "none";
            e.target.parentElement.querySelector(".ne").style.display = "none";
            e.target.parentElement.querySelector(".sw").style.display = "none";
            e.target.parentElement.querySelector(".se").style.display = "none";
        }
    }
    var textArea = e.target;
    document.body.onclick = function (e) {
        if (e.target != textArea) {
            isTyping = false;
        }
    }
    textArea.addEventListener('dblclick', type)
    function type() {
        if (!isTyping) {
            isTyping = true;
            textArea.style.cursor = 'text';
        } else {
            isTyping = false;
            textArea.style.cursor = 'default';
        }
    }
    var textBox = e.target.parentElement;
    const handles = e.target.parentElement.querySelectorAll('.handle');
    if (e.target == textArea && !isTyping) {
        e.target.style.cursor = 'move';
    }
    window.onmousemove = null;
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    //
    let slideLeft = document.querySelectorAll(".main-slide")[currentSlide].offsetLeft;
    let slideTop = document.querySelectorAll(".main-slide")[currentSlide].offsetTop;

    let prevX = e.clientX-slideLeft;
    let prevY = e.clientY-slideTop;

    function mousemove(e) {
        if (!isResizing && !isTyping) {
            let newX = prevX - e.clientX;
            let newY = prevY - e.clientY;
            textArea.classList.add("noselection");
            const rect = textBox.getBoundingClientRect();

            textBox.style.left = prevX + "px";
            textBox.style.top = prevY + "px";

            prevX = e.clientX - slideLeft;
            prevY = e.clientY - slideTop;
        }
        if (isResizing) {
            textArea.classList.add("noselection");
        } else {
            if (textArea.classList.contains("noselection")) {
                textArea.classList.remove("noselection");
            }
        }
    }
    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }


    let currentHandle;

    for (let handle of handles) {
        handle.addEventListener('mousedown', mousedown);
    }

    function mousedown(e) {
        currentHandle = e.target;
        isResizing = true;
        
        window.removeEventListener('mousemove', resize);

        let prevX = e.clientX;
        let prevY = e.clientY;

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', mouseup);

        function resize(e) {
            const rect = textBox.getBoundingClientRect();

            if (currentHandle.classList.contains("se")) {
                textBox.style.width = rect.width - (prevX - e.clientX) + "px";
                textBox.style.height = rect.height - (prevY - e.clientY) + "px";
            } else if (currentHandle.classList.contains("sw")) {
                textBox.style.width = rect.width + (prevX - e.clientX) + "px";
                textBox.style.height = rect.height - (prevY - e.clientY) + "px";
                textBox.style.left = rect.left - (prevX - e.clientX) + "px";
            } else if (currentHandle.classList.contains("ne")) {
                textBox.style.width = rect.width - (prevX - e.clientX) + "px";
                textBox.style.height = rect.height + (prevY - e.clientY) + "px";
                textBox.style.top = rect.top - (prevY - e.clientY) + "px";
            } else {
                textBox.style.width = rect.width + (prevX - e.clientX) + "px";
                textBox.style.height = rect.height + (prevY - e.clientY) + "px";
                textBox.style.top = rect.top - (prevY - e.clientY) + "px";
                textBox.style.left = rect.left - (prevX - e.clientX) + "px";
            }
            prevX = e.clientX;
            prevY = e.clientY;
        }

        function mouseup() {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', mouseup);
            textArea.focused = false;
            isResizing = false;
            for (let handle of handles) {
                handle.removeEventListener('mousedown', mousedown);
            }

        }
    }
}
function createTextBox(elem,startX,startY,width,height){
    var textBox = document.createElement("textarea");
    elem.remove();
    // var draghandle = document.createElement("div");
    // draghandle.classList.add("draghandle");
    // textBox.appendChild(draghandle);
    // draghandle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-move" viewBox="0 0 16 16"><path fill-rule="evenodd" d = "M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z" /></svg >';
    document.getElementById("main-slide").appendChild(textBox);
    textBox.placeholder = "Start typing...";
    textBox.style.resize = "none";
    textBox.style.position = "absolute";
    textBox.style.border = "none";
    textBox.style.left = startX + "px";
    textBox.style.top = startY + "px";
    textBox.style.width = width + "px";
    textBox.style.height = height + "px";
    textBox.focus();
}
function refreshThumbnails(){
    generateThumbnail(document.getElementById("slide_currentslide").value);
}
// function thumbnailByHTML(HTML,slideNum){
//     var canvas = document.createElement("canvas");
//     var themeIMG = new Image();
//     themeIMG.src = blankpres.theme + ".jpg";
//     canvas.width = document.querySelectorAll(".main-slide")[currentSlide].clientWidth;
//     canvas.height = document.querySelectorAll(".main-slide")[currentSlide].clientHeight;
//     HTML = filterHTML(HTML);
//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(themeIMG, 0, 0, canvas.width, canvas.height);
//     rasterizeHTML.drawHTML(HTML,
//         canvas);
//     //
//     setTimeout(function () {
//         URL = canvas.toDataURL();
//         //console.log(URL);
//         document.getElementsByClassName("single-slide")[slideNum].querySelector("img").src = URL;
//         // set crop
//         setCrop(slideNum);
//     }, 500);
// }
function thumbnailByHTML(HTML,slideNum) {
    var slide = document.querySelectorAll(".main-slide")[slideNum];
    slide = slide.innerHTML.replace('<span style="opacity: 0; cursor: default;">p</span>', '').trim();
    var elements = document.querySelectorAll(".main-slide")[slideNum].querySelectorAll("div");
    var canvas = document.createElement("canvas");
    canvas.width = 1124;
    canvas.height = 702;
    var ctx = canvas.getContext("2d");
    var theme = new Image();
    theme.src = blankpres.theme + ".jpg";
    ctx.drawImage(theme, 0, 0, canvas.width, canvas.height);
    for (var x = 0; x < elements.length; x++) {
        var thisElem = elements[x];
        if (thisElem.classList.contains("text-box")) {
            if (thisElem.querySelector("a") == undefined) {
                console.log("text box");
                slide = document.querySelectorAll(".main-slide")[slideNum];
                var left = 15 + Math.round((parseInt(thisElem.style.left) / parseInt(slide.clientWidth)) * 1124);
                var top = 45 + Math.round((parseInt(thisElem.style.top) / parseInt(slide.clientHeight)) * 702);
                thisElem = thisElem.getElementsByTagName("textarea")[0];
                var fontSize = Math.round((parseInt(thisElem.dataset.fontSize) / parseInt(slide.clientHeight)) * 702) - 5;
                var properties = {
                    "fontSize": fontSize,
                    "font": thisElem.dataset.font,
                    "backgroundColor": thisElem.dataset.backgroundColor,
                    "color": thisElem.dataset.color,
                    "textAlign": thisElem.dataset.textAlign,
                    "text": thisElem.innerHTML,
                    "left": left,
                    "top": top
                }
                console.log(properties);
                if (properties.font == "") {
                    properties.font = "Courier New";
                }
                if (properties.color == "") {
                    properties.color = "black";
                }
                if (properties.backgroundColor == "") {
                    properties.backgroundColor = "white";
                }
                if (properties.textAlign == "") {
                    properties.textAlign = "left";
                }
                ctx.font = properties.fontSize + "px " + properties.font;
                ctx.fillStyle = properties.color;
                ctx.textAlign = properties.textAlign;
                ctx.fillText(properties.text, properties.left, properties.top);
            } else {
                console.log("link");
                slide = document.querySelectorAll(".main-slide")[slideNum];
                var left = 15 + Math.round((parseInt(thisElem.style.left) / parseInt(slide.clientWidth)) * 1124);
                var top = 45 + Math.round((parseInt(thisElem.style.top) / parseInt(slide.clientHeight)) * 702);
                thisElem = thisElem.getElementsByTagName("a")[0];
                var givenWidth = thisElem.innerHTML.length*12;
                var properties = {
                    "fontSize": 29,
                    "text": thisElem.innerHTML,
                    "left": left,
                    "top": top,
                    "destination": thisElem.href,
                    "width": givenWidth
                }
                console.log(properties);
                ctx.font = properties.fontSize + "px Arial";
                ctx.fillStyle = "blue";
                ctx.textAlign = "left";
                ctx.fillText(properties.text, properties.left, properties.top);
                ctx.beginPath();
                ctx.moveTo(properties.left,(properties.top+properties.fontSize/3));
                ctx.lineTo(properties.left+givenWidth,(properties.top+properties.fontSize/3));
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#0000FF";
                ctx.stroke();
            }
        } else if (thisElem.classList.contains("image")) {
            // we've got an image
            console.log("image");
            var thisIMG = new Image();
            thisIMG.src = thisElem.getElementsByTagName("img")[0].src;
            slide = document.querySelectorAll(".main-slide")[slideNum];
            console.log(thisElem.parentElement.style.width, slide.clientWidth);
            var width = Math.round((parseInt(thisElem.style.width) / slide.clientWidth) * 1124);
            var height = Math.round((parseInt(thisElem.style.height) / slide.clientHeight) * 702);
            var top = Math.round((parseInt(thisElem.style.top) / slide.clientHeight) * 702);
            var left = Math.round((parseInt(thisElem.style.left) / slide.clientWidth) * 1124);
            var properties = {
                "width": width,
                "height": height,
                "top": top,
                "left": left
            }
            console.log(properties);
            ctx.drawImage(thisIMG, left, top, width, height);
        }
    }
    setTimeout(function () {
        var mainReturn = canvas.toDataURL();
        document.getElementsByClassName("single-slide")[slideNum].querySelector("img").src = mainReturn;
        return mainReturn;
    }, 500)
}
function getSlideData(slideNum,pin) {
    var slide = document.querySelectorAll(".main-slide")[slideNum];
    slide = slide.innerHTML.replace('<span style="opacity: 0; cursor: default;">p</span>', '').trim();
    var elements = document.querySelectorAll(".main-slide")[slideNum].querySelectorAll("div");
    var canvas = document.createElement("canvas");
    canvas.width = 1124;
    canvas.height = 702;
    var ctx = canvas.getContext("2d");
    var theme = new Image();
    theme.src = blankpres.theme + ".jpg";
    ctx.drawImage(theme, 0, 0, canvas.width, canvas.height);
    for (var x = 0; x < elements.length; x++) {
        var thisElem = elements[x];
        if (thisElem.classList.contains("text-box")) {
            if (thisElem.querySelector("a") == undefined) {
                console.log("text box");
                slide = document.querySelectorAll(".main-slide")[slideNum];
                var left = 15 + Math.round((parseInt(thisElem.style.left) / parseInt(slide.clientWidth)) * 1124);
                var top = 45 + Math.round((parseInt(thisElem.style.top) / parseInt(slide.clientHeight)) * 702);
                thisElem = thisElem.getElementsByTagName("textarea")[0];
                var fontSize = Math.round((parseInt(thisElem.dataset.fontSize) / parseInt(slide.clientHeight)) * 702) - 5;
                var properties = {
                    "fontSize": fontSize,
                    "font": thisElem.dataset.font,
                    "backgroundColor": thisElem.dataset.backgroundColor,
                    "color": thisElem.dataset.color,
                    "textAlign": thisElem.dataset.textAlign,
                    "text": thisElem.innerHTML,
                    "left": left,
                    "top": top
                }
                console.log(properties);
                if (properties.font == "") {
                    properties.font = "Courier New";
                }
                if (properties.color == "") {
                    properties.color = "black";
                }
                if (properties.backgroundColor == "") {
                    properties.backgroundColor = "white";
                }
                if (properties.textAlign == "") {
                    properties.textAlign = "left";
                }
                ctx.font = properties.fontSize + "px " + properties.font;
                ctx.fillStyle = properties.color;
                ctx.textAlign = properties.textAlign;
                ctx.fillText(properties.text, properties.left, properties.top);
            } else {
                console.log("link");
                slide = document.querySelectorAll(".main-slide")[slideNum];
                var left = 15 + Math.round((parseInt(thisElem.style.left) / parseInt(slide.clientWidth)) * 1124);
                var top = 45 + Math.round((parseInt(thisElem.style.top) / parseInt(slide.clientHeight)) * 702);
                thisElem = thisElem.getElementsByTagName("a")[0];
                var givenWidth = thisElem.innerHTML.length * 12;
                var properties = {
                    "fontSize": 29,
                    "text": thisElem.innerHTML,
                    "left": left,
                    "top": top,
                    "destination": thisElem.href,
                    "width": givenWidth
                }
                console.log(properties);
                ctx.font = properties.fontSize + "px Arial";
                ctx.fillStyle = "blue";
                ctx.textAlign = "left";
                ctx.fillText(properties.text, properties.left, properties.top);
                ctx.beginPath();
                ctx.moveTo(properties.left, (properties.top + properties.fontSize / 3));
                ctx.lineTo(properties.left + givenWidth, (properties.top + properties.fontSize / 3));
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#0000FF";
                ctx.stroke();
            }
        } else if (thisElem.classList.contains("image")) {
            // we've got an image
            console.log("image");
            var thisIMG = new Image();
            thisIMG.src = thisElem.getElementsByTagName("img")[0].src;
            slide = document.querySelectorAll(".main-slide")[slideNum];
            console.log(thisElem.parentElement.style.width, slide.clientWidth);
            var width = Math.round((parseInt(thisElem.style.width) / slide.clientWidth) * 1124);
            var height = Math.round((parseInt(thisElem.style.height) / slide.clientHeight) * 702);
            var top = Math.round((parseInt(thisElem.style.top) / slide.clientHeight) * 702);
            var left = Math.round((parseInt(thisElem.style.left) / slide.clientWidth) * 1124);
            var properties = {
                "width": width,
                "height": height,
                "top": top,
                "left": left
            }
            console.log(properties);
            ctx.drawImage(thisIMG, left, top, width, height);
        }
    }
    setTimeout(function () {
        var mainReturn = canvas.toDataURL();
        continueExport(mainReturn,slideNum,pin);
    }, 500);
}
function getIMG(HTML){
    var canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 300;
    rasterizeHTML.drawHTML(HTML,
        canvas);
    var URL = canvas.toDataURL();
    return URL;
}
function generateThumbnail(slideNum){
    var canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 300;
    ctx.moveTo(-100,-100);
    rasterizeHTML.drawHTML(document.getElementById("main-slide").innerHTML,
        canvas);
    var URL = canvas.toDataURL();
    document.getElementsByClassName("single-slide")[slideNum-1].querySelector("img").src = URL;
}
function setNode(nodeNum,status){
    for(var x=0;x<document.getElementsByClassName("full-node").length;x++){
        document.getElementsByClassName("full-node")[x].style.display = "none";
    }
    document.getElementsByClassName("full-node")[nodeNum].style.display = status;
}
function badIMG(e){
    window.alert("Failed to load image: Invalid URL");
    e.target.parentElement.outerHTML = "";
}
document.getElementById("node-image-url").onkeyup = function(){
    document.getElementById("node-link").checked = true;
}
document.getElementById("node-image-upload").onclick = function () {
    document.getElementById("node-upload-link").checked = true;
}
function insertImage(){
    if(document.getElementById("node-link").checked == true){
        // Upload via URL
        var URL = document.getElementById("node-image-url").value;
        var code = '<div class="image"><div class="handle ne"></div><div class="handle nw"></div><div class="handle sw"></div><div class="handle se"></div><img style="width: 100%; height: 100%; top: inherit; left: inherit;" onmousedown = "mousedownX(event)" onerror="badIMG(event)" src="' + URL + '"></div>';
        document.getElementsByClassName("main-slide")[currentSlide].innerHTML += code;
        setNode(0,'none');
    } else {
        // Upload from computer
        var file = document.getElementById("node-image-upload").files[0];
        if(file){
            var reader = new FileReader();
            reader.addEventListener('load', function() {
                var code = '<div class="image"><div class="handle ne"></div><div class="handle nw"></div><div class="handle sw"></div><div class="handle se"></div><img style="width: inherit; height: inherit; top: 0; left: 0;" onmousedown = "mousedownX(event)" onerror="badIMG(event)" src="' + this.result + '"></div>';
                document.querySelectorAll(".main-slide")[currentSlide].innerHTML += code;
                setNode(0,'none');
            });
            reader.readAsDataURL(file);
        }
    }
}
var slide;
function saveQuestion(){
    var nowEditing = document.querySelectorAll(".full-node")[1].querySelector(".now-editing").value;
    st = {
        "slidenum": currentSlide,
        "question": document.getElementById("node-mc-q").value,
        "answer1": {
            "text": document.getElementById("node-mc-a1").value,
            "correct": document.getElementById("node-mc-a1-c").value
        },
        "answer2": {
            "text": document.getElementById("node-mc-a2").value,
            "correct": document.getElementById("node-mc-a2-c").value
        },
        "answer3": {
            "text": document.getElementById("node-mc-a3").value,
            "correct": document.getElementById("node-mc-a3-c").value
        },
        "answer4": {
            "text": document.getElementById("node-mc-a4").value,
            "correct": document.getElementById("node-mc-a4-c").value
        }
    };
    var newInfo = window.btoa(JSON.stringify(st));
    document.querySelectorAll(".full-node")[1].querySelectorAll(".one-data")[nowEditing].value = newInfo;
    tempsave.dataset.information = newInfo;
    setNode(1,"none");
}
var tempSaveElem;
function saveFRQ(){
    var question = document.getElementById("node-frq-q").value + "";
    var windol = window.btoa(question);
    tempSaveElem.dataset.information = windol;
    setNode(2,'none');
}
function initiateFRQ(elem){
    var information = elem.dataset.information;
    if(information == undefined){
        // make it all blank
    } else {
        // load the info
        var question = window.atob(elem.dataset.information);
        document.getElementById("node-frq-q").value = question;
    }
    tempSaveElem = elem;
}
var tempsave;
function initiateMC(elem,num,ref){
    //console.log(ref);
    if(!elem){
        window.alert("Failed to identify target element.");
    }
    tempsave = elem;
    document.querySelectorAll(".full-node")[1].querySelector(".now-editing").value = ref;
    for(var x=0;document.querySelectorAll(".abcDEF").length;x++){
        document.querySelectorAll(".abcDEF")[x].classList.remove("abcDEF");
    }
    elem.classList.add("abcDEF");
    if(tempsave == undefined){
        document.getElementById("node-mc-q").value = "";
        document.getElementById("node-mc-a1").value = "";
        document.getElementById("node-mc-a1-c").value = "";
        document.getElementById("node-mc-a2").value = "";
        document.getElementById("node-mc-a2-c").value = "";
        document.getElementById("node-mc-a3").value = "";
        document.getElementById("node-mc-a3-c").value = "";
        document.getElementById("node-mc-a4").value = "";
        document.getElementById("node-mc-a4-c").value = "";
        st = {
            "slidenum": currentSlide,
            "question":"",
            "answer1":{
                "text":"",
                "correct": "0"
            },
            "answer2":{
                "text":"",
                "correct": "0"
            },
            "answer3":{
                "text":"",
                "correct": "0"
            },
            "answer4":{
                "text":"",
                "correct": "0"
            }
        };
        //console.log(st);
        console.log("primary pull");
        document.getElementById("node-mc-q").value = st.question;
        document.getElementById("node-mc-a1").value = st.answer1.text;
        document.getElementById("node-mc-a1-c").value = st.answer1.correct;
        document.getElementById("node-mc-a2").value = st.answer2.text;
        document.getElementById("node-mc-a2-c").value = st.answer2.correct;
        document.getElementById("node-mc-a3").value = st.answer3.text;
        document.getElementById("node-mc-a3-c").value = st.answer3.correct;
        document.getElementById("node-mc-a4").value = st.answer4.text;
        document.getElementById("node-mc-a4-c").value = st.answer4.correct;
    } else {
        var info = tempsave.dataset.information;
        st = JSON.parse(window.atob(info));
        document.getElementById("node-mc-q").value = st.question;
        document.getElementById("node-mc-a1").value = st.answer1.text;
        document.getElementById("node-mc-a1-c").value = st.answer1.correct;
        document.getElementById("node-mc-a2").value = st.answer2.text;
        document.getElementById("node-mc-a2-c").value = st.answer2.correct;
        document.getElementById("node-mc-a3").value = st.answer3.text;
        document.getElementById("node-mc-a3-c").value = st.answer3.correct;
        document.getElementById("node-mc-a4").value = st.answer4.text;
        document.getElementById("node-mc-a4-c").value = st.answer4.correct;
    }
}
function selectTheme(themeName){
    blankpres.theme = themeName;
    for(var x=0;x<document.getElementsByClassName("main-slide").length;x++){
        document.getElementsByClassName("main-slide")[x].style.backgroundImage = "url('" + themeName + ".jpg')";
    }
    saveAll();
}