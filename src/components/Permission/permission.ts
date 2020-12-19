import store from "@/store";
import _Vue from "vue";

export default {
  inserted(el: any, binding: any, vnode: any) {
    const { value } = binding
    const roles = store.getters && store.getters.roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some((role:any) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`使用方式： v-permission="['admin','editor']"`)
    }
  },
  install(Vue: typeof _Vue, options?: any) {}
}
