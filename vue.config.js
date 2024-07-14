const { defineConfig } = require('@vue/cli-service')
const { DefinePlugin } = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

const packageJson = require('./package.json')

module.exports = defineConfig({
  chainWebpack: config => {
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js'),
    config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [{
      filename: '[file].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    }]),
    config.plugin('DefinePlugin').use(DefinePlugin, [{
      'process.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
    }])
  },
  transpileDependencies: true,
  productionSourceMap: false,
  pwa: {
    name: process.env.VUE_APP_TITLE,
    themeColor: '#0f0f0f',
    msTileColor: '#0f0f0f',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    manifestOptions: {
      display_override: [
        "window-controls-overlay"
      ],
      background_color: "#0f0f0f",
      icons: [
        { 'src': 'icons/android-chrome-192x192.png', 'sizes': '192x192', 'type': 'image/png' },
        { 'src': 'icons/android-chrome-512x512.png', 'sizes': '512x512', 'type': 'image/png' }
      ],
    },
    iconPaths: {
      favicon32: 'icons/favicon-32x32.png',
      favicon16: 'icons/favicon-16x16.png',
      appleTouchIcon: 'icons/apple-touch-icon.png',
      maskIcon: 'icons/safari-pinned-tab.svg',
      msTileImage: 'icons/mstile-144x144.png'
    }
  }
})
