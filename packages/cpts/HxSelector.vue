<template>
  <div class="hx-selector"
    :data-value="value"
    ref="hxSelector"
    :required="!!required ? 'required' : false">
    <input type="text" readonly
      :class="['text-option', (_optionFilter(value) === placeholder) && 'color-gray']" 
      @focus="doFocus"
      @blur="doBlur"
      ref="inputer"
      :disabled="disabled"
      :value="_optionFilter(value)"/>
    <button v-if="value && !disabled" class="btn-clear hide-sm" @click="doClear">×</button>
    <hx-folder :dom="inputer" :onHide="doBlur" :show="showOptions" isResponsive="true">
      <div class="hx-pad-options selector">
        <div class="pad-select-zone">
          <div class="pad-options">
            <div class="btn-option" v-for="(option, idx) in options" :key="idx">
              <div @click="doSelect(option)"
                v-if="option.value !== '|' || option[key] !== '|'"
                :value="option.value"
                :class="['option', 
                  option.disabled ? 'disabled' : '', 
                  option.value === value && 'selected']">
                {{ option[key] }}
              </div>
              <div class="line-divider" v-if="option.value === '|' && option[key] === '|'"></div>
            </div>
          </div>
          <div class="btn-cancel option" @click="doHideOptions" v-if="screenWidth <= MOBILE_DEVICE_MAX_WIDTH">
            取消选择
          </div>
        </div>
      </div>
    </hx-folder>
  </div>
</template>
<script>
import HxFolder from './HxFolder'
import { MOBILE_DEVICE_MAX_WIDTH } from './../const'
export default {
  components: {
    HxFolder
  },
  data () {
    return {
      MOBILE_DEVICE_MAX_WIDTH,
      screenWidth: 0,
      showOptions: false,
      options: [],
      inputer: null,
      key: ''
    }
  },
  props: {
    content: { // 纯字符串或整数组成的数组，或者 {text: '', value: ''} 规格对象组成的数组
      type: Array,
      required: true
    },
    value: { // 该选择器关联的数据
      type: [Number, String],
      required: true,
      default: ''
    },
    keyName: { // 选项和value对应的键字段名
      type: String
    },
    valueName: { // 选项和value对应的值字段名
      type: String,
      default: 'value'
    },
    disabled: {
      type: [String, Boolean, Number],
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    required: {
      type: [String, Boolean, Number],
      default: false
    }
  },
  methods: {
    $_init () {
      this.inputer = this.$refs.inputer
      this.screenWidth = document.body.clientWidth
    },
    $_getKeyName () { // 智能分析传入数据的key对应的字段
      if (this.keyName) {
        this.key = this.keyName
        return
      }
      if (!this.content.length) {
        return
      }
      if (typeof this.content[0] === 'string') {
        this.key = 'text'
        return 
      }
      if (this.content[0]['text']) {
        this.key = 'text'
        return
      }
      if (this.content[0]['key']) {
        this.key = 'key'
      }
    },
    _optionFilter (data) {
      if (!this.options) {
        return this.placeholder
      }
      const result = this.options.filter(v => v.value === data)
      if (result.length) {
        return result[0][this.key]
      }
      return this.placeholder
    },
    $_initOptions () {
      this.options = []
      this.$_getKeyName()
      for (let option of this.content) {
        if (typeof option !== 'object') {
          let obj = { value: option }
          obj[this.key] = option
          this.options.push(obj)
        } else {
          let obj = Object.assign({}, option, { value: option[this.valueName] })
          this.options.push(obj)
        }
      }
    },
    doClear () {
      this.$emit('input', '')
      this.$emit('change')
      this.$forceUpdate()
    },
    doFocus () {
      this.showOptions = true
    },
    doBlur () {
      this.showOptions = false
    },
    doSelect (option) {
      if (option.disabled) {
        return
      }
      this.showOptions = false
      this.$emit('input', option.value)
      this.$refs.hxSelector.classList.remove('error')
      this.$emit('change', option)
      this.$forceUpdate()
    },
    doHideOptions () {
      this.showOptions = false
      this.doClear()
    }
  },
  created () {
    this.$_initOptions()
  },
  mounted () {
    this.$_init()
  },
  watch: {
    content: {
      handler (newVal) {
        this.$_initOptions()
      },
      deep: true
    }
  }
}
</script>
