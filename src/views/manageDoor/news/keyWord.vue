<template>
  <div class="app-container">
    <div class="filter-container">
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
      </el-table>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {dictionType} from '@/api/basic'
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
      }
    } ,
    created(){
      this.initTable();
    },
    methods: {
      initTable() {
        this.listLoading = true
        dictionType('fe9171b86c104125a12024c419f75ccd').then(response => {
          this.listLoading = false
          this.tableData = response.datas
        })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }

</script>

