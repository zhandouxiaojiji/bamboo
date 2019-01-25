var bb = {
    initLanguage: function(){
        console.log("bb.initLanguage", cc.sys.languageCode);
        const i18n = require('LanguageData');
        i18n.init(cc.sys.languageCode);
    }
};
module.exports = bb;