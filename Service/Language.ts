import bb from "../bb";

class Language {
    private data: any;
    private language: string;
    EventType = {
        CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
    }
    setLanguage(language: string) {
        this.language = language;
        bb.dispatch(this.EventType.CHANGE_LANGUAGE);
    }
    getLanguage() {
        return this.language;
    }
    getStr(name: string){
        if(!this.data[this.language] || !this.data[this.language][name]) {
            return this.data[cc.sys.LANGUAGE_ENGLISH][name];
        }
        return this.data[this.language][name];
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
        this.language = cc.sys.language;
    };
}

export default new Language();