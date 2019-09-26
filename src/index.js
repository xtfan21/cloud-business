/* src/index.js文件 是通过 /script/generate-index.js文件生成的 */

// 检验当前运行环境
if( typeof window === 'undefined' ) {
	console.warn('cloud-business@0.0.1 仅支持在浏览器环境进行使用!');
}

export { default as AreaSelector } from './area-selector';

export { default as CcMenu } from './cc-menu';

export { default as Editor } from './editor';

export { default as Sms } from './sms';

export { default as SmsEditor } from './sms-editor';
