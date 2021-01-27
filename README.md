# weibo-hongbao-cleaner

紅包微博清潔器

## 使用方法

1. 使用 chrome 打开 https://weibo.com 并登录
2. 打开调试窗口，复制以下代码至console，执行既可
```js
var cleaner = null;
fetch("https://raw.githubusercontent.com/pythias/weibo-hongbao-cleaner/master/weibo-hongbao-cleaner.js")
    .then(response => response.text())
    .then(text => {
        eval(text);
        cleaner = new cleanup();
    });
//cleaner.start('红包');
```
3. 输入 `cleaner.start('预删除的关键词')` ，然后回车等待完成。
