import React, { Component } from 'react';
import { Tree } from 'cloud-react';
import PropTypes from 'prop-types';

export default class OfflineTree extends Component {

	selectedNode = node => {
		this.props.onSelectTree(node);
	};

	render() {
		const { treeData } = this.props;
		return (
			<div className="tree-area">
				{ treeData.length ? <Tree
					treeData={treeData}
					onSelectedNode={this.selectedNode}>
				</Tree> : '' }
			</div>
		);
	}
}
OfflineTree.proTypes = {
	treeData: PropTypes.array,
	onSelectTree: PropTypes.func
};
