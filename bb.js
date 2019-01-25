var bb = {
    initLanguage: function(){
        console.log("bb.initLanguage", cc.sys.languageCode);
        const i18n = require('LanguageData');
        var code = cc.sys.languageCode;
        if(code == 'zh'){ //安卓暂时不支持区码
            code = 'zh-cn';
        }
        i18n.init(code);
    }
};
module.exports = bb;