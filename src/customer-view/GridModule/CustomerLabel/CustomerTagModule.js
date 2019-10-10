/**
 * 自定义客户表器
 * CustomerTagModule
 * wangbo
 * 2019/10/17
 */
import React  from 'react';
import { Message, Icon, Modal } from 'cloud-react';
import store from '../../store';
import CustomerViewContext from '../../context';

class CustomerTagModule extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.state = {
            cloudTagList: [],
            defineTagList: [],
            canSelectedTagList: [],
            visibleModal: false
        };
    }

    componentDidMount() {
        this.getMarkedCloudTagList();
        this.getMarkedDefineTagList();
        this.getCanSelectedTagList();
    }

    /**
     * 获取已打标的云标签列表
     */
    getMarkedCloudTagList = () => {
        store.getCustomerMarkedTagList(this.context.uniId, 0).then(res => {
            this.setState({
                cloudTagList: res.data
            })
        }).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        })
    };

    /**
     * 获取已打标的自定义标签列表
     */
    getMarkedDefineTagList = () => {
        store.getCustomerMarkedTagList(this.context.uniId, 1).then(res => {
            this.setState({
                defineTagList: res.data
            })
        }).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        })
    };

    /**
     * 获取可选择打标的标签列表
     */
    getCanSelectedTagList = () => {
          store.getCustomerCanSelectTagList().then(res => {
              this.setState({
                  canSelectedTagList: res.data
              })
          }).catch(err => {
              Message.error(err.message || '内部错误，请联系数据客服');
          });
    };

    /**
     * 新建或编辑标签
     */
    openTagModal = () => {
        this.setState({
            visibleModal: true
        });
        console.log(this.state.canSelectedTagList);
    };

    /**
     * 删除标签
     */
    deleteTag = (tagId) => {
        console.log(tagId);
        Modal.confirm({
            body: '确认删除该标签吗?',
            onOk: () => {
                store.DeleteCustomerDefineTag(this.context.uniId, tagId).then(() => {
                    const tmp = this.state.defineTagList;
                    const newTagList = tmp.filter(item => {
                        return item.tagId !== tagId;
                    });
                    this.setState({
                        defineTagList: newTagList
                    })
                }).catch(err => {
                    Message.error(err.message || '内部错误，请联系数据客服');
                })
            },
            onCancel: () => {}
        });
    };

    /**
     * 保存按钮
     */
    handleOkModal = () => {
        this.handleCloseModal();
    };

    /**
     * 关闭按钮
     */
    handleCloseModal = () => {
        this.setState({
            visibleModal: false
        });
    };

    render() {
        return (
            <div className="marked-tag-area">
                <ul className="cloud-area">
                    <li className="tag-type-label">云标签：</li>
                    {
                        this.state.cloudTagList.map(cloudTagItem => {
                            return (
                                <li key={cloudTagItem.tagId} className="cloud-tag-item">
                                    {cloudTagItem.tagName}：
                                    {
                                        // eslint-disable-next-line no-nested-ternary
                                        (cloudTagItem.valueType === 2 || cloudTagItem.valueType === 4) ? cloudTagItem.tagValue.join('、') : (cloudTagItem.valueType === 0) ? cloudTagItem.tagValue[0] : cloudTagItem.tagValue
                                    }
                                </li>
                            );
                        })
                    }
                </ul>
                <ul className="define-area">
                    <li className="tag-type-label">自定义标签：</li>
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                    <li className="add-tag" onClick={this.openTagModal}><Icon type="question-circle-solid"/>打标签</li>
                    {
                        this.state.defineTagList.map(defineTagItem => {
                            return (
                                <li key={defineTagItem.tagId} className="define-tag-item">
                                    <span className="define-tag-name">
                                        {defineTagItem.tagName}：
                                        {
                                            // eslint-disable-next-line no-nested-ternary
                                            (defineTagItem.valueType === 2 || defineTagItem.valueType === 4) ? defineTagItem.tagValue.join('、') : defineTagItem.valueType === 0 ? defineTagItem.tagValue[0] : defineTagItem.tagValue
                                        }
                                    </span>
                                    <Icon type="close" onClick={() => this.deleteTag(defineTagItem.tagId)}/>
                                </li>
                            );
                        })
                    }
                </ul>
                <Modal
                    title="basic title"
                    visible={this.state.visibleModal}
                    onOk={this.handleOkModal}
                    onCancel={this.handleCloseModal}
                    onClose={this.handleCloseModal}>
                    hello, this is a body content
                </Modal>
            </div>
        );
    }
}

export default CustomerTagModule;
