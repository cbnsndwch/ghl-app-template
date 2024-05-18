/**
 * @typedef {import('npm-check-updates').RunOptions} RunOptions
 */

/**
 * Options for `npm-check-updates`. See {@link https://www.npmjs.com/package/npm-check-updates#options}
 * for a full list of available options.
 *
 * @type {RunOptions}
 */
module.exports = {
    /**
     * The package manager you use. Can be `npm`, `yarn`, or `pnpm`.
     */
    packageManager: 'yarn',

    /**
     * Whether to run `npm-check-updates` in all workspace directories.
     */
    deep: true,

    /**
     * Put the names of packages you don't want NCU to suggest updates for here.
     */
    reject: ['eslint', 'conventional-changelog-cli']
};
