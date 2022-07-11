// pages/gyljr/detail/detail.js
import * as echarts from '../../../ec-canvas/echarts';
let chart = null;
var categories = [{ name: "人" },{ name: "企业" }];
var categories = [{ name: "人" },{ name: "金融机构" },{ name: "供应商" },{ name: "核心企业" },{ name: "下游企业" },{ name: "其他" }];
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
  animationDuration: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      name: 'risk graph',
      type: 'graph',
      layout: 'force',
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
        gravity: 0.01,
        edgeLength: [50, 200]
      }
    }
  ]
};
let basic_option = {
  title: {
    text: 'Basic Graph'
  },
  tooltip: {
    trigger: 'item',
    formatter:function(params){
      console.log(params)
        if(params.data.type==4){
            return '资金流';
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
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 50,
      categories: categories,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 15
      },
      data: [
      
      ],
      links: [],
     
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]
}


function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  //当点击节点时进行跳转到其他企业或产品页面
  // chart.on('click', function (params) {
  //     wx.navigateTo({
  //       url: '../link/link?source='+comp_id+'&target='+params.data.id
  //     })
  // });
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    analysis:null
  },

  //获取节点与关系 => 构图
  getLinksAndNodes(id){
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getGYLJRNodeAndLinkByEid?id=' + id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        const graph = res.data.data;
        options.series[0].data = graph.nodeList;
        options.series[0].links = graph.linkList;
        // basic_option.series[0].data = graph.nodeList;
        // basic_option.series[0].links = graph.linkList;
        console.log(graph.nodeList)
        console.log(graph.linkList)
        if(options!=null){
          chart.setOption(options);
        }
        // chart.setOption(basic_option);
      }
    });
  },

  // 获取六个维度分析
  getAnalysis(id){
   var that = this
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getGYLJRanalysis?id=' + id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.setData({
          analysis:res.data.data
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //事件id
    var id = options.id
    var name = options.name
    this.setData({
      event:name
    })

    //TODO:获取节点和关系
    this.getLinksAndNodes(options.id)
    this.getAnalysis(options.id)
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