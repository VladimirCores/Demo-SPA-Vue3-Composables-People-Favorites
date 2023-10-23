module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-standard-scss'],
  overrides: [
    {
      'files': ['**/*.(scss|css|html|vue)'],
      'customSyntax': 'postcss-scss'
    },
    {
      'files': ['**/*.(html|vue)'],
      'customSyntax': 'postcss-html'
    }
  ],
  rules: {
    indentation: 2,
    'rule-empty-line-before': 0,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen'
        ]
      }
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null
  },
}
