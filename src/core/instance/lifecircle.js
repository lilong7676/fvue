import {popWatcher, pushWatcher} from "../observer/dep";

export function lifecircleMixin(Vue) {
    // TODO
}

export function callHook(vm, hook) {
    pushWatcher()
    const handler = vm.$options[hook]
    if (handler) {
        handler.call(vm)
    }
    popWatcher()
}
