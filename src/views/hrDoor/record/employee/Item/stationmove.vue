<template>
  <div>

      <el-table
        :data="tableData"
        size = "small"
        border
        style="width: 100%">
        <el-table-column
          prop="stationname"
          label="岗位名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sketch"
          label="调动原因"
          width="100">
        </el-table-column>

        <el-table-column
          prop="createdate"
          label="创建时间">
        </el-table-column>
        <el-table-column label="操作" fixed="right"  width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

  </div>
</template>
<script type="text/ecmascript-6">
  import {Message,MessageBox} from 'element-ui'
  import {StationMoveList,DeleteStationMove} from '@/api/personnel'
  export default {
    data(){
      return{
        listQuery: {
          employeeId:this.employeeIds,
          pageNum:1,
          pageSize:10
        },
        tableData:[],
        dialogTitle:'',
        dialogVisible: false,
      }
    },
    props:{
      employeeIds:{
        type:String,
        default:''
      }
    },
    mounted(){
      this.initList(this.listQuery)
    },
    watch:{
      employeeIds:{
        handler(newName,oldName){
          this.listQuery.employeeId = newName
          this.initList(this.listQuery)
        }
      },
      immediate: true
    },
    methods:{
      initList(uId){
        StationMoveList(uId).then(response => {
          this.listLoading = false
          this.tableData = response.datas.list
        })
      },
      handleDelete(row) {
        MessageBox.confirm('此操作将删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          DeleteStationMove(row.uId)
            .then(response => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
              this.initList(this.listQuery);
            })
            .catch(error=>{console.log(error)})
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    }
  }

</script>

<style>

</style>
