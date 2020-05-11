const { ccclass, property } = cc._decorator;
@ccclass
export default class bbDialog extends cc.Component {
	@property({ type: cc.Label, tooltip: '标题' })
	title: cc.Label = null;
	@property({ type: cc.Label, tooltip: '内容' })
	content: cc.Label = null;
	@property({ type: cc.Button, tooltip: '确定按钮' })
	okBtn: cc.Button = null;
	@property({ type: cc.Button, tooltip: '取消按钮' })
	cancelBtn: cc.Button = null;

	show(title: string, content: string, ok: () => void, cancel: () => void) {
		cc.log(title, content);
		this.node.active = true;
		this.title.string = title;
		this.content.string = content;
		this.okBtn.node.on("click", () => {
			this.node.active = false;
			if (ok) {
				ok();
			}
		});
		if (cancel) {
			this.node.active = false;
			this.cancelBtn.node.on("click", () => { });
		}
	}

	// update (dt) {},
};
