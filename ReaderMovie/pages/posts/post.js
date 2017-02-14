var postsData = require('../../data/posts-data.js')//无法使用绝对路径

Page({
  data:{
      //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A，而这个动作A的执行，是在onLoad事件执行之后发生的
  },
  onLoad:function(options){
    //页面初始化，options为页面跳转所带来的参数
    this.setData({
        posts_key:postsData.postList
        });
  },
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url:"post-detail/post-detail?id=" + postId
    })
  },
  // onSwiperItemTap:function(event){
  //   var postId = event.currentTarget.dataset.postid;
  //   // console.log(postId);
  //   wx.navigateTo({    
  //     url:"post-detail/post-detail?id=" + postId

  //   })
  // },
  onSwiperTap:function(event){
    // target和currentTarget：
    // target指的是当前点击的组件 currentTarget指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({    
      url:"post-detail/post-detail?id=" + postId
    })
  }
})