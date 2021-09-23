import {pushWatcher, popWatcher} from "./dep";
import {isObject, parsePath} from "../shared/utils";

let uid = 0

export default class Watcher {
    vm;
    expression;
    cb;
    id;
    deep;
    user;
    lazy;
    sync;
    dirty;
    active;
    deps;
    newDeps;
    depIds;
    newDepIds;
    before;
    getter;
    value;

    constructor(
        vm,
        expOrFn,
        cb,
        options,
        isRenderWatcher
    ) {
        this.vm = vm
        vm._watchers.push(this)

        if (options) {
            this.deep = !!options.deep
            this.user = !!options.user
            this.lazy = !!options.lazy
            this.sync = !!options.sync
            this.before = options.before
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }

        this.cb = cb
        this.id = ++uid
        this.active = true
        this.dirty = this.lazy
        this.deps = []
        this.depIds = new Set()
        this.newDeps = []
        this.newDepIds = new Set()

        this.expression = expOrFn.toString()

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else {
            this.getter = parsePath(expOrFn)
        }

        this.value = this.lazy ? undefined : this.get()

    }

    // Evaluate getter, and re-collect dependencies
    get() {
        console.log('watcher get re-collect dependencies')
        pushWatcher(this)
        const vm = this.vm

        let value = this.getter.call(vm, vm)
        // TODO deep
        popWatcher()

        return value
    }

    // add a dependency to this directive
    addDep(dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    update() {
        if (this.lazy) {
            this.dirty = true
        } else if (this.sync || true) {
            this.run()
        }
    }

    // run cb
    run() {
        if (this.active) {

            const newVal = this.get()
            if (newVal !== this.value || isObject(newVal) || this.deep) {
                const oldValue = this.value
                this.value = newVal
                this.cb.call(this.vm, newVal, oldValue)
            }
        }
    }

    // Evaluate the value of the watcher.
    // this only gets called for lazy watchers.
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }


    // let all deps collect this watcher
    depend() {
        this.deps.forEach(dep => dep.depend())
    }

    teardown() {
        // TODO teardown
        if (this.active) {
            this.deps.forEach(dep => dep.removeSub(this))
            this.active = false
        }
    }
}
