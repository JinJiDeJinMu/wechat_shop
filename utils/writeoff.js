function getScancode() {
  let currentUser = app.globalData.userInfo;
  console.log(JSON.stringify(currentUser));
  let merchantId = wx.getStorageSync('merchantId');

  if (merchantId == "" || merchantId == "0" || merchantId == "null" || merchantId == null) {
    wx.showToast({
      title: '您当前没有权限核销扫码,请联系管理员',
      icon: 'fail',
      duration: 2000
    }); // wx.setStorageSync('userId');
  } else {
    scan();
  }
}

function scan() {
  // 允许从相机和相册扫码
  wx.scanCode({
    success: res => {
      console.log(res.result);
      wx.navigateTo({
        url: '../orderHexiao/orderHexiao?' + res.result
      });
    }
  });
}

module.exports = {
  getScancode,
  scan
};