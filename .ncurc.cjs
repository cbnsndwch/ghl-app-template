/**
 * Put the names of packages you don't want NCU to suggest updates for here.
 */
const reject = ['eslint', 'conventional-changelog-cli'];

/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
    packageManager: 'yarn',
    deep: true,
    reject
};
