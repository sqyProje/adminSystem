<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.meetingRoomId" placeholder="会议室类型" style="width: 100%;">
            <el-option
              v-for="item in TypeData"
              :label="item.name"
              :value="item.uId"
              :key = "item.uId"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker type="date"  placeholder="发布时间" v-model="listQuery.startDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="会议室名称" prop="meetingroomname"></el-table-column>
        <el-table-column label="会议秘钥" prop="rcMettingId"></el-table-column>
        <el-table-column label="主办方" prop="sponsor"></el-table-column>
        <el-table-column label="开始时间" prop="startdate"></el-table-column>
        <el-table-column label="结束时间" prop="enddate"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "发布" :"不发布"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="publishdate"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="会议类型" prop="type" width="100">
          <template slot-scope="scope">
            <el-button size="mini" round  plain class='label-btn' :type="scope.row.type ? 'success' : 'warning'">
              {{scope.row.type ? "线上会议" :"线下会议"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"  width="320">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="hasPerm('meeting:edit')"
              @click="handleCheck(scope.row)">查看</el-button>
            <el-button
              size="mini"
              type="info"
              @click="handleHost(scope.row)">会议纪要</el-button>
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('meeting:edit')"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="hasPerm('meeting:deletes')"
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
      width="50%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="100px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='会议图片'>
          <singleUpload  v-model="AddEditInfo.picPath" @input="picFun"></singleUpload>
        </el-form-item>
        <el-form-item label ='标题'  prop="title">
          <el-input v-model="AddEditInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="会议室名称">
          <el-select
            v-model="AddEditInfo.meetingroomname"
            placeholder="会议室名称"
            @change="roomChange"
            filterable
            style="width: 100%;">
              <el-tooltip placement="top"  v-for="item in TypeData"  :key = "item.uId">
                <div slot="content">容纳人数：{{item.maxpeople}}<br/>类型：{{item.type==1 ?'线下':'线上'}}</div>
                <el-option
                  :label="item.name"
                  :value="item.name"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-tooltip>
          </el-select>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label ='开始时间'  prop="startdate">
              <el-date-picker type="datetime" v-model="AddEditInfo.startdate" value-format="yyyy-MM-dd HH:mm" :picker-options="startDateLimit" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label ='结束时间'  prop="enddate">
              <el-date-picker type="datetime" v-model="AddEditInfo.enddate" value-format="yyyy-MM-dd HH:mm" :picker-options="endDateLimit" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label ='主办方'  prop="sponsor">
          <el-input v-model="AddEditInfo.sponsor"></el-input>
        </el-form-item>
        <el-form-item label ='简介'>
          <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
        </el-form-item>
        <el-form-item label ='选择用户' prop="userString"><!-- prop="userString"-->
          <el-button size="small"  v-on:click.native="userRole" type="primary">选择用户</el-button>
          <el-input type="hidden" v-model="AddEditInfo.userString" style="width: 0;height: 0"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label='会议分类' prop="typename">
              <el-select v-model="AddEditInfo.typename" filterable placeholder="会议分类" style="width: 100%;">
                <el-option
                  v-for="item in TypeNameData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          </el-col>
          <el-col :span="8">
            <el-form-item label='会议类型'>
              <el-select v-model="AddEditInfo.type" placeholder="会议类型" style="width: 100%;">
                <el-option
                  v-for="item in stateData"
                  :label="item.type_name"
                  :value="item.id"
                  :key = "item.id"
                >{{item.type_name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label ='创建时间'>
              <el-input v-model="AddEditInfo.createdate" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label ='更新时间'>
              <el-input v-model="AddEditInfo.updatedate" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="!rcFlag">
            <el-form-item label ='会议秘钥'>
              <el-input v-model="AddEditInfo.rcMettingId" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label ='内容详情'>
          <Editor :curValue="AddEditInfo.content" v-if="dialogVisible" @input="newContent"></Editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser" v-show="checkFlag">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="选择用户"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="RoleDialogVisible"
      width="33%">
      <el-input
        size="mini"
        style="width: 260px"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        clearable>
      </el-input>
      <el-row>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
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
      </el-row>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="RoleCanleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateRoleMenu"  v-show="checkFlag">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
      :title="HostTitle"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="HostVisible"
      width="50%">
      <el-form
        :inline="false"
        size="mini"
        :model="HostInfo"
        label-width="100px"
        ref="AddEditInfo"
        :rules ="HostRulesInfo"
      >
        <el-form-item label="发起人">
          <el-select
            v-model="HostInfo.compere"
            placeholder="请选择发起人"
            filterable
            style="width: 100%;"
            @change="compereChange">
              <el-option
                v-for="item in HostData"
                :label="item.realname"
                :value="item.uId"
                :key = "item.uId"
              >{{item.realname}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人">
          <el-select
            v-model="HostInfo.approveMan"
            placeholder="请选择审核人"
            filterable
            @change="ManChange"
            style="width: 100%;">
              <el-option
                v-for="item in HostData"
                :label="item.realname"
                :value="item.uId"
                :key = "item.uId"
              >{{item.realname}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="复核人">
          <el-select
            v-model="HostInfo.approveEndMan"
            placeholder="请选择复核人"
            filterable
            @change="EndChange"
            style="width: 100%;">
              <el-option
                v-for="item in HostData"
                :label="item.realname"
                :value="item.uId"
                :key = "item.uId"
              >{{item.realname}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="" @click="HostDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="UpdateHost" v-text="HostFlag ? '添 加' : '编 辑'"></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {dictionType} from '@/api/basic'
  import {MeetList,MeetAdd,GetMeet,EditMeet,CheckMeet,DeleteMeet,GetMeetDrop,GetRoomDrop,HostAdd,GetHost,EditHost} from '@/api/news-metting'
  import {userDrop} from '@/api/menu-pers'
  import singleUpload from '@/components/Upload/singleImg'
  import Editor from '@/components/Tinymce/Editor'
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
          title:'',
          meetingroomid:'',
          meetingroomname:'',
          picPath:'',
          startdate:'',
          enddate:'',
          sponsor:'',
          sketch:'',
          typename:'',
          state:'',
          content:'',
          type:'',
          rcMettingId:'',
          userIds:[],
          userString:''//中转
        },
        TypeData:[],
        TypeNameData:[],
        stateData:[
          { id: 0, display_name: '不发布',name:'否',type_name:'线下会议'},
          { id: 1, display_name: '发布',name:'是',type_name:'线上会议'}
        ],
        rulesInfo: {
          title: [{ required: true,trigger: 'blur',message: '请输入标题'}],
          meetingroomname: [{ required: true,trigger: 'blur',message: '请输入会议室名称'}],
          startdate:[{required: true, trigger: 'blur', message: '请选择开始时间'}],
          enddate:[{required: true, trigger: 'blur', message: '请选择结束时间'}],
          typename:[{required: true, trigger: 'blur', message: '请输入分类名称'}],
          userString:[{required: true, trigger: ['change','blur'],validator:this.approval, message: '请选择用户'}]
        },
        RoleDialogVisible:false,
        rcFlag:true,
        roleData:[],
        resourceCheckedKey:[],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        startDateLimit: {
          disabledDate: (time) => {
            let endTime = this.AddEditInfo.enddate;
            if (endTime) {
              return time.getTime() > new Date(endTime).getTime();
            }
          }
        },
        endDateLimit: {
          disabledDate: (time) => {
            let beginTime = this.AddEditInfo.startdate;
            if (beginTime) {
              return time.getTime() < new Date(beginTime).getTime();  //开始和结束可以选择同一天  - 8.64e7
            }
          }
        },
        checkFlag:true,
        filterText:'',
        checkAll:false,
        HostTitle:'',
        HostVisible:false,
        HostFlag:false,
        HostInfo:{
          uId:'',
          compere:'',
          approveMan:'',
          approveEndMan:''
        },
        HostRulesInfo:{},
        HostData:[]
      }

    } ,
    components:{
      singleUpload,Editor
    },
    created(){
      this.initTable();
      GetRoomDrop().then(response=>{
        this.TypeData = response.datas
      })
      dictionType('6d3739b3c10c4baeb4a700aa4c3f7f9e').then(response => {
        this.TypeNameData = response.datas
      })
      userDrop().then(response=>{
        this.HostData = response.datas
      })
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
      async approval() {
        if(this.AddEditInfo.userString.length===0){
          Message({
            message: response.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      },
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        MeetList(this.listQuery).then(response => {
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
        this.rcFlag= true
        this.AddEditInfo.isstick=0
        this.AddEditInfo.state=0
        this.checkFlag = true
        this.checkAll = false
      },
      handleEdit(row) {
        this.dialogTitle = '编辑'
        this.checkFlag = true
        this.roleData = []
        this.resourceCheckedKey = []
        this.userIds = []
        this.checkAll = false
        GetMeet(row.uId).then(response=>{
          if(response.status==0){
            this.dialogVisible = !this.dialogVisible
            this.AddEditInfo = response.datas
             if(this.AddEditInfo.type==1){
               this.rcFlag=false
               }else{
               this.rcFlag = true
             }
            GetMeetDrop(this.AddEditInfo.uId).then(response=>{
              response.datas.forEach((res,key)=>{
                this.roleData.push({id:key,name:res.name,children:[]})
                res.meeting_depart_userModels.forEach((depart,dkey)=>{
                  this.roleData[key].children.push({id:depart.uId,name:depart.name,children:[]})
                  depart.children.forEach((departuser,three)=>{
                    this.roleData[key].children[dkey].children.push({id:departuser.userId,name:departuser.realName,selected:departuser.selected})
                  })
                })
                res.children.forEach((child)=>{
                  this.roleData[key].children.push({id:child.userId,name:child.realName,selected:child.selected,children:[]})
                })
              })
              this.$nextTick(()=>{
                this.findAllChildren(this.roleData, this.resourceCheckedKey)
                let checkedKeys = this.resourceCheckedKey
                this.userIds = checkedKeys
                this.AddEditInfo.userString = this.userIds.toString()
                this.AddEditInfo.userIds = this.userIds
              })

            })
          }else{
            Message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })

      },
      handleCheck(row){
        CheckMeet(row.uId).then(res=>{
          this.dialogVisible = !this.dialogVisible
          this.AddEditInfo = res.datas
          this.checkFlag=false
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              MeetAdd(this.AddEditInfo)
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
              EditMeet(this.AddEditInfo).then(response => {
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
          DeleteMeet(row.uId)
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
      roomChange(value){
        this.TypeData.filter(item=>{
          if(value === item.name){
            this.AddEditInfo.meetingroomid=item.uId
          }
        })
      },
      newContent(val){
        this.AddEditInfo.content= val
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
              this.AddEditInfo.userString = userArray.toString()
            }
          });
        } else {
          this.$refs.roleData.setCheckedKeys([]);
          this.AddEditInfo.userString = ''
        }
      },
      //选择用户
      userRole(){
        this.roleData = []
        this.resourceCheckedKey = []
        this.userIds = []
        this.RoleDialogVisible = true
        this.filterText=''
        GetMeetDrop(this.AddEditInfo.uId).then(response=>{
          response.datas.forEach((res,key)=>{
            this.roleData.push({id:key,name:res.name,children:[]})
            res.meeting_depart_userModels.forEach((depart,dkey)=>{
              this.roleData[key].children.push({id:depart.uId,name:depart.name,children:[]})
              depart.children.forEach((departuser,three)=>{
                this.roleData[key].children[dkey].children.push({id:departuser.userId,name:departuser.realName,selected:departuser.selected})
              })
            })
            res.children.forEach((child)=>{
              this.roleData[key].children.push({id:child.userId,name:child.realName,selected:child.selected,children:[]})
            })
          })
          this.findAllChildren(this.roleData, this.resourceCheckedKey)
          this.$nextTick(()=>{
            this.$refs.roleData.setCheckedKeys(this.resourceCheckedKey)
          })
        })
      },
      UpdateRoleMenu(){
        let checkedKeys = this.$refs.roleData.getCheckedKeys();
        this.userIds = checkedKeys
        this.AddEditInfo.userString = this.userIds.toString()
        this.AddEditInfo.userIds = this.userIds
        this.resourceCheckedKey=[]
        this.roleData = []
        this.RoleDialogVisible = false
      },
      RoleCanleDialog(){
        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
      },
      //遍历选中子节点
      findAllChildren(data,arr){
      //  console.log(data,arr)
        data.forEach((item,index)=>{
          if(item.children.length!==0){
            item.children.forEach((child)=>{
              if(child.selected){
                arr.push(child.id)
              }
              child.children.forEach((thids=>{
                if(thids.selected) {
                  arr.push(thids.id)
                }
              }))
            })
          }
        })
      },
      picFun(data){
        this.AddEditInfo.picPath = data
      },
      handleHost(row){
        Object.keys(this.HostInfo).forEach(key => this.HostInfo[key]= '');
        this.HostInfo.uId = row.uId
        GetHost(this.HostInfo.uId).then(res=>{
          const datas = res.datas
          if(datas === null){
            this.HostFlag = true
            this.HostTitle = '添加'
          }else{
            this.HostFlag = false
            this.HostTitle = '编辑'
            this.HostInfo = datas
          }
        this.HostVisible = !this.HostVisible

        })
      },
      HostDialog(){
        this.HostVisible = !this.HostVisible
      },
      UpdateHost(){
        if(this.HostFlag){
          HostAdd(this.HostInfo).then(res=>{
            if(res.status==0){
              Message({
                message: res.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }else{
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
          this.HostVisible = !this.HostVisible
        }else{
          EditHost(this.HostInfo).then(res=>{
            if(res.status==0){
              Message({
                message: res.msg,
                type: 'success',
                duration: 3 * 1000
              })
            }else{
              Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
          this.HostVisible = !this.HostVisible
        }
      },
      compereChange(value){
        if(value == this.HostInfo.approveMan || value == this.HostInfo.approveEndMan){
          Message({
            message: '请不要重复选择一个人',
            type: 'error',
            duration: 3 * 1000
          })
          this.HostInfo.compere=''
        }
      },
      ManChange(value){
        if(value == this.HostInfo.compere || value == this.HostInfo.approveEndMan){
          Message({
            message: '请不要重复选择一个人',
            type: 'error',
            duration: 3 * 1000
          })
          this.HostInfo.approveMan=''
        }
      },
      EndChange(value){
        if(value == this.HostInfo.compere || value == this.HostInfo.approveMan){
          Message({
            message: '请不要重复选择一个人',
            type: 'error',
            duration: 3 * 1000
          })
          this.HostInfo.approveEndMan=''
        }
      }
    }
  }

</script>


