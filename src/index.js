import Vuefake from './core/instance/index'


const vuefake = new Vuefake({
    data() {
        return {
            test: 'hello vue'
        }
    }
})
window.vuefake = vuefake

console.log('test', vuefake.$data.test)
vuefake.$watch('test', function (newVal, oldValue) {
    console.log('test changed!!', newVal, oldValue)
})

vuefake._data.test = 222

export default Vuefake
