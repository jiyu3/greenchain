module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  devServer: {
    port: 8101,
    https: false,
    watchOptions: {
      poll: true
    }
  }
}
