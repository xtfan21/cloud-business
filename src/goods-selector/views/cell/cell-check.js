import React from 'react';
import { Checkbox } from 'cloud-react';

import Title from './title';
import { actionTypes } from '../../reducer';
import { getCheckStatus } from '../../utils'

const rootStyle = { display: 'inline-block', verticalAlign: '-3px' };

export default function SpCell(props) {
    const { dispatch, state, row, keyword } = props;

    const handleChange = v => {
        const { ADD_SELECTED, REMOVE_SELECTED } = actionTypes;
        dispatch({
            type: v ? ADD_SELECTED : REMOVE_SELECTED,
            data: row
        });
    }

    const checked = getCheckStatus(row, state.selectedGoods);
    
    return (
        <div style={rootStyle}>
            <Checkbox checked={checked === true} onChange={handleChange} style={{ height: 30 }} indeterminate={checked==='indeterminate'}>
                <Title row={row} highlight={keyword}></Title>
            </Checkbox>
        </div>
    );
}