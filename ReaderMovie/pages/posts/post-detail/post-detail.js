var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        // var globalData = app.globalData;//测试是否取到app.js中的全局变量
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })

        // var postsCollected ={
        //     1:"true",
        //     2:"false",
        //     3:"true"
        //     ...
        // }

        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        /*      //设置缓存，缓存是永久存在的，除非主动清除
                // wx.setStorageSync('key',"风暴英雄")
                wx.setStorageSync('key', {
                    game: "风暴英雄",
                    developer: "暴雪"
                })
                wx.setStorageSync('key1', {
                    game: "LOL",
                    developer: "punch"
                })
            },
            onCollectionTap: function (event) {
                //获取缓存
                var game = wx.getStorageSync('key')
                console.log(game)
            },
            onShareTap: function (event) {
                //清除单一缓存
                // wx.removeStorageSync('key')
                //清除所有缓存，缓存的上限最大不能超过10MB
                wx.clearStorageSync()
        */
        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){//如果全局变量g_isPlayMusic为truetrue，说明音乐正在播放，所以图片状态同步为true
            // this.data.isPlayingMusic = true;
            this.setData({
                isPlayingMusic : true
            })
        }
        this.setMusicMonitor();
    },

    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {//事件驱动实现模块与模块之间的传参，绑定数据的方法对于单元测试来说意义重大
            // callback
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            // callback
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function () {
            // callback
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },
    onCollectionTap: function (event) {//收藏图标点击事件
        this.getPostsCollectedSyc();
        // this.getPostsCollectedAsy();
    },
    getPostsCollectedAsy: function () {//异步
        var that = this;
        wx.getStorage({//同步时是getStorageSync,
            key: "posts_collected",
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                //取反操作，收藏的变未收藏，未收藏变收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },

    getPostsCollectedSyc: function () {//同步
        var postsCollected = wx.getStorageSync('posts_collected');//同步的缺陷是如果在这里执行不了，整个UI会在此处卡住，后面的代码走不了，这段时间耗时会非常长，但是该用同步时还是要用同步，同步解决不了再用异步
        var postCollected = postsCollected[this.data.currentPostId];
        //取反操作，收藏的变未收藏，未收藏变收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        // this.showModal(postsCollected,postCollected);//调用showModal方法，showModal是Page结构体下面的一个属性，必须加this
        this.showToast(postsCollected, postCollected);
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;//this是函数作用域的上下环境
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    showToast: function (postsCollected, postCollected) {
        //更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })

        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel   用户是不是点击了取消按钮
                // res.tapIndex    数组元素的序号，从0开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
            }
        })
    },
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio()
            this.setData({
                isPlayingMusic: false
            })
            // this.data.isPlayingMusic = false;
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }
})