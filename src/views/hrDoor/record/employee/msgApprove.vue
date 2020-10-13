<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.stationType" placeholder="人员岗位分类" style="width: 100%;">
            <el-option
              v-for="item in TypeData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.getStation" placeholder="聘用岗位" style="width: 100%;">
            <el-option
              v-for="item in GetData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.getStationLevel" placeholder="聘用岗位等级" style="width: 100%;">
            <el-option
              v-for="item in LevelData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.checkYearResult" placeholder="考核结果" style="width: 100%;">
            <el-option
              v-for="item in ResultData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchList"  size="small">查询</el-button>
          <el-button
            type="warning"
            @click="handleResetSearch()"
            size="small">
            重置
          </el-button>
        </el-form-item>
        <el-col>
          <el-form-item>
            <el-button
              type="success"
              size="small"
              @click="handleAdd">
              添加</el-button>
            <el-button
              type="warning"
              size="small"
              @click="ExportFun">
              导出模板</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-table
        class="basetreetable"
        :data="tableData"
        v-loading="listLoading"
        row-key="uId"
        :tree-props="{children:'childMenu',hasChildren:'hasChildren'}"
        size  = "small"  max-height="600"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="个人编码" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="人员岗位分类" prop="stationType"></el-table-column>
        <el-table-column label="聘用岗位" prop="getStation"></el-table-column>
        <el-table-column label="聘用岗位等级" prop="getStationLevel"></el-table-column>
        <el-table-column label="进入时间" prop="inTime"></el-table-column>
        <el-table-column label="考核年度" prop="checkYear"></el-table-column>
        <el-table-column label="平时考核" prop="otherCheck"></el-table-column>
        <el-table-column label="考核结果" prop="checkYearResult"></el-table-column>
        <el-table-column label="审批单位" prop="approveUnit"></el-table-column>
        <el-table-column label="上报类别" prop="upType"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'warning' : 'success'">
              {{scope.row.state ? "显示" :"隐藏"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[10,20,30]"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="100px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-row>
          <el-col :span=12>
            <el-form-item label='个人编号' prop="number">
              <el-input v-model.trim="AddEditInfo.number"  placeholder ='编号'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label='姓名' prop="name">
              <el-input v-model="AddEditInfo.name"  placeholder ='姓名'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=12>
            <el-form-item label='人员岗位分类'>
              <el-select v-model="AddEditInfo.stationType" placeholder="人员岗位分类" style="width: 100%;">
                <el-option
                  v-for="item in TypeData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label='聘用岗位'>
              <el-select v-model="AddEditInfo.getStation" placeholder="聘用岗位" style="width: 100%;">
                <el-option
                  v-for="item in GetData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=12>
            <el-form-item label='聘用岗位等级'>
              <el-select v-model="AddEditInfo.getStationLevel" placeholder="聘用岗位等级" style="width: 100%;">
                <el-option
                  v-for="item in LevelData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label='上报类别'>
              <el-select v-model="AddEditInfo.upType" placeholder="上报类别" style="width: 100%;">
                <el-option
                  v-for="item in upTypeData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=12>
            <el-form-item label='进入时间'>
              <el-date-picker
                type="date"
                placeholder="进入时间"
                v-model="AddEditInfo.inTime"
                value-format="yyyy-MM-dd"
                :editable="false"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label='考核年度' prop="checkYear">
              <el-date-picker
                type="year"
                placeholder="考核年度"
                v-model="AddEditInfo.checkYear"
                value-format="yyyy"
                :editable="false"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=12>
            <el-form-item label='审批时间' prop="approveTime">
              <el-date-picker
                type="date"
                placeholder="审批时间"
                v-model="AddEditInfo.approveTime"
                value-format="yyyy-MM-dd"
                :editable="false"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label='审批单位'>
              <el-input v-model="AddEditInfo.approveUnit"  placeholder ='审批单位'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label='平时考核' style="width: 100%;">
            <el-input v-model="AddEditInfo.otherCheck"  placeholder ='平时考核'></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span=12>
            <el-form-item label='考核结果'>
              <el-select v-model="AddEditInfo.checkYearResult" placeholder="考核结果" style="width: 100%;">
                <el-option
                  v-for="item in ResultData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label='状态'>
              <el-select v-model="AddEditInfo.state" placeholder="状态" style="width: 100%;">
                <el-option
                  v-for="item in StateData"
                  :label="item.name"
                  :value="item.id"
                  :key = "item.id"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label='备注'>
            <el-input v-model="AddEditInfo.sketch"  placeholder ='备注'></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {dictionType,importExcel} from '@/api/basic'
  import {YearCheckList,AddYearCheck,GetYearCheck,EditYearCheck,DeleteYearCheck,yearCheckExport} from '@/api/personnel'
  const defaultListQuery = {
    name: '',
    stationType:'',
    getStation:'',
    getStationLevel:'',
    checkYear:'',
    checkYearResult:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listLoading:true,
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          uId:'',
          approveTime:'',
          approveUnit:'',
          checkYear:'',
          checkYearResult:'',
          getStation:'',
          getStationLevel:'',
          inTime:'',
          name:'',
          number:'',
          otherCheck:'',
          sketch:'',
          state:'',
          stationType:'',
          upType:'',
        },
        TypeData:[],
        GetData:[],
        LevelData:[],
        ResultData:[],
        upTypeData:[],
        StateData:[
          {name:'显示',id:1},{name:'隐藏',id:0}
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          number:[{required: true, trigger: 'blur', message: '请输入个人编号'}],
          checkYear:[{required: true, trigger: 'blur', message: '请选择考核年度'}],
          approveTime:[{required: true, trigger: 'blur', message: '请选择审批时间'}],
        }
      }
    } ,
    created(){
      this.initTable();
      dictionType('4b3845ff7901445ea477b9b34e796cd7').then(res=>{
          this.TypeData= res.datas
      })
      dictionType('4d8295138dac4fb9b8c1f89ff44beb57').then(res=>{
        this.GetData= res.datas
      })
      dictionType('5b785f29e56e4d9a9563655391ca8db2').then(res=>{
        this.LevelData= res.datas
      })
      dictionType('b11bbcb3b7e24a00879be3372c4c22c0').then(res=>{
        this.ResultData= res.datas
      })
      dictionType('38be2def810d4ec8b6b55b86652655d4').then(res=>{
        this.upTypeData= res.datas
      })
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        YearCheckList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
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
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.state=1
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetYearCheck(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddYearCheck(this.AddEditInfo)
                .then(response => {
                  this.dialogVisible = false
                  if (response.status === 0) {
                    this.initTable();
                    Message({
                      message: response.msg,
                      type: 'success',
                      duration: 3 * 1000
                    })
                  }
                })

            } else {
              EditYearCheck(this.AddEditInfo).then(response => {
                if (response.status === 0) {
                  this.dialogVisible = false
                  this.initTable();
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                }
              })

            }
          }else{
            Message({
              message: '参数验证不合法',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      handleDelete(row) {
        MessageBox.confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          DeleteYearCheck(row.uId)
            .then(response => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              this.initTable()
            })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      ExportFun(){
        yearCheckExport().then(res=>{
          importExcel(res)
        })
      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      }
    }
  }

</script>


