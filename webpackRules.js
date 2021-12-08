module.exports = {
  resource: {
    test: /\.png/,
    type: 'asset/resource',
  },
  inline: {
    // test: /\.svg/,
    // type: 'asset/inline',
  },
  source: {
    test: /\.txt|\.traineddata/,
    type: 'asset/source',
  },
  svg: {
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  }, 
  fallback: {
    'stream': false,
    'fs': false,
    'path': false,
  }
};
