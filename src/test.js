const request = require("request");
const urlJoiner = require('url-join');
const fs = require("fs");
const FormData = require('form-data');

const DOMAIN_NAME = "https://qas16.bigbasket.com";
const TEMPLATE_API = "/content-svc/templates";
const TEMPLATE_NAME = "test-ys-wf-19-09-2019";
const TEMPLATE_NAME_FOR_CLONE = "test-ys-clone-19-09-2019";
const AUTH_TOKEN = "RzNoj7X_mlnoEKkNovknSb4x75dTNGvG";

const htmlStream = fs.createReadStream('/home/yash/Downloads/test.html');
const xlsxStream = fs.createReadStream('/home/yash/Downloads/uploaded_sku.xlsx');
const imgStream = fs.createReadStream('/home/yash/Downloads/1200x300.jpg');

var list_data = null;
var temp_id = null;
var status_id = null;
var task_id = null;

var formdata = new FormData();
formdata.append('file', htmlStream);
formdata.append('xlsx', xlsxStream);
formdata.append("data", JSON.stringify({
    "data": {
        "hiT": {
            "tag": "header-image",
            "heading": "this.props.headingvalue",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/692019-fcec04de-1200x300.jpg",
            "visible": true
        },
        "hihspM": {
            "tag": "header-image-anotherHeader-subheader-para",
            "heading": "this.props.headingTwovalue",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
            "anotherHeading": "this.props.anotherHeadingvalue",
            "subHeading": "this.props.subheadingvalue",
            "paragraph": "this.props.paravalue",
            "visible": true
        },
        "hspihB": {
            "tag": "anotherHeader-subheader-para-image-header",
            "anotherHeading": "this.props.anotherHeadingTwovalue",
            "subHeading": "this.props.subheadingTwovalue",
            "paragraph": "this.props.paraTwovalue",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
            "visible": true
        },
        "ispLT": {
            "tag": "image-subheading-para",
            "heading": "this.props.headingThreevalue",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
            "subHeading": " this.props.subheadingThreevalue",
            "paragraph": "this.props.paraThreevalue",
            "visible": true
        },
        "ispMT": {
            "tag": "image-subheading-para",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
            "subHeading": "this.props.subheadingFourvalue",
            "paragraph": "this.props.paraFourvalue",
            "visible": true
        },
        "ispRT": {
            "tag": "image-subheading-para",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
            "subHeading": "this.props.subheadingFivevalue",
            "paragraph": "this.props.paraFivevalue",
            "visible": true
        },
        "ispLB": {
            "tag": "image-subheading-para",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
            "subHeading": "this.props.subheadingSixvalue",
            "paragraph": "this.props.paraSixvalue",
            "visible": true
        },
        "ispMB": {
            "tag": "image-subheading-para",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
            "subHeading": "this.props.subheadingSevenvalue",
            "paragraph": "this.props.paraSevenvalue",
            "visible": true
        },
        "ispRB": {
            "tag": "image-subheading-para",
            "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
            "subHeading": "this.props.subheadingEightvalue",
            "paragraph": "this.props.paraEightvalue",
            "visible": true
        }
    },
    "metaData": {
        "templateName": TEMPLATE_NAME,
        "templateTag": "Temp 1",
        "action": "draft",
        "manufacturer": "Test WF"
    },
    "association": {
        "action": "override"
    },
    "comment": "template"
}));

var imgData = new FormData();
imgData.append("file", imgStream);
imgData.append("metaData", JSON.stringify({
    "templateName": TEMPLATE_NAME,
    "templateTag": "Temp 1",
    "action": "draft"
}));
imgData.append("imageMetaData", JSON.stringify({
    "width": 1200,
    "height": 300
}));

let optionsDraft = {
    method: 'PUT',
    headers:
    {
        'Content-Type': formdata.getHeaders()['content-type'],
        'Authorization': AUTH_TOKEN,
    },
    body: formdata
};

let optionsImage = {
    method: 'POST',
    headers:
    {
        'Content-Type': imgData.getHeaders()['content-type'],
        'Authorization': AUTH_TOKEN,
    },
    body: imgData
};

let optionsGet = {
    method: 'GET',
    headers:
    {
        'content-type': 'application/json',
        'authorization': AUTH_TOKEN,
    }
};

function handlerResponse(resolve, reject, error, body, response) {
    if (error) {
        console.log(error)
        return resolve(-1)
    }
    if (response.statusCode === 200) {
        if (body.status === 0) {
            console.log(response.statusCode);
            return resolve(0)
        } else {
            console.log("Success");
            return resolve(-2)
        }
    } else {
        console.log(response.statusCode)
        return resolve(-3)
    }
}

