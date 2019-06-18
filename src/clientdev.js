const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const app = express();
const main_config = require('../config');
const bbsign = require('./bbsign-node');
const axios = require('axios');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.dev');
const compiler = webpack(webpackConfig);

console.log("Starting ...");

app.use(bodyParser.json({
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

// webpack hmr

app.use(
    require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    })
);

app.use(require('webpack-hot-middleware')(compiler));


//static assets

app.use(main_config.preUrl+'/apluscontent', express.static(path.join(__dirname, '../dev')));
app.use(cors());

app.get(main_config.preUrl+'/apluscontent/*',
    function (req, res) {
        res.sendFile(path.join(__dirname, '../dev', 'index.html'));
    });


const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

app.post(main_config.preUrl+"/apluscontent/userspermission", (req, res, next) => {
    const groups = req.body.groups;
    console.log("Requested Group: ", req.body.groups);
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
            var grpuser = response.data.mesg;
            console.log("Workflow calling.. ", response.data.status);
            if (grpuser != 'invalid group name') {
                grpuser.forEach(element => {
                    if (!permissionUsers[groups]) {
                        permissionUsers[groups] = [element.user_email];
                    } else {
                        permissionUsers[groups].push(element.user_email);
                    }
                });
                console.log("Permissions Sent!");
                res.status(200).send({
                    data: permissionUsers
                })
            }
            else {
                console.log("Invalid Group Name!");
                res.status(400).send();
            }
        })
        .catch(function (error) {
            console.log("Error call from Workflow! ", error);
            res.status(400).send();
        });
});

app.listen(main_config.clientPort, function () {
    console.log("Frontend Serter Started on port " + main_config.clientPort);
});
