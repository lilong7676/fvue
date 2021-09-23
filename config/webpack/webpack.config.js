const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const resolve = p => {
    return path.resolve(__dirname, '../../', p)
}

module.exports = {
    mode: 'development',
    entry: {
        vuefake: resolve('src/index.js')
    },
    output: {
        library: 'Vuefake',
        libraryTarget: 'umd',
        filename: 'vuefake.js',
        auxiliaryComment: 'vuefake',
        path: resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime'],
                        cacheDirectory: true,
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: resolve('index.html')})
    ],
}
