const {
    resolve
} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''
module.exports = (options = {}) => ({
    entry: {
        // index: './src/index.ts',
        panel: './src/views/panel/index.ts',
        admin: './src/views/admin/index.ts'
    },
    output: {
        path: resolve(__dirname, 'dist', 'static', 'views'),
        filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
        chunkFilename: '[id].js?[chunkhash]',
        // publicPath: publicPath
        publicPath: options.dev ? '/assets/' : publicPath
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: ['vue-loader']
            },
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
        // new HtmlWebpackPlugin({
        //     filename: 'admin.html',
        //     template: 'src/views/admin/index.html'
        // }),
        // new HtmlWebpackPlugin({
        //     filename: 'panel.html',
        //     template: 'src/views/panel/index.html'
        // })
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
        // contentBase: 'dist/static/',
        proxy: {
            // "http://localhost:8010/socket.io/*": { target: "http://localhost:8088/ws", ws: true, },
            // "*proxy*": "http://localhost:8088/proxy",
            // '/socket.io/*': {
            //     target: 'ws://localhost:8088/ws',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '/socket.io': '/ws'
            //     },
            //     // ws: true,
            // },
        },
        historyApiFallback: {
            // rewrites: [
            //     { from: /^\/admin\/?$/, to: 'dev/admin.html' },
            //     { from: /^\/panel\/?$/, to: 'dev/panel.html' }
            // ],
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname
        }
    },
    devtool: options.dev ? '#eval-source-map' : '#source-map'
})