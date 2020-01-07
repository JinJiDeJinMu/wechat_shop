module.exports = {
  getAuthStatus(scopeName) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          // 已拒绝过，弹设置
          if (res.authSetting[`scope.${scopeName}`] === false) {
            resolve(false); // 已同意
          } else if (res.authSetting[`scope.${scopeName}`]) {
            resolve(true);
          } else {
            resolve("none");
          }
        }

      });
    });
  }

};