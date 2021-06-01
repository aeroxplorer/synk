if(localStorage.getItem("plugins") != undefined){
    var code;
    try {
        code = JSON.parse(localStorage.plugins);
        for(var x=0;x<code.length;x++){
            var pluginName = code[x].name;
            var source = code[x].sourceURL;
            var script = document.createElement("SCRIPT");
            script.setAttribute("data-plugin-name",pluginName);
            script.src = source;
            document.getElementsByTagName("body")[0].appendChild(script);
            document.getElementById("plugin-list").innerHTML += '<div class="plugin" data-name="' + pluginName + '">' + pluginName + ' &bull; <button onclick="deletePlugin(event)">Delete</button></div>';
        }
    } catch(err){
        window.alert("There was an error. Check the DevConsole for details.");
        console.log(err.message);
    }
} else {
    console.log("No plugins.");
}
function newPlugin(name,source){
    if(localStorage.getItem("plugins") != undefined){
        try{
            var arr = JSON.parse(localStorage.plugins);
        } catch {
            var arr = [];
        }
        arr.push({
            "name":name,
            "sourceURL":source
        });
        localStorage.setItem("plugins",JSON.stringify(arr));
    } else {
        var arr = [{
            "name": name,
            "sourceURL": source
        }];
        localStorage.setItem("plugins",JSON.stringify(arr));
    }
    var script = document.createElement("SCRIPT");
    script.setAttribute("data-plugin-name", name);
    script.src = source;
    document.getElementsByTagName("body")[0].appendChild(script);
    document.getElementById("plugin-list").innerHTML += '<div class="plugin" data-name="' + name + '">' + name + ' &bull; <button onclick="deletePlugin(event)">Delete</button></div>';
    window.alert("Plugin added!");
}
function deletePlugin(e){
    var pluginName,pluginNum,plugins;
    pluginName = e.target.parentElement.dataset.name;
    plugins = JSON.parse(localStorage.plugins);
    for(var x=0;x<plugins.length;x++){
        if(plugins[x].name == pluginName){
            pluginNum = x;
        }
    }
    plugins.splice(pluginNum,1);
    localStorage.plugins = JSON.stringify(plugins);
    e.target.parentElement.outerHTML = "";
    window.alert("Plugin removed.\n\nYou must refresh for changes to be applied.");
}
function loadPlugins(){
    var cont = document.querySelector(".pm");
    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://synk.aeroxplorer.com/plugins/");
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send("action=getPlugins");
    xhr.onload = function(){
        cont.innerHTML = "";
        var resp = JSON.parse(this.responseText);
        for(var x=0;x<resp.length;x++){
            cont.innerHTML += '<div class="add-plugin"><b>' + resp[x].name + '</b> &bull; ' + resp[x].description + '<br><button onclick="newPlugin(\'' + resp[x].name.toLowerCase() + '\',\'' + resp[x].source + '\')">Import Plugin</button>';
        }
    }
}
function exportPlugin(){
    dialogs.prompt("Plugin Name:", NAME => {
        dialogs.prompt("Plugin Description:", DESC => {
            if(NAME == "" || DESC == ""){
                window.alert("Please do not leave fields blank.");
                return;
            } else {
                var code = document.getElementById("terminal").value;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://synk.aeroxplorer.com/plugins/");
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send("action=savePlugin&name=" + NAME + "&description=" + DESC + "&code=" + window.btoa(code));
                xhr.onload = function(){
                    if(this.responseText == "TRUE"){
                        window.alert("Plugin exported successfully!");
                    } else {
                        window.alert("There was an error exporting your plugin. Please try again later.");
                    }
                }
            }
        });
    });
}