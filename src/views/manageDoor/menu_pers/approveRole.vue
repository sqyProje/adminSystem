<template>
    <div class="app-container">
      <div class="filter-container">
        <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="listQuery.name" placeholder="名称"></el-input>
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
                v-if="hasPerm('user:add')"
                @click="addUserDialog">
                添加</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
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
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-button size="mini" round class='label-btn' :type="scope.row.state ? 'success' : 'warning'">
              {{scope.row.state ? "显示" :"不显示"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="创建时间" prop="createdate"></el-table-column>
        <el-table-column label="更新时间" prop="updatedate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              v-if="hasPerm('role:permission')"
              @click="handleRoleMenu(scope.row)">用户</el-button>
            <el-button
              size="mini"
              type="success"
              v-if="hasPerm('role:edit')"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="hasPerm('role:deletes')"
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
          :page-sizes="[10,15,20]"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog
        :title="dialogTitle"
        :close-on-click-modal="false"      :show-close="false"
        :visible.sync="dialogVisible"
        width="33%">
        <el-form
          :inline="false"
          size="mini"
          :model="roleInfo"
          label-width="100px"
          ref="roleInfo"
          :rules ="rulesInfo"
        >
          <el-form-item label ='名称' prop="name">
            <el-input v-model="roleInfo.name"></el-input>
          </el-form-item>

          <el-form-item label ='简介'  prop="sketch">
            <el-input type="textarea" v-model="roleInfo.sketch"></el-input>
          </el-form-item>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label ='排序'  prop="sort">
                <el-input type="number" v-model="roleInfo.sort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label='状态' prop="state">
                <el-select v-model="roleInfo.state" placeholder="状态" style="width: 178px;">
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

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="" @click="canleDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--用户-->
      <el-dialog
        title="用户"
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
  import { Message, MessageBox } from 'element-ui'
  import {ApproveList,AddApprove,GetApprove,EditApprove,DeleteApprove,ApproveMenu,UploadApproveMenu} from '@/api/menu-pers'
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
          dialogTitle:'',
          dialogVisible: false,
          RoleDialogVisible:false,
          roleInfo:{
            name:'',
            sort:'',
            sketch:'',
            state:''
          },
          stateData:[
            { id: 0, display_name: '不显示'},
            { id: 1, display_name: '显示'}
          ],
          rulesInfo: {
            name: [{ required: true,trigger: 'blur',message: '请输入角色名称'}],
            sort:[{required: true, trigger: 'blur', message: '请输入序号'}],
            state: [{ required: true,trigger: 'change',message: '请选择状态'}],
          },
          roleId:'',
          roleData:[],
          userIds:[],
          resourceCheckedKey:[],
          defaultProps: {
            children: 'children',
            label: 'name'
          }
        }
      } ,
      created(){
        this.initTable()
      },
      methods: {
        onSearchList() {
          this.initTable()
        },
        initTable() {
          this.listLoading = true
          ApproveList(this.listQuery).then(response => {
            this.listLoading = false
            if(response.datas.list.length<=0){
              this.listQuery.pageNum=1
            }
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
        addUserDialog(){
          this.dialogVisible = !this.dialogVisible
          this.dialogTitle = '添加'
          Object.keys(this.roleInfo).forEach(key => this.roleInfo[key]= '');
          this.roleInfo.state=1
        },
        UpdateUser(){
          this.$refs.roleInfo.validate(valid => {
            if (valid) {
              if (this.dialogTitle === '添加') {
                AddApprove(this.roleInfo)
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
                EditApprove(this.roleInfo).then(response => {
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
            DeleteApprove(row.uId)
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
        handleEdit(row) {
          this.dialogVisible = true
          this.dialogTitle = '编辑'
          GetApprove(row.uId)
            .then(response => {
              this.roleInfo = response.datas
            })
        },
        //选择用户
        handleRoleMenu(row){
          this.RoleDialogVisible = true
          this.roleId = row.uId
        //  let response={"datas":[{"children":[],"departs":[{"children":[{"realName":"陈慧","selected":false,"userId":"3c7bd1fa512b4234858eab810d1e3c85"},{"realName":"张斌","selected":false,"userId":"9aa43e9f3a6e4d64b33a664a2b68501d"},{"realName":"刘晓刚","selected":false,"userId":"e06a494f98bd4e51a8d677ea2d31ed9e"},{"realName":"罗中华","selected":false,"userId":"f39d0e7461594ed4afca3027c8ee514b"}],"departs":[],"name":"骨一科6","uId":"a0ef6ade56494fe5a2204a66de0f07fe"},{"children":[],"departs":[],"name":"骨二科","uId":"e79c5b5622074ec3a73fc2f762e5053a"},{"children":[],"departs":[],"name":"骨三科","uId":"d3805eb49e444692b57fb14d6031ff8d"},{"children":[],"departs":[],"name":"骨四科","uId":"3633939987534204a31f6eb201cd235d"},{"children":[],"departs":[],"name":"骨五科","uId":"a203ce903b274846a42aa165d80b9e2f"}],"name":"骨科","uId":"647b4e2652f64002bae2818167e9cf82"},{"children":[],"departs":[],"name":"眼科","uId":"c36b44f0d52941b3b95990f63f75afdb"},{"children":[{"realName":"张远涛","selected":false,"userId":"1d402b1c58014e0bb6343dda182b65ae"}],"departs":[],"name":"儿科","uId":"dd4e98e9e848415a8ec650960d10ff84"},{"children":[],"departs":[],"name":"妇科","uId":"7b799caf5d9547c89af137110eedbbe8"},{"children":[{"realName":"孙秋月","selected":false,"userId":"4789d3ebd979455f92cfe38073722564"},{"realName":"李亚威","selected":false,"userId":"db05498fda5741819ceebaf7fd313826"}],"departs":[{"children":[{"realName":"贾延北","selected":false,"userId":"796a18f11ca34d5892381a64e5280859"},{"realName":"王雪萍","selected":false,"userId":"aa3cbd4588324d939e7008c289c5958b"},{"realName":"渠朝南","selected":false,"userId":"e25f3a04fea84a898b56d45d5d041a50"}],"departs":[],"name":"内二科","uId":"76df86c157a64bcdbd95ff89729122f4"},{"children":[],"departs":[],"name":"内三科","uId":"2bae832bc5bd42198798c41cbbfeb795"}],"name":"内科","uId":"b230db37166a46c0b81c4257c626fb2d"},{"children":[{"realName":"林圆添","selected":false,"userId":"76b920867bb24bbba869c407cd5db2f1"},{"realName":"李主任","selected":false,"userId":"9432c655bef34a20ad727133f972a31f"},{"realName":"李博华","selected":false,"userId":"e394bd677103402096a301aef8fb64e1"}],"departs":[],"name":"男科","uId":"8ba8f00508af4b2abef08f0118eebac0"},{"children":[],"departs":[],"name":"心血管科","uId":"9a42d181ff2c46e0941c09c7fb6cf679"},{"children":[],"departs":[{"children":[],"departs":[],"name":"脑外科","uId":"e8f27a8a98f34c559bba69a5ef6d0f8e"},{"children":[],"departs":[],"name":"脑内科","uId":"f194581fdf4245398b4653bf90c1e7f1"}],"name":"脑血管科","uId":"11b891b5d4f84888a922de89918315e5"},{"children":[],"departs":[],"name":"耳鼻喉","uId":"d7cd1295977f462f9e8d961061ac2240"},{"children":[],"departs":[{"children":[],"departs":[],"name":"拍片室","uId":"e9336a922b874b239026a9a4f82d0614"},{"children":[],"departs":[],"name":"CT室","uId":"0b91c0140cf54a258ac157ffb9d577e8"},{"children":[],"departs":[],"name":"透视室","uId":"8da17605300b44afbd1576e3ac9413e5"},{"children":[],"departs":[],"name":"磁共振室","uId":"e0147bed05e641a88f173acd2b3c4d14"},{"children":[],"departs":[],"name":"ECT室","uId":"b165b8efacea4b10833ea271451e036f"}],"name":"放射科","uId":"b8dd8d3b3cec4748a9edb36117f3ad1d"},{"children":[],"departs":[{"children":[],"departs":[],"name":"呼吸内科","uId":"3ee54cd5243e4490ba10dcdae66ab379"},{"children":[],"departs":[],"name":"消化内科","uId":"58f60dec0b644463a0b3cf911db34b5e"},{"children":[],"departs":[],"name":"泌尿内科","uId":"9922a110008c4046b6982f2f96926898"},{"children":[],"departs":[],"name":"心内科","uId":"7952b38d3948496488037f1c6d2acba7"},{"children":[],"departs":[],"name":"血液科","uId":"482e81db14574cb8bf72e141a56a229c"}],"name":"住院部","uId":"a758ad47e3f3421fb6676279b63f22f4"},{"children":[],"departs":[],"name":"急诊部","uId":"0ceed266db5040e3af138ffcbc7ecccd"},{"children":[],"departs":[{"children":[],"departs":[],"name":"生化室","uId":"a34e874b325a406eb97667ca75a8a1e5"},{"children":[],"departs":[],"name":"检验室","uId":"a7d7e7a94d5f480ca8f4c743e53619fc"},{"children":[],"departs":[],"name":"病理室","uId":"0c4e153288cb4fa7a6e8e766c48751eb"}],"name":"化验室","uId":"25e2e36b25c141b3acbbd82e2868e291"}],"msg":"加载成功","status":0,"date":"2020-09-22 17:03:12"}
          ApproveMenu(row.uId).then(response=>{
            response.datas.forEach((res,key)=>{
              this.roleData.push({id:key,name:res.name,children:[]})
              res.children.forEach((child)=>{
                this.roleData[key].children.push({id:child.userId,name:child.realName,selected:child.selected,children:[]})
              })
              if(res.departs.length>0){
                res.departs.forEach((departitem,twoId)=>{
                  this.roleData[key].children.push({id:departitem.uId,name:departitem.name,children:[]})
                  if(departitem.children.length>0){
                    departitem.children.forEach((thItem)=>{
                    //  console.log(this.roleData[key].children[twoId])
                        this.roleData[key].children[twoId].children.push({id:thItem.userId,name:thItem.realName,selected:thItem.selected})
                    })
                  }

                })
              }

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
          UploadApproveMenu(this.roleId,this.userIds)
            .then(response=>{
              this.RoleDialogVisible = false
              this.resourceCheckedKey=[]
              this.roleData = []
              Message({
                message: response.msg,
                type: 'success',
                duration: 3 * 1000
              })
            })
        },
        canleDialog(){
          this.dialogVisible = false
          this.$refs.roleInfo.resetFields();
          Object.keys(this.roleInfo).forEach(key => this.roleInfo[key]= '');
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
                child.children.forEach((thids=>{
                  if(thids.selected) {
                    arr.push(thids.id)
                  }
                }))
              })
            }
          })
        },
      }
    }

</script>

<style>

</style>
