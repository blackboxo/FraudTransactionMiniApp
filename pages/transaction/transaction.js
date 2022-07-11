import * as echarts from '../../ec-canvas/echarts';
let chart = null;
let chart2 = null;
let comp_id = null;
// var categories = [{ name: "企业" }, { name: "人" }, { name: "风险" }, { name: "招投标项目" }, { name: "产品" }];
var categories = [{ name: "订单" }, { name: "账户" }, { name: "设备"} ];
let options = {
  title: {
    text: '风险知识图谱',
    top: 'bottom',
    left: 'right'
  },
  roam: true,
  tooltip: {},
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
// let options = {
//   title: {
//     text: '风险知识图谱',
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
//         position: '',
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
  //当点击节点时进行跳转到其他企业或产品页面
  chart.on('click', function (params) {
      wx.navigateTo({
        url: '../link/link?source='+comp_id+'&target='+params.data.id
      })
  });
  return chart;
}
function initChart2(canvas2, width, height, dpr) {
  chart2 = echarts.init(canvas2, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas2.setChart(chart2);
  //当点击节点时进行跳转到其他企业或产品页面
  chart2.on('click', function (params) {
      wx.navigateTo({
        url: '../link/link?source='+comp_id+'&target='+params.data.id
      })
  });
  return chart2;
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    loading:true,
    loads: true,
    show:false,
    companys: [],
    projects: [],
    nodes:[],
    links:[],
    consensuses:[],
    activeNames: ['1'],
    credit:[],
    basic:[],
    activeBasic:['1','2'],
    active: 0,
    comp:{},
    desc:[],
    transaction:{}
  },


  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  onChangeBasic(event) {
    this.setData({
      activeBasic: event.detail
    });
  },

  onTab(event) {
    
  },

  getCorrelation(e){
    var name = e.currentTarget.dataset.name;
    var id;
    this.data.nodes.forEach(item=>{
      if(item.name==name){
        wx.navigateTo({
          url: '../link/link?source=' + comp_id + '&target=' + item.id
        })
      }
    })
  },

  report(){
    wx.navigateTo({
      url: '../report/report?id=' + comp_id
    })
  },

  getLink(gid){
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getTransactionNodeAndLinkByGid?gid=' + gid,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        const graph = res.data.data;
        options.series[0].data = graph.nodeList;
        options.series[0].links = graph.linkList;
        console.log(graph.nodeList)
        console.log(graph.linkList)
        chart.setOption(options);
        var desc = [];
      }
    });
  },


  onLoad: function (option) {
    console.log(option)
    var _this = this;
    comp_id  = option.id
    var gid = option.gid
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getTransactionByGid',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        gid:gid
      },
      success(res) {
        console.log(res)
        _this.setData({
          transaction : res.data.data
        })
        // _this.setData({
        //   transactions: res.data.data
        // })
      }
    })
    wx.getStorage({
      key: 'companyDetail',
      success: function (res) {
        res.data[option.index].basic = JSON.parse(res.data[option.index].basic);
        _this.setData({
          comp: res.data[option.index]
        })
      }
    })

    this.getLink(gid)
    
    setTimeout(function(){
      wx.request({
        url: 'https://mylittlefox.art/api/yxytransaction/getTransactionNodeAndLinkByGid?gid=' + gid,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          const graph = res.data.data;
          options.series[0].data = graph.nodeList;
          options.series[0].links = graph.linkList;
          console.log(graph.nodeList)
          console.log(graph.linkList)
          chart.setOption(options);
          var desc = [];
        }
      });
    },5000)
 
    this.getProjectByCompId(option.id);
    this.getConsensusData(option.id)
    if (option.recordNo!=0){
      this.getKexinData(option.recordNo);
    }
  },

  onReady(option){

  },
  getProjectByCompId: function (id) {
    var _this = this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getProjectByCompId?id='+id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        res.data.projects.forEach(project => {
          var relate = "";
          var relatestr = project.related_comp.replace(/'/g, '"');
          JSON.parse(relatestr).forEach(pro => {
            relate = relate + "\n" + pro.name;
          })
          project["relatedComp"] = relate;
        })
        _this.setData({
          historyProjects: res.data.projects,
        })
      }
    })
  },

  toVisible(){
    this.setData({
      loading: true,
    })
  },

  getConsensusData(id){
    var _this = this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getConsensus?id='+id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          consensuses: res.data.consensus,
        })
      }
    })
  },

  bindConsensusTap(e) {
    wx.setStorage({
      key: "consensusDetail",
      data: this.data.consensuses[e.currentTarget.dataset.index]
    })
    wx.navigateTo({
      url: '../consensus/consensus'
    })
  },

  getKexinData(recordNo){
    var _this=this;
    wx.request({
      url: 'https://www.mylittlefox.art/v1/enterpriseCredit/' + recordNo,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          show:true,
          credit: res.data[0]
        })
      }
    })
  },

  getProjectDetail(e){
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/searchProject?keyword=' + e.currentTarget.dataset.title,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.projects){
          console.log(res.data.projects)
          wx.setStorage({
            key: "projectDetail",
            data: res.data.projects[0]
          })
          wx.navigateTo({
            url: '../project/project'
          })
        }
      }
    })
  },

  toTourong(){
    wx.navigateTo({
      url: '../tourong/tourong?id=' + comp_id
    })
  },

  toHolder(){
    wx.navigateTo({
      url: '../holder/holder?id=' + comp_id
    })
  }
});