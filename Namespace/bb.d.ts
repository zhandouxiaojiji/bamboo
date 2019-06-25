/** !#en
The main namespace of bamboo
*/

declare namespace bb {
    export const EventType;

    export function log(...args: any): void;

    export function on(...args: any): void;
    export function off(...args: any): void;
    export function dispatch(...args: any): void;

    export function getData(k: string, defaultValue?: string): string;
    export function setData(k: string, v: string): string;

    export function open(viewPrefab: cc.Prefab): void;
    export function notify(msg: string): void;
    export function dialog(title: string, content: string, ok: () => void, cancel: () => void): void;
}
