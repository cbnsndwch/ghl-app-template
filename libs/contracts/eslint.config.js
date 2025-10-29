// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        ignores: [
            '**/node_modules/**',
            '**/lib/**',
            '**/*.json',
            'eslint.config.js',
            'eslint.config.*.js'
        ]
    },
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module'
            },
            globals: {
                node: true,
                browser: true,
                es6: true
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin,
            prettier: prettierPlugin
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json'
                }
            }
        },
        rules: {
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/prefer-for-of': 'warn',
            '@typescript-eslint/triple-slash-reference': 'error',
            '@typescript-eslint/unified-signatures': 'warn',
            'comma-dangle': 'off',
            'constructor-super': 'error',
            eqeqeq: ['warn', 'always'],
            'import/no-deprecated': 'warn',
            'import/no-extraneous-dependencies': 'error',
            'import/no-unassigned-import': 'warn',
            'no-cond-assign': 'error',
            'no-duplicate-case': 'error',
            'no-duplicate-imports': 'error',
            'no-empty': [
                'error',
                {
                    allowEmptyCatch: true
                }
            ],
            'no-invalid-this': 'error',
            'no-new-wrappers': 'error',
            'no-param-reassign': 'error',
            'no-redeclare': 'error',
            'no-sequences': 'error',
            'no-shadow': 'off',
            'no-throw-literal': 'error',
            'no-unsafe-finally': 'error',
            'no-unused-labels': 'error',
            'no-var': 'warn',
            'no-void': 'error',
            'prefer-const': 'warn',
            'prettier/prettier': ['error', {}, { usePrettierrc: true }]
        }
    }
);
