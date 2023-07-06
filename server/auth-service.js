//mongodb+srv://dbUser:Keith_12370@senecaweb.tdyfv1l.mongodb.net/?retryWrites=true&w=majority

const bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "userName": {type: String,unique: true},
    "firstName": String,
    "lastName": String,
    "password": String,
    "email": String,
    "aboutMe": {
        "type": String,
        "default": null
    },
    "posts":[{
        "postID": Number,
        "description": String,
        "postDate": Date,
        "featureImage": String,
        "comment": [{
            "name": String,
            "body": String,
            "replies": [{
                "name": String,
                "body": String
            }]
        }]
    }]
});
var postsSchema = new Schema({
    "postID": {type: Number, unique: true},
    "description": String,
    "postDate": Date,
    "featureImage": String,
    "userName": String,
    "author": String,
    "comment": [{
        "name": String,
        "body": String,
        "replies": [{
            "name": String,
            "body": String
        }]
    }]
})
var User;
var Posts;
function initialize(){
    return new Promise((resolve,reject)=>{
        let db = mongoose.createConnection("mongodb+srv://dbUser:Keith_12370@senecaweb.tdyfv1l.mongodb.net/Test");
        db.on('error',(err)=>{
            reject(err);
        });
        db.once('open',()=>{
            User = db.model('users',userSchema);
            Posts = db.model('posts',postsSchema);
            resolve();
        })
    })
}

function registerUser(userData){
    return new Promise((resolve,reject)=>{
        if(userData.password != userData.password2){
            reject("Passwords do not match");
        }
        else{
            bcrypt.hash(userData.password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save().then(()=>{
                    resolve();
                })
                .catch(err=>{
                    console.log(err)
                    if(err.code == 11000)
                        reject("Username is already taken");
                    else
                        reject(`There was an error creating the user: ${err}`);
                })
            })
            .catch(err=>{
                reject("There was an error encrypting the password");
            });
        }
    })
}

function checkUser(userData){
    return new Promise((resolve,reject)=>{
        User.find({userName:userData.userName}).exec()
        .then(users=>{
            users = users.map(val=>val.toObject());
            if(users.length == 0)
                reject(`Unable to find user: ${userData.userName}`);
            else{
            //Verify if entered password matches the hashed password in DB
                bcrypt.compare(userData.password,users[0].password).then((result)=>{
                    if(result === false)
                        reject(`Incorrect Password for user: ${userData.userName}`);
                    else if(result === true){
                        resolve(users[0]);
                    }
                })
            }
        })
        .catch((err)=>{reject(`Unable to find user: ${err}`)});
    });
}

function addPost(post){
    return new Promise((resolve,reject)=>{
        User.find({userName: post.userName}).exec()
        .then(users=>{
            users = users.map(val=>val.toObject());

            if(users.length === 0)
                reject('Post Error');
            else{
                Posts.find({}).exec()
                .then(posts=>{
                    posts = posts.map(val=>val.toObject());
                    console.log(posts.length)
                    let id = 0;
                    if(posts.length !== 0){
                        id = posts[posts.length-1].postID + 1;
                    }
                    console.log(id);
                    users[0].posts.push({
                        postID: id,
                        description: post.body,
                        postDate: new Date(),
                        featureImage: post.featureImage,
                    });
                    let newPost = new Posts({
                        postID: id,
                        description: post.body,
                        postDate: new Date(),
                        featureImage: post.featureImage,
                        userName: users[0].userName,
                        author: users[0].firstName + ' ' + users[0].lastName,
                    })
                    newPost.save().then(()=>{
                        User.updateOne(
                            {userName: post.userName},
                            {$set: {posts: users[0].posts}}
                        ).exec()
                        .then(()=>resolve(users[0].posts)).catch(err=>(reject('Post Error')));
                    })
                }).catch(reject('Post Error'));
            }
        }).catch(err=>reject('Post Error'));
    });
}

function getUserPosts(user){
    return new Promise((resolve,reject)=>{
        User.find({userName:user.userName}).exec()
        .then(users=>{
            users = users.map(val=>val.toObject());
            if(users.length === 0)
                reject('Get Error');
            else{
                resolve(users[0].posts);
            }
        }).catch(err=>reject('Get Error'));
    });
}

function getAllPosts(){
    return new Promise((resolve,reject)=>{
        Posts.find({}).exec()
        .then(posts=>{
            posts = posts.map(val=>val.toObject());
            if(posts.length === 0)
                resolve([]);
            else{
                resolve(posts);
            }
        }).catch(err=>reject('Posts Error'));
    });
}

function getUser(userData){
    return new Promise((resolve,reject)=>{
        User.find({userName:userData.userName}).exec()
        .then(users=>{
            users = users.map(val=>val.toObject());
            if(users.length === 0)
                reject('Cannot find this user');
            else{
                resolve(users[0]);
            }
        }).catch(err=>reject('Get error'));
    })
}

function setAbout(userData){
    return new Promise((resolve,reject)=>{
        User.updateOne(
            {userName:userData.userName},
            {$set:{aboutMe: userData.aboutMe}}
        ).exec()
        .then(()=>resolve('Success')).catch(err=>reject('Error'));
    });
}

function addCommentToPost(userData){
    return new Promise((resolve,reject)=>{
        User.find({userName:userData.userName,"posts.postID":userData.postID}).exec()
        .then(users=>{
            users = users.map(val=>val.toObject());
            if(users.length === 0)
                reject('Users === 0');
            else{
                let c = {
                    name: userData.firstName + ' ' + userData.lastName,
                    body: userData.body
                }
                User.updateOne(
                    {userName: userData.userName, "posts.postID":userData.postID},
                    {$push: {"posts.$.comment": c}}
                ).exec().then(()=>{
                    Posts.find({userName:userData.userName, postID: userData.postID}).exec()
                    .then(posts=>{
                        posts = posts.map(val=>val.toObject());
                        if(posts.length === 0)
                            reject('Posts === 0');
                        else{
                            posts[0].comment.push({
                                name: userData.firstName + ' ' + userData.lastName,
                                body: userData.body
                            });
                            Posts.updateOne(
                                {userName: userData.userName, postID: userData.postID},
                                {$set: {comment: posts[0].comment}}
                            ).exec().then(()=>resolve(posts[0].comment))
                            .catch(err=>reject('Posts UpdateOne Error'))
                        }
                })
                }).catch(err=>console.log('WTF'))
            }
        }).catch(err=>reject(err));
    })
}

function deletePost(userData){
    return new Promise((resolve,reject)=>{
        User.updateOne(
            {userName: userData.userName},
            {$pull: {posts: {postID: userData.postID}}}
        ).exec().then(()=>{
            Posts.deleteOne({postID: userData.postID}).exec()
            .then(()=>resolve()).catch(err=>reject(err))
        }).catch(err=>reject(err))
    })
}

module.exports = {
    initialize,
    registerUser,
    checkUser,
    addPost,
    getUserPosts,
    getAllPosts,
    getUser,
    setAbout,
    addCommentToPost,
    deletePost
}