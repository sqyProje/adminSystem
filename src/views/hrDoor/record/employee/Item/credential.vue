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
        prop="type"
        label="证书类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="证书名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="level"
        label="证书等级"
        width="120">
      </el-table-column>
      <el-table-column
        prop="number"
        label="证书编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="issuedate"
        label="签发时间"
        width="120">
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
            {{scope.row.state ? "失效" :"有效"}}
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
      width="35%"
    >
      <el-form
        size="mini"
        :model="AddEditInfo"
        label-width="100px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label ='证书类型'  prop="type">
              <el-input v-model="AddEditInfo.type"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label ='证书名称'  prop="name">
              <el-input v-model="AddEditInfo.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label ='证书等级'  prop="level">
              <el-input v-model="AddEditInfo.level"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label ='证书编号'  prop="number">
              <el-input v-model="AddEditInfo.number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          </el-col>
        </el-row>
        <el-form-item label ='签发机构'  prop="issueorganization">
          <el-input v-model="AddEditInfo.issueorganization"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label ='签发时间' prop="issuedate">
              <el-date-picker type="date" v-model="AddEditInfo.issuedate" value-format="yyyy-MM-dd" :editable="false" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label ='初始注册时间'>
              <el-date-picker type="date" v-model="AddEditInfo.rootregisterdate" value-format="yyyy-MM-dd" :editable="false" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label ='续注册时间' >
              <el-date-picker type="date" v-model="AddEditInfo.extendregisterdate" value-format="yyyy-MM-dd" :editable="false" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label ='失效时间'>
              <el-date-picker type="date" v-model="AddEditInfo.loseefficacydate" value-format="yyyy-MM-dd" :editable="false" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label ='注册编号'>
              <el-input v-model="AddEditInfo.registernumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label ='注册单位'>
              <el-input v-model="AddEditInfo.registerorganization"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label ='执业情况'><!--证书年审情况-->
          <el-input type="textarea" v-model="AddEditInfo.annualcase"></el-input>
        </el-form-item>
        <el-form-item label ='执业范围'><!--证书使用情况-->
          <el-input type="textarea" v-model="AddEditInfo.usecase"></el-input>
        </el-form-item>
        <el-form-item label ='证书变更情况'>
          <el-input type="textarea" v-model="AddEditInfo.changecase"></el-input>
        </el-form-item>
        <el-form-item label ='执业地点'><!--证书现存位置-->
          <el-input v-model="AddEditInfo.extantaddress"></el-input>
        </el-form-item>
        <el-form-item label ='图集'>
          <multiUploadImg
            ref="multiImg"
            @imgUrl="picPreview"
            @delUrl = "delUrlPreview"
            :picArray="picString"
          ></multiUploadImg>
        </el-form-item>
        <el-form-item label="附件" prop="filepath">
          <multiUploadFile
            ref="fileFile"
            @file-url="FilePreview"
            @delFile = 'delFilePreview'
            :fileArray="picArray">
          </multiUploadFile>
          <el-input v-model="AddEditInfo.fileIds" type="hidden"></el-input>
          <a
            v-for="(items,index) in fileIdsArray "
            :href="items"
            style="width: 100%;display: inline-block">
            下载附件{{index+1}} {{items.substring(50,items.length)}}
          </a>
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
  import {CredentialList,AddCredential,GetCredential,EditCredential,DeleteCredential} from '@/api/personnel'
  import multiUploadImg from '@/components/Upload/multiUploadImg'
  import multiUploadFile from '@/components/Upload/multiUploadFile'

  export default {
    data(){
      return{
        tableData:[],
        fileList: [],
        dialogTitle:'',
        dialogVisible: false,
        picString:"",
        picIdsArray:[],
        picPreviewInfo:'',
        AddEditInfo:{
          employeeid:"",
          type:"",
          name:"",
          level:"",
          issuedate:"",
          rootregisterdate:"",
          extendregisterdate:"",
          loseefficacydate:"",
          issueorganization:"",
          number:"",
          registernumber:"",
          registerorganization:"",
          annualcase:"",
          usecase:"",
          changecase:"",
          extantaddress:"",
          picids:"",
          state:"",
          fileIds:'',
          fileName:''
        },
        stateData:[
          { id: 0, display_name: '有效'},
          { id: 1, display_name: '失效'}
        ],
        rulesInfo: {
          type: [{ required: true,trigger: 'blur',message: '请输入证书类型'}],
          name: [{ required: true,trigger: 'blur',message: '请输入证书名称'}],
          level:[{required: true, trigger: 'blur', message: '请输入证书等级'}],
          issuedate: [{ required: true,trigger: 'blur',message: '请输入签发时间'}],
          issueorganization: [{ required: true,trigger: 'blur',message: '请输入签发机构'}],
          number: [{ required: true,trigger: 'blur',message: '请输入证书编号'}],
          state:[{required: true, trigger: 'blur', message: '请选择状态'}],
        },
        submitFlag:false,
        picArray:'',
        fileIdsArray:[],
        filePreviewInfo:'',
        fileString:''
      }
    },
    components:{
      multiUploadImg,multiUploadFile
    },
    mounted(){
      this.initList(this.$route.query.uId)
    },
    methods:{
      picPreview(value){
        this.picPreviewInfo += value+','
        this.picIdsArray.push(value)
      },
      delUrlPreview(value){
        this.picIdsArray= this.picIdsArray.filter((x)=>{
          return x !==value
        })
        this.picString = this.picIdsArray.toString()
        this.picPreviewInfo = this.picIdsArray.toString()+','
      },
      FilePreview(value){
        this.filePreviewInfo += value+','
        this.fileIdsArray.push(value)
      },
      delFilePreview(value){
        this.fileIdsArray= this.fileIdsArray.filter((x) => {
          return  x !== value
        } );
        this.fileString = this.fileIdsArray.toString()
        this.filePreviewInfo = this.fileIdsArray.toString()+','
      },
      initList(uId){
        CredentialList(uId).then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      },
      handleAdd(){
        this.dialogVisible = !this.dialogVisible
        this.submitFlag = false
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
        this.dialogTitle = '添加'
        this.AddEditInfo.employeeid=this.$route.query.uId
        this.AddEditInfo.state=0

      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.submitFlag=false
        this.dialogTitle = '编辑'
        this.fileIdsArray =[]
        this.filePreviewInfo=''
        GetCredential(row.uId).then(response=>{
          this.AddEditInfo = response.datas
          if(response.datas.picids.length !==0){
            this.picString = response.datas.picids;
            this.picPreviewInfo = response.datas.picids+','
            this.picIdsArray = response.datas.picids.split(',')
          }
          if(response.datas.fileIds.length !==0){
            this.picArray = response.datas.fileIds;
            this.filePreviewInfo = response.datas.fileIds+','
            this.fileIdsArray = response.datas.fileIds.split(',')
          }

        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if(this.submitFlag){
            return
          }
          this.submitFlag = true
          if (valid) {
            this.AddEditInfo.picids =  this.picPreviewInfo.substring(0, this.picPreviewInfo.length-1)
            this.AddEditInfo.fileIds = this.filePreviewInfo.substring(0, this.filePreviewInfo.length-1)
            if (this.dialogTitle === '添加') {
              AddCredential(this.AddEditInfo)
                .then(response => {
                  this.dialogVisible = false
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
              EditCredential(this.AddEditInfo).then(response => {
                if (response.status === 0) {
                  this.dialogVisible = false
                  this.initList(this.$route.query.uId);
                  Message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                }
              })
            }
          }else{
            this.submitFlag = false
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
          DeleteCredential(row.uId)
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
        this.picString = ''
        this.picPreviewInfo=''
        this.fileString = ''
        this.picArray=''
        this.filePreviewInfo=''
        this.fileIdsArray= []
        this.$refs.multiImg.parentClickClear()
        this.$refs.fileFile.parentClickClear()
        this.dialogVisible = false
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      }
    }
  }

</script>

<style>

</style>
