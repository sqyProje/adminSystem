<template>
  <div class="root-box">
    <div class="top-root" style="margin-top: 10px;">
      <div class="block left-box">
        <div class="lineInfo">
          <div class="selectTitle"><em></em><span>各部门审批通过折线统计图</span></div>
          <el-form size="mini"  class="selectYear demo-form-inline">
            <el-form-item label="">
              <el-select v-model="value" clearable placeholder="请选择年份" @change="selectYear">
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
      <div class="right-box">
        <div class="lineInfo">
          <div class="selectTitle"><em></em><span>各审批类型审批通过汇总图</span></div>
          <el-form size="mini"  class="selectYear demo-form-inline">
            <el-form-item label="">
              <el-select v-model="pievalue" clearable placeholder="请选择年份" @change="selectPieYear">
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
    </div>
  </div>
</template>

<script>
  import {yearApproveLine,yearApprovePie} from "@/api/ecahrt";
  const date = new Date;
  export default {
    data() {
      return {
        options: [2027,2026,2025,2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013],
        value: date.getFullYear(),
        pievalue:date.getFullYear(),
        lineTitle:''
      };
    },
    methods: {
      selectYear(e){
        this.drawChart(e)
      },
      selectPieYear(e){
        this.approvePie(e)
      },
      /*图表*/
      drawChart(year) {
        yearApproveLine(year).then(res=>{
          let myChart = this.$echarts.init(document.getElementById("approveLine"));
          let legend=[], title='',waitData=[];
          let approveLines= res.datas.approveLinesModels
          this.lineTitle = res.datas.title
          approveLines.forEach((value,key) => {
            legend.push(value.name)
            waitData.push({
              name:value.name,
              type:'line',
              data:value.values
            })
          })
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
            color : [ '#56D6BC', '#F29B76', '#00B7EE', '#439928', '#FFA800', 'indigo', 'purple' ],
            yAxis: {},
            series:waitData
          };
          myChart.setOption(option);
          window.addEventListener("resize",function(){
            myChart.resize()
          });
        })
      },
      approvePie(year){
        yearApprovePie(year).then(res=>{
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
                name: '审批通过率',
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
      this.drawChart(this.value);
      this.approvePie(this.pievalue)
    },
  };
</script>

<style>
  .root-box {
    background-color: #f1f1f1;
    padding: 10px 10px 100px;
    min-height: 800px;
  }
  .top-root {
    display: flex;
    justify-content: space-between;
  }
  .left-box {
    width: 50%;
    height: 380px;
    margin-right: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 1);
  }
  .right-box {
    width: 50%;
    height: 380px;
    padding: 10px;
    background: rgba(255, 255, 255, 1);
    position: relative;
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
