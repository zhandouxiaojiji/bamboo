import bb from "../bb";
import ResLoader, { ResLoaderEventType } from "../Service/ResLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class bbResLoader extends cc.Component {
	@property(cc.Label)
	label: cc.Label = null;
	@property(cc.ProgressBar)
	progressBar: cc.ProgressBar = null;

	start() {
		bb.on(ResLoaderEventType.UPDATE_PROCESS, (completedCount: number, totalCount: number, desc: string) => {
			if (this.label) {
				this.label.string = `(${completedCount}/${totalCount})`;
			}
			this.progressBar.progress = completedCount / totalCount;
		})
	}
};