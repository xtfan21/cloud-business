import React, { Component } from 'react';
import { Table, Tooltip, Checkbox } from 'cloud-react';
import ShopSelectorForm from '../form';

import store from '../store';
import Tree from './offline-tree';


class AllShopTable extends Component {

	constructor(props) {
		super(props);

		const { searchParams, tenantId } = this.props;

		this.gridManagerName = 'shopAllGrid';
		this.pageSize = 20;

		this.firstStatus = true;

		this.channel = '';

		// 店铺类型
		this.shopTypeList = [];

		this.channelList();

		this.query = { ...searchParams, tenantName: tenantId };

		this.state = {
			treeData: [],
			channelType: null
		};

		// 所有店铺
		this.allShopList = [];

		// 区域下所有店铺
		this.reginAllShopList = [];

		// 当前页店铺数据
		this.currentShopList= [];

		this.reginId = null;

		this.fetchAllShopList(this.query);
		this.fetchTreeData();
	}

	componentDidUpdate() {
		const { selectedShops } = this.props;
		if (selectedShops !== undefined) {
			Table.setCheckedData(this.gridManagerName, selectedShops);
		}

		if (document.querySelector('.all-shops-List')) {
			Table.resetLayout(this.gridManagerName, '100%');
		}
	}

	componentWillUnmount() {
		Table.setCheckedData(this.gridManagerName, []);
		this.props.onSelect({ checkedList: undefined })
	}

	/**
	 * 搜索
	 * @param params
	 */
	onSearch = (params) => {
		const { tenantId } = this.props;

		if (params.channel === 'offline') {
			this.query = { ...params, tenantName: tenantId, regionId: this.reginId };
		} else {
			this.reginId = null;
			this.query = { ...params, tenantName: tenantId };
		}

		this.updateShopList();

		Table.setQuery(this.gridManagerName, this.query);
	};


	/**
	 * 平台下拉
	 * @param channel
	 */
	onChannel = channel => {
		this.setState({
			channelType: channel
		});
	};

	/**
	 * 选择线下区域树
	 * @param node
	 */
	onSelectTreeNode = node => {

		this.reginId = node.id;

		const { selectedShops } = this.props;

		const query = {
			...this.query,
			regionId: this.reginId
		};

		store.getShopList(query).then(res => {
			this.reginAllShopList = res.list;
			this.props.onSelect({
				checkedList: selectedShops
			});
			Table.setQuery(this.gridManagerName, query)
		});
	};


	/**
	 * 全选全部
	 * @param status
	 */
	onAllCheckedHandle = status => {

		const allShopData = this.reginId ? this.reginAllShopList : this.allShopList;
		this.checkedList = this.updateCheckedShopData(allShopData, status);

		this.props.onSelect({
			checkedList: this.checkedList
		});

		// 全选全部
		Table.setCheckedData(this.gridManagerName, this.checkedList);
	};

	/**
	 * 全选当页
	 * @param status
	 */
	onPageCheckedHandle = status => {
		this.checkedList = this.updateCheckedShopData(this.currentShopList, status);

		this.props.onSelect({
			checkedList: this.checkedList
		});
		// 全选当页
		Table.setCheckedData(this.gridManagerName, this.checkedList);
	};


	/**
	 * 通过店铺id获取店铺详情
	 * @param selectedShop
	 * @returns {Promise<*>}
	 */
	async getselectedShopDetail(idList) {
		const query = {
			tenantName: this.query.tenantName,
			shopIdIn: idList.toString()
		};
		const shopList = await store.getShopList(query);
		return shopList
	}

	/**
	 * 获取表格数据
	 * @param setting
	 * @param params
	 * @returns {Promise<*>}
	 */
	ajaxData = (setting, params) => {
		this.pageSize = params.pageSize;
		return store.getShopList(params).then(resData => {
			this.currentShopList = resData.list;
			return resData
		});
	};


	/**
	 * 多选
	 * @returns {Function}
	 */
	checkedHandler = () => {
		return checkedList => {
			const { selectedShops } = this.props;
			this.props.onSelect({
				checkedList
			});

			this.isAllChecked = this.allShopList.length === selectedShops && selectedShops.length;

			Table.setCheckedData(this.gridManagerName, checkedList);
		}
	};

	/**
	 * 表格配置项
	 * @returns {*[]}
	 */
	genColumnData = () => {
		return [
			{
				key: 'id',
				text: '店铺ID',
				align: 'center',
				width: '150px',
				template: (name, row) => {
					return <span>{row.id}</span>
				}
			},
			{
				key: 'name',
				text: '店铺名称',
				align: 'center',
				width: '150px',
				template: (name, row) => {
					return <Tooltip content={row.name} placement="top-left">
						<span>{row.name}</span>
					</Tooltip>
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
				width: '80px',
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
					</Tooltip>
				}
			}
		];
	};

	ajaxSuccess = () => {
		const { selectedShop } = this.props.option;
		const { selectedShops } = this.props;

		if (selectedShop.length && this.firstStatus) {

			// 默认显示传来的已选店铺
			this.getselectedShopDetail(selectedShop).then(res => {

				// 默认tab为已选店铺并且已选有数据，数据从已选拿
				const defaultSelected = selectedShops && selectedShops.length ? selectedShops : res.list;

				this.props.onSelect({
					checkedList: defaultSelected
				});
				Table.setCheckedData(this.gridManagerName, defaultSelected);
				this.firstStatus = false;
			});

		}
	};

