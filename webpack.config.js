const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const modeConfig = env => require(`./scripts/webpack.${env}`)(env);
const resolve = dir => path.resolve(__dirname, dir);

let env = null;
let type = null;
module.exports = ({ mode } = { mode: 'development' }) => {
	if (!env) {
		env = mode === 'site' ? 'development' : mode;
	}
	if (!type) {
		type = mode;
	}
	return webpackMerge(
		{
			mode: env,
			resolve: {
				alias: {
					'@docs': resolve('./docs'),
					'@src': resolve('./src'),
					'cloud-business': resolve('./src')
				},
				modules: [resolve(__dirname, './src'), 'node_modules'],
				extensions: ['.js']
			},
			resolveLoader: {
				modules: ['node_modules', path.join(__dirname, './scripts/loaders')],
				moduleExtensions: ['-loader']
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: ['babel', 'eslint']
					},
					{
						test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
						loader: 'url',
						options: {
							limit: 10000,
							name: '[name]-[hash:7].[ext]'
						}
					},
					{
						test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
						loader: 'url',
						options: {
							limit: 10000,
							name: '[name]-[hash:7].[ext]'
						}
					},
					{
						test: /\.(le|c)ss$/,
						use: ['style', 'css', 'less'],
						include: [resolve('src'), resolve('node_modules')]
					},
					{
						test: /\.(le|c)ss$/,
						use: [
							'style',
							{
								loader: 'css',
								options: {
									modules: true,
									camelCase: true,
									localIdentName: '[local]_[hash:base64:5]'
								}
							},
							'less'
						],
						include: resolve('demos')
					},
					{
						test: /\.js$/,
						loader: 'dynamic-docs-loader',
						options: {
							target: [
								{ path: resolve('./docs'), importPath: '@docs' },
								{ path: resolve('./src/'), importPath: '@src' },
							]
						},
						include: resolve('demos')
					},
					{
						test: /\.md$/,
						loader: 'markdown',
						options: {
							pattern: /#{1,6}\s+API/,
							insert: {
								before: true,
								value: '### 代码演示\n<div id="code-demo"></div>'
							}
						}
					},
					{
						test: /\.markdown$/,
						loader: ['babel', 'markdown-react'],
						include: path.resolve(__dirname, 'src')
					}
				]
			},
			plugins: [
				new webpack.DefinePlugin({
					'process.env.NODE_ENV': JSON.stringify(env)
				}),
				// 分析打包大小问题
				// new WebpackBundleAnalyzer(),
				new webpack.ProgressPlugin()
			]
		},
		modeConfig(type)
	);
};
