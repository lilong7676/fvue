import {initState} from "./state";

let uid = 0

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this
        vm._uid = uid++

        vm._isVue = true

        vm.$options = Object.assign({}, options || {})

        vm._self = vm

        initState(vm)

    }
}
