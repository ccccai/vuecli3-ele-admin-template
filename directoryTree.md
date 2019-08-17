.
│  .gitignore <!-- git忽略文件配置文件 -->
│  babel.config.js <!-- babel配置文件 -->
│  package-lock.json <!-- 用以记录当前状态下实际安装的各个npm package的具体来源和版本号 -->
│  package.json <!-- 定义了这个项目所需要的各种模块,以及项目的配置信息(比如名称、版本、许可证等元数据) -->
│  README.md <!-- 项目介绍文件 -->
│  
├─node_modules <!-- 项目依赖包 -->
├─public <!-- 放不会变动的文件（相当于vue-cli2.x中的static） -->
│      favicon.ico <!-- 项目图标 -->
│      index.html <!-- 设置项目的一些meta头信息，提供用于挂载 vue 节点。 -->
│      
└─src <!-- 存放项目源码及需要引用的资源文件。 -->
    │  App.vue <!-- 根组件 -->
    │  main.js <!-- 入口文件 -->
    │  router.js <!-- 路由文件 -->
    │  store.js <!-- vuex仓库文件 -->
    │  
    ├─assets <!-- 静态资源文件，放可能会变动的文件 -->
    │      logo.png
    │      
    ├─components <!-- 公共组件 -->
    │      HelloWorld.vue
    │      
    └─views <!-- 页面 -->
            About.vue
            Home.vue
            
