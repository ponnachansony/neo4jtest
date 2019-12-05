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
               var email=req.body.email;
                var password=req.body.password;
               session
                .run('MATCH (n:Register {email: {emailparam}}) RETURN n' ,{emailparam: email})
                .then(function(result){
                    result.records.forEach(function(records){
                        console.log(records._fields[0].properties);
                        var a=records._fields[0].properties;
                        if(a.psw==password){
                            console.log("correct")
                            res.end("congrz")
                        }
                        else{
                            console.log("failed")
                            res.end("failed ")
                      }

                        
                   })


                })
                .catch(function(err)
                {
                    console.log(err);
                });

            });
        

                app.post('/adminlog',function(req,res){
                    var adminname=req.body.admin;
                    var password=req.body.password;
                    session
                    .run('MATCH(n:adminlogin{ name:{adminparam}})RETURN n',{adminparam:adminname})
                    .then(function(result){
                        result.records.forEach(function(rec){
                            console.log(rec._fields[0].properties);
                            var a=rec._fields[0].properties;
                            if(a.password==password){
                                console.log("correct")
                                res.render('adminview');
                            }
                            else{
                                console.log("failed")
                                res.end("failed ")
                          }
    
                            
                       })
                    
    
    
                    })
                    .catch(function(err)
                    {
                        console.log(err);
                    });
                });


                app.post('/relation',function(req,res){
                    var name=req.body.name;
                    var rel=req.body.relation;
                    var view=req.body.views;
                    session
                    .run ('MATCH(n:Register{name:{nameParam} ,relation:{relationParam} ,view:{viewParam} }) RETURN n.name' ,{nameParam:name,relationParam:rel,viewsParam:view})
                     .then(function(result){
                          res.redirect('/');
                          session.close();


                     }) 
                     .catch(function(err){
                        console.log(err);
                     })


                });
              app.post('/adminview',function(req,res){
                        session
                        .run('MATCH(n:Register) RETURN n')
                        .then(function(result){
                            var view=[];
                            result.records.forEach(function(records){
                                view.push({
                                    id:records._fields[0].identity.low,
                                    name:records._fields[0].properties.name,
                                    email:records._fields[0].properties.email
                                    


                                });
                            });
                            res.render('view',{
                                view1:view,
                              
                               
                            });
                        })
                            
                        .catch(function(err){
                            console.log(err)
                        })
                    });
                    app.post('/relnview',function(req,res){
                        session
                        .run('MATCH(n:Register) RETURN n')
                        .then(function(result){
                            var rell=[];
                            result.records.forEach(function(records){
                                rell.push({
                                    
                                    name:records._fields[0].properties.name
            
                                    });
                            });
                            res.render('relation',{
                                rela:rell
                              
                               
                            });
                        })
                            
                        .catch(function(err){
                            console.log(err)
                        })
                    });


                    app.post('/relationview', function(req, res) {
                        var name=req.body.name;
                        var relation=req.body.relation;
                        session
                        .run('MATCH (a:Register{name:{nameParam}}),(b:adminlogin) MERGE(a)-[r:'+relation+']-(b)RETURN a,b',{nameParam:name})
                        .then(function(result){
                            // res.render('relation');
                            console.log('add');
                             session.close();
                        })
                        .catch(function(err){
                            console.log(err)

                        });
                    });
                  
                      
                  
                    


            app.get('/',function(req,res){
                res.render('index');

            })
           app.get('/login',function(req,res){
                res.render('login');
            })
            app.get('/adminlog',function(req,res){
                res.render('adminlog');
            })
            app.get('/adminview',function(req,res){
                res.render('adminview');
            })
            app.listen(3000)
            console.log('Server started on port 3000')
            module.exports=app;
        