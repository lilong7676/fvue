import Watcher from "../observer/watcher";
import {pushWatcher, popWatcher} from "../observer/dep";
import {noop} from "../shared/utils";
import {observe} from "../observer";
import Dep from '../observer/dep'

const sharedPropertyDesc = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

export function proxy(target, sourceKey, key) {
    sharedPropertyDesc.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDesc.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDesc)
}


export function stateMixin(Vue) {
    const dataDef = {}
    dataDef.get = function() { return this._data}
    dataDef.set = function() {
        console.warn('不允许set', this)
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef)

    Vue.prototype.$watch = function(
        expOrFn,
        cb,
        options = {}
    ) {
        const vm = this
        options.user = true
        const watcher = new Watcher(vm, expOrFn, cb, options)
        if (options.immediate) {
            pushWatcher()
            watcher.run()
            popWatcher()
        }
        return function unwatchFn() {
            watcher.teardown()
        }
    }
}

export function initState(vm) {
    vm._watchers = []
    const opts = vm.$options
    // TODO init props - methods - data
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}


function initData(vm) {
    let data = vm.$options.data
    if (typeof data === 'function') {
        data = data.call(vm, vm) || {}
    } else {
        data = data || {}
    }
    vm._data = data || {}

    // proxy data on instance
    const keys = Object.keys(data)
    keys.forEach(key => {
        proxy(vm, '_data', key)
    })

    // observe data
    observe(data, true)

}


function initComputed(vm) {
    let computed = vm.$options.computed
    const watchers = vm._computedWatchers = Object.create(null)
    Object.keys(computed).forEach(key => {
        const getter = computed[key]
        if (typeof getter === 'function') {
            watchers[key] = new Watcher(vm, getter, noop, {lazy: true})
        } else {
            console.warn('computed item must be a function')
        }

        if (!(key in vm)) {
            defineComputed(vm, key, getter)
        }

    })
}

export function defineComputed(vm, key, getter) {
    sharedPropertyDesc.get = createComputedGetter(key)
    sharedPropertyDesc.set = noop
    Object.defineProperty(vm, key, sharedPropertyDesc)
}

function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers[key]
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate()
            }
            if (Dep.watcher) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}


function initWatch(vm) {
    const watches = vm.$options.watch
    Object.keys(watches).forEach(key => {
        const cb = watches[key]
        vm.$watch(key, cb)
    })
}
