<template>
  <div class="app-container">
      <div class="filter-container">
        <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="listQuery.name" placeholder="字典名称"></el-input>
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
                v-if="hasPerm('diction:add')"
                @click="handleAdd">
                添加</el-button>
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
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="描述" prop="sketch"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'warning' : 'success'">
                {{scope.row.state ? "禁用" :"启用"}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort"></el-table-column>
          <el-table-column label="创建时间" prop="createdate"></el-table-column>
          <el-table-column label="更新时间" prop="updatedate"></el-table-column>
          <el-table-column label="操作" fixed="right"  width="260">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                v-if="hasPerm('diction:add')"
                @click="handleAdd(scope.row)">新增</el-button>
              <el-button
                size="mini"
                type="success"
                v-if="hasPerm('diction:edit')"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="hasPerm('diction:deletes')"
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
      width="23%">
      <el-form
        :inline="false"
        size="mini"
        :model="AddEditInfo"
        label-width="80px"
        ref="AddEditInfo"
        :rules ="rulesInfo"
      >
        <el-form-item label ='名称'  prop="name">
          <el-input v-model="AddEditInfo.name"></el-input>
        </el-form-item>
        <el-form-item label ='排序' prop="sort">
          <el-input v-model="AddEditInfo.sort"></el-input>
        </el-form-item>
        <el-form-item label ='描述'>
          <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
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

  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {InitList,AddInfo,GetInfo,EditInfo,DeleteInfo} from '@/api/basic'
  const defaultListQuery = {
    name: '',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        listLoading:false,
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          name:'',
          parentid:'',
          sketch:'',
          sort:'',
          state:'',
        },
        stateData:[
          { id: 0, display_name: '启用'},
          { id: 1, display_name: '禁用'}
        ],
        rulesInfo: {
          name: [{ required: true,trigger: 'blur',message: '请输入名称'}],
          sort:[{required: true, trigger: 'blur', message: '请输入序号'}],
        }
      }
    } ,
    created(){
      this.initTable();
    },
    methods: {
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
        this.AddEditInfo.state=0
        if(row.uId ===undefined ){
          this.AddEditInfo.parentid = 0
        }else {
          this.AddEditInfo.parentid = row.uId
        }
      },
      handleEdit(row) {
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
      }
    }
  }

</script>

