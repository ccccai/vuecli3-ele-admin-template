const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist', // 输出文件目录
  assetsDir: 'assets', // 静态资源文件夹
  productionSourceMap: false,
  devServer: {
    port: 9566, // 端口号
    open: true,
    proxy: null // 设置代理
  },
  css: {
    loaderOptions: {
      sass: { // 如果用的是less就改成less
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          require('autoprefixer')({}),
          require('postcss-plugin-px2rem')({
            rootValue: 54, // 换算基数，默认100，自行根据效果调整。
            mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
            minPixelValue: 3 // 设置要替换的最小像素值默认0，这里表示大于3px会被转rem。
          })
        ]
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('css')
      .test(/\.css$/)
      .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use('px2rem')
      .loader('px2rem-loader')
      .options({
        remUnit: 54
      })

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    config.entry.app = ['babel-polyfill', './src/main.js']
  }
}

