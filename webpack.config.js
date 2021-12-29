const path = require('path');
const {CleanWebpackPlugin}      = require('clean-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const OptimisizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin              = require('terser-webpack-plugin');
const CopyPlugin                = require('copy-webpack-plugin');
const ImageMinPlugin            = require('imagemin-webpack-plugin').default;

/**
 * Base webpack configuration
 * 
 * @param env -> evn parameters
 * @param argv -> CLI arguments, 'argv.mode' is the current webpack mode (development | production)
 * @requires object
 */

module.exports = (env, argv) => {
    let isProduction = (argv.mode = 'production');

    let config = {
        // absolute path the base directory
        context: path.resolve(__dirname, "development"),

        // entry files to compile (relative to the base dir)
        entry: [
            "./js/app.js",
            "./scss/app.scss"
        ],

        // enable development source maps
        // * will be overwritten by 'source-maps' in production mode
        devtool: "inline-source-map",

        // path to store compiled JS bundle
        output: {
            // bundle relative name
            filename: "js/app.js",
            
            // base build directory
            path: path.resolve(__dirname, 'dist'),

            // path to build relative asset links
            publicPath: ""
        },

        // plugins configurations
        plugins: [
            // save compiled SCSS into separated CSS file
            new MiniCssExtractPlugin({
                filename: "css/app.css"
            }),

            // copy static assets directory
            new CopyPlugin({
                patterns: [
                    {from: 'static', to: 'static'},
                    {from: 'index.html', to: 'index.html'},
                ]
            }),

            // image optimization
            new ImageMinPlugin({
                disable: !isProduction,
                test: /\.(jpe?g|png|gif)$/i,
                pngquant: {quality: '70-85'},
                optipng: {optimizationLevel: 9}
            })
        ],

        // production mode optimization
        optimization: {
            minimizer: [
                // CSS optimizer
                new OptimisizeCSSAssetsPlugin(),

                // JS optimizer by default
                new TerserPlugin(),
            ],
        },

        // custom loaders configuration
        module: {
            rules: [
                // styles loader
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ],
                },

                // images loader
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        'file-loader',
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                },
                                // optipng.enabled: false will disable optipng
                                optipng: {
                                    enabled: false,
                                },
                                pngquant: {
                                    quality: [0.65, 0.90],
                                    speed: 4
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                // the webp option will enable WEBP
                                webp: {
                                    quality: 75
                                }
                            }
                        },
                    ],
                },

                // fonts loader
                {
                    test: /\.(woff|woff2|eot|tff|otf)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "fonts/[name].[ext]"
                            }
                        },
                    ],
                },

                // svg inline 'data:image' loader
                {
                    test: /\.svg$/,
                    loader: "svg-url-loader"
                },
            ]
        }
    };

    // PRODUCTION ONLY configuration
    if(isProduction) {
        config.plugins.push(
            // clean 'disk' directory
            new CleanWebpackPlugin()
        )
    }

    return config;
};