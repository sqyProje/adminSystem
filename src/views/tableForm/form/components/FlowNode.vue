<template>
  <div class="app-container">
    <el-button size="small" type="primary" @click="QDFlowInfo">表单流程信息</el-button>
    <el-dialog
      title="表单流程"
      :close-on-click-modal="false"
      :visible.sync="QDdialogVisible"
      width="25%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfoQD"
        label-width="80px"
        ref="AddEditInfoQD"
        :rules ="QDrulesInfo"
      >
        <el-form-item label ='名称'  prop="name">
          <el-input v-model="AddEditInfoQD.name"></el-input>
        </el-form-item>
        <el-form-item label ='简介'>
          <el-input type="textarea" v-model="AddEditInfoQD.sketch"></el-input>
        </el-form-item>
        <el-form-item label ='创建时间'>
          <el-input v-model="AddEditInfoQD.createdate" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label ='更新时间'>
          <el-input v-model="AddEditInfoQD.updatedate" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="QDCanle">关 闭</el-button>
          <el-button size="small" type="primary" @click="QDUpdateUser">确 定</el-button>
      </span>
    </el-dialog>
    <Nodes :tableFieldFlag="tableFieldFlag"></Nodes>
    <!--连线管理-->
    <lines :tableFieldFlag="tableFieldFlag"></lines>
    <!--流程图-->
    <h4>流程图</h4>
    <el-button
      type="success"
      size="small"
      @click="UpdateFlow">
      更新</el-button>
    <div style="width: 100%;border:1px solid #e1e1e1;margin-top:20px;position: relative" >
      <div id="tooltip" class="hidden">
        <p><strong>提示:</strong></p>
        <p><span id="tooltip_value"></span></p>
        <p><span id="tooltip_value2"></span></p>
      </div>
      <svg  width="100%" height="400" id="demosvg">
        <g />
        <rect />
      </svg>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as d3 from 'd3'
  import dagreD3 from 'dagre-d3'
  import d3Tip from './d3-tip';
  import { Message, MessageBox } from 'element-ui'
  import {FlowByID,EditQDFlowInfo,FlowNodeLine,FlowLineAll} from '@/api/tableForm'
  import Lines from './line.vue'
  import Nodes from './node.vue'
  export default {
    data(){
      return {
        tableFieldFlag:false,
        QDdialogVisible:false,
        AddEditInfoQD:{
          uId:'',
          tableformid:'',
          name:'',
          sketch:'',
          createdate:'',
          updatedate:'',
        },
        QDrulesInfo:{
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
        },
        nodes:[],
        edges:[]
      }
    } ,
    components:{Nodes,Lines},
    created(){
      this.FlowGet(this.$route.query.form_id);
      this.InitFlow(this.$route.query.form_id)
    },
    methods: {
      UpdateFlow(){
        this.InitFlow(this.$route.query.form_id)
      },
      FlowGet(flowid){
        FlowByID(flowid).then(res=>{
          this.AddEditInfoQD.tableformid=this.$route.query.form_id
          if(res.datas===null){
            this.QDdialogVisible = true
            this.tableFieldFlag = false
            Message({
              message: '请先添加表单信息,再进行节点和线的管理',
              type: 'error',
              duration: 3 * 1000
            })
          }else{
            this.tableFieldFlag = true
            this.AddEditInfoQD = res.datas
          }
        })
      },
      QDUpdateUser(){
        this.$refs.AddEditInfoQD.validate(valid => {
          if (valid) {
            EditQDFlowInfo(this.AddEditInfoQD).then(res=>{
              if (res.status === 0) {
                this.QDdialogVisible = false
                this.tableFieldFlag=true
                this.FlowGet(this.$route.query.form_id)
                Message({
                  message: res.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }
            })
          }else{
            Message({
              message: '验证参数不合法',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      QDCanle(){
        if(this.AddEditInfoQD.uId.length <= 0){
          Message({
            message: '此操作完成,无法节点和线的管理',
            type: 'error',
            duration: 3 * 1000
          })
          this.QDdialogVisible = false
        }else{
          this.QDdialogVisible = false
          this.tableFieldFlag=true
        }
        Object.keys(this.AddEditInfoQD).forEach(key => this.AddEditInfoQD[key]= '');
      },
      QDFlowInfo(){
        this.FlowGet(this.$route.query.form_id);
        this.QDdialogVisible = true
      },
      InitFlow(qdFlowId){
        FlowNodeLine(qdFlowId).then(res=>{
          this.nodes = res.datas
        }).then(()=> {
          FlowLineAll(qdFlowId).then(res => {
            this.edges = res.datas
            console.log(this.edges )

          }).then(() => {
            var g = new dagreD3.graphlib.Graph().setGraph({});
            g.setGraph({
              rankdir: 'LR',
           //   align: 'DL',
              nodesep: 80,
              edgesep: 100,
              ranksep: 100,
              marginx: 50,
              marginy: 50,
            });
            this.nodes.forEach(item => {
              g.setNode(item.uId, {
                //节点标签
                label: item.name,
                approveNodeName:item.approveNodeName,
                userName:item.userName,
                qdflownodeName:item.qdflownodeName,
                approveroleName:item.approveroleName,
                //节点形状
                shape: item.shape,
                //节点样式
                style: "fill:#fff;stroke:#000",
                //节点标签样式
                labelStyle: "fill:#000",
                id: item.uId,
                width: 100,
              })
            })
            this.edges.forEach(item => {
              g.setEdge(item.lastid, item.nextid, {
                //边标签
                label: item.name,
                //边样式
                style: "fill:#fff;stroke:#666;stroke-width:2px",
                labelStyle: "fill:#1890ff",
                arrowhead: "vee",
                arrowheadStyle: "fill:#666"
              })
            })
            let render = new dagreD3.render();
            let svg = d3.select('#demosvg')
            let svgGroup = svg.select('g');
            render(svgGroup, g);
            // 建立拖拽缩放
            let zoom = d3.zoom()
              .on("zoom", function () {
                svgGroup.attr("transform", d3.event.transform);
              });
            svg.call(zoom);

            //实现Tip
            const tip = d3Tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(c => c);
            svg.call(tip);

            //鼠标悬停节点事件
            svgGroup.selectAll("g.node").on('mouseover', function (v) {
            //  console.log(g.node(v))
              d3.select("#tooltip")
                .attr("style", "left:" + g.node(v).x + "px" + ";top:" + g.node(v).y + "px")
                .select("#tooltip_value")
                .html("审批类型：" + g.node(v).approveNodeName+
                  "<br>流程类型：" + g.node(v).qdflownodeName+
                "<br>审批人："+g.node(v).userName+
                "<br>审批角色："+g.node(v).approveroleName)

              //显示提示条
              d3.select("#tooltip").classed("hidden", false);
            });
            svgGroup.selectAll("g.node").on('mouseout', function (v) {
              //显示提示信息方案一：隐藏提示条
              d3.select("#tooltip").classed("hidden", true);
            })
          })
        })
      },
    }
  }

</script>

<style>
  svg {
    font-size: 14px;
  }

  .node rect {
    stroke: #606266;
    fill: #fff;
  }

  .edgePath path {
    stroke: #606266;
    fill: #333;
    stroke-width: 1.5px;
  }
  #tooltip {
    position: absolute;
    width: 150px;
    height: auto;
    padding: 5px;
    background-color: rgba(0,0,0,0);
    border: 1px solid #ccc;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    font-size: 12px;
    -webkit-box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
    -moz-box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
    box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
    pointer-events: none;
  }

  #tooltip.hidden {
    display: none;
  }

  #tooltip p {
    margin: 0;
    font-family: sans-serif;
    font-size: 12px;
    line-height: 20px;
  }
</style>
