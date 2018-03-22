const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');
const path = require("path");
//
// fs.open('./build/env.js', 'w', function(err, fd) {
//     const buf = 'export default "development";';
//     fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
// });

module.exports = merge(webpackBaseConfig, {
    devtool: 'eval',
    output: {
        path: path.resolve(__dirname,'../dist'),
        publicPath: '/',
        filename: 'js/[name].js',
        // chunkFilename: 'js/[name].chunk.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname,'../dist'),
        //开发阶段，使用devServer将api请求代理到后台服务端口
        proxy: {

            "/": "http://localhost:1234",
            "/account": "http://localhost:1234",
            "/user": "http://localhost:1234",
            "/access": "http://localhost:1234",
            "/role": "http://localhost:1234",
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify("development")
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
            filename: 'index.html',
            template: './src/template/index.local.ejs',
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