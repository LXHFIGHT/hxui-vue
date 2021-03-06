<template>
  <!-- 组件封装： 分页组件
    获取参数：
    total: [Number] 当前列表页总页数
    doRequest: [Function] 发起请求回调方法
  -->
  <div class="hx-pagination">
    <select name="sizePerPage"
      v-model="searchInfo.per_page"
      @change="requestListByPerPage()">
      <option v-for="pageSize in pageSizes"
        v-bind:key="pageSize"
        v-text="`每页${pageSize}条数据`"
        :value="pageSize">
      </option>
    </select>
    <a :class="['btn-switch', (searchInfo.page <= 1 ? 'hx-invisible' : '')]"
      @click="requestListByPage(searchInfo.page - 1)">
      <IconCaretLeft class="icon"></IconCaretLeft>
    </a>
    <span class="text-page">{{searchInfo.page}} / {{total}}</span>
    <a :class="['btn-switch', (searchInfo.page === total || !total) ? 'hx-invisible' : '']"
      @click="requestListByPage(searchInfo.page + 1)">
      <IconCaretRight class="icon"></IconCaretRight> 
    </a>
    <input type="text"
      class="page-inputer"
      autocomplete="off"
      placeholder="请输入"
      v-model="toPage" />
    <input type="password" 
      autocomplete="new-password" 
      style="visiblity: hidden; display: none;" />
    <a class="btn-jump"
      @click="requestListByPage(toPage)">
      跳转
    </a>
  </div>
</template>
<script>
import toast from './../plugins/toast'
import IconCaretLeft from './../img/svg/caret-left-gray.svg'
import IconCaretRight from './../img/svg/caret-right-gray.svg'
export default {
  name: 'hx-pagination',
  data () {
    return {
      searchInfo: {
        per_page: this.pageSize || this.pageSizes[0],
        page: this.page
      },
      toPage: ' '
    }
  },
  components: {
    IconCaretLeft,
    IconCaretRight
  },
  props: {
    // 父组件传入方法可以带上一个对象作为参数，对象中包含 per_page和pageSize参数
    doRequest: {
      type: Function,
      required: true
    },
    // 总页数
    total: {
      type: Number,
      required: true
    },
    // 暴露到父组件的当前所在页的参数名，默认为："page"
    pageParamName: {
      type: String,
      default: 'page'
    },
    // 暴露到父组件的分页数的参数名，默认为："per_page"
    pageSizeParamName: {
      type: String,
      default: 'per_page'
    },
    // 分页选项集合
    pageSizes: {
      type: Array,
      default () {
        return [20, 40, 60, 80, 100]
      }
    },
    // 当前分页
    page: {
      type: [String, Number],
      default: 1
    },
    // 当前页面记录数
    pageSize: {
      type: [String, Number]
    }
  },
  methods: {
    $_initRequest () {
      let bundle = {}
      bundle[this.pageSizeParamName] = this.searchInfo.per_page
      bundle[this.pageParamName] = this.searchInfo.page
      this.doRequest(bundle)
    },
    requestListByPerPage () {
      this.$_initRequest()
    },
    requestListByPage (page = 1) {
      if (page > this.total || page < 1 || isNaN(page)) {
        toast({ text: '所选页面超过范围', level: 'warn' })
        return
      }
      this.searchInfo.page = parseInt(page)
      this.$_initRequest()
    }
  },
  beforeDestroy () {
    window.clearTimeout(this.timer)
  },
  watch: {
    total (newVal) {
      if (newVal < this.searchInfo.page && newVal) {
        this.searchInfo.page = newVal
        this.$_initRequest()
      }
    }
  }
}
</script>
