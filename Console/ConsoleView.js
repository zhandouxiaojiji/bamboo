// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        view: cc.Node,
        logView: cc.Node,
        customView: cc.Node,
        customBtn: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.view.active = false;
    },

    onClickShowView(){
        this.view.active = !this.view.active;
    },

    onClickCustomBtn() {
        if(this.logView.active){
            this.logView.active = false;
            this.customBtn.active = true;
        }else{
            this.logView.active = true;
            this.customBtn.active = false;
        }
    },

    onClickRun() {

    }

    // update (dt) {},
});
