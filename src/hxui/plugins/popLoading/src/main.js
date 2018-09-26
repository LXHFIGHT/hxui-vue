/**
 * Created by lxhfight on 2018/8/10.
 * Email:
 * Description:
 *  HXUI 加载框调用方法
 */

import Vue from 'vue'
import Main from './main.vue'

const LoadingConstructor = Vue.extend(Main)
let instance = {}

export const showLoading = (options) => {
  instance.vm && hideLoading()
  let bundle = {}
  if (typeof options === 'string') {
    bundle = { title: options }
  } else {
    bundle = Object.assign({}, options)
  }
  instance = new LoadingConstructor({
    data: bundle
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  return instance.vm
}

export const hideLoading = () => {
  instance.vm.destroyElement()
  return true
}