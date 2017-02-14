Page({
    onTap: function (event) {
        // wx.navigateTo({
        //     url: "../posts/post"
        // });
        
        wx.switchTab({//设置过导航栏选项之后reddirectTo和navigateTo都会失效，只能用switchTab
            url: "../posts/post"
        })       
    },
    // onUnload: function () {
    //     console.log("welcome page is unload")
    // },
    // onHide: function () {
    //     console.log("welcome page is hide")
    // }
})