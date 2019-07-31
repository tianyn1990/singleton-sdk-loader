module.exports = (api) => {
    api.cache(true);
    return {
        plugins: [
            // https://www.babeljs.cn/docs/plugins/transform-runtime
            // http://troland.github.io/2018/02/08/babel-runtime-babel-preset-env-babel-plugin-transform-runtime-babel-polyfill-%E8%AF%A6%E8%A7%A3/
            [
                '@babel/plugin-transform-runtime',
                // {
                //     "useESModules": true
                // },
            ],
        ],
        presets: [
            [
                // https://babeljs.io/docs/en/babel-preset-env
                // https://www.babeljs.cn/docs/plugins/preset-env/
                '@babel/preset-env',
                {
                    targets: [
                        '> 0.25% in CN',
                        'last 2 versions',
                        'ios >= 6',
                        'android >= 4',
                        "ie >= 9",
                        'not dead',
                    ],
                    // for uglifyjs...
                    forceAllTransforms: true,
                    /**
                        配合入口处的polyfill使用
                        将：import '@babel/polyfill';
                        按需("target"参数)转换为特定的polyfill
                    */
                    // useBuiltIns: 'entry',
                    useBuiltIns: 'usage',
                    debug: true,
                    // modules: 'commonjs', // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
                },
            ],
        ],
    };
};