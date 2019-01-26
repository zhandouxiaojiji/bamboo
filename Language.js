var bb = require("bb");
var Language = {
    init: function(){
        console.log("bb.Language.init", cc.sys.languageCode);
        const i18n = require('LanguageData');
        var code = cc.sys.languageCode;
        //至少需要提供en一种
        if(!this.exist(code)){
            if(code.indexOf('tw') >= 0){
                if(this.exist('zh-tw')){
                    code = 'zh-tw';
                }else {
                    code = 'en';
                }
            }
            else if(code.indexOf('zh') >= 0){
                if(this.exist('zh-cn')){
                    code = 'zh-cn';
                }else if(this.exist('zh')){
                    code = 'zh';
                }else{
                    code = 'en';
                }
            }else{
                code = 'en';
            }
        }
        i18n.init(code);
    },
    exist: function(code){
        return window.i18n.languages[code]
    }
}
bb.Language = Language;