import { get, getDictMap, IDictMap } from '@/api/system/dictDetail'
import { Vue, Component } from 'vue-property-decorator'
import { IDictDetailDtoData } from '@/types/dictDetail'

@Component({
    name: 'initDict'
})
export default class extends Vue {
    dicts: IDictDetailDtoData[] = []
    dictMap: IDictMap = {}

    async getDict(name: string) {
        let res = await get({
            dictName: name
        })
        this.dicts = res.data
    }

    async getDictMap(names: string) {
        const arr = names.split(',')
        for (let i = 0; i < arr.length; i++) {
            this.dictMap[arr[i]] = []
        }
        let res = await getDictMap(names)
        this.dictMap = res.data
    }
}
