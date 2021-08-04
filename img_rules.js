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
    test: /\.txt/,
    type: 'asset/source',
  },
  svg: {
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  },
};
