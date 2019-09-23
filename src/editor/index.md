---
category: Components
title: Editor
subtitle: 内容编辑器
---

### 何时使用
用户通过该编辑器自定义文本内容，用于编辑短信或者微信内容。

### API

#### Editor
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 编辑器内容 | string |  |
| keywords | 变量集合 | Array |  |
| isTrimSpace | 是否删除内容两边空格 | boolean | true |
| hasTagInPreview | 预览文本是否包含html标签 | boolean | true |
| disabled | 编辑器禁止输入 | boolean | false |
| onContentChanged | 内容发生变化的回调 | function | noop |

### onContentChanged 函数
编辑器内容发生变化调用此函数，返回值为：
```js
{
    // 编辑器文本
    editorText: '',
    // 预览内容，按照换行符切割为数组
    previewText: [],
    // 总字数
    totalChars: 20,
    // 换行数
    newLineNumber: 2,
    // 变量数
    variableNumber: 1
}
```