// pages/gyljr/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    events:[],
    general:{}
  },

  // 获取概览部分
  getGeneral(){

    var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getGYLJRGeneral',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.setData({
          general:res.data.data
        })
      }
    });
  },

  getEvents(){
    
    var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getGYLJREvents',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.setData({
          events:res.data.data
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEvents()
    this.getGeneral()
  },

  bindViewTap(options){
    console.log(options)
     var id = options.target.dataset.id
     var name = options.target.dataset.name
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&name=' + name,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})