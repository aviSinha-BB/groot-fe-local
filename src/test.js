const request = require("request");
const urlJoiner = require('url-join');

const DOMAIN_NAME = "https://qas6.bigbasket.com";
const TEMPLATE_API= "/content-svc/templates";
const NUMBER_OF_USERS = 1000;

let optionsGet = {
    method: 'GET',
    headers:
    {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'authorization': 'rwmhdkmd767s8gpq3gxg68jac5ps9gih',
    }
};

function handlerResponse(resolve, reject, error, body, response) {
    if (error) {
        console.log(error)
        return resolve(-1)
    }
    if (response.statusCode === 200) {
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        if (body.status === 0) {
            console.log(response.statusCode);
            return resolve(0)
        } else {
            console.log("Success")
            return resolve(-2)
        }
    } else {
        console.log(response.statusCode)
        return resolve(-3)
    }
}

async function testUserPemissions() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsGet,
            {url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/permissions')}`});
        request(optionsGet, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testListingTemplates() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsGet,
            {url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/')}`});
        request(optionsGet, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testGetTemplateData() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsGet,
            {url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/1/1')}`});
        request(optionsGet, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

for(var i = 0; i < NUMBER_OF_USERS; i++) {
    (async () => {
        console.log("UserPermission",await testUserPemissions());
        console.log("Listing Templates",await testListingTemplates());
        console.log("Template Data",await testGetTemplateData());
    })();
}