//index.js

const util = require("../../utils/util");

//获取应用实例
const app = getApp()

Page({
  data: {
    comps: [],
    transactions:[],
    comps_origin:[],
    events: [],
    events_origin: [],
    projects:[],
    projects_origin:[],
    defaultComp:
      {
      short_name: '敬请期待',
      img: 'https://markdown-pic-blackboxo.oss-cn-shanghai.aliyuncs.com/下载.jpg',
      desc: '更多企业风险预警案例敬请期待',
      risk: '',
      searchComp:'',
      searchProject:''
    },
    active: 0,
    addr:'',
    addr1:'',
    addr2:'',
    parseAddr:null,
    comRes:null
  },

  onSearchComp(e) {
    var comps=[];
    if (e.detail != null) {
      this.data.comps_origin.forEach(item=>{
        if(item.name){
          if (item.name.indexOf(e.detail)!=-1){
            comps.push(item);
          }
        }
      })
      this.setData({
        comps:comps
      })}
    else{
      this.setData({
        comps: this.data.comps_origin
      })
    }
  },

  onSearchEvent(e) {
    var events = [];
    if (e.detail != null) {
      this.data.events_origin.forEach(item => {
        if (item.title) {
          if (item.title.indexOf(e.detail) != -1) {
            events.push(item);
          }
        }
      })
      this.setData({
        events: events
      })
    }
    else {
      this.setData({
        events: this.data.events_origin
      })
    }
  },

  

  onSearchProject(e){
    var _this=this;
    var projects = [];
    if(e.detail!=null){
      wx.request({
        url: 'https://www.mylittlefox.art/api/EDU/searchProject?keyword='+e.detail,
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
            projects: res.data.projects,
            projects_origin: res.data.projects,
          })
        }
      })
    }else{
      this.setData({
        projects: this.data.projects_origin
      })
    }
  },
  onChange(event) {

  },

  //事件处理函数
  bindViewTap: function (e) {
    if (e.target.dataset.id){
      wx.navigateTo({
        url: '../graph/graph?recordNo=' + e.target.dataset.recordno + '&id=' + e.target.dataset.id + '&index=' +e.currentTarget.dataset.index +  '&gid=' +e.currentTarget.dataset.gid
      })
    }
  },
  bindPeopleTap: function (e) {
    if (e.target.dataset.id){
      wx.navigateTo({
        url: '../people/people?recordNo=' + e.target.dataset.recordno + '&id=' + e.target.dataset.id + '&index=' +e.currentTarget.dataset.index 
      })
    }
  },
  bindTranTap: function (e) {
    // if (e.target.dataset.id){
    //   wx.navigateTo({
    //     url: '../transaction/transaction?recordNo=' + e.target.dataset.recordno + '&id=' + e.target.dataset.id + '&index=' +e.currentTarget.dataset.index 
    //   })
    // }
    if (e.target.dataset.gid){
      wx.navigateTo({
        url: '../transaction/transaction?recordNo=' + e.target.dataset.recordno + '&id=' + e.target.dataset.id + '&index=' +e.currentTarget.dataset.index + '&gid=' +e.currentTarget.dataset.gid
      })
    }
  },

  //事件处理函数
  bindProjectTap: function (e) {
      wx.setStorage({
        key: "projectDetail",
        data: this.data.projects[e.currentTarget.dataset.index]
      })
      wx.navigateTo({
        url: '../project/project?id='+e.currentTarget.dataset.id
      })
  },

  //事件处理函数
  bindEventTap: function (e) {
    wx.setStorage({
      key: "eventDetail",
      data: this.data.events[e.currentTarget.dataset.index]
    })
    wx.navigateTo({
      url: '../event/event?id=' + e.currentTarget.dataset.id
    })
  },

  onLoad: function () {
    this._getCompany();
    // this.getProject();
    // this.getEvent();
    this.getTransactions();
  },

  getCompany:function(){
    var _this=this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/digital2/getCompany',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        res.data.comps.push(_this.data.defaultComp);
        _this.setData({
          comps: res.data.comps,
          comps_origin: res.data.comps,
        })
        wx.setStorage({
          key: "companyDetail",
          data: res.data.comps
        })
      }
    })
  },

  _getCompany:function(){
    var _this=this;
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getCompany',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data)
        res.data.data.push(_this.data.defaultComp);
        _this.setData({
          comps: res.data.data,
          comps_origin: res.data.data,
        })
        wx.setStorage({
          key: "companyDetail",
          data: res.data.data
        })
      }
    })
  },

  getEvent: function () {
    var _this = this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getEvent',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        res.data.events.forEach((item,index)=>{
          res.data.events[index].related_comp = JSON.parse(res.data.events[index].related_comp)
        })
        _this.setData({
          events: res.data.events,
          events_origin: res.data.events,
        })
      }
    })
  },

  getProject: function () {
    var _this = this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getProject',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        res.data.projects.forEach(project=>{
          var relate="";
          var relatestr = project.related_comp.replace(/'/g, '"');
          JSON.parse(relatestr).forEach(pro=>{
            relate = relate+"\n"+pro.name;
          })
          project["relatedComp"] = relate;
        })
        _this.setData({
          projects: res.data.projects,
          projects_origin: res.data.projects,
        })
      }
    })
  },

  getTransactions:function(){
    var _this = this;
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getTransaction',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        _this.setData({
          transactions: res.data.data
        })
      }
    })
  },

  parseAddr:function(){
    var _this = this
    var addr = _this.data.addr
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getAddrParseText',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        'addr':addr
      },
      success:(res) => {
        console.log(res)
        _this.setData({
          parseAddr:res.data.data
        })
      }
    })
  },

  similarity:function(){
    var _this = this
    var addr1 = _this.data.addr1
    var addr2 = _this.data.addr2
    wx.request({
      url: 'https://mylittlefox.art/api/yxytransaction/getSimilarityfrom2texts',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        addr1:addr1,
        addr2:addr2
      },
      success:(res) => {
        console.log(res)
        this.setData({
          comRes:res.data.data
        })
      }
    })
  }



})
