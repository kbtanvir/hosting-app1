import eslint from "@antfu/eslint-config";

export default eslint({
  stylistic: {
    // semi: false,
  },
  typescript: {
    overrides: {
      "ts/no-explicit-any": "off",
      "max-lines": 200,
      "max-line-length": [
        true,
        {
          "limit": 150,
          "ignore-pattern": "^import [^,]+ from |^export | implements",
        },
      ],
    },
  },
});
