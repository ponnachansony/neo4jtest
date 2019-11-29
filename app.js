            var  express = require('express');
            var  path = require('path');
            var  logger = require('morgan');
            var  bodyParser = require('body-parser');
            var neo4j=require('neo4j-driver').v1;
            var app=express();
            app.set('views',path.join(__dirname,'views'))
            app.set('view engine','ejs');
            app.use(logger('dev'))
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({extended:false}));
            app.use(express.static(path.join(__dirname,'public')));
            var driver=neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','12345'));
            var session=driver.session();




            app.post('/add',function(req,res){
                var name=req.body.name;
                var email=req.body.email;
                var psw=req.body.psw;
            // var cnpsw=req.body.confirmpsw;
                session
                .run('CREATE(n:Register {name:{nameParam} ,email:{emailParam} ,psw:{pswParam} }) RETURN n' ,{nameParam:name ,emailParam:email,pswParam:psw})
                .then(function(result){


                    res.redirect('/');
                    session.close();
                })  
                .catch(function(err){
                    console.log(err);


                })
            
            });





           app.post('/log',function (req, res)  {
                var unmae=req.body.uname;
                var password=req.body.password;
                session
                .run('CREATE(n:Login{uname:{unameparam}  , password:{passowrdparam}RETURN n',{unameparam,passwordparam})
                .then(function(result){

                     res.redirect('/');
                     session.close();

                })
                .catch(function(err){
                    console.log(err);
                })
                
            });
            app.post('log',function (req, res)  {
                var uname=req.body.uname;
                var password=req.body.password;
                session
                .run('MATCH(a:Register{name:{nameParam}}) ,email:{emailParam} ,psw:{pswParam}}) ,(b:Login{uname:{unameparam}  ,password:{passwordparam})  MERGE(a)-[r:RELATION]-(b)  RETURN a,b',{nameparam:name,pawwordparam:password})
                
            });




            


            app.get('/',function(req,res){
                res.render('index');

            })




            app.get('/',function(req,res){
                res.render('login');
            })

            app.post(function(req,res){

            })
            app.listen(3000)
            console.log('Server started on port 3000')
            module.exports=app;