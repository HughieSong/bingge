var util = require('../../utils/util.js')
var app = getApp();
Page({
    //RESTFul API JSON
    //SOAP XML
    //一个优秀RESTFul API的特点：url的语义化，合适的接口粒度
    data: {//初始值，因为已经在template中绑定了这几个对象名，如果初始化的时候找不到这几个对象名，那么后面遇到这些的时候会无法辨别，继而报错
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult:{},
        containerShow: true,
        searchPanelShow: false
    },
    onLoad: function (event) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },
// 跳转到“更多”
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category
        })
    },
    // 跳转到电影详情页面
    onMovieTap:function(event){
        var movieId=event.currentTarget.dataset.movieid;
         wx.navigateTo({
            url: 'movie-detail/movie-detail?id='+movieId
        })
    },
    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "json"//设置请求的 header,无法用"application/json"，冒号后可以为"application/xml"
            },
            success: function (res) {
                // console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle)
            },
            fail: function (error) {
                // fail
                console.log(error)
            }
        })
    },
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            // searchResult:{}//清空上一次的记录
        })
    },
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },

    onBindConfirm: function (event) {
        var text = event.detail.value;
        // console.log(text);
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl,"searchResult","");
    },
    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {//处理返回的电影数据信息
        var movies = [];//定义一个空数组作为处理返回数据的容器
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {//定义获取的内容
                stars: util.convertToStarArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)//填充
        }
        var readyData = {};
        readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
        };
        this.setData(readyData);
    }
})