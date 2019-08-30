// pages/exam/index/index.js
let app = getApp()
Page({
  data: {
    spinShow: false,
    loadMoreLoad: false,
    loadMoreTip: '正在加载',
    queryParam: {
      pageIndex: 1,
      pageSize: 10
    },
    tableData: [],
    total: 1
  },
  onLoad: function(options) {
    this.setData({
      spinShow: true
    });
    this.search(true)
  },
  onPullDownRefresh() {
    this.setData({
      spinShow: true
    });
    if (!this.loading) {
      this.setData({
        ['queryParam.pageIndex']: 1
      });
      this.search(true)
    }
  },
  onReachBottom() {
    if (!this.loading && this.data.queryParam.pageIndex < this.data.total) {
      this.setData({
        loadMoreLoad: true,
        loadMoreTip: '正在加载'
      });
      this.setData({
        ['queryParam.pageIndex']: this.data.queryParam.pageIndex + 1
      });
      this.search(false)
    } else {
      this.setData({
        loadMoreLoad: false,
        loadMoreTip: '暂无数据'
      });
    }
  },
  search: function(override) {
    let _this = this
    app.formPost('/api/wx/student/exampaper/answer/pageList', this.data.queryParam)
      .then(res => {
        _this.setData({
          spinShow: false
        });
        wx.stopPullDownRefresh()
        if (res.code === 1) {
          const re = res.response
          _this.setData({
            ['queryParam.pageIndex']: re.pageNum,
            tableData: override ? re.list : this.data.tableData.concat(re.list),
            total: re.pages
          });
        }
      }).catch(e => {
        _this.setData({
          spinShow: false
        });
        app.message(e, 'error')
      })
  }
})