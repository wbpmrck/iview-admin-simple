const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');
const path = require("path");

// fs.open('./build/env.js', 'w', function(err, fd) {
//     const buf = 'module.exports="development";';
//     fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
// });

module.exports = merge(webpackBaseConfig, {
    // devtool: '#source-map',
    devtool: 'eval',
    output: {
        path: path.resolve(__dirname,'../../back-end/app/static'),
        publicPath: `/`,
        filename: 'js/[name].js',
        // chunkFilename: 'js/[name].chunk.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: require('../config/test.env')
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'iView admin v' + package.version,
            filename: '../views/index.html',
            template: './src/template/index.ejs',
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/views/main-components/theme-switch/theme'
            },
            // {
            //     from: 'src/views/my-components/text-editor/tinymce'
            // }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        })
    ]
});