	/**
	 * 禁用当前行选中
	 * @param row
	 * @returns {*}
	 */
	rowRenderHandler = row => {
		const { option } = this.props;

		// eslint-disable-next-line
		row.gm_checkbox_disabled = option.disabledRowIdList.includes(row.id);
		return row;
	};


	/**
	 * 全选操作更新店铺
	 * @param dataList
	 * @param status
	 */
	updateCheckedShopData(dataList, status) {
		const { selectedShops, option } = this.props;
		console.log(option.disabledRowIdList, '88888888');
		let checkedList = [];
		if (status) {
			// 合并数据，过滤重复项
			const shopList = dataList.concat(selectedShops);

			const newShopList = shopList.filter((item, index, self) => {
				return index === self.findIndex(t => (t.id === item.id))
			});
			checkedList = newShopList;
		} else {
			const data = dataList.map(item => item.id);

			// 过滤当前页
			const selectedShopList = selectedShops.filter(item => {
				return data.indexOf(item.id) === -1;
			});
			checkedList = selectedShopList;
		}

		checkedList = checkedList.filter(item => option.disabledRowIdList.find(item.id));
		console.log(checkedList, '=======');
		return checkedList
	}

	/**
	 * 搜索更新店铺数据
	 * @returns {Promise<void>}
	 */
	async updateShopList() {
		// 所有店铺数据
		await store.getShopList(this.query).then(res => {
			this.allShopList = res.list;
		});

		// 当前页面数据
		const currentPageQuery = { ...this.query, pageNum: 1, pageSize: this.pageSize };
		await store.getShopList(currentPageQuery).then(res => {
			this.currentShopList = res.list;
		});

		this.props.onSelect({
			checkedList: this.props.selectedShops
		});
	}


	/**
	 * 获取平台数据
	 * @returns {Promise<any>}
	 */
	async channelList() {
		this.channel = await store.fetchChannelData();
		this.channel.forEach(item => {
			if (item.filter.length) {
				this.shopTypeList = item.filter
			}
		});
	}


	/**
	 * 线下区域树数据
	 * @returns {Promise<T>}
	 */
	async fetchTreeData() {
		const data = await store.fetchRegionTree({ tenantName: this.query.tenantName });
		this.setState({
			treeData: data
		});
	}


	/**
	 * 获取所有店铺信息
	 */
	async fetchAllShopList (query) {
		const data = await store.getShopList(query);
		this.allShopList = data.list;
	};


	/**
	 * 更新选中状态
	 */
	updateCheckedStatus(pageData) {
		const { selectedShops } = this.props;
		if (selectedShops) {
			const checkedListId = selectedShops && selectedShops.map(item => item && item.id);
			const checkStatusList = checkedListId && pageData.map(item => checkedListId.includes(item.id));

			this.pageStatus = checkStatusList.every(item => (item === true)) && checkStatusList.length;
		}
		return this.pageStatus;
	};


	render() {
		const { channelType } = this.state;
		const { option } = this.props;

		const allShopData = this.reginId ? this.reginAllShopList : this.allShopList;
		this.isAllChecked = this.updateCheckedStatus(allShopData);

		this.currentPageChecked = this.updateCheckedStatus(this.currentShopList);

		const gridConf = {
			textConfig: {
				'checked-info': {
					'zh-cn': '<span class="table-footer-tips">已选：店铺（{0}）个</span>'
				}
			}
		};

		return (
			<div>
				<ShopSelectorForm option={option} formFlag searchParams={this.onSearch} channel={this.onChannel}/>
				<div className="all-shops-area">
					{
						channelType === 'offline' ? <Tree treeData={this.state.treeData} onSelectTree={this.onSelectTreeNode}/> : <></>
					}
					<div className={channelType === 'offline' ? 'all-shops-List' : ''}>
						{ !option.isSingleSelected ? <div className="all-shops-operation">
							<Checkbox className="check-all-selected" checked={this.isAllChecked} onChange={this.onAllCheckedHandle}>全选全部</Checkbox>
							<Checkbox className="check-page-selected" checked={this.currentPageChecked} onChange={this.onPageCheckedHandle}>全选当页</Checkbox>
						</div>: <></>
						}

						<Table
							{...gridConf}
							gridManagerName={this.gridManagerName}
							query={this.query}
							height="calc(380px)"
							ajaxData={this.ajaxData}
							columnData={this.genColumnData()}
							ajaxSuccess={this.ajaxSuccess}
							supportAutoOrder={false}
							supportAjaxPage
							currentPageKey="pageNum"
							pageSizeKey="pageSize"
							dataKey="list"  // 指定返回数据列表的key键值
							totalsKey="totals"  // 指定返回数据总条数的key键值
							disableLine  // 配置是否禁用单元格分割线
							checkedAfter={this.checkedHandler()}
							supportCheckbox
							useRadio={option.isSingleSelected}
							rowRenderHandler={this.rowRenderHandler}
						/>
					</div>
				</div>
			</div>

		)
	}
}

export default AllShopTable;
