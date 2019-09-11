import React, { useState } from 'react';
import { Tips, Input, Radio, Modal } from 'cloud-react';

const DATA_TYPES = {
    id: '商品ID',
    outerId: '商品商家编码',
    'skus.outerId': 'SKU商家编码'
};

const style = {
    marginTop: 17,
    marginBottom: 8
}

export default function BatchAdd(props) {
    const { visible, onOk, onClose } = props;

    const [dataType, setDataType] = useState('id');
    const [text, setText] = useState('');

    function changeType(v) {
        setDataType(v);
        setText('');
    }

    function changeText(e) {
        setText(e.target.value);
    }

    function handleAdd() {
        const rs = text.split('\n').map(item => item.trim());
        onOk({ [dataType]: rs });
    }

    function genPlaceholder(type) {
        const insertText = DATA_TYPES[type];
        return `请输入${insertText}，格式如下：\n${insertText}1\n${insertText}2`
    }
    
    return (
        <Modal 
            title="批量导入商品ID"
            visible={visible}
            onOk={handleAdd}
            onCancel={onClose}
            onClose={onClose}>
            <div className="batch-add-content">
                <Tips msg="将数据直接粘贴到文本框中，每行一条数据，最多可以输入198条。"></Tips>

                <div style={style}>
                    <Radio.Group value={dataType} onChange={changeType}>
                        { Object.entries(DATA_TYPES).map(([key, value]) => <Radio value={key} key={key}>{value}</Radio>) }
                    </Radio.Group>
                </div>
                
                <Input.Textarea className="batch-add-text" placeholder={genPlaceholder(dataType)} rows={12} value={text} onChange={changeText}/>
            </div>
        </Modal>
    );
}