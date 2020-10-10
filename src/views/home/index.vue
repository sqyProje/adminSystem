<template >
  <!-- 整个盒子 -->
  <div class="app-container root-box">
    <!-- 上半部分 -->
    <el-row :gutter="10" style="margin-left: -5px">
      <el-col :span="12"> <!-- 轮播图 -->
        <div class="block left-box">
          <el-carousel height="360px">
            <el-carousel-item v-for="(item,i) in list" :key="i">
              <img style="width: 100%;height:100%" :src="item.picpath" alt />
            </el-carousel-item>
          </el-carousel>
        </div></el-col>
      <el-col :span="12"> <!--公告  -->
        <div class="right-box">
          <div class="gonggao-box">
            <div style="height:30px;line-height:30px;">公告</div>
            <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
              <el-form-item >
                <el-input v-model="listQuery.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            :row-style="{height:'20px'}"
            :header-row-style="{height:'20px'}"
            :cell-style="{padding:'1px'}"
            :header-cell-style="{ background: '#3C82FE',color:'#FFFFFF',}"
            :data="AnnounceList"
            style="width: 100%;height: 256px"
          >
            <el-table-column prop="title" width="230" label="标题" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="sketch" label="简介" width="250" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="publishDate" width="230" label="发布时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="NoticeDetails(scope.row)" type="text" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total,prev, pager, next"
            :current-page.sync="listQuery.pageNum"
            :page-size="listQuery.pageSize"
            :total="total"
            style="margin-top:20px;text-align: center"
          ></el-pagination>
        </div></el-col>
    </el-row>
    <!-- 下半部分 -->
    <div class="new-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item,i) in newsType"
          :key="i"
          :id="item.uId"
          :label="item.name"
          :name="item.name"
        >
          <el-form :inline="true" size="mini" :model="newQuery" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="newQuery.title" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="newsSubmit" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
          <div  v-if="newsList.length!=0">
            <el-row :gutter="10" style="margin:10px -5px -10px -5px">
              <el-col :span="9">
                <div class="firstnew" v-for="(item,i) in newsList" :key="i" v-if="i==0">
                  <div class="img-box">
                    <img  :src="item.picPath" alt />
                  </div>
                  <div class="biaoti ellipsis">{{item.title}}</div>
                  <div class="neirong ellipsis">{{item.sketch}}</div>
                  <div style="height:30px;display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between;-ms-flex-pack:justify ;justify-content: space-between;">
                    <span class="btn-size">{{item.publishDate}}</span>
                    <span class="btn-box btn-size"@click="SeeDetails(item)">查看详情 >></span>
                  </div>
                </div>
              </el-col>
              <el-col :span="15">
                <div class="news-other">
                  <div class="newitem" v-for="(item,i) in newsList" :key="i" v-if="i!==0" @click="SeeDetails(item)" >
                    <img class="new-img" src="../../assets/images/lingwps.png"  />
                    <div class="news-title ellipsis">{{item.title}}</div>
                    <div class="right-icon"> > </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-pagination
                background
                @size-change="handleSizeChanges"
                @current-change="handleCurrentChanges"
                layout="total,prev, pager, next"
                :current-page.sync="newQuery.pageNum"
                :page-size="newQuery.pageSize"
                :total="newstotal"
                style="margin-top:10px;text-align: center"
              ></el-pagination>
            </el-row>
          </div>
          <div v-if="newsList.length==0" style="height:343px;text-align: center;line-height:343px ;">
            暂无数据
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--图表-->
      <el-row :gutter="10" style="margin:10px -5px 40px -5px">
        <el-col :span="12">
          <div class="block left-box">
            <div class="lineInfo">
              <div class="selectTitle"><em></em><span>我发起的及已通过的</span></div>
              <el-form size="mini"  class="selectYear demo-form-inline">
                <el-form-item label="">
                <el-select v-model="value" placeholder="请选择年份" @change="selectYear">
                  <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div  id="approveLine" style="height: 300px"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="right-box">
            <div class="lineInfo">
              <div class="selectTitle"><em></em><span>我的审批状态</span></div>
              <el-form size="mini"  class="selectYear demo-form-inline">
                <el-form-item label="">
                  <el-select v-model="pievalue" placeholder="请选择年份" @change="selectPieYear">
                    <el-option
                      v-for="item in options"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div  id="approvePie" style="height: 300px"></div>
          </div>
        </el-col>
      </el-row>
      </div>
