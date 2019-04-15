module.exports = {
    "extends": "eslint:recommended",

    "parserOptions": {						//es6
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "impliedStrict": true
        }
    },

    "env": {								//可能对require有用
        "amd": true,
    },

    "globals": {							//全局变量
    	"cc": true,
        "module": true,
        "sdkbox": true,
        "window": true,
        "XMLHttpRequest": true
    },

    "rules": {
        "no-mixed-spaces-and-tabs": 0,		//忽略的错误
    },
};