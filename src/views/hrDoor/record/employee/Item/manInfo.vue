<template>
<el-form ref="AddEditInfo" :model="AddEditInfo" :rules="rulesInfo" label-width="150px" size="mini">
  <div class="box-card">
    <div class="header">
      <span>基本信息</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="编号" prop="number">
            <el-input v-model.trim ="AddEditInfo.number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人员性质" prop="property">
            <el-select
              v-model="AddEditInfo.property"
              placeholder="人员性质"
              @change="propertyChange"
              style="width: 100%;">
              <el-option
                v-for="item in propertyData"
                :label="item.enumValue"
                :value="item.enumKey"
                :key = "item.enumKey"
              >{{item.enumValue}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row  v-show="propertyFlag">
        <el-form-item label="编内所在单位">
          <el-input v-model="AddEditInfo.procecompany"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="AddEditInfo.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="政治面貌" prop="politics">
            <el-select
              v-model="AddEditInfo.politics"
              placeholder="状态"
              @change="politicsChange"
              style="width: 100%;">
              <el-option
                v-for="item in politicsData"
                :label="item.enumValue"
                :value="item.enumKey"
                :key = "item.enumKey"
              >{{item.enumValue}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="politicsFlag">
        <el-col :span="12">
          <el-form-item label="入党时间">
            <el-date-picker type="date" v-model="AddEditInfo.partyDate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="党内职务">
            <el-input v-model="AddEditInfo.partyDuty"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="AddEditInfo.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参加工作时间" prop="jobdate">
            <el-date-picker type="date" v-model="AddEditInfo.jobdate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="离职/退休/停止时间">
            <el-date-picker type="date" v-model="AddEditInfo.dimissiondate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="婚姻状况">
            <el-select
              v-model="AddEditInfo.marriage"
              placeholder="婚姻状况"
              style="width: 100%;">
              <el-option
                v-for="item in marriageData"
                :label="item.name"
                :value="item.uId"
                :key = "item.uId"
              >{{item.name}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开户行">
            <el-input v-model="AddEditInfo.openBank"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行（工资）卡号">
            <el-input v-model="AddEditInfo.payCard"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="离职/退休/停止原因">
        <el-input type="textarea" v-model="AddEditInfo.dimissionreason"></el-input>
      </el-form-item>
      <el-form-item label="家庭地址" prop="familyaddress">
        <el-input v-model="AddEditInfo.familyaddress"></el-input>
      </el-form-item>
      <el-form-item label="特长">
        <el-input type="textarea" v-model="AddEditInfo.evaluate"></el-input>
      </el-form-item>
    </div>
    <div class="header">
      <span>职称/执业</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职称级别">
            <el-input v-model="AddEditInfo.titleLevel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职称取得时间">
            <el-date-picker type="date" v-model="AddEditInfo.titleGetDate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="职称专业">
            <el-input v-model="AddEditInfo.titleProfession"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="执业类别">
            <el-input v-model="AddEditInfo.operationType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执业资格">
            <el-input v-model="AddEditInfo.operationState"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="执业专业">
            <el-input v-model="AddEditInfo.operationProfession"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执业取得时间">
            <el-date-picker type="date" v-model="AddEditInfo.operaionDate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div class="header">
      <span>全日制教育信息</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="全日制学历" prop="alleducation">
            <el-input v-model="AddEditInfo.alleducation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="全日制毕业时间" prop="allfinishdate">
            <el-date-picker type="date" v-model="AddEditInfo.allfinishdate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="全日制毕业院校" prop="alluniversity">
            <el-input v-model="AddEditInfo.alluniversity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="全日制毕业专业" prop="allprofession">
            <el-input v-model="AddEditInfo.allprofession"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div class="header">
      <span>在职教育信息</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="在职学历">
            <el-input v-model="AddEditInfo.jobeducation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职学历毕业时间">
            <el-date-picker type="date" v-model="AddEditInfo.jobfinishdate" value-format="yyyy-MM-dd"  :editable="false" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职学历毕业院校">
            <el-input v-model="AddEditInfo.jobuniversity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职学历毕业专业">
            <el-input v-model="AddEditInfo.jobprofession"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
    </div>
  </div>
  <el-form-item size="large">
    <el-button type="primary" @click="UpdateUser">提交</el-button>
  </el-form-item>
</el-form>
</template>
<script>
  import {Message,MessageBox} from 'element-ui'
  import {validmobile,validEmail} from '@/utils/validate'
  import {enumeration,dictionType} from '@/api/basic'
  import {GetEmployeeInfo,EditEmployeeInfo} from '@/api/personnel'
  export default {
    data() {
      const checkphone = (rule, value, callback) => {
        if (!validmobile(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      };
      const checkmail = (rule, value, callback) => {
        if (!validEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      };
      return {
        propertyFlag:false,
        politicsFlag:false,
        AddEditInfo: {
          alleducation: "",
          allfinishdate: "",
          allprofession: "",
          alluniversity: "",
          dimissiondate: "",
          dimissionreason: "",
          email: "",
          employeeId: "",
          evaluate: "",
          familyaddress: "",
          jobdate: "",
          jobeducation: "",
          jobfinishdate: "",
          jobprofession: "",
          jobuniversity: "",
          number: "",
          phone: "",
          marriage:'',
          politics: "",
          partyDate:"",
          partyDuty:"",
          procecompany: "",
          property: "",
          openBank:"",
          payCard:"",
          titleLevel:"",
          titleProfession:"",
          titleGetDate:"",
          operationType:"",
          operationState:"",
          operationProfession:"",
          operationDate:""
        },
        rulesInfo: {
          number: [{ required: true,trigger: 'blur',message: '请输入编号'}],
          property:[{ required: true,trigger: 'blur',message: '请输入人员性质'}],
          familyaddress:[{ required: true,trigger: 'blur',message: '请输入家庭住址'}],
          phone:[{ required: true,trigger: 'blur', validator: checkphone,message: '请输入联系电话'}],
          politics:[{ required: true,trigger: 'blur',message: '请输入政治面貌'}],
          jobdate:[{ required: true,trigger: 'blur',message: '请输入参加工作时间'}],
          alleducation:[{ required: true,trigger: 'blur',message: '请输入全日制学历'}],
          allfinishdate:[{ required: true,trigger: 'blur',message: '请输入全日制毕业时间'}],
          alluniversity:[{ required: true,trigger: 'blur',message: '请输入全日制毕业院校'}],
          allprofession:[{ required: true,trigger: 'blur',message: '请输入全日制毕业专业'}],

          email: [{required: true, trigger: 'blur', validator: checkmail}]
        },
        //政治面貌，人员性质,婚姻状况
        politicsData:[],
        propertyData:[],
        marriageData:[]
      };
    },
    mounted(){
      enumeration('/approveEnum/getPropertyEnums').then(res=>{
        this.propertyData = res.datas
      })
      enumeration('/approveEnum/getPoliticsEnums').then(res=>{
        this.politicsData = res.datas
      })
      dictionType('79f606fccb8046a2b2069e37bdecdc91').then(res=>{
        this.marriageData = res.datas
      })
      this.getInfo(this.$route.query.uId)

    },
    methods: {
      getInfo(uId){
        GetEmployeeInfo(uId).then(response=>{
          this.AddEditInfo = response.datas==null ? this.AddEditInfo={} :  response.datas
          if(this.AddEditInfo.property==10){
            this.propertyFlag=true
          }
        })
      },
      UpdateUser() {
        this.$refs.AddEditInfo.validate(valid => {
          this.AddEditInfo.employeeId=this.$route.query.uId
          if (valid) {
            console.log(this.AddEditInfo)
            EditEmployeeInfo(this.AddEditInfo).then(response=>{
              if (response.status === 0) {
                this.$options.methods.getInfo(this.$route.query.uId)
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
              }
            })
          }
        })
      },
      propertyChange(value){
        if(value===10){
          this.propertyFlag= true
        }else{
          this.propertyFlag= false
          this.AddEditInfo.procecompany = ''
        }
      },
      politicsChange(value){
        if(value===30){
          this.politicsFlag= true
        }else{
          this.politicsFlag= false
          this.AddEditInfo.partyDate=""
          this.AddEditInfo.partyDuty = ''
        }
      },

    }
  };
</script>
<style>
  .header{
    padding-bottom: 10px;

    margin-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
  }
</style>
