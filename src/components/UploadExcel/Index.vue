<template>
  <div>
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    />
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      拖拽excel文件到此处 或者
      <el-button
        :loading="loading"
        style="margin-left: 16px"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        浏览
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import XLSX from "xlsx";

export interface IExcelData {
  header: string[]
  results: any
}

@Component
export default class UploadExcelComponent extends Vue {
  @Prop() beforeUpload?: Function;
  @Prop() onSuccess?: Function;

  @Ref("excel-upload-input") uploadInput!: HTMLInputElement;

  loading = false;
  excelData!: IExcelData

  generateData(header: string[], results: any) {
    this.excelData.header = header;
    this.excelData.results = results;
    this.onSuccess && this.onSuccess(this.excelData);
    let es = new HTMLInputElement();
    es.onchange;
  }

  handleDrop(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.loading) return;
    const files = e.dataTransfer?.files;

    if (files) {
      if (files.length !== 1) {
        this.$message.error("只支持单个文件上传!");
        return;
      }
      const rawFile = files[0];

      if (!this.isExcel(rawFile)) {
        this.$message.error("只支持.xlsx, .xls, .csv 格式文件");
        return false;
      }
      this.upload(rawFile);
      e.stopPropagation();
      e.preventDefault();
    }
  }

  handleDragover(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  }

  handleUpload() {
    this.uploadInput.click();
  }

  handleClick(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      const files = e.target.files!;
      const rawFile = files[0];
      if (!rawFile) return;
      this.upload(rawFile);
    }
  }

  upload(rawFile: File) {
    this.uploadInput.value = "";

    if (!this.beforeUpload) {
      this.readerData(rawFile);
      return;
    }
    const before = this.beforeUpload(rawFile);
    if (before) {
      this.readerData(rawFile);
    }
  }

  readerData(rawFile: File) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const header = this.getHeaderRow(worksheet);
        const results = XLSX.utils.sheet_to_json(worksheet);
        this.generateData(header, results);
        this.loading = false;
        resolve(null);
      };
      reader.readAsArrayBuffer(rawFile);
    });
  }

  getHeaderRow(sheet: XLSX.WorkSheet) {
    const headers = [];
    const range = XLSX.utils.decode_range(sheet["!ref"]!);
    let C;
    const R = range.s.r;
    for (C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
      let hdr = "UNKNOWN " + C;
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
      headers.push(hdr);
    }
    return headers;
  }

  isExcel(file: File) {
    return /\.(xlsx|xls|csv)$/.test(file.name);
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
