import {stateMixin} from "./state";
import {initMixin} from "./init";

function Vuefake(options) {
    this._init(options)
}
initMixin(Vuefake)
stateMixin(Vuefake)

export default Vuefake