function handlerResponseClone(resolve, reject, error, body, response) {
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
            console.log("Success Cloning");
            console.log("Data: ", body);
            return resolve(-2)
        }
    } else {
        console.log(response.statusCode)
        return resolve(-3)
    }
}

function handlerResponseGetData(resolve, reject, error, body, response) {
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
            let temp_data = body;
            task_id = temp_data.metaData.taskId;
            console.log("Success Get Data: ");
            return resolve(-2)
        }
    } else {
        console.log(response.statusCode)
        return resolve(-3)
    }
}

function handlerResponseListing(resolve, reject, error, body, response) {
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
            list_data = body;
            let arr_data = list_data["data"];
            arr_data.forEach(function (element) {
                if (element.templateName === TEMPLATE_NAME) {
                    temp_id = element.id;
                    status_id = element.status.id;
                }
            });
            console.log("Success Listing");
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
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/permissions')}` });
        request(optionsGet, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testListingTemplates() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsGet,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/')}` });
        request(optionsGet, function (error, response, body) {
            return handlerResponseListing(resolve, reject, error, body, response)
        });
    });
}

async function testListingTemplatesAll() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsGet,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/all')}` });
        request(optionsGet, function (error, response, body) {
            return handlerResponseListing(resolve, reject, error, body, response)
        });
    });
}

