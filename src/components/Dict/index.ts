import { Vue, Component, Prop } from 'vue-property-decorator'
import { get as getDictDetail } from '@/api/system/dictDetail'

export interface IDictData {
    dict: {}
    label: {}
}

export class DictObj {
    dict: IDictData

    constructor(dict: IDictData) {
        this.dict = dict;
    }

    async init(names: string[], completeCallback :Function) {
        if (names === undefined || names === null) {
            throw new Error("need Dict names")
        }
        const ps:Promise<void>[] = []
        names.forEach(n => {
            Vue.set(this.dict.dict, n, {})
            Vue.set(this.dict.label, n, {})
            Vue.set(this.dict, 0, [])
            ps.push(getDictDetail({dictName: n}).then(data => {
                this.dict[n].splice(0, 0, ...data.data)
                data.data.forEach(d => {
                    Vue.set(this.dict.dict[n], d.value, d)
                    Vue.set(this.dict.label[n], d.value, d.label)
                })
            }))
        })
        await Promise.all(ps)
        completeCallback()
    }
}

@Component
export default class Dict extends Vue {
    dict: IDictData = { dict:[], label:[] }

    created() {
        if ((this.$options as any).dict instanceof Array) {
            new DictObj(this.dict).init((this.$options as any).dicts, () => {
                this.$nextTick(() => {
                    this.$emit("dictReady")
                })
            })
        }
        
    }
}