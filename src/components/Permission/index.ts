import permission from './permission'
import _Vue from 'vue'

const install = (Vue: typeof _Vue) => {
  Vue.directive('permission', permission)
}

if (window.Vue) {
  // window.permission = permission
  _Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
