module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: [
    'import',
    '@typescript-eslint',
    'eslint-plugin-import-helpers'
  ],
  rules: {
    "import-helpers/order-imports": [
      "warn",
      {
        "newlinesBetween": "always",
        "groups": [
          ["/[^.]vue$/", "/vuex/", "/nuxt/", "/vue-property-decorator/", "/vuelidate/", "/^vuetify/", "/^vue$/", "/@vue/", "/^vue-/", "/^vitest/", "/crypto/"],
          "module",
          "/^~/constants/",
          "/^~/components/",
          "/^~/utils/",
          "/^~/assets/",
        ],
        "alphabetize": { "order": "asc", "ignoreCase": true }
      }
    ],
    "semi": ["error", "always"],
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "space-before-function-paren": ["error", "never"],
    "comma-dangle": ["error", "always-multiline"],
    "no-console": "off",
    "no-return-assign": "off",
    "no-sequences": "off",
    "newline-per-chained-call": ["error"],
    "vue/no-multiple-template-root": "off",
    "vue/multi-word-component-names": "off",
    "vue/max-attributes-per-line": [1, {
      "singleline": 3,
      "multiline": 1
    }],
    "vue/no-empty-component-block": ["error"],
    "implicit-arrow-linebreak": 0,
    "no-underscore-dangle": 0,
    "no-else-return": 0,
    "no-unused-expressions": 0,
    "arrow-body-style": 0,
    "object-curly-newline": 0,
    "class-methods-use-this": 0,
    "function-paren-newline": 0,
    "linebreak-style": 0,
    "func-names": 0,
    "import/no-unresolved": 0,
    "import/prefer-default-export": 0,
    "no-param-reassign": [2, { "props": false }],
    "max-len": ["error", { "code": 300 }],
    "no-plusplus": 0,
    "vue/no-v-html": 0,
    "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }]
  }
}
