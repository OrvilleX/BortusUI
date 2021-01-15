import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { RenderContext } from 'vue/types/options'
import { CreateElement } from 'vue/types/vue'

export interface HoverOption {
    show: boolean
    tips: any
}

@Component({
  name: 'CodeEditor'
})
export default class extends Vue {
    @Prop({ default: '100%' }) width!: string
    @Prop({ default: '100%' }) height!: string
    @Prop() original!: string
    @Prop() value!: string
    @Prop({ default: 'javascript' }) language!: string
    @Prop({ default: 'vs' }) theme!: string
    @Prop({ default: () => { return {} } }) options!: monaco.editor.IEditorOptions & monaco.editor.IGlobalEditorOptions
    @Prop() editorMounted?: Function
    @Prop() editorBeforeMount?: Function
    @Prop({ default: () => { return { show: false, tips: [] } } }) hoverOption!: HoverOption

    editor!: monaco.editor.IStandaloneCodeEditor

    @Watch('options', {
      deep: true
    })
    onOptionsChange(val: monaco.editor.IEditorOptions & monaco.editor.IGlobalEditorOptions) {
      this.editor.updateOptions(val)
    }

    @Watch('value')
    onValueChange() {
      if (this.value !== this.editor.getValue()) {
        this.editor.setValue(this.value)
      }
    }

    @Watch('language')
    onLanguageChange() {
      const model = this.editor.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, this.language)
      }
    }

    @Watch('theme')
    onThemeChange() {
      monaco.editor.setTheme(this.theme)
    }

    @Watch('style')
    onStyleChange() {
      this.$nextTick(() => {
        this.editor.layout()
      })
    }

    get style() {
      return {
        width: !/^\d+$/.test(this.width) ? this.width : this.width + 'px',
        height: !/^\d+$/.test(this.height) ? this.height : this.height + 'px'
      }
    }

    mounted() {
      if (this.hoverOption.show) {
        this.setEditorHover(this.language)
      }
      Object.assign(this.options, this._editorBeforeMount())
      this.editor = monaco.editor.create(this.$el as HTMLElement, {
        value: this.value,
        language: this.language,
        theme: this.theme,
        ...this.options
      })
      this._editorMounted(this.editor)
    }

    beforeDestroy() {
      this.editor && this.editor.dispose()
    }

    render(createElement: CreateElement, hack: RenderContext) {
      return createElement('div', {
        class: 'monaco_editor_container',
        style: this.style
      })
    }

    private setEditorHover(lang: string) {
      const { tips } = this.hoverOption
      if (tips.length === 0) return
      monaco.languages.register({ id: lang })
      monaco.languages.registerHoverProvider(lang, {
        provideHover: function(model, position) {
          const positionLine = position.lineNumber
          const positionEndColumn = position.column
          const textUntilPosition = {
            startLineNumber: positionLine,
            startColumn: 1,
            endLineNumber: positionLine,
            endColumn: positionEndColumn
          }
          const tipText = tips.some((item: any) => item.lineNumber === positionLine) ? tips.filter((item: any) => item.lineNumber === positionLine)[0].text : ''
          return {
            range: new monaco.Range(textUntilPosition.startLineNumber, textUntilPosition.startColumn, textUntilPosition.endLineNumber, textUntilPosition.endLineNumber),
            contents: [
              { value: tipText }
            ]
          }
        }
      })
    }

    private _editorBeforeMount() {
      if (this.editorBeforeMount) {
        const options = this.editorBeforeMount(monaco)
        return options
      }
      return {}
    }

    private _editorMounted(editor: monaco.editor.IStandaloneCodeEditor) {
      if (this.editorMounted) {
        this.editorMounted(editor, monaco)
      }
      editor.onDidChangeModelContent(event => {
        this._emitChange(this.value, event)
      })
    }

    private _emitChange(value: string, event: any) {
      this.$emit('change', value, event)
      this.$emit('input', value)
    }
}
