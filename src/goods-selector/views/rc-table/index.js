import React, { useRef, useEffect } from 'react';
import { Table } from 'cloud-react';
import PropTypes from 'prop-types';

function RcTable(props) {

    const { data, gridManagerName, columnData, checkedList, onPageChange, onSortChange, loading, ...rest } = props;

    const dataRef = useRef(data);
    dataRef.current = data;

    const loadingRef = useRef(loading);
    loadingRef.current = loading;

    useEffect(() => {
        const { rendered } = Table.get(gridManagerName);
        if (rendered) {
            Table.refreshGrid(gridManagerName);
        }
    }, [data, gridManagerName, loading]);

    function ajaxData() {
        return new Promise(resolve => {
            // resolve(dataRef.current);
            if (!loadingRef.current) {
                resolve(dataRef.current);
            }
        });
    }

    return <Table
            gridManagerName={gridManagerName}
            columnData={columnData}
            pagingBefore={onPageChange}
            sortingBefore={onSortChange}
            ajaxData={ajaxData}
            {...rest}/>
}

RcTable.defaultProps = {
    loading: true,
    onPageChange: () => {},
    onSortChange: () => {}
};
RcTable.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.object.isRequired,
    gridManagerName: PropTypes.string.isRequired, 
    columnData: PropTypes.array.isRequired, 
    onPageChange: PropTypes.func,
    onSortChange: PropTypes.func
};

export default new Proxy(RcTable, {
    get(target, propKey) {
        const v = target[propKey];
        return v === undefined ? Table[propKey] : v;
    }
});