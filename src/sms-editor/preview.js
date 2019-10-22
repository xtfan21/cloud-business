import React, { useContext } from 'react';
import SmsContext from './SmsContext';
import './index.less';

// 预览模拟🔋等效果
const Header = () => {
	return (
		<div className="preview-header">
			<span className="preview-battery"></span>
		</div>
	);
}

// 字数统计
const Counter = () => {

	const option = useContext(SmsContext);
	const { totalChars, newLineNumber, variableNumber } = option;

    return (
        <div className="preview-counter">
            <span className="preview-counter-number">{ totalChars }</span>个字（不含变量
			{
				newLineNumber > 0 &&
				<span>
					，含<span className="preview-counter-number">{ newLineNumber }</span>个换行符
				</span>
			}
			），
			<span className="preview-counter-number">{ variableNumber }</span> 个变量
        </div>
    );
}

// 预览tips提示信息
const Tips = () => {

	const option = useContext(SmsContext);
	const { gateway: { wordsLimit = 70, multiLimit = 67 }, isTrimSpace } = option;

	return (
		<div className="preview-tips">
			<p>
				1.当前通道单条短信字数限制 <span className="preview-warning">{ wordsLimit }</span> 个字；超出 { wordsLimit } 个字，均按 <span className="preview-warning">{ multiLimit }</span> 字一条计费；
			</p>
			<span>
				{
					isTrimSpace ? '2.上图仅为操作预览，最终字数和计费条数以实际执行时发送为准。' : '2.上图仅为操作预览，变量无固定长度，最终字数和计费条数以实际执行时发送为准，建议先测试执行。'
				}
			</span>
		</div>
	);
}

// 编辑器内容预览区域
const Content = () => {

    const option = useContext(SmsContext);
    const { previewText } = option;

    return (
        <div className="preview-main">
            <div className="preview-content">
                {
                    Array.isArray(previewText) && previewText.map(item =>
                        item.length ? <div key={Math.random()} dangerouslySetInnerHTML={{ __html: item }}></div> : <div key={Math.random()}><br/></div>
                    )
                }
            </div>
        </div>
    )
}

export default function SmsPreview() {

    return (
        <div className="preview">
            <div className="preview-mock">
                <Header />
                <Content />
            </div>
            <Counter />
            <Tips />
        </div>
    )
}