</template>
<script>
  import {NewsDetails,slideshow,newsType,AnnounceList,newsList} from "@/api/personalDoor";
  import {myApproveLine,myApprovePie} from "@/api/reportInfo";
  const defaultListQuery = {
    title: "",
    pageNum: 1,
    pageSize: 6,
  };
  const newListQuery = {
    title: "",
    type: "",
    pageNum: 1,
    pageSize: 10,
  };
  const date = new Date;
  export default {
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        newQuery: Object.assign({}, newListQuery),
        list: [],
        newsType: [],
        activeName: "新闻",
        AnnounceList: [],
        total: null,
        newstotal: null,
        newsList: [],
        options: [2027,2026,2025,2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013],
        value: date.getFullYear(),
        pievalue:date.getFullYear(),
        lineTitle:''
      };
    },
    methods: {
      handleClick(tab, event) {
        this.newQuery.type = tab.$vnode.data.attrs.id;
        this.newsinitTable();
      },
      onSubmit() {
        this.initTable();
      },
      newsSubmit() {
        this.newsinitTable();
      },
      initTable() {
        AnnounceList(this.listQuery)
          .then((response) => {
            this.AnnounceList = response.datas.list;
            this.total = response.datas.total;
          })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.initTable();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.initTable();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.initTable();
      },
      // 新闻搜索分页
      newsinitTable() {
        newsList(this.newQuery)
          .then((response) => {
            this.newsList = response.datas.list;
            this.newstotal = response.datas.total;
          })
      },
      handleResetSearch() {
        this.newQuery = Object.assign({}, newQuery);
        this.newsinitTable();
      },
      handleSizeChanges(val) {
        this.newQuery.pageNum = 1;
        this.newQuery.pageSize = val;
        this.newsinitTable();
      },
      handleCurrentChanges(val) {
        this.newQuery.pageNum = val;
        this.newsinitTable();
      },
      // 新闻详情
      SeeDetails(row) {
        this.$router.push({ name: "NewsDetails", query:{ uId: row.uId }});
      },
      // 公告详情
      NoticeDetails(row) {
        this.$router.push({ name: "AnnouncementNewsDetails", query: { uId: row.uId },});
      },
      selectYear(e){
        this.drawChart(e)
      },
      selectPieYear(e){
        this.approvePie(e)
      },
      /*图表*/
      drawChart(year) {
        myApproveLine(year).then(res=>{
          let myChart = this.$echarts.init(document.getElementById("approveLine"));
          let legend=[], title='',waitData=[],completeData=[];
          let approveLines= res.datas.approveLinesModels
          this.lineTitle = res.datas.title
          approveLines.forEach((value,key) => {
            legend.push(value.name)
          })
          waitData = approveLines[0].values
          completeData = approveLines[1].values
          let option = {
            title: false,
            tooltip: {},
            legend: {
              data: legend,
              top: 30
            },
            xAxis: {
              data: res.datas.xMonths
            },
            yAxis: {},
            series:[
              {name:legend[0],type:'line', data:waitData},
              {name:legend[1],type:'line',data:completeData}
            ]
          };
          myChart.setOption(option);
          window.addEventListener("resize",function(){
            myChart.resize()
          });
        })
      },
      approvePie(year){
        myApprovePie(year).then(res=>{
          let approvePie = this.$echarts.init(document.getElementById("approvePie"));
          let pieData = res.datas.approveCakesModels;
          let legend = [],statusData=[]
          pieData.forEach((value,key)=>{
            legend.push(value.name)
            statusData.push({name:value.name,value:value.values})
          })
          let option = {
            title: false,
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
             /* orient: 'vertical',*/
              top: '36',
              data: legend
            },
            series: [
              {
                name: '审批状态',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: statusData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          approvePie.setOption(option);
          window.addEventListener("resize",function(){
            approvePie.resize()
          });
        })
      }
    },
    mounted() {
      newsType()
        .then((res) => {
          this.newsType = res.datas;
          this.newQuery.type = res.datas[0].uId;
          this.activeName  = res.datas[0].name
        })
        .then(() => {
          this.initTable()
          slideshow().then((res) => {
            this.list = res.datas;
          })
          this.newsinitTable();
          this.drawChart(this.value);
          this.approvePie(this.pievalue)
        });
    },
  };
</script>

<style scoped>
  .gonggao-box {
    display: flex;
    justify-content: space-between;
    padding-top: 5px;
  }
  .root-box {
    background-color: #f1f1f1;
  }
  .left-box,.right-box {
    padding: 10px;
    background: rgba(255, 255, 255, 1);
  }
  .img-box {
    height: 250px;
    margin-bottom: 10px;
  }
  .img-box img{
    width:100%;
    height: 100%;
  }
  .new-content {
    margin-top: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 1);
  }
  .ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .biaoti {
    height: 24px;
    line-height:24px;
    font-size: 22px;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    margin-bottom: 10px;
  }
  .neirong {
    font-size: 14px;
    height: 16px;
    line-height: 16px;
    color: rgba(76, 76, 76, 1);
    margin-bottom: 10px;
    padding-right: 22px;
  }
  .btn-box {
    width: 100px;
    height: 30px;
    line-height: 30px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 2px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }
  .btn-size {
    font-size: 14px;
    color: rgba(153, 153, 153, 1);
    line-height: 30px;
  }
  .news-other{
    margin-left: 20px;
  }
  .newitem{
    display: flex;
    cursor: pointer;
    height: 36px;
    line-height: 36px;
  }
  .new-img{
    height: 20px;
    margin-right: 10px;
    margin-top:8px;
    flex: 0 1 20px;
  }
  .news-title{
    flex: 1;
  }
  .right-icon {
    flex: 0 1 20px;
    color: #999999;
    font-size: 20px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serf;
  }

  .lineInfo{
    display: flex;
    height: 24px;
    line-height: 24px;
  }
  .selectTitle{
    flex:1;
  }
  .selectYear{
    flex:2;
    text-align: right;
  }
  .selectTitle span{
    display: inline-block;
    vertical-align: top;
  }
  .selectTitle em{
    width:2px;
    height: 24px;
    display: inline-block;
    background-color: #00a0e9;
    margin-right:10px;
  }
</style>

