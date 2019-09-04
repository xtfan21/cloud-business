const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const buildOutputDir = path.join(__dirname, '../cloud-business-react-site');

const publicPath = '/';

module.exports = () => ({
	devtool: 'none',
	entry: {
		'app': './demos/index.js'
	},
	output: {
		path: buildOutputDir,
		publicPath,
		filename: '[name].js'
	},
	optimization: {
		minimizer: [
			new OptimizeCSSAssetsPlugin()
		]
	},
	plugins: [
		new CleanWebpackPlugin([buildOutputDir]),
		new MiniCssExtractPlugin({
			filename: '[name]-[hash:20].css',
			chunkFilename: '[name].[hash:20].css'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'demos/index.html'
		})
	]
});
