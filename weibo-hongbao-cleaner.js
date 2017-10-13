// 1. 使用 chrome 打开 weibo.com （确保你登录了微博）
// 2. 打开调试窗口，在 console 中贴下面的代码后回车
// 3. 如需删除其他微博，请输入一下内容后回车：start('替换成你要删除的内容'); 

let mids = [];
let midIndex = 0;
let timer = null;
let page = 0;
let keyWord = '';
let running = false;
let http = new XMLHttpRequest();

function cleanByPage() {
    let userId = $CONFIG['uid'];
    let url = 'https://weibo.com/p/aj/v6/mblog/mbloglist?ajwvr=6&domain=100505&rightmod=1&wvr=6&mod=personnumber&is_all=1&is_search=1&pagebar=1&feed_type=0&domain_op=100505&key_word=' + encodeURI(keyWord) + '&page=' + page + '&pre_page=' + page + '&id=100505' + userId + '&__rnd=1507705795334';
    
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState != 4 || http.status != 200) {
            return;
        }

        let json = {}
        try {
            json = JSON.parse(http.responseText);
        } catch (error) {
            stop('请求失败');
            return;
        }

        if (json.code != 100000) {
            stop('请求失败：' + json.msg);
            return;
        }

        let matches = json.data.match(/mid=([0-9]+)/g);
        if (matches == null) {
            stop('已经删光所有含有"' + keyWord + '"的微博');
            return;
        }
        
        let values = {};
        matches.forEach(function(match) {
            values[match.substr(4)] = 0;
        }, this);

        mids = Object.keys(values);
        timer = setInterval('cleanNext();', 1000);

        console.log('找到 ' + mids.length + ' 条含有"' + keyWord + '"的微博');
    }
}

function cleanNext() {
    if (midIndex >= mids.length) {
        mids = [];
        midIndex = 0;
        page++;
        clearInterval(timer);
        setTimeout('cleanByPage();', 1000);
        return;
    }

    cleanByMid(mids[midIndex]);
    midIndex++;
}

function cleanByMid(mid) {
    http.open('POST', 'https://weibo.com/aj/mblog/del?ajwvr=6', true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send('mid=' + mid);
    http.onreadystatechange = function() {
        if (http.readyState != 4 || http.status != 200) {
            return;
        }

        let json = {}
        try {
            json = JSON.parse(http.responseText);
        } catch (error) {
            return;
        }

        if (json.code == 100000) {
            console.log('删除成功 - ' + mid);
        } else {
            console.log('删除失败 - ' + mid);
        }
    }
}

function stop(message) {
    clearInterval(timer);
    running = false;
    console.log(message);
}

function start(kw) {
    if (running) {
        console.log('正在删除含有"' + keyWord + '"的微博，请稍后再试');
        return;
    }

    console.log('开始删除含有"' + kw + '"的微博');
    running = true;
    mids = [];
    page = 0;
    midIndex = 0;
    keyWord = kw;
    cleanByPage();
}

start('红包');
