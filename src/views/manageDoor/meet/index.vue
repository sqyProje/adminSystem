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
        :data="tableData"
        v-loading="listLoading"
        size  = "small"  max-height="600"
        border
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
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="会议类型" prop="type" width="100">
          <template slot-scope="scope">
            <el-button size="mini" round  plain class='label-btn' :type="scope.row.type ? 'success' : 'warning'">
              {{scope.row.type ? "线上会议" :"线下会议"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"  width="290">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-if="hasPerm('meeting:edit')"
              @click="handleCheck(scope.row)">查看</el-button>
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
              <el-date-picker type="datetime" v-model="AddEditInfo.startdate" value-format="yyyy-MM-dd HH:mm" :picker-options="startDateLimit"style="width: 100%;"></el-date-picker>
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
        <el-form-item label ='选择用户' prop="userIds">
          <el-button size="small" v-on:click.native="userRole" type="primary">选择用户</el-button>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label='会议分类' prop="typename">
              <el-select v-model="AddEditInfo.typename" placeholder="会议分类" style="width: 100%;">
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
      <!---->
      <el-tree
        :data="roleData"
        show-checkbox
        node-key="id"
        ref="roleData"
        :default-expanded-keys="resourceCheckedKey"
        :default-checked-keys="resourceCheckedKey"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="RoleCanleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateRoleMenu">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {dictionType} from '@/api/basic'
  import {MeetList,MeetAdd,GetMeet,EditMeet,CheckMeet,DeleteMeet,GetMeetDrop,GetRoomDrop} from '@/api/news-metting'
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
          userIds:[{required: true, trigger: 'blur', message: '请选择用户'}]
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
        checkFlag:true
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

    },
    methods: {
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
      },
      handleEdit(row) {
        this.dialogTitle = '编辑'
        GetMeet(row.uId).then(response=>{
          if(response.status==0){
            this.dialogVisible = !this.dialogVisible
            this.AddEditInfo = response.datas
             if(this.AddEditInfo.type==1){
                this.rcFlag=false
              }else{
                this.rcFlag = true
              }
          }else{
            Message({
              message: response.msg,
              type: 'success',
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
        this.AddEditInfo.userIds = this.userIds
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
      //选择用户
      userRole(){
        this.RoleDialogVisible = true
        GetMeetDrop(this.AddEditInfo.uId).then(response=>{
          response.datas.forEach((res,key)=>{
            this.roleData.push({id:key,name:res.name,children:[]})
            res.children.forEach((child)=>{
              this.roleData[key].children.push({id:child.userId,name:child.realName,selected:child.selected})
            })
          })
          this.findAllChildren(this.roleData,this.resourceCheckedKey)
          this.$nextTick(()=>{
            this.$refs.roleData.setCheckedKeys(this.resourceCheckedKey)
          })

        })
      },
      UpdateRoleMenu(){
        let checkedKeys = this.$refs.roleData.getCheckedKeys();
        checkedKeys =  checkedKeys.filter((value)=>{
          return value.length >= 3
        })
        this.userIds = checkedKeys
        this.RoleDialogVisible = false
        this.resourceCheckedKey=[]
        this.roleData = []
      //  console.log(this.userIds)
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
                arr.push(child.id)
              }
            })
          }
        })
      },
      picFun(data){
        this.AddEditInfo.picPath = data
      },
    }
  }

</script>


