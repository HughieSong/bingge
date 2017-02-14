function convertToStarArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];//[1,1,1,0,0]表示三颗星，[1,1,1,1,1]表示五颗星
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    return array;
}

function http(url, callBack) {
    wx.request({
        url: url,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            "Content-Type": "json"//设置请求的 header,无法用"application/json"，冒号后可以为"application/xml"
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function (error) {
            // fail
            console.log(error)
        }
    })
}

function convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}
function convertToCastInfos(casts) {
    var castsArray = [];
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}
module.exports = {
    convertToStarArray: convertToStarArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
}