async function testUniqueName() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsGet,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, TEMPLATE_NAME, '/is-unique')}` });
        request(optionsGet, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testDraftTemplate() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsDraft,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/draft/')}` });
        request(optionsDraft, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testGetTemplateData() {
    return await new Promise((resolve, reject) => {
        let temp = String(temp_id);
        let status = String(status_id);
        Object.assign(optionsGet,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, temp, status)}` });
        request(optionsGet, function (error, response, body) {
            return handlerResponseGetData(resolve, reject, error, body, response)
        });
    });
}

async function testReviewTemplate() {
    return await new Promise((resolve, reject) => {

        var formdataReview = new FormData();
        formdataReview.append('file', htmlStream);
        formdataReview.append('xlsx', xlsxStream);
        formdataReview.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": "this.props.headingvalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/692019-fcec04de-1200x300.jpg",
                    "visible": true
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": "this.props.headingTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "anotherHeading": "this.props.anotherHeadingvalue",
                    "subHeading": "this.props.subheadingvalue",
                    "paragraph": "this.props.paravalue",
                    "visible": true
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": "this.props.anotherHeadingTwovalue",
                    "subHeading": "this.props.subheadingTwovalue",
                    "paragraph": "this.props.paraTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "visible": true
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": "this.props.headingThreevalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": " this.props.subheadingThreevalue",
                    "paragraph": "this.props.paraThreevalue",
                    "visible": true
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFourvalue",
                    "paragraph": "this.props.paraFourvalue",
                    "visible": true
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFivevalue",
                    "paragraph": "this.props.paraFivevalue",
                    "visible": true
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSixvalue",
                    "paragraph": "this.props.paraSixvalue",
                    "visible": true
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSevenvalue",
                    "paragraph": "this.props.paraSevenvalue",
                    "visible": true
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingEightvalue",
                    "paragraph": "this.props.paraEightvalue",
                    "visible": true
                }
            },
            "metaData": {
                "templateName": TEMPLATE_NAME,
                "templateTag": "Temp 1",
                "action": "createToReview",
                "taskId": task_id,
                "templateId": String(temp_id),
                "manufacturer": "Test WF"
            },
            "association": {
                "action": "override"
            },
            "comment": "Send to review"
        }));

        let optionsReview = {
            method: 'POST',
            headers:
            {
                'Content-Type': formdataReview.getHeaders()['content-type'],
                'Authorization': AUTH_TOKEN,
            },
            body: formdataReview
        };

        Object.assign(optionsReview,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/change/state/create')}` });
        request(optionsReview, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testRevisionTemplate() {
    return await new Promise((resolve, reject) => {

        var formdataRevision = new FormData();
        formdataRevision.append('file', htmlStream);
        formdataRevision.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": "this.props.headingvalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/692019-fcec04de-1200x300.jpg",
                    "visible": true
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": "this.props.headingTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "anotherHeading": "this.props.anotherHeadingvalue",
                    "subHeading": "this.props.subheadingvalue",
                    "paragraph": "this.props.paravalue",
                    "visible": true
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": "this.props.anotherHeadingTwovalue",
                    "subHeading": "this.props.subheadingTwovalue",
                    "paragraph": "this.props.paraTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "visible": true
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": "this.props.headingThreevalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": " this.props.subheadingThreevalue",
                    "paragraph": "this.props.paraThreevalue",
                    "visible": true
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFourvalue",
                    "paragraph": "this.props.paraFourvalue",
                    "visible": true
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFivevalue",
                    "paragraph": "this.props.paraFivevalue",
                    "visible": true
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSixvalue",
                    "paragraph": "this.props.paraSixvalue",
                    "visible": true
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSevenvalue",
                    "paragraph": "this.props.paraSevenvalue",
                    "visible": true
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingEightvalue",
                    "paragraph": "this.props.paraEightvalue",
                    "visible": true
                }
            },
            "metaData": {
                "templateName": TEMPLATE_NAME,
                "templateTag": "Temp 1",
                "action": "reviewToCreate",
                "taskId": task_id,
                "templateId": String(temp_id),
                "manufacturer": "Test WF"
            },
            "association": {
                "products": [{ "value": "10000148", "label": "Onion" }],
                "action": "override"
            },
            "comment": "Send to review"
        }));

        let optionsRevision = {
            method: 'POST',
            headers:
            {
                'Content-Type': formdataRevision.getHeaders()['content-type'],
                'Authorization': AUTH_TOKEN,
            },
            body: formdataRevision
        };

        Object.assign(optionsRevision,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/change/state/review')}` });
        request(optionsRevision, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testSaveTemplate() {
    return await new Promise((resolve, reject) => {

        var formdataSave = new FormData();
        formdataSave.append('file', htmlStream);
        formdataSave.append('xlsx', xlsxStream);
        formdataSave.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": "this.props.headingvalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/692019-fcec04de-1200x300.jpg",
                    "visible": true
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": "this.props.headingTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "anotherHeading": "this.props.anotherHeadingvalue",
                    "subHeading": "this.props.subheadingvalue",
                    "paragraph": "this.props.paravalue",
                    "visible": true
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": "this.props.anotherHeadingTwovalue",
                    "subHeading": "this.props.subheadingTwovalue",
                    "paragraph": "this.props.paraTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "visible": true
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": "this.props.headingThreevalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": " this.props.subheadingThreevalue",
                    "paragraph": "this.props.paraThreevalue",
                    "visible": true
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFourvalue",
                    "paragraph": "this.props.paraFourvalue",
                    "visible": true
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFivevalue",
                    "paragraph": "this.props.paraFivevalue",
                    "visible": true
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSixvalue",
                    "paragraph": "this.props.paraSixvalue",
                    "visible": true
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSevenvalue",
                    "paragraph": "this.props.paraSevenvalue",
                    "visible": true
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingEightvalue",
                    "paragraph": "this.props.paraEightvalue",
                    "visible": true
                }
            },
            "metaData": {
                "templateName": TEMPLATE_NAME,
                "templateTag": "Temp 1",
                "action": "save",
                "taskId": task_id,
                "templateId": String(temp_id),
                "manufacturer": "Test WF"
            },
            "association": {
                "products": [{ "value": "10000148", "label": "Onion" }],
                "action": "override"
            },
            "comment": "Send to review"
        }));

        let optionsSave = {
            method: 'POST',
            headers:
            {
                'Content-Type': formdataSave.getHeaders()['content-type'],
                'Authorization': AUTH_TOKEN,
            },
            body: formdataSave
        };

        Object.assign(optionsSave,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/save/')}` });
        request(optionsSave, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testPublishTemplate() {
    return await new Promise((resolve, reject) => {

        var formdataPublish = new FormData();
        formdataPublish.append('file', htmlStream);
        formdataPublish.append("data", JSON.stringify({
            "data": {
                "hiT": {
                    "tag": "header-image",
                    "heading": "this.props.headingvalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/692019-fcec04de-1200x300.jpg",
                    "visible": true
                },
                "hihspM": {
                    "tag": "header-image-anotherHeader-subheader-para",
                    "heading": "this.props.headingTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "anotherHeading": "this.props.anotherHeadingvalue",
                    "subHeading": "this.props.subheadingvalue",
                    "paragraph": "this.props.paravalue",
                    "visible": true
                },
                "hspihB": {
                    "tag": "anotherHeader-subheader-para-image-header",
                    "anotherHeading": "this.props.anotherHeadingTwovalue",
                    "subHeading": "this.props.subheadingTwovalue",
                    "paragraph": "this.props.paraTwovalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/1292019-3fcd886c-600x300.jpg",
                    "visible": true
                },
                "ispLT": {
                    "tag": "image-subheading-para",
                    "heading": "this.props.headingThreevalue",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": " this.props.subheadingThreevalue",
                    "paragraph": "this.props.paraThreevalue",
                    "visible": true
                },
                "ispMT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFourvalue",
                    "paragraph": "this.props.paraFourvalue",
                    "visible": true
                },
                "ispRT": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingFivevalue",
                    "paragraph": "this.props.paraFivevalue",
                    "visible": true
                },
                "ispLB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSixvalue",
                    "paragraph": "this.props.paraSixvalue",
                    "visible": true
                },
                "ispMB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingSevenvalue",
                    "paragraph": "this.props.paraSevenvalue",
                    "visible": true
                },
                "ispRB": {
                    "tag": "image-subheading-para",
                    "imageSrc": "https://qas6.bigbasket.com/media/uploads/groot/images/992019-54a92d0d-Mango-Sales-Website-Profile-350x350.jpg",
                    "subHeading": "this.props.subheadingEightvalue",
                    "paragraph": "this.props.paraEightvalue",
                    "visible": true
                }
            },
            "metaData": {
                "templateName": TEMPLATE_NAME,
                "templateTag": "Temp 1",
                "action": "reviewToEnd",
                "taskId": task_id,
                "templateId": String(temp_id),
                "manufacturer": "Test WF"
            },
            "association": {
                "products": [{ "value": "10000148", "label": "Onion" }],
                "action": "override"
            },
            "comment": "Send to review"
        }));

        let optionsPublish = {
            method: 'POST',
            headers:
            {
                'Content-Type': formdataPublish.getHeaders()['content-type'],
                'Authorization': AUTH_TOKEN,
            },
            body: formdataPublish
        };

        Object.assign(optionsPublish,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/publish')}` });
        request(optionsPublish, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testCloneTemplate() {
    return await new Promise((resolve, reject) => {
        let temp = String(temp_id);
        Object.assign(optionsGet,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/clone', temp, TEMPLATE_NAME_FOR_CLONE)}` });
        request(optionsGet, function (error, response, body) {
            return handlerResponseClone(resolve, reject, error, body, response)
        });
    });
}

async function testImageUpload() {
    return await new Promise((resolve, reject) => {
        Object.assign(optionsImage,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/image/upload')}` });
        request(optionsImage, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testXslxDownload() {
    return await new Promise((resolve, reject) => {
        let temp = String(temp_id);
        Object.assign(optionsGet,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/download/', temp)}` });
        request(optionsGet, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

async function testXslxUpload() {
    return await new Promise((resolve, reject) => {
        let temp = String(temp_id);
        var xlsxData = new FormData();
        xlsxData.append("file", xlsxStream);
        xlsxData.append("metaData", JSON.stringify({
            "templateId": temp,
            "action": "override"
        }));

        let optionsXslx = {
            method: 'POST',
            headers:
            {
                'Content-Type': xlsxData.getHeaders()['content-type'],
                'Authorization': AUTH_TOKEN,
            },
            body: xlsxData
        };

        Object.assign(optionsXslx,
            { url: `${urlJoiner(DOMAIN_NAME, TEMPLATE_API, '/upload/sku')}` });
        request(optionsXslx, function (error, response, body) {
            return handlerResponse(resolve, reject, error, body, response)
        });
    });
}

(async () => {
    console.log("1. UserPermission", await testUserPemissions());
    console.log("2. Unique Name", await testUniqueName());
    console.log("3. Draft Template", await testDraftTemplate());
    console.log("4. Listing Templates", await testListingTemplates());
    console.log("5. Template Data", await testGetTemplateData());
    console.log("6. Send For Review Template", await testReviewTemplate());
    console.log("7. Listing Templates", await testListingTemplates());
    console.log("8. Template Data", await testGetTemplateData());
    console.log("9. Send For Revision Template", await testRevisionTemplate());
    console.log("10. Listing Templates", await testListingTemplates());
    console.log("11. Template Data", await testGetTemplateData());
    console.log("12. Send For Review Template", await testReviewTemplate());
    console.log("13. Listing Templates", await testListingTemplates());
    console.log("14. Template Data", await testGetTemplateData());
    console.log("15. Save Template", await testSaveTemplate());
    console.log("16. Listing Templates", await testListingTemplates());
    console.log("17. Template Data", await testGetTemplateData());
    console.log("18. Publish Template", await testPublishTemplate());
    console.log("19. All Listing Templates", await testListingTemplatesAll());
    console.log("20. Clone Template", await testCloneTemplate());
    console.log("21. Image Upload", await testImageUpload());
    console.log("22. XLSX Download", await testXslxDownload());
    console.log("23. XLSX Upload", await testXslxUpload());
})();