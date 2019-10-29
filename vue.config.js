// const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin')
// const { styles } = require('@ckeditor/ckeditor5-dev-utils')

module.exports = {
  // 基本路径
  baseUrl: process.env.VUE_APP_BASE_URL
  // baseUrl: '/admin/'
  // // 输出文件目录
  // outputDir: 'dist',
  // // eslint-loader 是否在保存的时候检查
  // lintOnSave: true,
  // // use the full build with in-browser compiler?
  // // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  // // compiler: false,
  // // webpack配置
  // // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // // chainWebpack: () => {},
  // // configureWebpack: () => {},
  // // vue-loader 配置项
  // // https://vue-loader.vuejs.org/en/options.html
  // // vueLoader: {},
  // // 生产环境是否生成 sourceMap 文件
  // productionSourceMap: true,
  // // css相关配置
  // css: {
  //   // 是否使用css分离插件 ExtractTextPlugin
  //   extract: true,
  //   // 开启 CSS source maps?
  //   sourceMap: false,
  //   // css预设器配置项
  //   loaderOptions: {},
  //   // 启用 CSS modules for all css / pre-processor files.
  //   modules: false
  // },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  // parallel: require('os').cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // pwa: {},
  // webpack-dev-server 相关配置
  // devServer: {
  //   open: process.platform === 'darwin',
  //   host: '0.0.0.0',
  //   port: 8080,
  //   https: false,
  //   hotOnly: false,
  //   proxy: null, // 设置代理
  //   before: app => {}
  // },
  // 第三方插件配置
  // pluginOptions: {
  //   // ...
  // },

  // configureWebpack: {
  //   plugins: [
  //     new CKEditorWebpackPlugin({
  //       // See https://docs.ckeditor.com/ckeditor5/latest/features/ui-language.html
  //       language: 'zh-cn'
  //     })
  //   ],

  //   module: {
  //     rules: [
  //       {
  //         // Or /ckeditor5-[^/]+\/theme\/icons\/[^/]+\.svg$/ if you want to limit this loader
  //         // to CKEditor 5 icons only.
  //         test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

  //         use: ['raw-loader']
  //       },
  //       {
  //         // Or /ckeditor5-[^/]+\/theme\/[\w-/]+\.css$/ if you want to limit this loader
  //         // to CKEditor 5 theme only.
  //         test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
  //         use: [
  //           {
  //             loader: 'style-loader',
  //             options: {
  //               singleton: true
  //             }
  //           },
  //           {
  //             loader: 'postcss-loader',
  //             options: styles.getPostCssConfig({
  //               themeImporter: {
  //                 themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
  //               },
  //               minify: true
  //             })
  //           },
  //         ]
  //       }
  //     ]
  //   }
  // },
  // chainWebpack: config => {
  //   // const svgRule = config.module.rule('svg')

  //   // // 清除已有的所有 loader。
  //   // // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
  //   // svgRule.uses.clear()

  //   // // 添加要替换的 loader
  //   // svgRule
  //   //   .use('vue-svg-loader')
  //   //     .loader('vue-svg-loader')
  //   config.module.rule('svg')

  //   //   .test(/^(?!ckeditor5).*\.(svg)(\?.*)?$/)
  //     .exclude
  //     .add(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
  //     .end()
  //   // config.module.rule('svg').uses.clear()
  //   // // config.module.rule('svg').use('raw-loader').loader('raw-loader')
  //   // config.module.rule('svg').use('svg-inline-loader').loader('svg-inline-loader')

  //   config.module.rule('css').oneOf('normal')
  //     .exclude
  //     .add(/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/)
  //     .end()
  //     // .test(/^(?!ckeditor5).*\.(css)(\?.*)?$/)
  //     // .add(/ckeditor5-[^/]+\/theme\/[\w-/]+\.css$/)
  //     // // /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
  //     // .end()
  //   // .exclude(/ckeditor5-[^/]+\/theme\/icons\/[^/]+\.svg$/)
  // }



  // chainWebpack: config => {
  //   config.resolve.alias.set('vue$', 'vue/dist/vue.common')
  // }
}