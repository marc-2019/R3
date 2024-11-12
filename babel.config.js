module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  ignore: [
    'node_modules/process',  // Ignore process/browser.js during Babel transformation
    'node_modules/web3',     // Ignore large libraries like web3 during transformation to prevent performance issues
  ],
};
