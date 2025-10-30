// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/lib/**',
            '**/.yarn/**',
            '**/tsconfig.tsbuildinfo',
            'eslint.config.js'
        ]
    },
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                sourceType: 'module'
            },
            globals: {
                ...globals.node,
                ...globals.jest
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin,
            prettier: prettierPlugin
        },
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts']
            }
        },
        rules: {
            semi: ['error', 'always'],
            strict: 'error',
            'no-console': 'warn',
            'comma-dangle': 'off',
            'no-unused-vars': 'off',
            'no-use-before-define': 'off',
            'array-callback-return': 'off',
            'spaced-comment': [
                'error',
                'always',
                {
                    markers: [
                        '!',
                        '?',
                        '*',
                        '//',
                        'todo',
                        'TODO',
                        'bug',
                        'BUG',
                        'hack',
                        'HACK',
                        'fixme',
                        'FIXME',
                        'xxx',
                        'XXX',
                        'fix',
                        'FIX',
                        'fixit',
                        'FIXIT',
                        '#region',
                        '#endregion'
                    ],
                    exceptions: ['-', '+']
                }
            ],
            'import/no-named-as-default': 'off',
            'import/order': [
                'error',
                {
                    'newlines-between': 'always-and-inside-groups',
                    groups: [
                        'builtin',
                        'external',
                        'parent',
                        'sibling',
                        'index',
                        'object'
                    ]
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
            ],
            '@typescript-eslint/no-empty-object-type': [
                'error',
                { allowInterfaces: 'always' }
            ],
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'prettier/prettier': [
                'error',
                {
                    semi: true,
                    singleQuote: true,
                    bracketSpacing: true,
                    arrowParens: 'avoid',
                    trailingComma: 'none',
                    printWidth: 80,
                    tabWidth: 4,
                    useTabs: false,
                    endOfLine: 'lf'
                }
            ]
        }
    }
);
