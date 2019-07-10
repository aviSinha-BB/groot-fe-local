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

app.use(main_config.preUrl + '/apluscontent', express.static(path.join(__dirname, '../build')));
app.use(cors());

app.get(main_config.preUrl + '/apluscontent/*',
    function (req, res) {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });

function checkAuth(authStr) {
    if (!authStr)
        return false;
    else {
        if (authStr.includes("Basic")) {
            var encodedAuthVal = authStr.split("Basic ")[1];
            var decodedAuthVal = base64.decode(encodedAuthVal);

            if (decodedAuthVal === main_config.BasicAuthVal)
                return true;
            else
                return false;
        }
        else
            return false;
    }
}

const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

app.post(main_config.preUrl + "/apluscontent/userspermission", (req, res, next) => {
    const groups = req.body.groups;
    if (checkAuth(req.get('Authorization'))) {
        console.log("[Content_Fe_WAPI]: Workflow is calling.. ");
        console.log("[Content_Fe_WAPI]: Requested Group from Workflow: ", req.body.groups);
        const bbSignkey = bbsign.generate_bbsign(main_config.signKey, ['group_name'], [groups]);
        axios({
            method: 'post',
            url: main_config.getGroupUserUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: formUrlEncoded({
                'group_name': groups,
                'bb_sign': bbSignkey
            })
        }).then(function (response) {
            const permissionUsers = {};
            if (response.status === 200) {
                var grpuser = response.data.mesg;
                console.log("[Content_Fe_WAPI]: Call to Get Group User API: ", response.data.status);
                if (grpuser !== 'invalid group name' || grpuser !== 'Sign Error.') {
                    grpuser.forEach(element => {
                        if (!permissionUsers[groups]) {
                            permissionUsers[groups] = [element.user_email];
                        } else {
                            permissionUsers[groups].push(element.user_email);
                        }
                    });
                    console.log("[Content_Fe_WAPI]: Users Sent to Workflow!");
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
            }
            else {
                console.log("[Content_Fe_WAPI]: Response Failed: ", response.status);
                res.status(400).send();
            }
        })
            .catch(function (error) {
                console.log("[Content_Fe_WAPI]: Error call from Workflow!");
                console.log("[Content_Fe_WAPI]: ", error)
                res.status(400).send();
            });
    }
    else {
        console.log("[Content_Fe_WAPI]: Authorization Header not sent or incorrect!");
        res.status(401).send();
    }
});

app.get(main_config.preUrl + "/health-fe", (req, res) => {
    request
        .get('http://localhost:8081/content-svc/health-check')
        .on('response', function (response) {
            if (response.statusCode === 200) {
                console.log("[Content_Fe_Health]: Content Frontend Health Success!");
                res.status(200).send({
                    data: "Success"
                });
            }
            else {
                console.log("[Content_Fe_Health]: Content Frontend Health Failed! ", response.statusCode);
                res.status(400).send();
            }
        })
        .on('error', function (err) {
            console.log("[Content_Fe_Health]: Content Frontend Health Failed! ", err);
            res.status(400).send();
        });
});

app.listen(main_config.clientPort, function () {
    console.log("[Content_Fe]: Content Frontend Server Started on port " + main_config.clientPort);
});
