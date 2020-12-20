<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UploadExcelComponent, {
  ExcelData
} from '@/components/UploadExcel/Index.vue'

@Component({
  name: 'UploadExcel',
  components: {
    UploadExcelComponent
  }
})
export default class UploadExcel extends Vue {
  tableData: any = [];
  tableHeader: string[] = [];

  beforeUpload(file: File) {
    const isLt1M = file.size / 1024 / 1024 < 1
    if (isLt1M) {
      return true
    }

    this.$message({
      message: '请不要上传大于1m的文件.',
      type: 'warning'
    })
    return false
  }

  handleSuccess(e: ExcelData) {
    this.tableData = e.results
    this.tableHeader = e.header
  }
}
</script>
