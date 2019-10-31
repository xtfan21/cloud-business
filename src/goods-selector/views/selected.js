import React, { useState, useCallback, useEffect } from 'react';
import RcTable from './rc-table';

import GoodsForm from './form';
import { Title } from './cell';
import { actionTypes } from '../reducer';
import { sliceData, genGridConf } from '../utils';
import { useGoodsContext } from '../context';
import { useFirstRender } from '../hooks';

const GRID_NAME = 'selected-goods-table';

function genColumnData(dispatch, state, query) {
	return [
		{
            key: 'name',
			text: '商品',
            align: 'left',
            width: '200px',
            template(value, row) {
                return <Title row={row} state={state} dispatch={dispatch} highlight={query.name}/>
            }
		}, {
			key: 'id',
			text: '商品ID',
			align: 'left'
		}, {
			key: 'quantity',
			text: '库存',
			align: 'left',
			template: quantity => { return `<span>${quantity || '--'}件</span>` }
		}, {
			key: 'price',
			text: '价格',
			align: 'left',
			template: price => { return `<span>￥${price}</span>`}
		}, {
			key: 'outerId',
			text: '商家编码',
			align: 'left'
        },{
            key: 'op',
            text: '操作',
            align: 'left',
            template(value, row) {
                function remove() {
                    dispatch({
                        type: actionTypes.REMOVE_SELECTED,
                        data: row
                    });
                }
                return <span className="table-link" alt="" onClick={remove}>移除</span>
            }
        }
	];
}

export default function GoodsSelected(props) {
    const { limit, platShopList, platShopValue, skusAble } = props;

    const { state, dispatch } = useGoodsContext();
    const { selectedGoods } = state;

    const [data, setData] = useState(() => sliceData(selectedGoods, 20, 1));
    const pageData = data.data;

    const [loading, setLoading] = useState(true);

    const [query, setQuery] = useState({ ...platShopValue, pageSize: 20, pageNum: 1 }); // 搜索条件,包含分页

    const firstRender = useFirstRender(true);

    useEffect(() => {
        if (firstRender)  return () => {};
        const { pageSize, pageNum } = query;
        
        setLoading(true);
        const newData = sliceData(selectedGoods, pageSize, pageNum, query);
        setData(newData);
        setLoading(false);

        // selected data
        if (RcTable.get(GRID_NAME).rendered) {
            RcTable.setCheckedData(GRID_NAME, state.selectedGoods);
        }
        return () => {};
    }, [query, selectedGoods]);

    function handleRemoveAll() {
        dispatch({
            type: actionTypes.CLEAR_SELECTED
        });
    }

    function handleRemovePage() {
        dispatch({
            type: actionTypes.REMOVE_SELECTED,
            data: pageData
        });
    }

    const handleSearch = useCallback(params => {
        setQuery({ ...query, ...params });
    }, []);

    function pageChange(qs) {
        const { pageSize, pageNum } = qs;
        setQuery({ ...query, pageSize, pageNum });
    }

    const columnData = genColumnData(dispatch, state, query);
    const gridConf = genGridConf(limit, { supportTreeData: skusAble });
    const newGridConf = {
        ...gridConf,
        treeConfig: {
            ...gridConf.treeConfig,
            openState: true
        }
    }

    return (
        <>
            <GoodsForm onSearch={handleSearch} platShopList={platShopList} platShopValue={platShopValue}/>
            
            <div className="goods-table">
                <div className="goods-table-batch">
                    <span className="accent-color" onClick={handleRemoveAll}>移除全部</span>
                    &nbsp;&nbsp;
                    <span className="accent-color" onClick={handleRemovePage}>移除当页</span>
                </div>
                <RcTable
                    {...newGridConf}
                    gridManagerName={GRID_NAME}
                    data={data} 
                    loading={loading}
                    onPageChange={pageChange}                   
                    columnData={columnData}/>
            </div>
        </>
    );
}