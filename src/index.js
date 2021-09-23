import Vuefake from './core/instance/index'


const vuefake = new Vuefake({
    beforeCreate() {
        console.log('before create')
    },
    created() {
        console.log('created')
    },
    data() {
        return {
            count: 1
        }
    },
    computed: {
        countPlus13() {
            return this.count * 13
        }
    },
    watch: {
        count(newVal, oldVal) {
            console.log('count changed', newVal, oldVal)
        },
        countPlus13(newVal, oldVal) {
            console.log('countPlus13 changed', newVal, oldVal)
        }
    }
})
window.vuefake = vuefake

console.log('count', vuefake.count)
console.log('countPlus13', vuefake.countPlus13)

// console.log('watch count')
// vuefake.$watch('count', function (newVal, oldValue) {
//     console.log('count changed!!', newVal, oldValue)
// })
console.log('set count 222')
vuefake.count = 222

console.log('countPlus13', vuefake.countPlus13)


export default Vuefake
