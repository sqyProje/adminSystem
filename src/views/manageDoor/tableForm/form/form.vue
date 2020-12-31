<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.approveType" placeholder="所属分类" style="width: 100%;">
            <el-option
              v-for="item in dictionTypeData"
              :label="item.name"
              :value="item.uId"
              :key="item.uId">
              {{item.name}}</el-option>
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
              v-if="hasPerm('form:add')"
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
        <el-table-column label="类型" prop="approvetypename"></el-table-column>
        <el-table-column label="状态"  width="70">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "显示" :"不显示"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="简介" prop="sketch"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="操作" fixed="right" width="460px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleFlow(scope.$index, scope.row)"
            >表单流程</el-button>
            <el-button
              size="mini"
              v-if="hasPerm('form:field')"
              @click="handleFileds(scope.$index, scope.row)"
            >表单字段</el-button>
            <el-button
              size="mini"
              type="info"
              @click="handleCopy(scope.row)">复制</el-button>
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('form:edit')"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="hasPerm('form:deletes')"
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
      width="25%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="80px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='图片'>
          <singleUpload  v-model="AddEditInfo.picpath" @input="picFun"></singleUpload>
        </el-form-item>
        <el-form-item label ='名称'  prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='简介'>
          <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
        </el-form-item>
        <el-form-item label='所属分类' prop="approvetypename">
          <el-select v-model="AddEditInfo.approvetypename" placeholder="所属分类" style="width: 100%;">
            <el-option
              v-for="item in dictionTypeData"
              :label="item.name"
              :value="item.uId"
              :key="item.uId">
              {{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='用户树'>
          <!--prop="usersView"-->
          <el-input type='hidden' v-model="AddEditInfo.usersView" style="width: 0;height: 0;"></el-input>
          <el-button size="small" v-on:click.native="userRole('')" type="primary">选择用户</el-button>
        </el-form-item>
        <el-form-item label ='排序'>
          <el-input v-model="AddEditInfo.sort" type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
        </el-form-item>
        <el-form-item label='状态'>
          <el-select v-model="AddEditInfo.state" style="width: 100%;">
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
    <!--选择用户-->
    <el-dialog
      title="选择用户"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="RoleDialogVisible"
      width="33%">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="DutyNameText" multiple placeholder="职务名称" clearable style="width: 100%;">
            <el-option
              v-for="item in DutyName"
              :label="item.name"
              :value="item.name"
              :key="item.uId">
              {{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchDuty()"  size="small">查询</el-button>
        </el-form-item>
      </el-form>
      <el-input
        size="mini"
        style="width: 260px;"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        clearable>
      </el-input>
      <el-row :gutter = '10'>
        <el-col :span="14">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <!--
          :check-on-click-node = true
            @check='checks'
            @check-change="handleCheckChange"
          -->
          <el-tree
            :data="roleData"
            show-checkbox
            node-key="uId"
            ref="roleData"
            :default-expanded-keys="resourceCheckedKey"
            :default-checked-keys="resourceCheckedKey"
            :filter-node-method="filterNode"
            :props="defaultProps">
          </el-tree>
        </el-col>
        <!--<el-col :span="10">
          <ul>
            <li v-for="(item,index) in checkArray" :key="index">{{item}}</li>
          </ul>
        </el-col>-->
      </el-row>

      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="RoleCanleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateRoleMenu">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import {dictionType} from '@/api/basic'
  import singleUpload from '@/components/Upload/singleImg'
  import {InitList,AddInfo,GetInfo,EditInfo,DeleteInfo,GetFlowUserDrop,dutyFind,copyTableField} from '@/api/tableForm'
  const defaultListQuery = {
    name: '',
    approveType:'',
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
        AddEditInfo:{
          picUrl:'',
          name:'',
          approvetypename:'',
          sketch:'',
          usersView:'',
          sort:'',
          state:'',
        },
        stateData:[
          { id:0 , display_name: '不显示' },
          { id:1, display_name: '显示' }
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          approvetypename:[{required: true, trigger: 'blur', message: '请选择所属分类'}],
        //  usersView:[{ required: true,trigger: 'blur',message: '请选择用户'}]
        },
        dictionTypeData:[],
        RoleDialogVisible:false,
        roleData:[],
        resourceCheckedKey:[],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        filterText:'',
        DutyName:[],
        DutyNameText:'',
        checkAll:false,
        checkArray:[],
      }
    } ,
    created(){
      if(this.$route.query.pageNum){
        this.listQuery.pageNum = this.$route.query.pageNum
      }
      this.initTable();
      dictionType('0556e14a6dbc49a1bb668421ad570560')
        .then(res=>{
          this.dictionTypeData = res.datas
        })
      dutyFind().then(res=>{
        this.DutyName = res.datas
      })
    },
    components:{
      singleUpload,
    },
    watch: {
      filterText(val) {
        this.$refs.roleData.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleCopy(row){
        copyTableField(row.uId)
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
      },
      picFun(data){
        this.AddEditInfo.picpath = data
      },
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        InitList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.initTable()
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
      getChildImg(v){
        this.AddEditInfo.picUrl= v
      },
      handleAdd(row){
        this.DutyNameText = ''
        this.checkAll = false
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '添加'
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.AddEditInfo.state = 0
      },
      handleEdit(row) {
        this.DutyNameText = ''
        this.checkAll = false
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetInfo(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              AddInfo(this.AddEditInfo)
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
              EditInfo(this.AddEditInfo).then(response => {
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
          DeleteInfo(row.uId)
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
      onSearchDuty(){
        this.userRole(this.DutyNameText)
      },
      handleCheckAllChange(){
        if (this.checkAll) {
          this.$refs.roleData.setCheckedNodes(this.roleData);
          let userArray = [];
          this.$refs.roleData.getCheckedNodes().forEach((item) => {
            if(item.selected  === undefined){
              return
            }else{
              userArray.push(item.uId)
              this.AddEditInfo.usersView = userArray.toString()
            }
          });
        } else {
          this.$refs.roleData.setCheckedKeys([]);
          this.checkArray=[]
          this.AddEditInfo.usersView = ''
        }
      },
      //12.04
      /*checks(data,checkNode){
        if (checkNode.checkedKeys.length < this.checkArray.length) {
          this.deleteOid(data.uId)
        }
      },
      handleCheckChange(data, checked, indeterminate) {
        if (checked) {
          if(data.selected === undefined){
            return
          }
          this.checkArray.push(data.uId)
        }
      },
      deleteOid(a){
        for (let i = this.checkArray.length - 1; i > -1; i--) {
          if (this.checkArray[i] === a) {
            this.checkArray.splice(i, 1)
          }
        }
      },
      array_diff(a, b) {
        for (var i = 0; i < b.length; i++) {
          for (var j = 0; j < a.length; j++) {
            if (a[j].uId == b[i].uId) {
              a.splice(j, 1);
              j = j - 1;
            }
          }
        }
        return a;
      },*/
      //选择用户
      userRole(DutyNameText){
        this.RoleDialogVisible = true
        this.filterText = ''
        this.resourceCheckedKey = []
        this.checkAll = false
        if( DutyNameText === ''){
          this.DutyNameText = ''
        }
        DutyNameText = DutyNameText.toString()
        GetFlowUserDrop(DutyNameText).then(response=>{
          /*response.datas.forEach((res,key)=>{
            this.roleData.push({id:key,name:res.name,children:[]})
            res.user.forEach((child)=>{
              this.roleData[key].children.push({id:child.uId,name:child.realname,selected:child.selected,})
            })
            res.childMenu.forEach((child,two)=>{
              this.roleData[key].children.push({id:two,name:child.name,children:[]})
              child.user.forEach((three)=>{
                this.roleData[key].children[two].children.push({id:three.uId,name:three.realname,selected:three.selected})
              })
            })
          })*/
          this.roleData = response.datas
          this.parseJson(this.roleData)
          this.resourceCheckedKey = this.AddEditInfo.usersView.split(',')

          this.findAllChildren(this.roleData,this.resourceCheckedKey)
          this.$nextTick(()=>{
            this.$refs.roleData.setCheckedKeys(this.resourceCheckedKey)
          })

        })
      },
      UpdateRoleMenu(){
        let checkedKeys = this.$refs.roleData.getCheckedKeys();
        let select_box = [];
        this.$refs.roleData.getCheckedNodes().forEach((item) => {
          if(item.selected  === undefined){
            return
          }else{
            select_box.push(item.uId);
          }
        });
        checkedKeys = select_box;
      //  console.log(checkedKeys)
        this.AddEditInfo.usersView = checkedKeys.toString()
        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
      },
      RoleCanleDialog(){
        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
      },
      //遍历选中子节点
      findAllChildren(data,arr){
        data.forEach((item,index)=>{
          if(item.children.length!==0){
            item.children.forEach((child)=>{
              if(child.selected){
                arr.push(child.uId)
              }
            })
          }
        })
      },


      //字段管理
      handleFileds(index, row){
        this.$router.push({name:'FormFields',query: {form_id: row.uId,pageNum:this.listQuery.pageNum}})
      },
      handleFlow (index, row){
        this.$router.push({name:'qdFlow',query: {form_id: row.uId,pageNum:this.listQuery.pageNum}})
      },
      parseJson(arr){
        var key = 'children'
        arr = arr.slice()
        function toParse(arr) {
          arr.forEach(function (item,index) {
            if (item.childMenu && Array.isArray(item.childMenu)) {
             // this.roleData[key].children.push({id:child.uId,name:child.realname,selected:child.selected,})
              item[key] = item.childMenu
              toParse(item[key])
            }
            if (item.user && Array.isArray(item.user)) {
              item.user.forEach(function (child) {
                item[key].push( {uId:child.uId,name:child.realname,selected:child.selected,})
                toParse(item[key])
              })
            }
            delete item.user
            delete item.childMenu
          })
          return arr
        }
        return toParse(arr)
      }
    }
  }

</script>

