// pages/gyljr/transaction_input/transaction_input.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:'',
    debtor:'',
    debtee:'',
    fund_provider:'',
    debt_receivable_passed:'',
    debt_receivable_not_passed:'',
    debt_receivable_to_approval:'',
    currency:'',
    allotted_time:'',
    debt_type:'',
    transaction_type:'',
    financing_mode:'',
    financing_products:'',
    debt_source:'',
    amount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.setNavigationBarTitle({
      title: '交易输入页面'
    })
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

  },
  confirm(){
    var _this = this
    wx.navigateTo({
      url: '/pages/gyljr/transaction_analysis/transaction_analysis?debtee='+_this.data.debtee+'&debtor='+_this.data.debtor + '&fund_provider=' + _this.data.fund_provider,
    })
    // console.log(this.data.debtor)
    // var _this = this
    // wx.request({
    //   url: 'https://mylittlefox.art/api/yxytransaction/inputTransaction',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   data:{
    //     'debtor':_this.data.debtor,
    //     'debtee':_this.data.debtee,
    //     'fund_provider':_this.data.fund_provider,
    //     'debt_receivable_passed':_this.data.debt_receivable_passed,
    //     'debt_receivable_not_passed':_this.data.debt_receivable_passed,
    //     'debt_receivable_to_approval':_this.data.debt_receivable_passed,
    //     'currency':_this.data.currency,
    //     'allotted_time':_this.data.allotted_time,
    //     'debt_type':_this.data.debt_type,
    //     'transaction_type':_this.data.transaction_type,
    //     'financing_mode':_this.data.financing_mode,
    //     'financing_products':_this.data.financing_products,
    //     'debt_source':_this.data.debt_source,
    //     'amount':_this.data.amount
    //   },
    //   success(res) {
    //     console.log(res)
    //   }
    // });
  }
})