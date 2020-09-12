<template>
  <div>
    <el-button
    type="success"
    size="small"
    @click="handleAdd"
    style="margin-bottom: 20px">
    添加</el-button>
    <el-table
      :data="tableData"
      size  = "small"  max-height="600"
      border
      style="width: 1100px">
      <el-table-column
        prop="startdate"
        label="教育开始时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="enddate"
        label="教育结束时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="school"
        label="教育机构">
      </el-table-column>
      <el-table-column
        prop="name"
        label="教育名称">
      </el-table-column>
      <el-table-column
        prop="createdate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updatedate"
        label="更新时间">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'warning' : 'success'">
            {{scope.row.state ? "禁用" :"启用"}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right"  width="160">
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
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"      :show-close="false"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="120px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='教育名称'>
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='教育开始时间'  prop="startdate">
          <el-date-picker
            type="date"
            v-model="AddEditInfo.startdate"
            :picker-options="startDateLimit"
            value-format="yyyy-MM-dd"
            :editable="false"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label ='教育结束时间' prop="enddate">
          <el-date-picker
            type="date"
            v-model="AddEditInfo.enddate"
            value-format="yyyy-MM-dd"
            :picker-options="endDateLimit"
            :editable="false"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label ='教育机构'>
          <el-input v-model="AddEditInfo.school"></el-input>
        </el-form-item>
        <el-form-item label ='教育内容'>
          <el-input type="textarea" v-model="AddEditInfo.content"></el-input>
        </el-form-item>
        <el-form-item label ='期间表现'>
          <el-input type="textarea" v-model="AddEditInfo.processcase"></el-input>
        </el-form-item>
        <el-form-item label='状态' prop="state">
          <el-select v-model="AddEditInfo.state" placeholder="状态" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='图集'>
          <multiUploadImg
            @imgUrl="picPreview"
            :picArray="picString"
            @delUrl = "delUrlPreview"
          ></multiUploadImg>
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
  import multiUploadImg from '@/components/Upload/multiUploadImg'
  import {EduList,AddEdu,GetEdu,EditEdu,DeleteEdu} from '@/api/personnel'
  export default {
    data(){

      return{
        tableData:[],
        picString:"",
        picPreviewInfo:'',
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          employeeid:'',
          startdate:'',
          enddate:'',
          school:'',
          content:'',
          name:'',
          processcase:'',
          picPaths:'',
          state:''
        },
        stateData:[
          { id: 0, display_name: '启用'},
          { id: 1, display_name: '禁用'}
        ],
        rulesInfo: {
          startdate: [{ required: true,trigger: 'blur',message: '请输入教育开始时间'}],
          enddate:[{required: true, trigger: 'blur', message: '请输入教育结束时间'}],
          school: [{ required: true,trigger: 'blur',message: '请输入教育机构'}],
          state:[{required: true, trigger: 'blur', message: '请选择状态'}],
        },
        submitFlag:false,
        startDateLimit: {
          disabledDate: (time) => {
            console.log(time,this.AddEditInfo.enddate)
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
              return time.getTime() < new Date(beginTime).getTime() - 8.64e7;  //开始和结束可以选择同一天
            }
          }
        }
      }
    },
    mounted(){
      this.initList(this.$route.query.uId)
    },
    components:{
      multiUploadImg
    },
    methods:{
      initList(uId){
        EduList(uId).then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      },
      handleAdd(row){
        this.dialogVisible = !this.dialogVisible
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.employeeid=this.$route.query.uId
        this.AddEditInfo.state=0
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetEdu(row.uId).then(response=>{
          this.AddEditInfo = response.datas
          this.picString = response.datas.picPaths;
          if(response.datas.picPaths.length==0){
            this.picPreviewInfo = ''
            return
          }
          this.picPreviewInfo = response.datas.picPaths+','
          console.log( this.picPreviewInfo)
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if(! this.submitFlag) {
            if (valid) {
              this.AddEditInfo.picPaths = this.picPreviewInfo.substring(0, this.picPreviewInfo.length - 1)
              if (this.dialogTitle === '添加') {
                AddEdu(this.AddEditInfo)
                  .then(response => {
                    this.dialogVisible = false
                    this.submitFlag =true
                    if (response.status === 0) {
                      this.initList(this.$route.query.uId);
                      Message({
                        message: response.msg,
                        type: 'success',
                        duration: 3 * 1000
                      })
                    }
                  })

              } else {
                EditEdu(this.AddEditInfo).then(response => {
                  if (response.status === 0) {
                    this.dialogVisible = false
                    this.submitFlag =true
                    this.initList(this.$route.query.uId);
                    Message({
                      message: response.msg,
                      type: 'success',
                      duration: 3 * 1000
                    })
                  }
                })

              }
            } else {
              Message({
                message: '参数验证不合法',
                type: 'error',
                duration: 3 * 1000
              })
            }
          }else{
            this.submitFlag =false
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
          DeleteEdu(row.uId)
            .then(response => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              this.initList(this.$route.query.uId);
            })
            .catch(error=>{console.log(error)})
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      canleDialog(){
        this.dialogVisible = false
        this.picString = ''
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      picPreview(value){
        this.picPreviewInfo += value+','
        console.log( this.picPreviewInfo);
      },
      delUrlPreview(value){
        this.picPreviewInfo = value
        this.picString = value.substring(0,value.length-1)
        console.log( this.picString);
      },
    }
  }

</script>

<style>

</style>
