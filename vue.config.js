module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^/v2': {
          target: 'https://api.champ-ramard.fr/',
          changeOrigin: true,
        },
      '^/v1': {
          target: 'https://api.champ-ramard.fr/',
          changeOrigin: true,
        }
      }
  }
}
