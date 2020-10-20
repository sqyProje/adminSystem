<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      v-loading="listLoading"
      size  = "small"  max-height="650"
      border
    >
      <el-table-column label="版本类型" prop="apptype" width="150">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.apptype==10" size="mini" round class='label-btn'>安卓</el-button>
          <el-button type="primary" v-else-if="scope.row.apptype==20" size="mini" round class='label-btn'>IOS</el-button>
          <el-button type="warning" v-else="scope.row.apptype==30" size="mini" round class='label-btn'>其他</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下载地址" prop="downloadurl"></el-table-column>
      <el-table-column label="是否强制更新"  width="120">
        <template slot-scope="scope">
          <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
            {{scope.row.state ? "是" :"否"}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="版本号" prop="versionnum" width="80"></el-table-column>
      <el-table-column label="创建时间" prop="createdate"></el-table-column>
      <el-table-column label="更新时间" prop="updatedate"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible"
      width="33%">
      <el-form
        :inline="false"
        size="mini"
        ref="AddEditInfo"
        :model="AddEditInfo"
        :rules="rulesInfo"
        label-width="100px"
      >
        <el-form-item label='版本类型' prop="apptype">
          <el-select v-model="AddEditInfo.apptype" placeholder="版本类型" style="width: 100%;">
            <el-option
              v-for="item in typeData"
              :label="item.name"
              :value="item.id"
              :key = "item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label ='下载地址' prop="downloadurl">
          <el-input v-model="AddEditInfo.downloadurl"></el-input>
        </el-form-item>
        <el-form-item label ='版本号' prop="versionnum">
          <el-input v-model="AddEditInfo.versionnum"></el-input>
        </el-form-item>
        <el-form-item label ='更新内容' prop="upcontent">
          <el-input type="textarea" v-model="AddEditInfo.upcontent"></el-input>
        </el-form-item>
        <el-form-item label='是否强制更新' prop="state">
          <el-select v-model="AddEditInfo.state" placeholder="是否强制更新" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.name"
              :value="item.id"
              :key = "item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">关   闭</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import {VersionList,GetVersion,EditVersion} from '@/api/basic'
  export default {
    data(){
      return {
        tableData:[],
        total: null,
        listLoading:false,
        dialogVisible: false,
        AddEditInfo:{},
        stateData:[
          { id: 0, name:'否'},
          { id: 1, name:'是'}
        ],
        typeData:[
          { id: 10, name:'安卓'},
          { id: 20, name:'IOS'},
          { id: 30, name:'其他'},
        ],
        rulesInfo: {
          apptype:[{required: true, trigger: 'blur', message: '请选择版本类型'}],
          downloadurl: [{ required: true,trigger: 'blur',message: '请输入下载地址'}],
          upcontent:[{required: true, trigger: 'blur', message: '请输入更新内容'}],
          versionnum: [{ required: true,trigger: 'blur',message: '请输入版本号'}],
          state:[{required: true, trigger: 'blur', message: '请选择是否强制更新'}],
        }
      }
    },
    created(){
      this.initTable()
    },
    methods:{
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        VersionList().then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
      },
      handleEdit(row) {
        this.dialogVisible = true
        this.dialogTitle = '编辑'
        GetVersion(row.uId).then(response => {
            this.AddEditInfo = response.datas
          })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            EditVersion(this.AddEditInfo).then(response => {
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
      },
    }
  }

</script>
