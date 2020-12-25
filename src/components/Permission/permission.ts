import _Vue from 'vue'
import { UserModule } from '@/store/modules/user'

export default {
  inserted(el: any, binding: any) {
    const { value } = binding
    const roles = UserModule.roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some((role: any) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('使用方式： v-permission="[\'admin\',\'editor\']"')
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  install(Vue: typeof _Vue) {}
}
