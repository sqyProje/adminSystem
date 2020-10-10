<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="number" v-model="listQuery.maxPeople" placeholder="容纳人数" min="0"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.type" placeholder="会议类型">
            <el-option
              v-for="item in stateData"
              :label="item.type_name"
              :value="item.id"
              :key = "item.id"
            >{{item.type_name}}</el-option>
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
        :data="tableData"
        v-loading="listLoading"
        size  = "small"  max-height="600"
        border
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="容纳人数" prop="maxpeople"></el-table-column>
        <el-table-column label="负责人" prop="lead"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="会议类型">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.type ? 'success' : 'warning'">
              {{scope.row.type ? "线上" :"线下"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "开放" :"不开放"}}
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
      width="30%">
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
        <el-form-item label ='容纳人数'  prop="maxpeople">
          <el-input type="number" v-model="AddEditInfo.maxpeople" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label='会议类型' prop="type">
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
          <el-col :span="12">
            <el-form-item label='负责人' prop="lead">
              <el-input v-model="AddEditInfo.lead"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label='联系电话' prop="phone">
              <el-input v-model="AddEditInfo.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='排序' prop="sort">
              <el-input v-model="AddEditInfo.sort" type="number" min="0" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label='地址' prop="address">
          <el-input v-model="AddEditInfo.address"></el-input>
        </el-form-item>
        <el-form-item label ='简介' prop="sketch">
          <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
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
  import {validmobile} from '@/utils/validate'
  import {RoomList,RoomAdd,GetRoom,EditRoom,DeleteRoom,GetRoomDrop} from '@/api/news-metting'
  const defaultListQuery = {
    name: '',
    maxPeople:'',
    type:'',
    pageNum:1,
    pageSize:10
  }
  export default {
    data(){
      const checkphone = (rule, value, callback) => {
        if (!validmobile(value)) {
          callback(new Error('请输入正确的联系电话'))
        } else {
          callback()
        }
      };
      return {
        listQuery: Object.assign({}, defaultListQuery),
        tableData:[],
        total: null,
        dialogTitle:'',
        dialogVisible: false,
        AddEditInfo:{
          uId:'',
          name:'',
          maxpeople:'',
          type:'',
          address:'',
          lead:'',
          phone:'',
          sketch:'',
          sort:'',
          state:'',
        },
        TypeData:[],
        stateData:[
          {id:0,display_name:'不开放',type_name:'线下'},
          {id:1,display_name:'开放',type_name:'线上'},
        ],


        rulesInfo: {
          name:[{required: true, trigger: 'blur', message: '请输入名称'}],
          maxpeople: [{ required: true,trigger: 'blur',message: '请输入容纳人数'}],
          type:[{required: true, trigger: 'blur', message: '请选择会议类型'}],
          address:[{required: true, trigger: 'blur', message: '请输入地址'}],
          lead:[{required: true, trigger: 'blur', message: '请输入负责人'}],
          phone:[{required: true, trigger: 'blur',validator:checkphone, message: '请输入正确的联系方式'}],
          sketch: [{ required: true,trigger: 'blur',message: '请输入简介'}],
          sort:[{required: true, trigger: 'blur', message: '排序应为数字'}],
          state:[{required: true, trigger: 'blur', message: '请选择状态'}],
        }
      }
    } ,

    created(){
      this.initTable();
      GetRoomDrop().then(response=>{
        this.TypeData = response.datas
      })
    },
    methods: {
      onSearchList() {
        this.initTable()
      },
      initTable() {
        this.listLoading = true
        RoomList(this.listQuery).then(response => {
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
        GetRoom(row.uId).then(response=>{
          this.AddEditInfo = response.datas
        })
      },
      UpdateUser(){
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              RoomAdd(this.AddEditInfo)
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
              EditRoom(this.AddEditInfo).then(response => {
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
          DeleteRoom(row.uId)
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
        this.$refs.AddEditInfo.resetFields();
        Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
      },
      newContent(val){
        console.log(val)
        this.AddEditInfo.content= val
      }
    }
  }

</script>


