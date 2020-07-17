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
            <el-input v-model="AddEditInfo.number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人员性质" prop="property">
            <el-input v-model="AddEditInfo.property"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="AddEditInfo.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="政治面貌" prop="politics">
            <el-select v-model="AddEditInfo.politics" placeholder="状态" style="width: 100%;">
              <el-option
                v-for="item in politicsData"
                :label="item.name"
                :value="item.id"
                :key = "item.id"
              >{{item.name}}</el-option>
            </el-select>
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
            <el-date-picker type="date" v-model="AddEditInfo.jobdate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="离职/退休/停止时间" prop="dimissiondate">
            <el-date-picker type="date" v-model="AddEditInfo.dimissiondate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手续所在单位" prop="procecompany">
            <el-input v-model="AddEditInfo.procecompany"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="离职/退休/停止原因" prop="dimissionreason">
        <el-input type="textarea" v-model="AddEditInfo.dimissionreason"></el-input>
      </el-form-item>
      <el-form-item label="家庭地址" prop="familyaddress">
        <el-input v-model="AddEditInfo.familyaddress"></el-input>
      </el-form-item>
      <el-form-item label="评价" prop="evaluate">
        <el-input type="textarea" v-model="AddEditInfo.evaluate"></el-input>
      </el-form-item>
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
            <el-date-picker type="date" v-model="AddEditInfo.allfinishdate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
      <span>全日制教育信息</span>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="在职学历" prop="jobeducation">
            <el-input v-model="AddEditInfo.jobeducation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职学历毕业时间" prop="jobfinishdate">
            <el-date-picker type="date" v-model="AddEditInfo.jobfinishdate" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职学历毕业院校" prop="jobuniversity">
            <el-input v-model="AddEditInfo.jobuniversity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职学历毕业专业" prop="jobprofession">
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
          politics: "",
          procecompany: "",
          property: ""
        },
        rulesInfo: {
          number: [{ required: true,trigger: 'blur',message: '请输入编号'}],
          property:[{ required: true,trigger: 'blur',message: '请输入人员性质'}],
          familyaddress:[{ required: true,trigger: 'blur',message: '请输入家庭住址'}],
          phone:[{ required: true,trigger: 'blur', validator: checkphone,message: '请输入联系电话'}],
          politics:[{ required: true,trigger: 'blur',message: '请输入政治面貌'}],
          evaluate:[{ required: true,trigger: 'blur',message: '请输入评价'}],
          jobdate:[{ required: true,trigger: 'blur',message: '请输入参加工作时间'}],
          procecompany:[{ required: true,trigger: 'blur',message: '请输入手续所在单位'}],
          alleducation:[{ required: true,trigger: 'blur',message: '请输入全日制学历'}],
          allfinishdate:[{ required: true,trigger: 'blur',message: '请输入全日制毕业时间'}],
          alluniversity:[{ required: true,trigger: 'blur',message: '请输入全日制毕业院校'}],
          allprofession:[{ required: true,trigger: 'blur',message: '请输入全日制毕业专业'}],
          jobeducation:[{ required: true,trigger: 'blur',message: '请输入在职学历'}],
          jobfinishdate:[{ required: true,trigger: 'blur',message: '请输入在职学历毕业时间'}],
          jobuniversity:[{ required: true,trigger: 'blur',message: '请输入在职毕业院校'}],
          jobprofession:[{ required: true,trigger: 'blur',message: '请输入在职专业'}],
          dimissiondate:[{ required: true,trigger: 'blur',message: '请输入离职/退休/停止时间'}],
          dimissionreason:[{ required: true,trigger: 'blur',message: '请输入离职/退休/停止原因'}],
          email: [{required: true, trigger: 'blur', validator: checkmail}]
        },
        politicsData:[
          { id: 0, name: '群众'},
          { id: 1, name: '团员'},
          { id: 2, name: '党员'}
        ],
      };
    },
    mounted(){
      this.getInfo(this.$route.query.uId)
    },
    methods: {
      getInfo(uId){
        GetEmployeeInfo(uId).then(response=>{
          this.AddEditInfo = response.datas==null ? this.AddEditInfo={} :  response.datas
        })
      },
      UpdateUser() {
        this.$refs.AddEditInfo.validate(valid => {
          this.AddEditInfo.employeeId=this.$route.query.uId
          if (valid) {
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
      }
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
