import { initData } from '@/api/data'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
    name: 'InitData'
})
export default class InitData<T, K, Q> extends Vue {
    private loading = true
    private data: K[] = []    
    private time = 170
    private isAdd = false

    public url = ''
    public params!: T
    public query!: Q
    public page = 0
    public size = 10
    public total = 0

    async init() {
        if (!await this.beforeInit()) {
            return
        }
        this.loading = true
        try {
            let res = await initData<T, K>(this.url, this.params);
            this.total = res.data.totalElements
            this.data = res.data.content
            setTimeout(() => {
                this.loading = false
            }, this.time)
        }
        catch (e) {
            this.loading = false
        }
    }

    beforeInit() {
        return true
    }

    pageChange(e: number) {
        this.page = e - 1
        this.init()
    }

    sizeChange(e: number) {
        this.page = 0
        this.size = e
        this.init()
    }

    dleChangePage(size: number) {
        if (size === undefined) {
            size = 1
        }
        if (this.data.length === size && this.page !== 0) {
            this.page = this.page - 1
        }
    }

    toQuery() {
        this.page = 0
        this.init()
    }
}
