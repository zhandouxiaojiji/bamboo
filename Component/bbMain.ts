import bb from "../bb";

const { ccclass, property } = cc._decorator;
@ccclass
export default class bbMain extends cc.Component {
	onLoad() {
		bb.on(bb.EventType.SCHEDULE, this.onSchedule, this);
		bb.on(bb.EventType.UNSCHEDULE, this.onUnschedule, this);
	};
	onDestroy() {
		bb.off(bb.EventType.SCHEDULE, this.onSchedule, this);
		bb.off(bb.EventType.UNSCHEDULE, this.onUnschedule, this);
	};

	start() {
	};

	onSchedule(callback: Function, interval?: number, repeat?: number, delay?: number) {
		this.schedule(callback, interval, repeat, delay);
	};

	onUnschedule(callback: Function) {
		this.unschedule(callback);
	}

};
