<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="listQuery.toLike" placeholder="点赞数（小于等于）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="listQuery.toBrowse" placeholder="浏览量（小于等于）"></el-input>
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
              v-if="hasPerm('newsMsg:add')"
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
        <el-table-column label="排序" prop="sort" width="50"></el-table-column>
        <el-table-column label="点赞数" prop="tolike"  width="90"></el-table-column>
        <el-table-column label="浏览量" prop="tobrowse"  width="90"></el-table-column>
        <el-table-column label="是否置顶"  width="70">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.isstick ? 'success' : 'warning'">
              {{scope.row.isstick ? "是" :"否"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态"  width="70">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "发布" :"下架"}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="发布时间" prop="publishdate"  width="150"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"  width="150"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"  width="150"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.state ? 'warning' : 'success'"
              v-if="hasPerm('newsMsg:toState')"
              @click="handleState(scope.row)"
            >
              {{scope.row.state ? "下架" :"发布"}}
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('newsMsg:edit')"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="hasPerm('newsMsg:deletes')"
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
        label-width="80px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='封面'  prop="picpath">
          <singleUpload  v-model="AddEditInfo.picpath" @input="picFun"></singleUpload>
        </el-form-item>
        <el-form-item label ='标题'  prop="title">
          <el-input v-model="AddEditInfo.title"></el-input>
        </el-form-item>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label='关键字' prop="keyword">
              <el-select v-model="AddEditInfo.keyword" filterable placeholder="关键字" style="width: 100%;">
                <el-option
                  v-for="item in KeyData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='新闻类型' prop="type">
              <el-select v-model="AddEditInfo.type" filterable placeholder="状态" style="width: 100%;">
                <el-option
                  v-for="item in TypeData"
                  :label="item.name"
                  :value="item.uId"
                  :key = "item.uId"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label ='简介'>
          <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label ='来源'>
              <el-input v-model="AddEditInfo.source"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label ='作者'  prop="author">
              <el-input v-model="AddEditInfo.author"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label ='排序' prop="sort">
              <el-input v-model="AddEditInfo.sort" type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label ='点赞量'>
              <el-input v-model="AddEditInfo.tolike" type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label ='浏览量'>
              <el-input v-model="AddEditInfo.tobrowse" type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label ='转发量'>
              <el-input v-model="AddEditInfo.totranspond"  type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label ='发布时间'>
              <el-input v-model="AddEditInfo.publishdate" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
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
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label='是否置顶' prop="isstick">
              <el-select v-model="AddEditInfo.isstick" placeholder="是否置顶" style="width: 100%;">
                <el-option
                  v-for="item in stateData"
                  :label="item.name"
                  :value="item.id"
                  :key = "item.id"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
        </el-row>
        <el-form-item label ='内容详情'>
          <Editor :curValue="AddEditInfo.content" v-if="dialogVisible" @input="newContent"></Editor>
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
  import {dictionType} from '@/api/basic'
  import {NewsList,NewsAdd,GetNews,EditNews,DeleteNews,StateNews} from '@/api/news-metting'
  import singleUpload from '@/components/Upload/singleImg'
  import Editor from '@/components/Tinymce/Editor'
  const defaultListQuery = {
    title: '',
    toLike:'',
    toBrowse:'',
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
          uId:'',
          picpath:'',
          type:'',
          title:'',
          author:'',
          keyword:'',
          sketch:'',
          content:'',
          source:'',
          isstick:'',
          sort:'',
          tolike:'',
          tobrowse:'',
          totranspond:'',
          state:'',
        },
        TypeData:[],
        KeyData:[],
        stateData:[
          { id: 0, display_name: '下架',name:'否'},
          { id: 1, display_name: '发布',name:'是'}
        ],
        rulesInfo: {
          picpath: [{ required: true,trigger: 'blur',message: '请上传图片'}],
          type:[{required: true, trigger: 'blur', message: '请选择新闻类型'}],
          title: [{ required: true,trigger: 'blur',message: '请输入标题'}],
          author:[{required: true, trigger: 'blur', message: '请填写作者'}],
          keyword: [{ required: true,trigger: 'blur',message: '请选择关键字'}],
          isstick:[{required: true, trigger: 'blur', message: '请选择是否置顶'}],
          sort:[{required: true, trigger: 'blur', message: '排序应为数字'}],
          state:[{required: true, trigger: 'blur', message: '请选择状态'}],
        }
      }
    } ,
    components:{
      singleUpload,Editor
    },
    created(){
      this.initTable();
      dictionType('442335ae40774a74ad64af816e406e05').then(response=>{
        this.TypeData = response.datas
      })
      dictionType('fe9171b86c104125a12024c419f75ccd').then(response=>{
        this.KeyData = response.datas
      })
    },
    methods: {
      picFun(data){
        this.AddEditInfo.picpath = data
      },
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        NewsList(this.listQuery).then(response => {
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
        this.AddEditInfo.isstick=0
        this.AddEditInfo.state=0
      },
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        this.dialogTitle = '编辑'
        GetNews(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              NewsAdd(this.AddEditInfo)
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
              EditNews(this.AddEditInfo).then(response => {
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
          DeleteNews(row.uId)
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
      handleState(row){
        MessageBox.confirm('此操作将修改状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          StateNews(row.uId)
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
            message: '已取消修改状态'
          });
        });
      },
      canleDialog(){
        this.dialogVisible = false
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      newContent(val){
        this.AddEditInfo.content= val
      }
    }
  }

</script>


