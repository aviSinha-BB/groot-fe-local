const main_config= {
    "clientPort": process.env.CLIENT_PORT,

    "clientHost": process.env.CLIENT_HOST,

    "catalogHost": process.env.CATALOG_HOST,

    "imageHost": process.env.IMAGE_HOST,

    "AuthKey": process.env.AUTH_KEY,
    
    "ttl": process.env.TTL,
    
    "debug": process.env.DEBUG,
    
    "BasicAuthVal": process.env.BASIC_AUTH,

    "statusDraft": process.env.STATUS_DRAFT,

    "statusRevision": process.env.STATUS_REVISION,

    "statusReview": process.env.STATUS_REVIEW,

    "statusActive": process.env.STATUS_ACTIVE,

    "statusInactive": process.env.STATUS_INACTIVE,

    "statusSentForPublish": process.env.STATUS_SENT_FOR_PUBLISH,

    "statusPending": process.env.STATUS_PENDING,

    "creatorPermission": process.env.CREATOR_PERMISSION,

    "imageSize": process.env.IMAGE_SIZE,   //1024*1024 = 1MB

    "FroalaKey": process.env.FROALA_KEY,

    "signKey": process.env.SIGN_KEY,

    "timeout": process.env.TIMEOUT,

    "preUrl": process.env.PRE_URL,

    "pendingTimeout": process.env.PENDING_TIMEOUT,

    "pageListSize": process.env.PAGE_LIST_SIZE,

    "templateAPI": process.env.TEMPLATE_API,
    
    "productSearchAPI": process.env.PRODUCT_SEARCH_API,

    "getGroupUserUrl": process.env.GET_GROUP_USER_URL
}

module.exports = main_config;