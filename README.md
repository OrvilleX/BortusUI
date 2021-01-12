# Bortus数据管理平台

## 基础教程  

本项目采用VSCode进行开发，建议读者采用此IDE进行开发。同时考虑到国内npm的不稳定性本项目将采用
cnpm，并且以下教程也以cnpm进行指令编写。  

### 项目结构  

* .vscode: 提供基于VSCode的开发调试配置，便于开发者可以上手直接进行开发调试；    
* mock: 基于NodeJs的后台模拟；  
* public: 项目需要包含的静态资源；  
* src: 项目源码目录；  
* src/api: Ajax请求；  
* src/assets: 图片、图标和样式目录；  
* src/components: 通用Vue组件目录；  
* src/layout: 项目主体框架界面；  
* src/mixins: 包含通用操作父类；  
* src/router: Vue路由；  
* src/store: Vuex目录；  
* src/types: 数据类型定义目录；  
* src/utils: 工具类目录；  
* src/views: 主要页面目录；  

### 项目指令  

本项目已经支持直接通过VSCode进行调试开发，请安装如下插件以便进行调试开发：  

* Debugger for Chrome  
* Vetur  
* SVG Viewer（可选，用于查看svg文件）  

完成以上插件安装后我们就可以进行开发工作了，对于使用VSCode的用户可以直接通过F5进行调试，并且
考虑到本程序自己自带了Mock服务，所以可以通过`cnpm run mock`启动，然后进行调试。关于其他指令
的介绍如下：  

`cnpm run lint`： 对代码进行代码验证  
`cnpm run serve`： 浏览本项目  
`cnpm run build`： 构建本项目  

### 服务模拟  

为了便于前端本机进行开发调试，在本项目的mock文件夹下通过nodejs模拟的对应后台API接口的模拟，
主要采用了[express](https://github.com/expressjs/express)框架，部分数据模拟采用[faker](https://github.com/Marak/faker.js)自动生成。当然最大的优势就是可以直接使用已经定义的数据
定义文件。  

项目已经默认采用了基于nodejs模拟的服务端对`/auth`和`/api`请求进行重定向，如果读者需要将请求
代理到其他地址以便于进行对接可以打开`vue.config.js`文件将`proxy`中的内容修改自己需要的地址。  

```javascript
proxy: {
  '/api': {
    target: `http://127.0.0.1:${mockServerPort}/mock-api/v1`,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    }
  },
  '/auth': {
    target: `http://127.0.0.1:${mockServerPort}/mock-api/v1`,
    changeOrigin: true,
    pathRewrite: {
      '^/auth': '/auth'
    }
  }
}
```  

服务模拟建议以功能模块为单位新家独立的文件，并且采用`Router`进行相关API请求的模拟，最后需要
将`Router`作为默认对象`export`，最终在`mock-server.ts`中使用`use`进行绑定。具体可以参考
本项目文件。  

## 功能开发  

本项目主要用于各类后台管理前端的开发，所以为了便于快速进行相关管理模块的开发，以下将介绍如何
进行相关功能的快速开发教程，以便于用户可以快速的进行对应应用的开发。  

### 通用功能  

由于实际开发大多数为基于CRUD形式的开发，所以本框架已经提供了基础类，以便于用户快速的进行相关
功能列表的开发，具体可以参考`/src/components/Crud/index.ts`文件夹中的`CRUD`类。  

该类需要提供三个泛型参数，`T`为新增与编辑表单的模型对象，`Q`为列表查询表单的模型对象，最后的
`D`则为列表的模型对象。该类提供了常用的属性以及方法使开发者快速进行相关开发工作，以下将分别进
行进行具体的介绍。  

`注意类型中的T、Q、D为CRUD类的泛型参数`  

| 参数 | 类型 | 必填 | 说明 | 备注 |
| ---- | ---- | ---- | ---- | ---- |
| url | string | 是 | 提供列表请求路径 | 空 |
| sort | string[] | 否 | 提供排序规则，默认按照id逆序 | 空 |
| defaultQuery | Q | 否 | 默认查询值，通过resetQuery方法可以采用该属性重置查询 | 空 |
| data | D[] | 否 | 列表数据，会自动根据url进行请求 | 空 |
| query | Q | 是 | 列表查询表单 | 空 |
| form | T | 是 | 增加编辑表单 | 空 |
| defaultForm | T | 是 | 表单默认内容 | 空 |
| crudMethod | CurdMethod<T> | 是 | 新增、编辑、删除和详情请求接口 | 空 |
| title | string | 是 | 模块标题 | 空 |

不仅仅需要使用以上属性，实际开发过程中还需要使用到对应的方法进行开发，主要常用的方法如下。  

| 方法名 | 说明 |
| ----- | ----- |
| refresh | 列表刷新 |
| toQuery | 根据query对列表查询 |
| resetQuery | 重置查询表单 |
| toAdd | 显示新增窗口 |
| toEdit | 显示编辑数据窗口 |
| toTableDelete | 删除多个数据 |
| doExport | 导出数据 |
| toggleSearch | 隐藏/显示查询表单 |
| submitCU | 提交表单（新增/编辑）|
| toDeleteUD | 单数据删除 |

最后就是可以由用户重写的方法，这类方法会根据实际功能响应事件而触发调用，以便于开发者根据具体
的事件来响应，具体可以参考如下表格。  

| 方法名 | 说明 |
| ---- | ---- |
| beforeRefresh | 列表刷新前 |
| afterRefresh | 列表刷新后 |
| beforeDelete | 删除前 |
| afterDelete | 删除后 |
| beforeDeleteCancel | 删除取消前 |
| afterDeleteCancel | 删除取消后 |
| beforeToAdd | 新建前 |
| afterToAdd | 新建后 |
| beforeToEdit | 编辑前 |
| afterToEdit | 编辑后 |
| beforeToCU | 新增编辑前 |
| afterToCU | 新增编辑后 |
| beforeValidateCU | 新增/编辑验证前 |
| afterValidateCU | 新增/编辑验证后 |
| beforeAddCancel | 添加取消前 |
| afterAddCancel | 添加取消后 |
| beforeEditCancel | 编辑取消前 |
| afterEditCancel | 编辑取消后 |
| beforeSubmit | 提交后 |
| afterAddError | 添加错误后 |
| afterEditError | 编辑错误后 |

## 注意事项  

1. treeselect 组件如果需要能够触发`load-options`事件，父级组件的`children`必须为`null`才可触发;   
2. el-table 实现树形效果，由于需要初始化datastatus，所以需要在父级加载数据的对应位置调用`CRUD`的`this.attchTable()`方法进行初始化;  
3. 
