import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'cloud-react';
import ShopSelectorForm from '../form';
import store from '../store';


/**
 * 分页处理
 * @param dataList
 * @param pageSize
 * @param rawPageNum
 * @returns {{data: *, pageSize: *, pageNum: number, totalCount: *, totalPage: number}}
 */
function sliceData(dataList, pageSize, rawPageNum) {
	const totalCount = dataList.length;
	const totalPage = Math.ceil(totalCount / pageSize);
	const pageNum = Math.min(rawPageNum, totalPage);
	const data = dataList.slice((pageNum - 1) * pageSize, pageNum * pageSize);

	return { data, pageSize, pageNum, totalCount, totalPage };
}


export default class SelectedShopTable extends Component {
	constructor(props) {
		super(props);

		const { channel } = this.props;
		this.channel = channel.channelList;
		this.shopTypeList = channel.shopTypeList;


		this.gridManagerName = 'shopSelectedGrid';
		this.params = null;
		this.firstStatus = true;

		this.firstLoading = true;

	}

	componentDidUpdate() {

		// 是否初始化渲染表格
		if (Table.get(this.gridManagerName).rendered) {
			Table.refreshGrid(this.gridManagerName);

			if (this.params) {
				this.onSearch(this.params);
			}
		}

	}

	/**
	 * 前端过滤搜索
	 * @param params
	 */
	onSearch = params => {
		this.params = params;

		if (this.props.selectedShops) {
			const list = JSON.parse(JSON.stringify(this.props.selectedShops));

			const form = params;
			const methods = this.filterSearchMethods();

			// 开始过滤
			list.forEach(entity => {
				const buf = [];

				Object.keys(form).forEach(field => {
					if (field === 'channel' || field === 'type') {
						buf.push(methods.equal(form[field], entity[field]));
					} else if (field === 'sign') {
						const group = ['name', 'id'];
						buf.push(methods.fuzzySearchGroup(group, form[field], entity));
					}
				});

				// eslint-disable-next-line
				entity.isHide = buf.indexOf(false) !== -1;
			});

			this.filterShopList = list.filter(item => !item.isHide);

			Table.setAjaxData(this.gridManagerName, { list: this.filterShopList, totals: this.filterShopList.length });
		}
	};

	filterSearchMethods = () => {
		return {
			// 判断两个字符串是否相等
			// 渠道 channel; 店铺类型 type
			equal: (formVal, val) => {
				return !formVal && formVal !== 0 || String(formVal).replace(/\s/g, '') === String(val);
			},
			// 返回多个条件过滤后的并集
			fuzzySearchGroup: (group, formVal, entity) => {

				const buf = [];
				group.forEach(item => {
					buf.push(!formVal && formVal !== 0 || String(entity[item]).replace(/\s/g, '').search(String(formVal)) !== -1);
				});
				return buf.indexOf(true) !== -1;
			}
		};
	};

	/**
	 * 移除单个店铺
	 * @param action
	 * @param row
	 * @returns {Function}
	 */
	onRemoveHandle = (action, row) => {
		return () => {
			const { selectedShops } = this.props;

			const newList = selectedShops.filter(item => item.id !== row.id);
			this.props.onChecked(newList);
			Table.refreshGrid(this.gridManagerName);
		};
	};

	/**
	 * 移除全部
	 */
	onRemoveAll = () => {
		this.props.onChecked([]);

		Table.refreshGrid(this.gridManagerName);
	};

	/**
	 * 移除当前页
	 */
	onRemovePage = () => {
		const { selectedShops } = this.props;

		const data = this.pageData.data.map(item => item.id);

		const selectedShopList = selectedShops.filter(item => {
			return data.indexOf(item.id) === -1;
		});
		this.props.onChecked(selectedShopList);

		Table.refreshGrid(this.gridManagerName);

	};

	ajaxData = setting => {
		const { selectedShops = [] } = this.props;

		this.pageData = sliceData(selectedShops, setting.pageData.pageSize, setting.pageData.pageNum);
		return Promise.resolve({ list: this.pageData.data, totals: this.pageData.totalCount });
	};

	ajaxSuccess = () => {
		const { selectedShop, isOpenSelectedTab, serverName } = this.props.option;
		const { selectedShops } = this.props;

		if (this.firstStatus && selectedShop.length) {
			const query = {
				tenantName: this.props.tenantId,
				shopIdIn: selectedShop.toString()
			};
			// 默认显示传来的已选店铺
			store.getShopList({ query, serverName }).then(res => {

				// 默认tab为全部店铺，数据从全部店铺的已选中拿
				const defaultSelected = isOpenSelectedTab ? res.list : selectedShops;

				this.props.onChecked(defaultSelected);
				this.firstStatus = false;
			});
		}
	};

	/**
	 * 已选店铺配置项
	 */
	genColumnData = () => {
		return [
			{
				key: 'id',
				text: '店铺ID',
				align: 'center'
			},
			{
				key: 'name',
				text: '店铺名称',
				align: 'center',
				template: (name, row) => {
					return <Tooltip content={row.name} placement="top-left">
						<span>{row.name}</span>
					</Tooltip>;
				}
			},
			{
				key: 'channelName',
				text: '平台',
				align: 'center',
				template: (channelName, row) => {
					const name = this.channel.filter(item => item.id === row.channel);
					return <span>{name[0] ? name[0].name : '--'}</span>
				}
			},
			{
				key: 'typeName',
				text: '店铺类型',
				align: 'center',
				template: (typeName, row) => {
					const shopTypeName = this.shopTypeList[0].values.filter(item => item.id === row.type);
					return <span> {shopTypeName[0] && shopTypeName[0].name ? shopTypeName[0].name : '--'} </span>
				}
			},
			{
				key: 'address',
				text: '店铺详细地址',
				align: 'center',
				template: (name, row) => {
					return <Tooltip content={row.address} placement="top-left">
						<span>{row.address ? row.address : '---'}</span>
					</Tooltip>;
				}
			},
			{
				key: 'action',
				text: '操作',
				align: 'center',
				template: (name, row) => {
					return <span className="row-remove" onClick={this.onRemoveHandle(name, row)}>移除</span>;
				}
			}
		];
	};


	render(){
		const { option } = this.props;

		return (
			<div>
				<ShopSelectorForm option={option} formFlag={false} selectedSearchParams={this.onSearch} channelList={this.channel}/>
				{ !option.isSingleSelected ? <div className="selected-operation">
					<span className="remove" onClick={this.onRemoveAll}>移除全部</span>
					<span className="remove remove-page" onClick={this.onRemovePage}>移除当页</span>
				</div> : <></>}

				<Table
					gridManagerName={this.gridManagerName}
					height="calc(380px)"
					ajaxData={this.ajaxData}
					ajaxSuccess={this.ajaxSuccess}
					columnData={this.genColumnData()}
					supportAjaxPage
					supportAutoOrder={false}
					firstLoading={this.firstLoading}
					currentPageKey="pageNum"
					pageSizeKey="pageSize"
					dataKey="list"  // 指定返回数据列表的key键值
					totalsKey="totals"  // 指定返回数据总条数的key键值
					disableLine  // 配置是否禁用单元格分割线
					supportCheckbox={false}
				/>
			</div>
		);
	}
};

SelectedShopTable.proTypes = {
	selectedShops: 	PropTypes.array,
	tenantId: PropTypes.string,
	onChecked: PropTypes.func,
	option: PropTypes.object
};

