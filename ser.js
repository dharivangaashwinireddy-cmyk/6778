
const http = require('http');
const fs = require('fs');
const url = require('url');

const port = 8000;

const server = http.createServer(function(req, res) {

    res.setHeader("Content-Type", "application/json");

    // GET
    if (req.method == "GET" && req.url == "/") {
        res.end(JSON.stringify("Welcome"));
    }

    // GET ALL STUDENTS
    else if (req.method == "GET" && req.url == "/list") {
        fs.readFile('student.json', function(err, data) {
            if (err) {
                res.end(JSON.stringify({message: "Error reading file"}));
            } else {
                res.end(data);
            }
        });
    }

    // POST
    else if (req.method == "POST" && req.url == "/add") {
        let body = "";

        req.on("data", function(chunk) {
            body += chunk;
        });

        req.on("end", function() {
            const newstu = JSON.parse(body);

            fs.readFile('student.json', function(err, data) {
                const stu = JSON.parse(data);
                stu.push(newstu);

                fs.writeFile('student.json', JSON.stringify(stu, null, 2), function(err) {
                    if (err) {
                        res.end(JSON.stringify({message: "Insert failed"}));
                    } else {
                        res.end(JSON.stringify({message: "Inserted successfully"}));
                    }
                });
            });
        });
    }

    // PUT
    else if (req.method == "PUT" && req.url == "/update") {
        let body = "";

        req.on("data", function(chunk) {
            body += chunk;
        });

        req.on("end", function() {
            const upstu = JSON.parse(body);

            fs.readFile('student.json', function(err, data) {
                const stu = JSON.parse(data);

                let found = false;

                for (let s in stu) {
                    if (stu[s].roll == upstu.roll) {
                        stu[s].name = upstu.name;
                        stu[s].branch = upstu.branch;
                        stu[s].cgpa = upstu.cgpa;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    res.statusCode = 404;
                    return res.end(JSON.stringify({message: "Student not found"}));
                }

                fs.writeFile('student.json', JSON.stringify(stu, null, 2), function(err) {
                    res.end(JSON.stringify({message: "Updated successfully"}));
                });
            });
        });
    }

    // DELETE
    else if (req.method == "DELETE" && req.url == "/delete") {
        let body = "";

        req.on("data", function(chunk) {
            body += chunk;
        });

        req.on("end", function() {
            const delstu = JSON.parse(body);

            fs.readFile('student.json', function(err, data) {
                const stu = JSON.parse(data);

                let found = false;

                for (let s in stu) {
                    if (stu[s].roll == delstu.roll) {
                        stu.splice(s, 1);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    res.statusCode = 404;
                    return res.end(JSON.stringify({message: "Student not found"}));
                }

                fs.writeFile('student.json', JSON.stringify(stu, null, 2), function(err) {
                    res.end(JSON.stringify({message: "Deleted successfully"}));
                });
            });
        });
    }

    else {
        res.statusCode = 404;
        res.end(JSON.stringify({message: "Invalid URL"}));
    }

});

server.listen(port, function() {
    console.log("Server started on port 8000");
});
