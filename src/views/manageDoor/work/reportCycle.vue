<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="名称"></el-input>
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
              v-if="hasPerm('meeting:add')"
              @click="handleAdd">
              添加</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-table
        class="basetreetable"
        :data="tableData"
        v-loading="listLoading"
        size  = "small"  max-height="600"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="汇报类型">
          <template slot-scope="scope">
            {{scope.row.reporttype===10 ? "自由汇报" :"规则汇报"}}
          </template>
        </el-table-column>
        <el-table-column label="去汇报类型">
          <template slot-scope="scope">
            {{scope.row.toreporttype===10 ? "单独个人" :"其中之一"}}
          </template>
        </el-table-column>
        <el-table-column label="汇报周期（天）" prop="reportdays"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "显示" :"不显示"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
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
      :close-on-click-modal="false"
      :show-close="false"
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
        <el-form-item label ='名称' prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="汇报类型" prop="reporttype">
          <el-select
            v-model="AddEditInfo.reporttype"
            placeholder="汇报类型"
            style="width: 100%;">
            <el-option
              v-for="item in reportData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='去汇报类型' prop="toreporttype">
          <el-select v-model="AddEditInfo.toreporttype" placeholder="去汇报类型" style="width: 100%;" @change="toReportFun">
            <el-option
              v-for="item in toreportData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='汇报周期' prop="reportdays">
          <el-input type="number" v-model="AddEditInfo.reportdays" placeholder="汇报周期（天）" min="0"></el-input>
        </el-form-item>
        <el-form-item label ='汇报人员' prop="reportUserIds">
          <el-input type="hidden" v-model="AddEditInfo.reportUserIds" style="width: 0;height: 0;"></el-input>
          <el-button size="small" v-on:click.native="userRole" type="primary">选择汇报人员</el-button>
        </el-form-item>
        <el-form-item label ='被汇报人员' prop="toreportUserIds">
          <el-input type="hidden" v-model="AddEditInfo.toreportUserIds" style="width: 0;height: 0;"></el-input>
          <el-button size="small" v-on:click.native="userRoleTo" type="primary">选择被汇报人员</el-button>
        </el-form-item>
        <el-form-item label ='排序' prop="sort">
          <el-input type="number" v-model="AddEditInfo.sort" min="0"></el-input>
        </el-form-item>
        <el-form-item label='状态'>
          <el-select v-model="AddEditInfo.state" placeholder="状态" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="选择汇报人员"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="RoleDialogVisible"
      width="33%">
      <el-input
        size="mini"
        style="width: 260px"
        placeholder="输入人员姓名进行过滤"
        v-model="reportText"
        clearable>
      </el-input>
      <el-tree
        :data="roleData"
        show-checkbox
        node-key="id"
        ref="roleData"
        :default-expanded-keys="resourceCheckedKey"
        :default-checked-keys="resourceCheckedKey"
        :filter-node-method="filterNode"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="RoleCanleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateRoleMenu">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="选择被汇报人员其中之一"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="RoleDialogVisibleTo"
      width="33%">
      <!--:check-strictly="true" 父子是否关联-->
      <el-input
        size="mini"
        style="width: 260px"
        placeholder="输入人员姓名进行过滤"
        v-model="filterToText"
        clearable>
      </el-input>
      <el-tree
        :data="roleDataTo"
        show-checkbox
        node-key="id"
        ref="roleDataTo"
        :default-expanded-keys="resourceCheckedKeyTo"
        :default-checked-keys="resourceCheckedKeyTo"
        :filter-node-method="filterNode"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="RoleCanleDialogTo">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateRoleMenuTo">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="选择被汇报人员单选个人"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="radioFlag"
      width="33%">
      <!--:check-strictly="true" 父子是否关联-->
      <el-input
        size="mini"
        style="width: 260px"
        placeholder="输入人员姓名进行过滤"
        v-model="filterText"
        clearable>
      </el-input>
      <el-tree
        ref="fileTree"
        :data="roleDataTo"
        :check-strictly="true"
        :show-checkbox="true"
        :default-expanded-keys="resourceCheckedKeyTo"
        :default-checked-keys="resourceCheckedKeyTo"
        @check-change="checkChange"
        :filter-node-method="filterNode"
        :props="defaultProps"
         node-key="id">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="RoleCanleDialogTo">取 消</el-button>
          <el-button size="small" type="primary" @click="RoleCanleDialogTo">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {enumeration} from '@/api/basic'
  import {ReportList,ReportAdd,GetReport,EditReport,DeleteReport,GetReportUser,GetToReportUser} from '@/api/address'
  const defaultListQuery = {
    name: '',
    meetingRoomId:'',
    startDate:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        dialogTitle:'',
        dialogVisible: false,
        userIds:[],
        AddEditInfo:{
          uId:'',
          reporttype:'',
          toreporttype:'',
          name:'',
          reportdays:'',
          reportUserIds:'',
          toreportUserIds:'',
          sort:'',
          state:'',
        },
        reportData:[
          { id: 10, display_name: '自由汇报'},
          { id: 20, display_name: '规则汇报'}
        ],
        toreportData:[
          { id: 10, display_name: '单独个人'},
          { id: 20, display_name: '其中之一'}
        ],
        stateData:[
          { id: 0, display_name: '不显示'},
          { id: 1, display_name: '显示'}
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          reporttype:[{required: true, trigger: 'blur', message: '请选择汇报类型'}],
          toreporttype: [{ required: true,trigger: 'blur',message: '请选择去汇报类型'}],
          reportdays:[{required: true, trigger: 'blur', message: '请输入汇报周期'}],
          reportUserIds:[{required: true, trigger: 'blur', message: '请选择汇报人'}],
          toreportUserIds:[{required: true, trigger: 'blur', message: '请选择被汇报人'}],
          sort: [{ required: true,trigger: 'blur',message: '排序应为数字'}],
          state: [{ required: true,trigger: 'blur',message: '请选择状态'}],
        },
        RoleDialogVisible:false,
        roleData:[],
        resourceCheckedKey:[],
        RoleDialogVisibleTo:false,
        roleDataTo:[],
        resourceCheckedKeyTo:[],
        defaultProps: {
          children: 'childrenMenu',
          label: 'name',
        },

        /*单选个人*/
        radioFlag:false,
        fileTree: [],
        leafCheckArr: [],
        oldCheckKey: '',
        reportText:'',
        filterText:'',
        filterToText:''
      }

    } ,
    created(){
      this.initTable();
    },
    watch: {
      reportText(val){
        this.$refs.roleData.filter(val)
      },
      filterText(val) {
        this.$refs.fileTree.filter(val);
      },
      filterToText(val) {
        this.$refs.roleDataTo.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        ReportList(this.listQuery).then(response => {
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
        GetReport(row.uId).then(response=>{
          this.AddEditInfo = response.datas
          this.AddEditInfo.toreportUserIds=response.datas.toreportuserid
          this.AddEditInfo.reportUserIds=response.datas.reportuserid
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              ReportAdd(this.AddEditInfo)
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
              EditReport(this.AddEditInfo).then(response => {
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
          DeleteReport(row.uId)
            .then(response => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              let totalPage = Math.ceil((this.total - 1)/this.listQuery.pageSize);
              let currentPage = this.listQuery.pageNum > totalPage ? totalPage : this.listQuery.pageNum;
              this.listQuery.pageNum = this.listQuery.pageNum < 1 ? 1 : currentPage;
              this.initTable()
            })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      //选择汇报人员
      userRole(){
        this.RoleDialogVisible = true
        this.reportText = ''
        GetReportUser(this.AddEditInfo.uId).then(response=>{
          this.roleData = response.datas
          this.parseJson(this.roleData)
          this.resourceCheckedKey = this.AddEditInfo.reportUserIds.split(',')
          //this.findAllChildren( this.parseJson(this.roleData),this.resourceCheckedKey)
          this.$nextTick(()=>{
            this.$refs.roleData.setCheckedKeys(this.resourceCheckedKey)
          })

        })
      },
      UpdateRoleMenu(){
        let checkedKeys = this.$refs.roleData.getCheckedKeys();
        checkedKeys =  checkedKeys.filter((value)=>{
          return value !== undefined
        })
      //  console.log(checkedKeys)
        this.AddEditInfo.reportUserIds = checkedKeys.toString()

        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
      },
      RoleCanleDialog(){
        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
      },
      /*被汇报人员*/
      userRoleTo(){
        if(this.AddEditInfo.toreporttype===10){ //单选
          this.radioFlag=true
          this.RoleDialogVisibleTo=false
          this.filterText = ''
          GetToReportUser(this.AddEditInfo.uId).then(response=>{
            this.roleDataTo = response.datas
            this.parseJson(this.roleDataTo)
            this.resourceCheckedKeyTo = this.AddEditInfo.toreportUserIds.split(',')
           // console.log( this.resourceCheckedKeyTo)
            //  this.findAllChildren(this.roleDataTo,this.resourceCheckedKeyTo)
            this.$nextTick(()=>{
              this.$refs.fileTree.setCheckedKeys(this.resourceCheckedKeyTo)
            })

          })
        }else if(this.AddEditInfo.toreporttype===20){ //多选
          this.radioFlag=false
          this.RoleDialogVisibleTo=true
          this.filterToText = ''
          GetToReportUser(this.AddEditInfo.uId).then(response=>{
            this.roleDataTo = response.datas
            this.parseJson(this.roleDataTo)
            this.resourceCheckedKeyTo = this.AddEditInfo.toreportUserIds.split(',')
           // console.log( this.resourceCheckedKeyTo)
            //  this.findAllChildren(this.roleDataTo,this.resourceCheckedKeyTo)
            this.$nextTick(()=>{
              this.$refs.roleDataTo.setCheckedKeys(this.resourceCheckedKeyTo)
            })

          })
        }else{
          Message({
            type: 'warning',
            message: '请先选择去汇报类型'
          });
          return
        }
      },
      UpdateRoleMenuTo(){
        let checkedKeys = this.$refs.roleDataTo.getCheckedKeys();
        checkedKeys =  checkedKeys.filter((value)=>{
          return value !== undefined
        })
        this.AddEditInfo.toreportUserIds = checkedKeys.toString()
        //console.log(this.AddEditInfo.toreportUserIds)
        this.RoleDialogVisibleTo = false
        this.resourceCheckedKeyTo=[]
        this.roleDataTo = []
      },
      RoleCanleDialogTo(){
        this.RoleDialogVisibleTo = false
        this.radioFlag = false
        this.resourceCheckedKeyTo=[]
        this.roleDataTo = []
      },
      //遍历选中子节点
      findAllChildren(data,arr){
        data.forEach((item,index)=>{
          if(item.childrenMenu.length!==0){
            item.childrenMenu.forEach((child)=>{
              if(child.selected){
                arr.push(child.id)
              }
            })
          }
        })
      },
      parseJson(arr){
        var key = 'childrenMenu'
        arr = arr.slice()
        function toParse(arr) {
          arr.forEach(function (item) {
            if (item.childMenu && Array.isArray(item.childMenu)) {
              item[key] = item.childMenu
              toParse(item[key])
            }
            if (item.user && Array.isArray(item.user)) {
              item.user.forEach(function (child) {
                item[key] .push( {id:child.uId,name:child.realname,selected:child.selected})
                toParse(item[key])
              })
            }
            delete item.user
            delete item.childMenu
          })
          return arr
        }
        return toParse(arr)
      },
      toReportFun(event){
        if(event==10){
          this.AddEditInfo.toreporttype=10
          Message({
            type: 'warning',
            message: '只能选择单个被汇报人员'
          });
        }else{
          this.AddEditInfo.toreporttype=20
          Message({
            type: 'warning',
            message: '能选择单个或多个被汇报人员'
          });
        }

      },
      /*单选个人*/
      checkChange(a,b,c) {
        this.leafCheckArr = this.$refs.fileTree.getCheckedKeys()
      //  console.log(this.leafCheckArr)
        let arr = []
        this.leafCheckArr.forEach(item => {
          arr.push(item)
        })
        if (this.leafCheckArr.length > 1) {
          arr = this.leafCheckArr.filter(item => {
            return item !== undefined && item !==this.AddEditInfo.toreportUserIds
          })
        }
        //console.log(arr)
        if(arr.length>1){
          Message({
            type: 'warning',
            message: '只能选择单人，请先取消'
          });
        }
        else {
          this.AddEditInfo.toreportUserIds = arr.join('')
         // console.log(this.AddEditInfo.toreportUserIds)

          this.$refs.fileTree.setCheckedKeys([]);
          this.$refs.fileTree.setCheckedKeys([this.AddEditInfo.toreportUserIds]);
        }
      },

    }
  }

</script>


