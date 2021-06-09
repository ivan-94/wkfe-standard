exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['react-app', 'prettier'],
    plugins: [],
    rules: {
      ...exports.rules,
      ...(loose ? exports.looseRules : {}),
    },
  };
};

exports.rules = {};

exports.looseRules = {};
