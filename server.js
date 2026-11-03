const http=require('http')
const fs=require('fs')
const url= require('url')
const port=8000;
const stu = require('./student.json')
const server=http.createServer(function(req,res){
    res.setHeader("Content-Type", "text/html");
    if(req.method=="GET" && req.url=='/'){
        res.write("<h3> welcome</h3>");
        res.end();
    }
    if(req.method=="GET" && req.url=='/list'){
        fs.readFile('student.json',function(err,data){
            res.write(data);
            res.end();
        });
    }
    if(req.method=="POST"){
        const newstu=url.parse(req.url,true).query;
        stu.push(newstu);
        mywrite(stu)
        res.write("inserted successfully");
    }
    if(req.method=="PUT"){
        const upstu=url.parse(req.url,true).query;
        for(s in stu){
            if(stu[s]['roll']==upstu['roll']){
                stu[s]['name']=upstu['name']
                stu[s]['branch']=upstu['branch']
                stu[s]['cgpa']=upstu['cgpa']
                mywrite(stu);
                res.write("updated successfully");
            }
        }
    }
    if(req.method=="DELETE"){
      const  delstu=url.parse(req.url,true).query;
        for(s in stu){
            if(stu[s]['roll']==delstu['roll']){
                stu.splice(s,1);
                mywrite(stu);
                res.write("deleted successfully");
            }
        }
    }
    function mywrite(data){
        fs.writeFile('student.json',JSON.stringify(data),function(err){});
    }
});
server.listen(port,function(){
    console.log("server started");
});


