import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Checkbox, Message } from 'cloud-react';
import { CellCheck } from './cell';
import BatchAdd from './batch-add';
import RcTable from './rc-table';

import Store from '../store';
import GoodsForm from './form';
import { useGoodsContext } from '../context';
import { actionTypes } from '../reducer';
import { highlighter, getMultiCheckedStatus, genGridConf } from '../utils';

const GRID_NAME = 'all-goods-table';

/**
 * 动态列生成
 * @param {*} ctx 
 */
function genColumnData(dispatch, state, query) {

	const common = [
		{
			key: 'name',
			text: '商品',
            align: 'left',
            width: '250px',
			template: (value, row) => {
				return <CellCheck row={row} dispatch={dispatch} state={state} keyword={query.name}/>;
			}
		},
		{
			key: 'id',
			text: '商品ID/SKU ID',
			align: 'left'
		},
		{
			key: 'quantity',
			text: '库存',
			align: 'left',
			template: quantity => <span>{quantity || '--'}件</span>
		},
		{
			key: 'price',
			text: '价格',
            align: 'left',
			template: price => <span>￥{price}</span>
		},
		{
			key: 'outerId',
			text: '商家编码',
            align: 'left',
            template: outerId => highlighter(outerId, query.outerId)
		}
    ];
    if (query.platCode.toUpperCase() === 'OFFLINE') {
        common.push({
            key: 'shop',
            text: '上架店铺',
            align: 'left',
            template: <span>商家店铺</span>
        });
    };
    return common;
}

/**
 * Main Component
 */
export default function GoodsAll(props) {
    const { limit, platShopList, platShopValue, dataHandler, batchAble, server, extraQuery, skusAble, selectedData } = props;
    const store = useMemo(() => Store.getInstance(server, extraQuery), [server, extraQuery]);

    const { dispatch, state } = useGoodsContext();

    const [data, setData] = useState({ data: [] }); 
    const pageData = data.data; // 当前页数据

    const [loading, setLoading] = useState(true); // 表格loading
    const [allData, setAllData] = useState([]); // 某条件下的全量数据

    const [query, setQuery] = useState({ ...platShopValue, pageSize: 20, pageNum: 1 }); // 搜索条件,包含分页
    const [batchVisible, setBatchVisible] = useState(false);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, []);

    useEffect(() => {
        // 表格数据
        setLoading(true);
        store.fetchGoods(query, dataHandler).then(res => {
            if (mounted.current) {
                setData(res);
                setLoading(false);
            }
        });

        // 全量数据（筛选条件）
        store.fetchGoods({ ...query, pageNum: 1, pageSize: null }, dataHandler).then(res => {
            if (mounted.current) {
                setAllData(res.data);
            }
        });
    }, [query]);

    useEffect(() => {
        // 已选商品数据
        async function handleSelected() {
            const id = Object.keys(selectedData);
            const res = await store.fetchGoods({ ...query, id, pageNum: null, pageSize: null }, dataHandler);
            // 如果有sku，且支持sku，则需要进一步进行sku替换。
            let rs = res.data;
            if (skusAble) {
                rs = rs.map(item => {
                    if (!item.skus) return item;
                    const selectedSkusId = selectedData[item.id];
                    const newSkus = item.skus.filter(sku => selectedSkusId.includes(sku.id));
                    return { ...item, skus: newSkus };
                });
            }

            dispatch({
                type: actionTypes.SET_SELECTED,
                data: rs
            });
        }

        handleSelected();
    }, [selectedData]); // 从组件外部传递进来的已选商品

    useEffect(() => {
        if (RcTable.get(GRID_NAME).rendered) {
            RcTable.setCheckedData(GRID_NAME, state.selectedGoods);
        }
    }, [state.selectedGoods]);

    function handlePageCheck(v) {
        dispatch({
            type: v ? actionTypes.ADD_SELECTED : actionTypes.REMOVE_SELECTED,
            data: pageData
        });
    }

    function handleAllCheck(v) {
        const contextContainer = document.body.querySelector('.modal-body');
        const opts = { duration: 0, contextContainer };

        if (pageData.length > allData.length) {
            return Message.error('正在获取全部商品，请稍后再点击。', opts);
        }

        if (allData.length >= limit) {
            return Message.error('已选商品数已达上限，不能继续选择。', opts);
        }
        return dispatch({
            type: actionTypes.SET_SELECTED,
            data: v ? allData : []
        });
    }

    const handleSearch = useCallback(params => {
        setQuery({ ...query, ...params }); // 这里可以做性能优化
    }, []);

    function pageChange(qs) {
        const { pageSize, pageNum } = qs;
        setQuery({ ...query, pageSize, pageNum });
    }

    function openBatch() {
        setBatchVisible(true);
    }
    function closeBatch() {
        setBatchVisible(false);
    }

    function ensureBatch(params) {
        const { platCode, shopId } = query;
        const search = { platCode, shopId, ...params };
        store.batchImport(search).then(importData => {

            dispatch({
                type: actionTypes.ADD_SELECTED,
                data: importData
            });
            dispatch({
                type: actionTypes.CHANGE_TAB,
                data: 'selected'
            });
            setBatchVisible(false);
        });
    }

    /**
     * renders
     */

    const columnData = genColumnData(dispatch, state, query);
    const checkedPage = useMemo(() => getMultiCheckedStatus(pageData, state.selectedGoods), [state, pageData]);
    const checkedAll = useMemo(() => getMultiCheckedStatus(allData, state.selectedGoods), [state, allData]);
    const gridConf = genGridConf(limit, { supportTreeData: skusAble });

    return (
        <>
            <GoodsForm onSearch={handleSearch} platShopList={platShopList} platShopValue={platShopValue}/>
            <div className="goods-table">
                <div className="goods-table-batch">
                    <Checkbox checked={checkedAll} onChange={handleAllCheck}>全选全部</Checkbox>
                    &nbsp;&nbsp;
                    <Checkbox checked={checkedPage} onChange={handlePageCheck}>全选当页</Checkbox>
                    { batchAble && <span className="batch-add" onClick={openBatch}>批量添加</span> }
                </div>
                <RcTable
                    {...gridConf}
                    gridManagerName={GRID_NAME}
                    data={data}
                    loading={loading}
                    onPageChange={pageChange}
                    columnData={columnData}/>
                <BatchAdd visible={batchVisible} onOk={ensureBatch} onClose={closeBatch}/>
            </div>
        </>
    );
}
