/**
 * 账号信息组件
 * AccountInfoModule
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Message, Tooltip } from 'cloud-react';
import { PLAT_LIST } from '../constant';

class AccountInfoModule extends React.Component {
    render() {
        const { uniId, platAccountList } = this.props;
        return (
            <div className="account-info-area">
                <label className="uniId-label">
                    <span>全渠道ID：</span>
                    <Tooltip content={uniId}>
                        <CopyToClipboard text={uniId} onCopy={() => {Message.success('复制成功')}}>
                            <span className="account-name">{uniId}</span>
                        </CopyToClipboard>
                    </Tooltip>
                </label>
                {
                    platAccountList.map(item => {
                        return (
                            <span key={item.platCode} className="account-info-area-label">
                                {
                                    PLAT_LIST.map(i => {
                                        return (
                                            <label key={i.plat} className={item.platCode !== i.plat ? 'hideLabel' : ''}>
                                                {i.name}：
                                                <Tooltip content={item.platAccount}>
                                                    <CopyToClipboard text={item.platAccount} onCopy={() => {Message.success('复制成功')}}>
                                                        <span>{item.platAccount}</span>
                                                    </CopyToClipboard>
                                                </Tooltip>
                                            </label>
                                        );
                                    })
                                }
                            </span>
                        );
                    })
                }
            </div>
        );
    }
}

export default AccountInfoModule;
