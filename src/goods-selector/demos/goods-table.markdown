---
title: 商品选择器表格
desc: 表格
---

````javascript
import React, { Component, useState } from 'react';

import GoodsSelector from 'cloud-business/goods-selector';
import { Button } from 'cloud-react';

export default function GoodsSelectorDemo() {
    const [visible, setVisible] = useState(false);

    function handleOpen() {
        setVisible(true);
    }

    function handleClose() {
        setVisible(false);
    }

    function handleOk(result) {
        handleClose();
        console.log(result);
    }

    return (
        <>
            <Button onClick={handleOpen}>打开商品选择器</Button>
            <GoodsSelector 
                visible={visible}
                onOk={handleOk}
                onClose={handleClose}
                onCancel={handleClose}/>
        </>
    );
}

````