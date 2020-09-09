var mongoClient = require("mongodb").MongoClient;

var messages = [];

function postMessage(obj){
    messages.push(obj);
    mongoClient.connect("mongodb://127.0.0.1:27017/",{useUnifiedTopology : true},(err,dbHost)=>{
        if(err)
        {
            console.log("error while connecting to the db");
        }
        else
        {
            var db = dbHost.db("slDb");
            db.collection("messages",(err,col)=>{
                if(err){
                    console.log("error while connecting to collection");
                }
                else{
                    col.insertOne(obj);
                }
            })

        }
    })
}

function getAllMessages(){
    return messages;
}

module.exports = {postMessage, getAllMessages};