module.exports = {
    extends: "@dolittle/typescript",
    root: true,
    parserOptions: {
        project: './Sources/*/tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname
    }
};
