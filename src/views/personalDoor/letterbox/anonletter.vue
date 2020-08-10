<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="字典名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.isAnonym" placeholder="是否匿名" style="width: 100%;">
            <el-option
              v-for="item in stateData"
              :label="item.display_name"
              :value="item.id"
              :key = "item.id"
            >{{item.display_name}}</el-option>
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
      </el-form>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        size  = "small"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="描述" prop="sketch"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="操作" fixed="right"  width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.row)">查看</el-button>
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
        <el-form-item label ='标题'>
          <el-input v-model="AddEditInfo.title"></el-input>
        </el-form-item>
        <el-form-item label ='发起人'>
          <el-input v-model="AddEditInfo.realname"></el-input>
        </el-form-item>
        <el-form-item label ='创建时间'>
          <el-input v-model="AddEditInfo.createdate"></el-input>
        </el-form-item>
        <el-form-item label ='内容详情'>
          <Editor :curValue="AddEditInfo.content" v-if="dialogVisible" @input="newContent"></Editor>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {letterBoxList,letterBoxCheck} from '@/api/address'
  import Editor from '@/components/Tinymce/Editor'
  const defaultListQuery = {
    title: '',
    isAnonym:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        stateData:[
          { id: 0, display_name: '否'},
          { id: 1, display_name: '是'}
        ],
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          title:'',
          realname:'',
          content:'',
          createdate:'',
        }
      }
    } ,
    components:{
      Editor
    },
    created(){
      this.initTable();
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        letterBoxList(this.listQuery).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
          this.total = response.datas.total
        })
          .catch(error => {
            console.log(error);
          });
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
      handleEdit(row) {
        this.dialogVisible = !this.dialogVisible
        letterBoxCheck(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      newContent(val){
        this.AddEditInfo.content= val
      }
    }
  }

</script>

