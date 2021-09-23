let uid = 0

export default class Dep {
    static watcher;
    id;
    subs;

    constructor(props) {
        this.id = uid++
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub)
        if (index !== -1) {
            this.subs.splice(index, 1)
        }
    }

    depend() {
        if (Dep.watcher) {
            Dep.watcher.addDep(this)
        }
    }

    notify() {
        const subs = this.subs.slice()
        subs.forEach(sub => {
            sub.update()
        })
    }

}

const watcherStack = []
Dep.watcher = null

export function pushWatcher(watcher) {
    watcherStack.push(watcher)
    Dep.watcher = watcher
}

export function popWatcher() {
    watcherStack.pop()
}
