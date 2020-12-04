<template>
  <div class="app-container">
    <search-tree
      :toChildId="listQuery.departname"
      :toChildTree=" departData"
      @childFnToParent="childFnInfo"
    ></search-tree>
    <el-col :xs="16" :sm="18" :md="21">
      <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="listQuery.payNameId" filterable placeholder="工资表单">
            <el-option
              v-for="item in payData"
              :key="item.uId"
              :value="item.uId"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            type="month"
            placeholder="工资年月时间"
            v-model="listQuery.payDate"
            value-format="yyyy-MM"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.realName" placeholder="员工姓名"></el-input>
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
              导入</el-button>
            <el-button
              type="warning"
              size="small"
              @click="ExportFun">
              导出模板</el-button>
            <el-button
              type="primary"
              size="small"
              @click="ExportAll">
              导出报表</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-table
        class="basetreetable"
        :data="tableData"
        v-loading="listLoading"
        size  = "small"
        max-height="600"
      >
        <el-table-column label="编号" prop="number"></el-table-column>
        <el-table-column label="部门" prop="departname"></el-table-column>
        <el-table-column label="姓名" prop="realname"></el-table-column>
        <el-table-column label="薪资月份" prop="salarydate"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="扣款合计" prop="deductTotal"></el-table-column>
        <el-table-column label="应发合计"  >
          <template slot-scope="scope">
            {{scope.row.salaryTotal}}
          </template>
        </el-table-column>
        <el-table-column label="实发合计" >
          <template slot-scope="scope">
            {{scope.row.salaryPay}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.row)">薪资清单</el-button>
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
          :page-sizes="[50,100,150]"
          :total="total">
        </el-pagination>
      </div>
    </div>
    </el-col>
    <el-dialog
      title='薪资清单'
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="detailsVisible"
      width="23%">
      <div>
        <div>
          <h4>扣除款项明细：</h4>
          <p>大病救助：{{DeatailSalary.bigIllHelp}}</p>
          <p>医疗保险：{{DeatailSalary.medicalInsurance}}</p>
          <p>养老保险：{{DeatailSalary.oldInsurance}}</p>
          <p>其他扣除：{{DeatailSalary.otherDeduct}}</p>
          <p>公积金：{{DeatailSalary.saveFunds}}</p>
          <p>失业保险：{{DeatailSalary.workInsurance}}</p>
        </div>
        <div>
          <h4>应发工资明细：</h4>
          <p>独生：{{DeatailSalary.aloneSubsidy}}</p>
          <p>职务：{{DeatailSalary.dutySubsidy}}</p>
          <p>薪级工资：{{DeatailSalary.gradePay}}</p>
          <p>医疗和卫生：{{DeatailSalary.healthSubsidy}}</p>
          <p>护士津贴：{{DeatailSalary.nurseSubsidy}}</p>
          <p>其他：{{DeatailSalary.otherSubsidy}}</p>
          <p>岗位工资：{{DeatailSalary.stationPay}}</p>
          <p>津贴：{{DeatailSalary.subsidy}}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary"  @click="detailsVisible=!detailsVisible">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入工资表"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="dialogVisible"
      width="23%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="120px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='工资年月'  prop="payDate">
          <el-date-picker
            type="month"
            placeholder="工资年月"
            v-model="AddEditInfo.payDate"
            value-format="yyyy-MM"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label ='核算开始时间'  prop="payStartDate">
          <el-date-picker
            type="date"
            placeholder="核算开始时间"
            v-model="AddEditInfo.payStartDate"
            value-format="yyyy-MM-dd"
            :picker-options="startDateLimit"
            :editable="false"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label ='核算结束时间'  prop="payEndDate">
          <el-date-picker
            type="date"
            placeholder="核算结束时间"
            v-model="AddEditInfo.payEndDate"
            value-format="yyyy-MM-dd"
            :picker-options="endDateLimit"
            :editable="false"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label ='表单名称'  prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='工资备注'>
          <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
        </el-form-item>
        <el-form-item label ='工资表' prop="file">
          <input type="file" ref="fileurl"  @change="handleChange($event)" />
          <el-input type="hidden" v-model="AddEditInfo.file"></el-input>
        </el-form-item>
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
  import SearchTree from '@/components/LeftSearchTree/searchtree'
  import {importExcel} from '@/api/basic'
  import {SalaryList,ExportModel,ExcelImport,PayName,ExportDatas,GetDepartInfoArray} from '@/api/personnel'
  const defaultListQuery = {
    payNameId:'',
    payDate:'',
    realName:'',
    departName:'',
    pageNum:1,
    pageSize:50
  }

  export default {
    data(){
      return {
        listLoading:true,
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        File:'',
        payData:[],
        departData:[],
        dialogVisible: false,
        detailsVisible:false,
        DeatailSalary:{},
        AddEditInfo:{
          payDate:'',
          payStartDate:'',
          payEndDate:'',
          name:'',
          sketch:'',
          file:''
        },
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入表单名称'}],
          payDate:[{required: true, trigger: 'blur', message: '请选择工资年月'}],
          payStartDate:[{required: true, trigger: 'blur', message: '请选择开始核算时间'}],
          payEndDate:[{required: true, trigger: 'blur', message: '请选择结束核算时间'}],
          file:[{ required: true,trigger: 'blur',message: '请选择工资表'}]
        },
        startDateLimit: {
          disabledDate: (time) => {
            let endTime = this.AddEditInfo.payEndDate;
            if (endTime) {
              return time.getTime() > new Date(endTime).getTime();
            }
          }
        },
        endDateLimit: {
          disabledDate: (time) => {
            let beginTime = this.AddEditInfo.payStartDate;
            if (beginTime) {
              return time.getTime() < new Date(beginTime).getTime() - 8.64e7;  //开始和结束可以选择同一天
            }
          }
        }
      }
    } ,
    created(){
      this.initTable();
      this.departFu();
      PayName().then(res=>{
        this.payData=res.datas
      })
    },
    components:{
      SearchTree
    },
    methods: {
      departFu(){
        GetDepartInfoArray().then(response=>{
          response.datas.forEach(item=>{
            this.departData.push(item)
          })
        })
      },
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        SalaryList(this.listQuery).then(response => {
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
      },
      handleChange(file){
        this.AddEditInfo.file=file.target.files[0]
      },
      UpdateUser(){
        let param = new FormData();
        param.append("payDate", this.AddEditInfo.payDate);
        param.append("payStartDate", this.AddEditInfo.payStartDate);
        param.append("payEndDate", this.AddEditInfo.payEndDate);
        param.append("name", this.AddEditInfo.name);
        param.append("sketch", this.AddEditInfo.sketch);
        param.append("file",  this.AddEditInfo.file);
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            ExcelImport(param)
                .then(response => {
                  this.dialogVisible = false
                  if (response.status === 0) {
                    this.initTable();
                    PayName().then(res=>{
                      this.payData=res.datas
                    })
                    Message({
                      message: response.msg,
                      type: 'success',
                      duration: 3 * 1000
                    })
                  }
                })

          }else{
            Message({
              message: '参数验证不合法',
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
      },
      canleDialog(){
        this.dialogVisible = false
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.$refs.fileurl.value=''
        this.$refs.AddEditInfo.resetFields()
      },
      ExportFun(){
        ExportModel().then(res=>{
          importExcel(res)
        })
      },
      ExportAll(){
        ExportDatas(this.listQuery).then(res=>{
          importExcel(res)
        })
      },
      childFnInfo(payload){
        if(payload.Name ==='全部'){
          this.listQuery.departName = ''
        }else{
          this.listQuery.departName = payload.Name
        }
        this.initTable(this.listQuery);
      },
      handleEdit(row){
        this.DeatailSalary=row
        this.detailsVisible = !this.detailsVisible
      }

    }
  }

</script>


