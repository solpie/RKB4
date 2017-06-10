const {
    resolve
} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''
module.exports = (options = {}) => ({
    entry: {
        // index: './src/index.js',
        index: './src/index.ts',
        panel: './src/views/panel/index.ts',
        admin: './src/views/admin/index.ts'
    },
    output: {
        path: resolve(__dirname, 'dist', 'static'),
        filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
        chunkFilename: '[id].js?[chunkhash]',
        publicPath: options.dev ? '/assets/' : publicPath
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: ['vue-loader']
            },
            // {
            //     test: /\.js$/,
            //     use: ['babel-loader'],
            //     exclude: /node_modules/
            // },
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        root: resolve(__dirname, 'src'),
                        attrs: ['img:src', 'link:href']
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /favicon\.png$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                }]
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                exclude: /favicon\.png$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ['vendor', 'manifest']
        // }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            '~': resolve(__dirname, 'src')
        }
    },
    devServer: {
        host: '127.0.0.1',
        port: 8010,
        overlay: true,
        proxy: {
            "http://localhost:8010/socket.io/*": { target: "http://localhost:8088", ws: true, },
            // '/socket.io/*': {
            //     target: 'ws://localhost:8088/',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '/socket.io': '/ws'
            //     },
            //     // ws: true,
            // },
        },
        historyApiFallback: {
            rewrites: [
                { from: /^\/admin\/?$/, to: 'src/views/admin/admin.html' }
            ],
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname
        }
    },
    devtool: options.dev ? '#eval-source-map' : '#source-map'
})