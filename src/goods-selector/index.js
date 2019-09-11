import React, { useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tabs, Message } from 'cloud-react';

import { usePrevious } from './hooks';
import './index.less';
import AllGoods from './views/all';
import SelectedGoods from './views/selected';
import GoodsProvider from './context';
import reducer, { actionTypes } from './reducer';
import { genPlatShopValue } from './utils';

// import fakeOfflineShops from './data';

const noop = () => {};
const { Panel } = Tabs;

export default function GoodsSelector(props) {
    const {
        visible, batchAble, limit, activeTab, onCancel, onClose, onOk, skusAble, selectedData,
        server, extraQuery, dataHandler,
        platShopList, platShop
    } = props;

    const [state, dispatch] = useReducer(reducer, null, () => {
        return {
            activeTab,
            selectedGoods: [] // 关联全部商品中的选中，关联已选商品中的展示
        };
    });
    const ctxValue = { dispatch, state };
    const prevState = usePrevious(state);

    const platShopValue = useMemo(() => genPlatShopValue(platShopList, platShop), [platShopList, platShop]); // 店铺平台查询值

    useEffect(() => {
        if (state.selectedGoods.length > limit) {
            Message.error('已选商品数已达上限，不能继续选择。', { duration: 0 });
            dispatch({
                type: actionTypes.SET_SELECTED,
                data: prevState.selectedGoods
            });
        }
    }, [state]);

    function ok() {
        onOk(state.selectedGoods);
    }

    return (
        <Modal
            title="商品选择"
            visible={visible}
            onOk={ok}
            onClose={onClose}
            onCancel={onCancel}>
            <GoodsProvider value={ctxValue}>
                <Tabs className="goods-selector" activeKey={state.activeTab} mode="remain">
                    <Panel key="all" tab="全部商品" className="goods-selector-panel">
                        <AllGoods
                            skusAble={skusAble}
                            batchAble={batchAble}
                            selectedData={selectedData}
                            server={server}
                            extraQuery={extraQuery}
                            limit={limit} 
                            dataHandler={dataHandler}
                            platShopValue={platShopValue}
                            platShopList={platShopList} />
                    </Panel>
                    <Panel key="selected" tab="已选商品" className="goods-selector-panel">
                        <SelectedGoods 
                            skusAble={skusAble}
                            limit={limit}
                            platShopList={platShopList} 
                            platShopValue={platShopValue} />
                    </Panel>
                </Tabs>
            </GoodsProvider>
        </Modal>
    );
}

GoodsSelector.propTypes = {
    selectedData: PropTypes.object,
    visible: PropTypes.bool,
    skusAble: PropTypes.bool,
    batchAble: PropTypes.bool,
    server: PropTypes.string,
    dataHandler: PropTypes.func,
    extraQuery: PropTypes.object,
    limit: PropTypes.number,
    activeTab: PropTypes.oneOf(['all', 'selected']),
    platShop: PropTypes.object,
    platShopList: PropTypes.any,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    onOk: PropTypes.func
};
GoodsSelector.defaultProps = {
    selectedData: { '35647605646': null, '41898176511': '3180237725671' }, // { [id]: [skusId] }
    visible: false,
    skusAble: true,
    batchAble: true,
    server: 'https://qa-ual.shuyun.com',
    dataHandler: data => data,
    extraQuery: { tenant: 'qiushi6' },
    limit: 200,
    activeTab: 'selected',
    platShop: {
        platCode: 'uni_top', platName: '淘宝', shopId: '106878997', shopName: '数云食堂'
    }, // 默认选中的店铺平台
    platShopList:  [{
        platCode: 'uni_top', platName: '淘宝', shopId: '106878997', shopName: '数云食堂'
    }, {
        platCode: 'uni_top', platName: '淘宝', shopId: '70724306', shopName: '奥康皮具店'
    }, {
        platCode: 'uni_jos', platName: '京东', shopId: '54735', shopName: '361度官方旗舰店'
    }, {
        platCode: 'uni_youzan', platName: '有赞', shopId: '16263065', shopName: '野兽生活'
    }, {
        platCode: 'uni_offline', platName: '线下', shopId: '201809201497', shopName: 'online洽客小门店'
    }, {
        platCode: 'uni_offline', platName: '线下', shopId: '201809201576', shopName: '清远赢之城L——L2076301' 
    }, {
        platCode: 'uni_offline', platName: '线下', shopId: '201809201910', shopName: '线下测试店铺9301' 
    }, {
         platCode: 'uni_offline', platName: '线下', shopId: '2018092015072', shopName: '线下测试店铺9301'
    }],
    onCancel: noop,
    onClose: noop,
    onOk: noop
};