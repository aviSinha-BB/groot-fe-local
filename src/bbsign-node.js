const crypto = require('crypto');
const base64 = require('base-64');
var exports = module.exports = {};

const FULL_SIGN = 1;
const LEFT_SIGN_ONLY = 2;
const RIGHT_SIGN_ONLY = 3;

module.exports.FULL_SIGN = FULL_SIGN;
module.exports.LEFT_SIGN_ONLY = LEFT_SIGN_ONLY;
module.exports.RIGHT_SIGN_ONLY = RIGHT_SIGN_ONLY;

get_left_sign = function (key, param_value) {
	return crypto.createHmac('sha256', key).update(param_value).digest('hex');
}

get_right_sign = function (param_name) {
	return base64.encode(param_name);
}

module.exports.generate_bbsign = function (key, param_name, param_value, sign_type = FULL_SIGN) {
	var signature = '';
	param_name = param_name.join();
	param_value = param_value.join();

	switch (sign_type) {
		case FULL_SIGN:
			signature = get_left_sign(key, param_value) + ":" + get_right_sign(param_name);
			break;
		case LEFT_SIGN_ONLY:
			signature = get_left_sign(key, param_value);
			break;
		case RIGHT_SIGN_ONLY:
			signature = get_right_sign(param_name);
			break;
	}
	return signature
}