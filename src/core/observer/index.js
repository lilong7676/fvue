
/*
尝试为vm上的value创建一个观察者
return new observer if there is no observer existed
* */
import {isObject, def} from "../shared/utils";
import Dep from "./dep";

export let shouldObserve = true

export function toggleObserving (value) {
    shouldObserve = value
}

export class Observer {
    value; // any
    dep; // Dep
    vmCount; // number of vms that have this object as root $data

    constructor(value) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            // TODO array mutation methods intercept
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key)
        })
    }

    observeArray(arr) {
        arr.forEach(item => {
            observe(item)
        })
    }
}

export function observe(object, asRootData) {
    if (!isObject(object)) {
        return
    }
    let observer
    if (Object.hasOwnProperty.call(object, '__ob__')) {
        observer = object.__ob__
    } else if (shouldObserve && !object._isVue) {
        observer = new Observer(object)
    }
    if (asRootData && observer) {
        observer.vmCount++
    }
    return observer
}


export function defineReactive(
    obj,
    key,
    val,
    customSetter,
    shallow
) {
    const dep = new Dep()

    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }

    const getter = property && property.get
    const setter = property && property.set
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }

    let childOb = !shallow && observe(val)

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactieveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.watcher) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            if (customSetter) { // for test
                customSetter()
            }
            if (getter && !setter) {
                return
            }
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)
            dep.notify()
        }
    })
}


// 数组依赖收集特殊处理
function dependArray (value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i]
        e && e.__ob__ && e.__ob__.dep.depend()
        if (Array.isArray(e)) {
            dependArray(e)
        }
    }
}
