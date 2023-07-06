 var HTTP_PORT = process.env.PORT || 8080;
 var express = require("express");
 var path = require('path')
 var app = express();
 var authData = require('./auth-service');
 const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');
 const clientSessions = require('client-sessions');
 app.use(express.json()) // for parsing application/json
 app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
 app.use(express.static(path.join(__dirname,'build')));

 // Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "Assignment06", // this should be a long un-guessable string.
    duration: 100 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use((req,res,next)=>{
    res.locals.session = req.session;
    next();
});

cloudinary.config({
    cloud_name: 'dqiz37nmw',
    api_key: '366567292895275',
    api_secret: 'Xcyvw0F00TS86t0r4k2m3TL9bvA',
    secure: true
});

const upload = multer(); 

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})

app.get('/:userName',(req,res)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})

app.get('/api',(req,res)=>{
    res.json({"message":"Hello"})
})

app.post('/api/register',(req,res)=>{
    let data = req.body;
    console.log(data)
    authData.registerUser(data).then(()=>{
        res.json({successMessage: "User created"})
    })
    .catch((err)=>{
        res.json({
            errorMessage: err,
            userName: req.body.userName
        })
    })
})

app.post('/api/login',(req,res)=>{
     req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body).then(user=>{
        req.session.user = {
            userName: user.userName,
            email: user.email,
            posts: user.posts
       }
       res.json({user:user});
    })
     .catch(err=>{
         res.json({
             errorMessage: err,
             userName: req.body.userName
         })
     })
});

app.get('/api/user',(req,res)=>{
    res.json(req.session.user);
})

app.post('/api/add/post',upload.single('featureImage'),(req,res)=>{
    //////////////////////////////////////
    console.log(req.file)
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream({resource_type:'auto'},
                    (error,result)=>{
                        if(result){
                            resolve(result);
                        }
                        else{
                            reject(error);
                        }
                    }
                )
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            try{
            let result = await streamUpload(req);
            console.log(result);
            return result;
            }
            catch(err){
                console.log(err)
            }
        }
    
        upload(req).then((uploaded)=>{
            if(typeof uploaded === 'undefined'){
                res.json({errMsg:'File size is too large. File must be 100MB or less'});
                reject();
            }
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }

    async function processPost(imageUrl){
        req.body.featureImage = imageUrl;
        console.log(imageUrl)

        const data = req.body;
        authData.addPost(data).then(m=>res.json(m))
        .catch(err=>res.json({errMessage:err}));
    }    
})

function toDateString(value) {
    var month = value.getMonth() + 1; //month is 0-11 plus 1
  
    var date = value.getDate();
  
    if (month.toString().length !== 2) {
      //add leading zero if month is single digit
      month = '0' + month;
    }
    if (date.toString().length !== 2) {
      //add leading zero if date is single digit
      date = '0' + date;
    }
  
    var d = value.getFullYear() + '-' + month + '-' + date;
    return d;
}

app.post('/api/getPosts',(req,res)=>{
    authData.getUserPosts(req.body).then(data=>{
        data.sort((a,b)=>new Date(b.postDate) - new Date(a.postDate));
        data.map(e=>{
            e.postDate = toDateString(e.postDate);
        })
        res.json(data);
    }).catch(err=>{console.log(err)});
})
app.get('/api/logout',(req,res)=>{
    req.session.reset();
    res.json({message:"Logged out"});
});

app.get('/api/posts',(req,res)=>{
    authData.getAllPosts().then(data=>{
        data.sort((a,b)=>new Date(b.postDate) - new Date(a.postDate));
        data.map(e=>{
            e.postDate = toDateString(e.postDate);
        })
        res.json(data);
    }).catch(err=>console.log(err));
})

app.post('/api/getUser',(req,res)=>{
    authData.getUser(req.body).then(data=>{
        data.posts.sort((a,b)=>new Date(b.postDate) - new Date(a.postDate));
        data.posts.map(e=>{
            e.postDate = toDateString(e.postDate);
        })
        res.json(data);
    }).catch(err=>{
        console.log(err)
        res.json({errMsg:err})
    });
})

app.post('/api/setAbout',(req,res)=>{
    authData.setAbout(req.body)
    .then(d=>res.json({message:d}))
    .catch(err=>res.json({message:err}));
})

app.post('/api/postComment',(req,res)=>{
    console.log(req.body)
    authData.addCommentToPost(req.body).then(mes=>res.json(mes))
    .catch(err=>{
        console.log(err)
        res.json({err:err})
    });
})

app.post('/api/deletePost',(req,res)=>{
    console.log(req.body);
    authData.deletePost(req.body)
    .then(d=>res.json({m:"Success"})).catch(err=>console.log(err));
})

authData.initialize()
.then(()=>app.listen(HTTP_PORT,()=>{console.log(`listening on port ${HTTP_PORT}`)}))
.catch(err=>console.log(err));
