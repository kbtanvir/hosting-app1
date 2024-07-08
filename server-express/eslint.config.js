import eslint from '@antfu/eslint-config'

export default eslint({
  stylistic: {
    // semi: false,
  },
  typescript: {
    overrides: {
      'ts/no-explicit-any': 'off',
    },
  },
})
