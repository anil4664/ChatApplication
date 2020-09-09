var mongoClient = require("mongodb").MongoClient;

const users=[];

function newUserJoin(id, username, roomName){
    var user = {id, username, roomName};
    users.push(user);
    mongoClient.connect("mongodb://127.0.0.1:27017/",{useUnifiedTopology : true},(err,dbHost)=>{
        if(err)
        {
            console.log("error while connecting to the db");
        }
        else
        {
            var db = dbHost.db("slDb");
            db.collection("users",(err,col)=>{
                if(err){
                    console.log("error while connecting to collection");
                }
                else{
                    col.insertOne(user);
                }
            })

        }
    })
}

function getAllUsers(roomName,returnResult){
    //return users;
    mongoClient.connect("mongodb://127.0.0.1:27017/",{useUnifiedTopology : true},(err,dbHost)=>{
        if(err)
        {
            console.log("error connectig to mongodb",err);
        }
        else{
            var db=dbHost.db("slDb");
            db.collection("users",(err,col)=>{
                if(err){
                    console.log("error connecting to the collection",err);
                    returnResult([]);
                }
                else{
                    col.find({roomName:roomName}).toArray((err,data)=>{
                        if(err){
                            console.log("erro in find dat",err);
                        }
                        else{
                            console.log("data in the particular room",data);
                            returnResult(data);
                        }
                    });
                }
            })
        }
    })
}

function getUser(id){
    var pos = users.findIndex(item=>item.id==id);
    console.log(users,pos,id)
    if(pos>=0)
    {
        mongoClient.connect("mongodb://127.0.0.1:27017/",{useUnifiedTopology : true},(err,dbHost)=>{
        if(err)
        {
            console.log("error while connecting to the db");
        }
        else
        {
            var db = dbHost.db("slDb");
            db.collection("users",(err,col)=>{
                if(err){
                    console.log("error while connecting to collection");
                }
                else{
                    col.findOne({id:id},(err, res)=>{
                        if(err)
                            console.log("no user with the given id");
                        else{
                            console.log("result is:",res)
                        }
                    });
                }
            })

        }
    })   
    return users[pos];
    }
    else 
        return null;
}

function removeUser(id){
    var pos = users.findIndex(item=>item.id==id);
    if(pos>=0)
    {
        mongoClient.connect("mongodb://127.0.0.1:27017/",{useUnifiedTopology : true},(err,dbHost)=>{
            if(err)
            {
                console.log("error while connecting to the db");
            }
            else
            {
                var db = dbHost.db("slDb");
                db.collection("users",(err,col)=>{
                    if(err){
                        console.log("error while connecting to collection");
                    }
                    else{
                        col.deleteOne({id:id},(err,res)=>{
                            if(err)
                                console.log("failed to delete the given id");
                            else{
                                if(res.deletedCount==1)
                                    return true
                                return false;
                                    console.log("deleted successfully");
                            }
                        });
                    }
                })
    
            }
        })
        users.splice(pos,1)
    }
        
}

module.exports = {newUserJoin, getAllUsers, getUser, removeUser};
