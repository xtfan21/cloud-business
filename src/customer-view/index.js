/**
 * Index
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'cloud-react';
import './index.less';
import InfoModule from './InfoModule/index';
import GridModule from './GridModule/index';
import CustomerViewContext from './context';

const noop = () => {};

class CustomerView extends React.Component {
    render() {
        const { visible, onClose, uniId, serverName, domain } = this.props;
        return (
                <Modal
                    hasFooter={false}
                    visible={visible}
                    onClose={onClose}
                    title="客户视图">
                    <CustomerViewContext.Provider value={{ uniId, serverName, domain }}>
                        <div className="customer-view-area">
                            <InfoModule/>
                            <GridModule />
                        </div>
                    </CustomerViewContext.Provider>
                </Modal>
        );
    }
}

CustomerView.defaultProps = {
    visible: false,
    serverName: 'https://qa-ual.shuyun.com',
    domain: 'data-manage-x/1.0',
    onClose: noop
};

CustomerView.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    serverName: PropTypes.string,
    domain: PropTypes.string,
};

export default CustomerView;
