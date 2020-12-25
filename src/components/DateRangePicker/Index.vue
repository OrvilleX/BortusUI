<script lang="ts">
import { DatePicker } from 'element-ui'
import { DatePickerOptions, DatePickerType } from 'element-ui/types/date-picker'
import { mixins } from 'vue-class-component'
import { calendarShortcuts } from '@/utils/shortcuts'
import { Component, Prop } from 'vue-property-decorator'
import { ElementUIComponentSize } from 'element-ui/types/component'

@Component({ name: 'DateRangePicker' })
export default class DateRangePicker extends mixins(DatePicker) {
    @Prop({ default: 'daterange' }) type!: DatePickerType
    @Prop({ default: 'yyyy-MM-dd HH:mm:ss' }) valueFormat!: string
    @Prop({ default: () => ['00:00:00', '23:59:59'] }) defaultTime!: Array<string>
    @Prop({ default: () => { shortcuts: calendarShortcuts } }) pickerOptions!: DatePickerOptions
    @Prop({ default: 'small' }) size!: ElementUIComponentSize
    @Prop({ default: ':' }) rangeSeparator!: string
    @Prop({ default: '开始日期' }) startPlaceholder!: string
    @Prop({ default: '结束日期' }) endPlaceholder!: string
}
</script>
