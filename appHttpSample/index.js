// https://blog.risingstack.com/your-first-node-js-http-server/

const http = require('http')
const url = require('url');
const fs = require('fs');
// var express = require('express')
// var favicon = require('serve-favicon');
// var path = require("path");

var user = require('./model/user')

const PORT_ADD = 3330;
var userList = [];

// var app = express()
// app.use(favicon(path.join(__dirname,'public','images','favicon.png')))

const requestHandler = (request, response) => {
    console.log(request.url)
    if('/'==request.url) {
        if('GET' == request.method) {
            response.writeHead(200,{"Content-type":"text/html"});
            fs.createReadStream("./appHttpSample/index.html").pipe(response);
        } else {
            response.end(
                "<html>"
                    +"<head>"
                        +"<title>Sample HTTP</title>"
                    +"</head>"
                    +"<body>"
                        +"<h4>Hello Node.js Server, Via POST url hit!</h4>"
                        +"<br><br><pre>You can use: \n\t1) /addUser?name=somename&id=123 \n\tOR \n\t2) /removeUser?id=123 \n\tOR \n\t3) /getUsers</pre>"
                    +"</body>"
                +"</html>"
            );
        }
    } else if(request.url.indexOf('/addUser') != -1) {
        params = url.parse(request.url,true).query;
        if(!params.name || !params.id){
            response.end(
                "<html>"
                    +"<head>"
                        +"<title>Sample HTTP</title>"
                    +"</head>"
                    +"<body>"
                        +"<h2>Adding user:</h2>"
                        +"<br><p>Failed to add '"+params.name+"', with ID='"+params.id+"'.."
                        +"<br><p>Total users="+userList.length
                    +"</body>"
                +"</html>"
            );
        } else {
            newUser = user()
            newUser.name =params.name
            newUser.id = params.id
            userList.push(newUser)
            response.end(
                "<html>"
                    +"<head>"
                        +"<title>Sample HTTP</title>"
                    +"</head>"
                    +"<body>"
                        +"<h2>Adding user:</h2>"
                        +"<br><p>\tAdded '"+newUser.name+"', with ID='"+newUser.id+"'.."
                        +"<br><p>\tTotal users="+userList.length
                    +"</body>"
                +"</html>"
            );
        }

    } else if(request.url.indexOf('/removeUser') != -1) {
        params = url.parse(request.url,true).query;
        if(!params.id){
            response.end(
                "<html>"
                    +"<head>"
                        +"<title>Sample HTTP</title>"
                    +"</head>"
                    +"<body>"
                        +"<h2>Removing user:</h2>"
                        +"<br><p>Failed to remove user with ID='"+params.id+"'.."
                        +"<br><p>Total users="+userList.length
                    +"</body>"
                +"</html>"
            );
        } else {
            var itemFound = false
            var index=0
            for(index=0;index<userList.length;index++){
                item = userList[index]
                if (item.id == params.id){
                    userList.splice(userList.indexOf(item), 1);
                    response.end(
                        "<html>"
                            +"<head>"
                                +"<title>Sample HTTP</title>"
                            +"</head>"
                            +"<body>"
                                +"<h2>Removing user:</h2>"
                                +"<br><p>Removed '"+item.name+"', with ID='"+item.id+"'.."
                                +"<br><p>Total users="+userList.length
                            +"</body>"
                        +"</html>"
                    );
                    itemFound = true;
                    break;
                }
            }

            if(!itemFound) {
                response.end(
                    "<html>"
                        +"<head>"
                            +"<title>Sample HTTP</title>"
                        +"</head>"
                        +"<body>"
                            +"<h2>Removing user:</h2>"
                            +"<br><p>No such user found with ID='"+params.id+"'.."
                    +"</html>"
                );
            }
        }
    } else if(request.url.indexOf('/getUsers') != -1) {
        response.end(
            "<html>"
                +"<head>"
                    +"<title>Sample HTTP</title>"
                +"</head>"
                +"<body>"
                    +"<h2>Get all users:</h2>"
                    +"<br><p>Total users="+userList.length
                    +"<br><br><p>"+JSON.stringify(userList)+""
            +"</html>"
        );
    } else {
        response.writeHead(404,{"Content-type":"text/plain"});
        response.write("Page not found!");
        response.end();
        //[OR]
        // response.end(
        //     "<html>"
        //         +"<head>"
        //             +"<title>Sample HTTP</title>"
        //         +"</head>"
        //         +"<body>"
        //             +"<br>"
        //             +"<h4>URL not yet defined! You had hit " + request.url + "</h4>"
        //         +"</body>"
        //     +"</html>"
        // );
    }
}

const server = http.createServer(requestHandler)

server.listen(PORT_ADD, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log('\nappHttpSample Server is running successfully @ http:localhost:'+PORT_ADD);
})
