import bb from "./bb";

class Language {
    data: any;
    code: string;
    EventType = {
        CHANGE_CODE: "CHANGE_CODE",
    }
    getCode() {
        return cc.sys.languageCode;
    }
    setCode(code: string) {
        this.code = code;
        bb.dispatch(this.EventType.CHANGE_CODE);
    } 
    getStr(name: string){
        if(!this.data[this.code] || !this.data[this.code][name]) {
            return this.data['en'][name];
        }
        return this.data[this.code][name];
    }
    init(languageProp) {
        this.data = {};
        for(let name in languageProp) {
            let p = languageProp[name];
            for(let code in p) {
                if(code != "NAME") {
                    if(!this.data[code]) {
                        this.data[code] = {};
                    }
                    this.data[code][p.NAME] = p[code];
                }
            }
        }
        this.code = this.getCode();
        cc.log(this.data);
    };
}

export default new Language();