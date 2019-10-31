import React from 'react';
import cls from 'classnames';
import { Tooltip } from 'cloud-react';

import { highlighter } from '../../utils';

function genDisplayName(row) {
    const { name, props } = row;
    if (name) return name;
    if (!props) return '';
    const result = props.reduce((acc, item) => {
        const { pname, vname } = item;
        const rs = `${pname}: ${vname.join(',')}`;
        return `${acc}；${rs}`;
    }, '');
    return result.startsWith('；') ? result.slice(1) : result;
}

function GoodsTitle(props) {
    const { row, highlight, className, style } = props;

    const name = genDisplayName(row);
    const highlightElement = highlighter(name, highlight);

    return (
        <Tooltip content={name}>
            <a className={cls('table-link', className)} target="_Blank" rel="noopener noreferrer"  href={row.detailUrl} style={style}>
                <img src={row.picUrl} alt=""/>
                <span className="goods-title" dangerouslySetInnerHTML={{ __html: highlightElement }}></span>
            </a>
        </Tooltip>
    );
}

export default React.memo(GoodsTitle);