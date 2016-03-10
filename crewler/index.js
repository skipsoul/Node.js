"use strict";

const request = require('request');
const cheerio = require('cheerio');

// 根据url地址，获取该页面中所有文章的标题、时间、链接，得到一个数组
function getArticleList(url, callback) {
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    // 加载为一个类似于jQuery的对象
    let $ = cheerio.load(body);

    // 该数组用来存储文章信息对象
    let articleList = [];

    $('.articleList .articleCell').each(function (index, item) {
      // 获取到遍历的当前项
      let $this = $(item);

      // 找到title a元素
      let $title = $this.find('.atc_title a');

      // 找到时间元素
      let $time = $this.find('.atc_tm');

      // [{title:'',url:'',time:''}]
      articleList.push({
        title: $title.text(),
        url: $title.attr('href'),
        time: $time.text()
      });
    });

    // 调用回调函数，表示返回数据
    callback(null, articleList);
  });
}

const URL = 'http://blog.sina.com.cn/s/articlelist_2391731143_0_1.html';

//getArticleList(URL, function (err, articleList) {
//  if (err) {
//    throw new Error('请求出错了');
//  }
//  articleList.forEach(function (item, index) {
//    let url = item.url;
//    request(url, function (err, res, body) {
//      let $ = cheerio.load(body);
//    });
//  });
//});

// 根据url地址获取文章的详情
function getDetailByUrl(url, callback) {
  request(url, function (err, res, body) {
    if (err) {
      return callback(err, null);
    }

    // 把body字符串转换为一个类似于jQuery的对象
    let $ = cheerio.load(body, {
      decodeEntities: false
    });

    // 根系博客内容部分
    let content = $('.articalContent').html().trim();

    // 返回数据
    callback(null, content);
  });
}

getDetailByUrl('http://blog.sina.com.cn/s/blog_8e8eebc701010qls.html', function (err, content) {
  if (err) {
    throw err;
  }
  console.log(content);
});
