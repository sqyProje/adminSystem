<template>
  <el-dialog
    :title="dialogTitle"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="60%">
    <el-form
      :inline="false"
      size="mini"
      :model="AddEditInfo"
      label-width="80px"
      ref="AddEditInfo"
      :rules ="rulesInfo"
    >
      <el-steps :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="权限类型"></el-step>
        <el-step title="选择表单"></el-step>
        <el-step title="选择流程"></el-step>
      </el-steps>
      <el-form-item label ='名称' prop="name" v-show="active == 0">
        <el-input v-model="AddEditInfo.name"></el-input>
      </el-form-item>
      <el-form-item label='表单类别' prop="type_id" v-show="active == 0|| active == 2 ||active == 3" >
        <el-select v-model="AddEditInfo.type_id"
                   @change =typeIdChange
                   placeholder="表单类别"
                   :disabled="active == 2 ||active == 3? true : false"
                   style="width: 100%;">
          <el-option
            v-for="item in dictionTypeData"
            :label="item.name"
            :value="item.uId"
            :key="item.uId">
            {{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label ='简述' v-show="active == 0">
        <el-input type="textarea" v-model="AddEditInfo.sketch"></el-input>
      </el-form-item>
      <el-form-item prop="isPerUse" v-show="active == 1">
        <el-radio-group v-model="AddEditInfo.isPerUse" @change="isPerSelect">
          <el-radio :label='0' >全部</el-radio>
          <el-radio :label='1' >指定</el-radio>
        </el-radio-group>
        <el-link type="danger" style="float: right">！全部状态下不可以操作权限</el-link>
      </el-form-item>
      <el-form-item label='表单id' prop="formId" v-show="active == 2">
        <el-select v-model="AddEditInfo.formId" style="width: 100%;">
          <el-option
            v-for="item in formIdData"
            :label="item.name"
            :value="item.f_id"
            :key = "item.f_id"
          >{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='部署id' prop="deployId" v-show="active == 3">
        <el-select v-model="AddEditInfo.deployId"
                   @change =deployIdChange
                   style="width: 100%;">
          <el-option
            v-for="item in deployIdData"
            :label="item.name"
            :value="item.deployId"
            :key = "item.deployId"
            :data_p_id="item.p_id"
            :data_key = "item.key"
          >{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <img :src="srcImg" style="width: 100%; height: 400px"  v-show="active == 3 && this.AddEditInfo.deployId ">
      <!--指定权限信息-->
      <el-row :gutter="20" :style="{'pointer-events':isPerShow}" v-show="active == 1">
        <el-col :span="6">
          <el-tabs tab-position="left">
            <el-tab-pane label="部门"><el-tree
              show-checkbox
              node-key="d_id"
              :data="departInfoArray"
              @check-change	="handleNodeClickDepart"
              :default-expanded-keys="resourceCheckedKey"
              :default-checked-keys="resourceCheckedKey"
              ref="treeDepart"
              :props="defaultProps">
            </el-tree></el-tab-pane>
            <el-tab-pane label="用户"><el-tree
              show-checkbox
              node-key="d_id"
              :data="userInfoArray"
              @check-change="handleNodeClickUser"
              :default-expanded-keys="userCheckedKey"
              :default-checked-keys="userCheckedKey"
              ref="treeUser"
              :props="defaultProps">
            </el-tree></el-tab-pane>
            <el-tab-pane label="角色"><el-tree
              show-checkbox
              node-key="d_id"
              :data="roleInfoArray"
              @check-change="handleNodeClickRole"
              :default-expanded-keys="roleCheckedKey"
              :default-checked-keys="roleCheckedKey"
              ref="treeRole"
              :props="defaultProps">
            </el-tree></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col  :span="18">
          <el-col :span="24">
            <div class="out-border">
              <div class="layout-title">部门</div>
              <div class="color-main address-content">
                <el-badge v-for="item in checkedDepart" class="item" :key="item.d_id">
                  <el-button size="small">{{item.name}}</el-button>
                </el-badge>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="out-border">
              <div class="layout-title">用户</div>
              <div class="color-main address-content">
                <el-badge v-for="item in checkedUser" class="item" :key="item.d_id">
                  <el-button size="small">{{item.name}}</el-button>
                </el-badge>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="out-border">
              <div class="layout-title">角色</div>
              <div class="color-main address-content">
                <el-badge v-for="item in checkedRole" class="item" :key="item.d_id">
                  <el-button size="small">{{item.name}}</el-button>
                </el-badge>
              </div>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button size="small" type="info" v-show="active !=0 " @click="StepsPrevious">上一步</el-button>
        <el-button size="small" type="info" v-show="active !=3 "@click="StepsNext">下一步</el-button>
        <el-button size="small" type="" @click="canleDialog">取 消</el-button>
        <el-button size="small" type="primary" @click="UpdateUser">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  import {AddFlowInfo,GetFlowInfo,EditFlowInfo,FindByID,GetDeployInfo} from '@/api/activiti'
  export default {
      name:'addInfo',
      props:{
        dialogTitle:{
          type:String,
          default:''
        }
      },
      data() {
        return{
          isPerShow:'none',
          AddEditInfo:{
            m_id:'',
            name:'',
            type_id:'',
            sketch:'',
            isPerUse:0,
            deployId:'',
            formId:'',
            key:'',
            p_id:'',
            departArrays:[],
            roleArrays:[],
            userArrays:[]
          },
          rulesInfo: {
            name:[{ required: true,trigger: 'blur',message: '请输入名称'}],
            type_id:[{required: true, trigger: 'blur', message: '请选择表单类别'}],
            type:[{required: true, trigger: 'blur', message: '请选择权限类型'}],
            formId:[{required: true, trigger: 'blur', message: '请选择表单id'}],
            deployId:[{required: true, trigger: 'blur', message: '请选择部署id'}],
          },
          stateData:[
            { id:0, display_name: '全部' },
            { id:1, display_name: '指定' }
          ],
          dialogVisible:false,
          srcImg:"",
          active:0,
          formIdData:[],
          deployIdData:[],
          dictionTypeData:[],
          departInfoArray:[],
          userInfoArray:[],
          roleInfoArray:[],
          resourceCheckedKey:[],
          userCheckedKey:[],
          roleCheckedKey:[],
          checkedDepart:[],
          checkedUser:[],
          checkedRole:[],
          defaultProps: {
            children: 'children',
            label: 'name'
          }
        }
      },
      methods:{
        UpdateUser(){
          this.$refs.AddEditInfo.validate(valid => {
            if (valid) {
              if (this.dialogTitle === '添加') {
                if(this.AddEditInfo.departArrays.length <=0){
                  this.AddEditInfo.departArrays=[]
                }
                if(this.AddEditInfo.roleArrays.length <=0){
                  this.AddEditInfo.roleArrays=[]
                }
                if(this.AddEditInfo.departArrays.length <=0){
                  this.AddEditInfo.userArrays=[]
                }
                AddFlowInfo(this.AddEditInfo)
                  .then(response => {
                    this.dialogVisible = false
                    if (response.status === 0) {
                      this.$emit('initTableFather');
                      Message({
                        message: response.msg,
                        type: 'success',
                        duration: 3 * 1000
                      })
                    }
                  })

              } else {
                console.log(this.AddEditInfo)
                EditFlowInfo(this.AddEditInfo).then(response => {
                  if (response.status === 0) {
                    this.dialogVisible = false
                    this.$emit('initTableFather');
                    Message({
                      message: response.msg,
                      type: 'success',
                      duration: 3 * 1000
                    })
                  }
                })
                  .catch(error => {
                    console.log(error);
                  });
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
        canleDialog(){
          this.dialogVisible = false
          this.$refs.AddEditInfo.resetFields();
          Object.keys(this.AddEditInfo).forEach(key => this.AddEditInfo[key]= '');
          this.checkedDepart=[]
          this.checkedUser=[]
          this.checkedRole=[]
          this.active =0
        },
        StepsNext() {
          if(this.active ===0){
            if (this.AddEditInfo.name ==="") {
              Message({
                message: '请输入*内容',
                type: 'error',
                duration: 3 * 1000
              })
            }else {
              if (this.active++ > 4) this.active=0;
            }
          }else{
            if (this.active++ > 4) this.active=0;
          }
        },
        StepsPrevious(){
          if (this.active-- < 0 ) return;
        },
        isPerSelect(value){
          if(value===0){
            this.isPerShow = 'none'
            delete this.AddEditInfo.departArrays
            delete this.AddEditInfo.roleArrays
            delete this.AddEditInfo.userArrays
            this.resourceCheckedKey=[]
            this.userCheckedKey=[]
            this.roleCheckedKey=[]
            this.checkedDepart=[]
            this.checkedUser=[]
            this.checkedRole=[]
            this.$refs.treeDepart.setCheckedKeys([]);
            this.$refs.treeUser.setCheckedKeys([]);
            this.$refs.treeRole.setCheckedKeys([]);
            this.$refs.treeDepart.$children.forEach(item => item.expanded = false)
            this.$refs.treeUser.$children.forEach(item => item.expanded = false)
            this.$refs.treeRole.$children.forEach(item => item.expanded = false)
          }else{
            this.isPerShow = 'auto'
          }

        },
        typeIdChange(value){
          FindByID(value).then(response=>{
            this.formIdData = response.datas
            this.AddEditInfo.formId =  this.formIdData[0].f_id ? this.formIdData[0].f_id :''
          })
        },
        deployIdChange(value){
          const rule = this.deployIdData.find(item=>item.deployId ===value)
          console.log(rule)
          this.AddEditInfo.key=rule.key
          this.AddEditInfo.p_id=rule.p_id,
          GetDeployInfo(value).then(response=>{
            this.srcImg = 'http://192.168.1.7:8088/'+ response.datas
          })
        },
        handleNodeClickDepart(){
          let checkedKeys = this.$refs.treeDepart.getCheckedKeys();
          let checkedNodes = this.$refs.treeDepart.getCheckedNodes();
          this.AddEditInfo.departArrays = checkedKeys
          this.checkedDepart = checkedNodes //checkedNodes.concat(hafCheckedNodes)
        },
        handleNodeClickUser(){
          let checkedKeys = this.$refs.treeUser.getCheckedKeys(true);
          let checkedNodes = this.$refs.treeUser.getCheckedNodes(true);
          this.AddEditInfo.userArrays = checkedKeys
          this.checkedUser = checkedNodes
          console.log(this.AddEditInfo.userArrays)
          this.AddEditInfo.userArrays=this.AddEditInfo.userArrays.filter(res=>{return res!=undefined})
        },
        handleNodeClickRole(){
          let checkedKeys = this.$refs.treeRole.getCheckedKeys();
          let checkedNodes = this.$refs.treeRole.getCheckedNodes();
          this.AddEditInfo.roleArrays = checkedKeys
          this.checkedRole = checkedNodes
        }
      }
    }

</script>

<style>
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
  .item{
    margin-right:10px;
  }
</style>
