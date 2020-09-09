var chatForm=document.getElementById("chatForm");
var chatMessage=document.getElementById("txtChatMessage");
var chatMessageDiv=document.getElementById("chatMessage");

var room = document.getElementById("roomName");
var username=Qs.parse(location.search,{ignoreQueryPrefix:true}).username;
var roomName = Qs.parse(location.search,{ignoreQueryPrefix:true}).roomName;
//console.log("Username:",username);
//console.log("room name:",roomName)
const socket = io();
socket.emit("joinRoom",{username:username, roomName:roomName});
socket.on("welcomeUser",(msg)=>{
    room.innerHTML = roomName.toUpperCase() + " ROOM";
    chatMessageDiv.innerHTML=msg;
})
socket.on("chatMessage",(obj)=>{
    //console.log("inside chatMessage");
    //chatMessage.innerHTML+=formatMessage(obj);
    formatMessage(obj);
})

socket.on("newUserJoinMessage",(obj)=>{
    var paraElement = document.createElement("p");
    var str = obj.username+" : "+obj.message;
    var textElement = document.createTextNode(str);
    paraElement.appendChild(textElement);
    chatMessageDiv.appendChild(paraElement);
})
function formatMessage(obj){
    var paraElement = document.createElement("p");
    var str = obj.username+" : "+obj.message;
    var textElement = document.createTextNode(str);
    paraElement.appendChild(textElement);
    chatMessageDiv.appendChild(paraElement);
    //return str;
}


function sendMessageEventHandler(){
    socket.emit("message",{message:chatMessage.value,username:username, roomName:roomName});
}


