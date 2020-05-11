const { ccclass, property } = cc._decorator;
@ccclass
export default class bbView extends cc.Component {
	onClickClose() {
		this.node.active = false;
	}
};
