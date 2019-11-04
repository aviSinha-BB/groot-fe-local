const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const app = express();
const main_config = require('../config');
const request = require('request');
const bbsign = require('./bbsign-node');
const axios = require('axios');
const base64 = require('base-64');

console.log("[Content_Fe]: Starting ...");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(main_config.grootHost, express.static(path.join(__dirname, '../build')));
app.use(cors());

app.get(main_config.grootHost + '/*',
    function (req, res) {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });

function checkAuth(authStr) {
    if (!authStr){
        console.log("[Content_Fe_WAPI]: Authorization Failed");
        return true;
    }
    else {
        if (authStr.includes("Basic")) {
            var encodedAuthVal = authStr.split("Basic ")[1];
            console.log("[Content_Fe_WAPI]: Encoded Auth Value: ", encodedAuthVal);
            var decodedAuthVal = base64.decode(encodedAuthVal);
            console.log("[Content_Fe_WAPI]: BasicAuth Value in config: ", main_config.BasicAuthVal);
            console.log("[Content_Fe_WAPI]: Decoded Auth Value: ", decodedAuthVal);
            if (decodedAuthVal === main_config.BasicAuthVal) {
                console.log("[Content_Fe_WAPI]: Authorization Success");
                return true;
            }
            else {
                console.log("[Content_Fe_WAPI]: Authorization Failed");
                return true;
            }
        }
        else{
            console.log("[Content_Fe_WAPI]: Authorization Failed");
            return true;
        }
    }
}

const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

app.post(main_config.grootHost + "/userspermission", (req, res, next) => {
    const groups = req.body.groups;
    console.log("[Content_Fe_WAPI]: Authorization header received: ", req.get('Authorization'));
    if (checkAuth(req.get('Authorization'))) {
        console.log("[Content_Fe_WAPI]: Requested Group from Workflow: ", req.body.groups);
        const bbSignkey = bbsign.generate_bbsign(main_config.signKey, ['group_name'], [groups]);
        console.log("[Content_Fe_WAPI]: BB SignKey: ", bbSignkey);
        axios({
            method: 'post',
            url: main_config.monolithHost + main_config.getGroupUserUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: formUrlEncoded({
                'group_name': groups,
                'bb_sign': bbSignkey
            })
        }).then(function (response) {
            var permissionUsers = {};
            if (response.status === 200) {
                var grpuser = response.data.mesg;
                console.log("[Content_Fe_WAPI]: Get Group User API status: ", response.data.status);
                console.log("[Content_Fe_WAPI]: Get Group User API Response Received: \n", grpuser);
                if (grpuser !== 'invalid group name' || grpuser !== 'Sign Error.' || grpuser.length() !== 0 || grpuser !== '') {
                    grpuser.forEach(element => {
                        if (!permissionUsers[groups]) {
                            permissionUsers[groups] = [element.user_email];
                        } else {
                            permissionUsers[groups].push(element.user_email);
                        }
                    });
                    console.log("[Content_Fe_WAPI]: Users Sent to Workflow!");
                    console.log("[Content_Fe_WAPI]: Response Sent: ", permissionUsers);
                    res.status(200).send({
                        data: permissionUsers
                    })
                }
                else if (grpuser === 'invalid group name') {
                    console.log("[Content_Fe_WAPI]: Invalid Group Name!");
                    res.status(400).send();
                }
                else if (grpuser === 'Sign Error.') {
                    console.log("[Content_Fe_WAPI]: Sign Error!");
                    res.status(400).send();
                }
                else if (grpuser.length() === 0 || grpuser === '') {
                    console.log("[Content_Fe_WAPI]: Empty response from Get Group User API");
                    res.status(400).send();
                }
            }
            else {
                console.log("[Content_Fe_WAPI]: Group User API Response Failed Status: ", response.status);
                res.status(400).send();
            }
        })
            .catch(function (error) {
                console.log("[Content_Fe_WAPI]: Error Call! \n", error);
                res.status(400).send();
            });
    }
    else {
        console.log("[Content_Fe_WAPI]: Authorization Header not sent or incorrect!");
        res.status(401).send();
    }
});

app.get("/content-svc/health-fe", (req, res) => {
    request
        .get('http://localhost:8081/content-svc/health-check')
        .on('response', function (response) {
            if (response.statusCode === 200) {
                console.log("[Content_Fe_Health]: Content-svc Health Success!");
                res.status(200).send({
                    data: "Success"
                });
            }
            else {
                console.log("[Content_Fe_Health]: Content-svc Health Failed! ", response.statusCode);
                res.status(400).send();
            }
        })
        .on('error', function (err) {
            console.log("[Content_Fe_Health]: Content-svc Health Failed! ", err);
            res.status(400).send();
        });
});

app.listen(main_config.clientPort, function () {
    console.log("[Content_Fe]: Content Frontend Server Started on port " + main_config.clientPort);
});
