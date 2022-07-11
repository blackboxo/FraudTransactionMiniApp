const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var ansList = ["抱歉，小晨暂时还不知道你的答案","具体细节请移步首页导航栏","您好，请叙述的再详细一点","对不起，我不能解决你的问题","有问题，找百度","你怎么这么笨","对不起，我是个笨蛋","请输入关键词"];

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '您可以向我咨询信用卡申请等常见问题，快来体验吧！'
    },
      {
    speaker: 'customer',
    contentType: 'text',
    content: '如何申请'
  },
  {
    speaker: 'server',
    contentType: 'text',
    content: '进入首页，选取符合条件的信用卡，点击立即申请，查看权益介绍以及申请条件后，填写表单信息即可成功发起申请请求。'
  },
  ]


  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    tabActive:4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    initData(this);
    this.setData({
      cusHeadIcon: "https://img.yzcdn.cn/vant/cat.jpeg",
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '信用AI',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function(e) {
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    // this.getAnswer(e.detail.value)
    this.getAnswerFromFAQs(e.detail.value)
  },

  getAnswer:function(question){
    // var rdm = Math.floor(Math.random()*ansList.length);
    // console.log(rdm)
    // return ansList[rdm];
    wx.request({
      url: `${app.globalData.papi}/competition/chatBot`,
      method:"POST",
      data:{
        question:question
      },
      success:(res)=>{
        console.log(res)
        msgList.push({
          speaker: 'server',
          contentType: 'text',
          content: res.data.as
        }) 
        inputVal = '';
        this.setData({
          msgList,
          inputVal
        });
        this.blur();
      }
    })
  },
  getAnswerFromFAQs:function(question){
    wx.request({
      url: `${app.globalData.papi}/FAQ/getAnswer`,
      method:"POST",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },
      data:{
        question:question
      },
      success:(res)=>{
        console.log(res)
        msgList.push({
          speaker: 'server',
          contentType: 'text',
          content: res.data
        }) 
        inputVal = '';
        this.setData({
          msgList,
          inputVal
        });
        this.blur();
      }
    })
  },
    /**
   * 退回上一页
   */
  toBackClick: function() {
    wx.navigateBack({})
  },
  tabChange(event) {
    // event.detail 的值为当前选中项的索引
    if(event.detail==0){
      wx.navigateTo({
        url: '../transaction_index/transaction_index',
      })
    }
    else if(event.detail==1){
      wx.navigateTo({
        url: '../search_bussiness/search_bussiness',
      })
    }
    else if(event.detail==2){
      wx.navigateTo({
        url: '../search_transaction/search_transaction',
      })
    }
    else if(event.detail==4){
      wx.navigateTo({
        url: '../chatbot/chatbot',
      })
    }
  }

})