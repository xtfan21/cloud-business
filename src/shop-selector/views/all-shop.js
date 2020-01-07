import React, { Component } from 'react';
import { Table, Tooltip, Checkbox } from 'cloud-react';
import PropTypes from 'prop-types';
import ShopSelectorForm from '../form';
import store from '../store';
import Tree from './offline-tree';

class AllShopTable extends Component {

	constructor(props) {
		super(props);

		const { searchParams, tenantId, option, channel } = this.props;

		this.gridManagerName = 'shopAllGrid';
		this.pageSize = 20;

		this.firstStatus = true;

		this.channel = channel.channelList;
		this.shopTypeList = channel.shopTypeList;

		this.queryData = {
			serverName: option.serverName,
			query: { ...searchParams, tenantName: tenantId, channel: option.platform && option.platform.toString(), permissionType: option.permissionType }
		};

		this.state = {
			treeData: [],
			channelType: null,
			currentShopList: [] // 当前页店铺数据
		};

		// 所有店铺
		this.allShopList = [];

		// 区域下所有店铺
		this.reginAllShopList = [];

		this.reginId = null;

		this.fetchAllShopList(this.queryData);
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

	/**
	 * 搜索
	 * @param params
	 */
	onSearch = (params) => {
		const { tenantId, option } = this.props;

		const channelStr = !params.channel ? option.platform && option.platform.toString() : params.channel;

		if (params.channel === 'offline') {
			this.queryData.query = { ...params, tenantName: tenantId, regionId: this.reginId, channel: channelStr };
		} else {
			this.reginId = null;
			this.queryData.query = { ...params, tenantName: tenantId, channel: channelStr };
		}

		this.updateShopList();

		Table.setQuery(this.gridManagerName, this.queryData.query);

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

		const { selectedShops, option } = this.props;

		const query = {
			...this.queryData.query,
			regionId: this.reginId
		};

		store.getShopList({ query, serverName: option.serverName }).then(res => {
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
		this.checkedList = this.updateCheckedShopData(this.state.currentShopList, status);

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
	async getSelectedShopDetail(idList) {
		const { option, tenantId } = this.props;
		const query = {
			tenantName: tenantId,
			shopIdIn: idList.toString()
		};
		const shopList = await store.getShopList({ query, serverName: option.serverName });
		return shopList
	}

	/**
	 * 获取表格数据
	 * @param setting
	 * @param params
	 * @returns {Promise<*>}
	 */
	ajaxData = (setting, params) => {
		const { option } = this.props;
		this.pageSize = params.pageSize;
		return store.getShopList({ query: params, serverName: option.serverName }).then(resData => {
			this.setState({
				currentShopList: resData.list
			});
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
			this.getSelectedShopDetail(selectedShop).then(res => {

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
		const { option: { disabledRowIdList = [] } } = this.props;

		// eslint-disable-next-line
		row.gm_checkbox_disabled = disabledRowIdList.includes(row.id);
		return row;
	};


	/**
	 * 全选操作更新店铺
	 * @param dataList
	 * @param status
	 */
	updateCheckedShopData(dataList, status) {
		const { selectedShops, option } = this.props;
		const { disabledRowIdList = [], selectedShop } = option;

		let checkedList = [];
		if (status) {
			const newShopList = [];
			const shopIdList = {};

			// 合并数据，过滤重复项
			const shopList = dataList.concat(selectedShops);

			shopList.forEach((item) => {
				if(!shopIdList[item.id]) {
					newShopList.push(item);
					shopIdList[item.id] = true;
				}
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

		// 过滤禁选中的选中项
		const disabledShop = disabledRowIdList.filter(id => {
			return selectedShop.indexOf(id) === -1
		});

		// 过滤禁选店铺
		checkedList = checkedList.filter(item => disabledShop.indexOf(item.id) === -1);
		return checkedList
	}


	/**
	 * 搜索更新店铺数据
	 * @returns {Promise<void>}
	 */
	async updateShopList() {
		// 所有店铺数据
		await store.getShopList(this.queryData).then(res => {
			this.allShopList = res.list;
		});

		this.props.onSelect({
			checkedList: this.props.selectedShops,
			channel: this.channel,
			shopTypeList: this.shopTypeList
		});
	}


	/**
	 * 线下区域树数据
	 * @returns {Promise<T>}
	 */
	async fetchTreeData() {
		const { tenantId, option } = this.props;
		const query = {
			tenantName: tenantId,
			serverName: option.serverName
		};
		const data = await store.fetchRegionTree(query);
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
		const { selectedShops, option: { disabledRowIdList = [] } } = this.props;
		if (selectedShops) {
			// 过滤禁选店铺
			const _pageData = pageData.filter(item => disabledRowIdList.indexOf(item.id) === -1);

			const checkedListId = selectedShops && selectedShops.map(item => item && item.id);
			const checkStatusList = checkedListId && _pageData.map(item => checkedListId.includes(item.id));

			this.pageStatus = checkStatusList.length && !checkStatusList.includes(false);
		}
		return this.pageStatus;
	};



	render() {
		const { channelType, currentShopList } = this.state;
		const { option } = this.props;

		const allShopData = this.reginId ? this.reginAllShopList : this.allShopList;
		this.isAllChecked = this.updateCheckedStatus(allShopData);

		this.currentPageChecked = this.updateCheckedStatus(currentShopList);
		const gridConf = {
			textConfig: {
				'checked-info': {
					'zh-cn': '<span class="table-footer-tips">已选：店铺（{0}）个</span>'
				}
			}
		};

		return (
			<div>
				<ShopSelectorForm option={option} formFlag searchParams={this.onSearch} channel={this.onChannel} channelList={this.channel}/>
				<div className="all-shops-area">
					{
						channelType === 'offline' ? <Tree treeData={this.state.treeData} onSelectTree={this.onSelectTreeNode}/> : <></>
					}
					<div className={channelType === 'offline' ? 'all-shops-List' : ''}>
						{ !option.isSingleSelected ? <div className="all-shops-operation">
							<Checkbox className="check-all-selected" checked={this.isAllChecked} onChange={this.onAllCheckedHandle}>全选全部</Checkbox>
								<Checkbox className="check-page-selected" checked={this.currentPageChecked} onChange={this.onPageCheckedHandle}>全选当页
							</Checkbox>
						</div>: <></>
						}

						<Table
							{...gridConf}
							gridManagerName={this.gridManagerName}
							query={this.queryData.query}
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

AllShopTable.propTyes = {
	option: PropTypes.shape({
		isSingleSelected: PropTypes.bool,
		disabledRowIdList: PropTypes.array,
		serverName: PropTypes.string.isRequired
	}),
	channel: PropTypes.object,
	tenantId: PropTypes.string.isRequired,
	onSelect: PropTypes.func
};

AllShopTable.defaultProps = {
	option: {
		isSingleSelected: false,
		disabledRowIdList: [],
		serverName: ''
	},
	channel: {
		channelList: [],
		shopTypeList: []
	},
	tenantId: 'qiushi6',
	onSelect: () => {}
};
export default AllShopTable;
