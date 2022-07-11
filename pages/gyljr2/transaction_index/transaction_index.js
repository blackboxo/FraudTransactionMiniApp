import * as echarts from '../../../ec-canvas/echarts';
const { formatTime } = require("../../../utils/util");

let chart = null;

var categories = [{ name: "核心企业" }, { name: "供应商" }, { name: "金融机构" }];

let options = {
  title: {
    // text: '风险知识图谱',
    // top: 'bottom',
    // left: 'right'
  },
  roam: true,
  tooltip: {
    trigger: 'item',
    formatter:function(params){
        if(params.data.type==4){
            return '异常资金流';
        }
        else{
            return params.name;
        }
    }
  },
  legend: [{
    // selectedMode: 'single',
    data: categories.map(function (a) {
      return a.name;
    })
  }],
  animationDuration: 1000,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      name: 'risk graph',
      type: 'graph',
      layout: 'none',
      data: [],
      links: [],
      categories: categories,
      roam: true,
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      label: {
        position: '',
        formatter: '{b}'
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      emphasis: {
        lineStyle: {
          width: 10
        }
      },
      force: {
        repulsion: 80,
        // gravity: 0.01,
        edgeLength: [50, 200]
      }
    }
  ]
};
// let options = {
//   title: {
//     text: '交易记录',
//     top: 'bottom',
//     left: 'right'
//   },
//   roam: true,
//   tooltip: {},
//   legend: [{
//     // selectedMode: 'single',
//     data: categories.map(function (a) {
//       return a.name;
//     })
//   }],
//   animationDuration: 1500,
//   animationEasingUpdate: 'quinticInOut',
//   series: [
//     {
//       name: 'risk graph',
//       type: 'graph',
//       layout: 'force',
//       data: [],
//       links: [],
//       categories: categories,
//       roam: true,
//       itemStyle: {
//         normal: {
//           borderColor: '#fff',
//           borderWidth: 1,
//           shadowBlur: 10,
//           shadowColor: 'rgba(0, 0, 0, 0.3)'
//         }
//       },
//       label: {
//         position: 'right',
//         formatter: '{b}'
//       },
//       lineStyle: {
//         color: 'source',
//         curveness: 0.3
//       },
//       emphasis: {
//         lineStyle: {
//           width: 10
//         }
//       },
//       force: {
//         repulsion: 80,
//         gravity: 0.01,
//         edgeLength: [50, 200]
//       }
//     }
//   ]
// };
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  // chart.setOption(options)
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive:0,
    ec: {
      onInit: initChart
    },
    transactions:[],
    general:{},
    comp1:'',
    comp2:'',
    active: 0,
    currency:'人民币',
    amount:'3000000',
    allotted_time:'360',
    transaction_type:'转让',
    debt_source:'应收帐款',
    debtor:'上海钜华企业管理有限公司',
    debtee:'达州宝汽汽车销售服务有限公司',
    fund_provider:'上海宝胜汽车销售服务有限公司',
    tb_number:'',
    tb_data:[],
    show:false,
    bgColor:'#f3f3f3',
    avatarUrl:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp2.qhimgs4.com%2Ft01bbdfba8500d7c708.jpg&refer=http%3A%2F%2Fp2.qhimgs4.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611970796&t=59002b20d500537d1e76d76c2cc460a0",
    tb_data_list:[]
  },

  onChange(item){
    var that  =  this
      console.log(item.detail.index)
      if(item.detail.index == 2){
        that.setData({
          show:true
        })
      }
      else{
        that.setData({
          show:false
        })
      }
      // wx.nextTick(()=>{

      // })
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

  getTransactions(){
    
    var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getGYLJRTransactions',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        res.data.data.map((item)=>{
          item['time'] = formatTime(new Date(item['time']))
        })
        // for (const it of res.data.data) {
        //   console.log(it)
        //   it.ti
        // }
        that.setData({
          transactions:res.data.data
        })
      }
    });
  },

  // /getKeywordList
  getKeywordList(){
    var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getKeywordList',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        keyword:'承'
      },
      success(res) {
        console.log(res)
        // res.data.data.map((item)=>{
        //   item['time'] = formatTime(new Date(item['time']))
        // })
        // that.setData({
        //   transactions:res.data.data
        // })
      }
    });
  },


  searchTransaction(){
    // var that = this
    // if(this.data.comp1!=''&&this.data.comp2!=''){
    //   var comp1 = this.data.comp1
    //   var comp2 = this.data.comp2
    //   wx.request({
    //     url: 'https://mylittlefox.art/api/yxytransaction/getGYLJRTransactions2',
    //     header: {
    //       'content-type': 'application/json' // 默认值
    //     },
    //     data:{
    //       comp1:comp1,
    //       comp2:comp2
    //     },
    //     success(res) {
    //       console.log(res)
    //       res.data.data.map((item)=>{
    //         item['time'] = formatTime(new Date(item['time']))
    //       })
    //       // for (const it of res.data.data) {
    //       //   console.log(it)
    //       //   it.ti
    //       // }
    //       that.setData({
    //         transactions:res.data.data
    //       })
    //     }
    //   });
    // }
    // else{
    //   this.getTransactions()
    // }
    wx.navigateTo({
      url: '/pages/gyljr/transaction_input/transaction_input',
    })
  },

  bindViewTap(options){
    console.log(options)
     var id = options.currentTarget.dataset.id
     var event = options.currentTarget.dataset.event
     var source_name = options.currentTarget.dataset.sourcename
     var target_name = options.currentTarget.dataset.targetname
    wx.navigateTo({
      url: '../../gyljr/transaction_detail/transaction_detail?id=' + id + '&event=' + event + '&source_name=' + source_name + '&target_name=' + target_name
    })
  },

  bindViewTap2(options){
    console.log(options)
     var id = options.currentTarget.dataset.id
     var source_name = options.currentTarget.dataset.source_name
     var target_name = options.currentTarget.dataset.target_name
    wx.navigateTo({
      url: '../../gyljr/tongbao_detail/tongbao_detail?id=' + id + '&source_name=' + source_name + '&target_name=' + target_name
    })
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
  },
  searchTBData(){
    console.log("111")
    var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getTBTransactions?number='+that.data.tb_number,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          tb_data : res.data.data['zr_history']
        })
        // options.series[0].data = res.data.data.nodes;
        // options.series[0].links = res.data.data.links;
        options.series[0].data = res.data.data.nodes;
        options.series[0].links = res.data.data.links;

        chart.setOption(options);
        console.log(options)
        console.log("222")
      }
    });
  },

  getAllTBRecords(){
    var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getTBAllrecords',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.setData({
          tb_data_list : res.data.data.zr_history
        })
      }
    });
  },

  tabChange(event) {
    // event.detail 的值为当前选中项的索引
    // this.setData({ tabActive: event.detail });
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
    else if(event.detail==3){
      wx.navigateTo({
        url: '../chatbot/chatbot',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTransactions()
    this.getGeneral()
    this.getKeywordList()
    this.getAllTBRecords()
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