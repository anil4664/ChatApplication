var express = require("express");
var path=require("path");
var bodyParser = require("body-parser");
var http=require("http");
var queryString = require("querystring");
var socketio=require("socket.io");

var userObj = require("./utils/usersInfo");
var messageObj = require("./utils/messageManagement");
const { response } = require("express");
const messageManagement = require("./utils/messageManagement");

const PORT=3000;

var app = express();
const server=http.createServer(app);
var io = socketio(server);


app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get("/",(request, response)=>{
    var fileUrl = path.join(__dirname,"public","index.html");
    response.sendFile(fileUrl);
})

app.post("/home",(request, response)=>{
    var username=request.body.username;
    var roomName=request.body.roomName;
    //console.log("request is",request.body);
    var temp = queryString.stringify({username:username, roomName:roomName});
    //response.redirect("/chat/"+username);
    response.redirect("/chat?"+temp);
})

app.get("/chat",(request, response)=>{
    var fileUrl=path.join(__dirname,"public","chat.html");
    response.sendFile(fileUrl);
})
//when a new user joins the chat 
io.on("connection",(socket)=>{
    socket.on("joinRoom",(data)=>{
        socket.join(data.roomName);
        //console.log(data);
        var obj = {username : data.username, message : "has joined the room", roomName: data.roomName};
        userObj.newUserJoin(socket.id, data.username, data.roomName);
        messageObj.postMessage(obj);
        socket.to(data.roomName).broadcast.emit("newUserJoinMessage", obj);
        socket.emit("welcomeUser", "welcome to the room");
    })
    socket.on("disconnect",()=>{
        //console.log("User has left the room");
        var tempUser = userObj.getUser(socket.id);
        if(tempUser!=null)
        {
            var obj = {username : tempUser.username, message:"has left the room"};
            socket.to(tempUser.roomName).broadcast.emit("newUserJoinMessage", obj);
            var deletFlag = userObj.removeUser(socket.id);
            if(deletFlag)
            {
            messageObj.postMessage(obj);
            console.log("user disconnected:"+tempUser.username);
            }
        }
    })
    socket.on("message",(obj)=>{
        console.log("message received",obj.message);
        //socket.io.emit
        messageObj.postMessage(obj);
        io.to(obj.roomName).emit("chatMessage",obj);
        //console.log("message posted");
        //console.log("all messages are:",messageObj.getAllMessages());
        userObj.getAllUsers(obj.roomName,(p1)=>{
            if(p1.lenght==0)
                console.log("error in retreiving docs");
            else{
                //console.log(p1);
                var userArr = p1.map(item=>item.username);
                //console.log(userArr);
                //console.log("message posted successfully");
            }
        });
    })

})
server.listen(PORT,(err)=>{
    if(!err)
    {
        console.log("server started at:"+PORT);
    }
    else{
        console.log("error while starting the server",err);
    }
})