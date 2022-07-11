// pages/gyljr/tongbao_detail/tongbao_detail.js
import * as echarts from '../../../ec-canvas/echarts';
const { _formatTime } = require("../../../utils/util");

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
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  chart.on('click', function (params) {
    console.log(params)
    // wx.navigateTo({
    //   url: '../link/link?source='+comp_id+'&target='+params.data.id
    // })
    wx.navigateTo({
      url: '../../gyljr/tongbao_detail/tongbao_detail?id=' + params.data.number + '&source_name=' + params.data.source + '&target_name=' + params.data.target
    })
});
  // chart.setOption(options)
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tb_data:[],    
    ec: {
      onInit: initChart
    },
    source_name:'',
    target_name:'',
    // table
    tableHeader: [
      {
        prop: 'start',
        width: 180,
        label: '交易发起方'
      },
      {
        prop: 'end',
        width: 180,
        label: '交易接收方'
      },
      {
        prop: 'amount',
        width: 150,
        label: '金额',
        color: '#55C355'
      },
      {
        prop: 'datetime',
        width: 200,
        label: '日期',
        // color: '#55C355'
      }
    ],
    stripe: true,
    border: true,
    outBorder: true,
    row: [],
    msg: '暂无数据'
  },

  searchTBData(tb_number){
    console.log("111")
    var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getTBTransactions?number='+tb_number,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          tb_data : res.data.data['zr_history']
        })
        // options.series[0].data = res.data.data.nodes;
        // options.series[0].links = res.data.data.links;
        var table_data = []
        for(let i=0;i<res.data.data['zr_history'].length;i++){
          table_data.push({
            'id':i,
            'start':res.data.data['zr_history'][i]['来源企业'],
            'end':res.data.data['zr_history'][i]['本次通宝接收方'],
            'amount':res.data.data['zr_history'][i]['初始通宝接收金额(元)'],
            'datetime':_formatTime(new Date(res.data.data['zr_history'][i]['接收时间']))
          })
        }
        that.setData({
          row : table_data
        })
        options.series[0].data = res.data.data.nodes;
        options.series[0].links = res.data.data.links;

        chart.setOption(options);
        console.log(options)
        console.log("222")
      }
    });
  },

  navToCompDetail(options){
    console.log(options)
    wx.navigateTo({
      url: '../tongbao2/tongbao_comp_detail/tongbao_comp_detail?source_name='+options.currentTarget.dataset.name,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.searchTBData(options.id)
    this.setData({
      source_name:options.source_name,
      target_name:options.target_name
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