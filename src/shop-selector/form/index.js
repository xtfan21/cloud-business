import React, { Component } from 'react';
import { Input, Button, Select } from 'cloud-react';

import './index.less';

export default class shopSelectorForm extends Component {

	constructor(props) {
		super(props);
		this.channelList = this.props.channelList;
		this.channelList.forEach(item => {
			const { filter } = item;
			if (item.id === 'offline') {
				this.typeList = filter[0].values;
				this.typeList = this.typeList.map(type => ({ id: parseInt(type.id, 10), name: type.name }));
				this.typeList.unshift({ id: '', name: '不限' });
			}
		});

		this.state = {
			shopValue: undefined,
			channel: undefined,
			shopType: undefined,
		};
	}


	/**
	 * 店铺数据
	 * */
	handleChange = event => {
		this.setState({
			shopValue: event.target && event.target.value,
		});
	};

	/**
	 * 平台数据
	 * */
	handlePlatformChange = value => {
		this.setState({
			channel: value
		});

		const { formFlag } = this.props;

		if (formFlag) {
			this.props.channel(value);
		}
	};

	/**
	 * 店铺类型
	 * */
	handleTypeChange = value => {
		this.setState({
			shopType: value
		})
	};

	/**
	 * 搜索
	 * */
	handleSearch = () => {
		this.params = {
			sign: this.state.shopValue, // 店铺
			channel: this.state.channel, // 平台
			type: this.state.shopType // 店铺类型
		};

		const { formFlag } = this.props;
		if (formFlag) {
			this.props.searchParams(this.params);
		} else {
			this.props.selectedSearchParams(this.params);
		}
	};

	/**
	 * 重置
	 * */
	handleReset = () => {
		this.setState({
			shopValue: '',
			channel: '',
			shopType: ''
		});
	};

	/**
	 * 处理从外部传入的平台
	 * */
	filterPlatform = (list, platform) => {
		const result = [];
		list.forEach(data => {
			platform.forEach(item => {
				if (item === data.id) {
					result.push(data);
				}
			})
		});
		if (platform.length === 1) {
			// 传入一个平台时，只显示该平台
			this.state.channel = result[0].id;
		} else {
			result.unshift({ id: '', name: '不限' });
		}
		return result;
	};

	render() {
		// option -> 外部传入的平台等参数 formFlag -> 防止console.warn提示第二遍
		const { option, formFlag } = this.props;

		// 若为从外部传入是否支持配置平台，则默认支持平台
		const isSupportedChannel = option.isSupportedChannel === undefined ? true : option.isSupportedChannel;

		let { platform } = option;

		const { Option } = Select;

		// 是否有平台从外部传入
		this.channelList = platform ? this.filterPlatform(this.channelList, platform) : this.channelList;
		const { channel } = this.state;

		// 当平台为线下时，显示店铺类型下拉
		const shopTypeStyle = channel !== 'offline' ? { display: 'none' } : {};

		// 用户传入是否支持平台, 默认支持
		const platformStyle = (isSupportedChannel === undefined) || isSupportedChannel ? {} : { display: 'none' };

		// 已配置不支持平台，但是仍然传递了平台数据
		if (!isSupportedChannel && platform && formFlag) {
			platform = null;
			console.warn('您已配置不支持平台，但是平台参数不为空');
		}


		return (
			<section className="shop-form">
				<div className="shop-form-item" style={platformStyle}>
					<span className="shop-item-label">平台：</span>

					<Select
						value={channel}
						className="shop-form-input selector-background"
						onChange={this.handlePlatformChange}
					>
						{this.channelList.map(item => (
							<Option value={item.id} key={item.id}>
								{item.name}
							</Option>
						))}

					</Select>

				</div>

				<div className="shop-form-item" style={shopTypeStyle}>
					<span className="shop-item-label">店铺类型：</span>
					<Select
						className="shop-form-input selector-background"
						value={this.state.shopType}
						onChange={this.handleTypeChange}>
						{
							this.typeList.map(item => (
								<Option value={item.id} key={item.id}>
									{item.name}
								</Option>

							))
						}
					</Select>
				</div>

				<div className="shop-form-item">
					<span className="shop-item-label">店铺名称：</span>
					<Input size="default"
						   className="shop-form-input"
						   placeholder="请输入店铺名称/ID"
						   value={this.state.shopValue}
						   onChange={this.handleChange}/>
				</div>

				<div className="shop-form-search">
					<Button type="primary" onClick={this.handleSearch} className="search-btn">搜索</Button>
					<Button type="normal" onClick={this.handleReset}>重置</Button>
				</div>
			</section>
		)
	}
}
