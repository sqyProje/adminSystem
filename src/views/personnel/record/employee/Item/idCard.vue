<template>
<el-form ref="AddEditInfo" :model="AddEditInfo" :rules="rulesInfo" label-width="150px" size="mini">
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="身份证号" prop="idcard">
        <el-input v-model="AddEditInfo.idcard"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="生日信息" prop="lunarbirthdate">
        <el-date-picker type="date" v-model="AddEditInfo.lunarbirthdate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="户籍地址" prop="censusaddress">
        <el-input v-model="AddEditInfo.censusaddress"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="出生年月">
        <el-input v-model="AddEditInfo.birthdate" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="性别">
        <el-input v-model="AddEditInfo.sex" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="年龄">
        <el-input v-model="AddEditInfo.age" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="有效期至" prop="indate">
        <el-date-picker type="date" v-model="AddEditInfo.indate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="状态" prop="state">
        <el-select v-model="AddEditInfo.state" placeholder="状态" style="width: 178px;">
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
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="创建时间">
        <el-input v-model="AddEditInfo.createdate" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="更新时间">
        <el-input v-model="AddEditInfo.updatedate" :disabled="true"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item label="身份证人像面" prop="frontpath">
    <singleUpload  v-model="AddEditInfo.frontpath" @input="frontPicFun"></singleUpload>
  </el-form-item>
  <el-form-item label="身份证国徽面" prop="versopath">
    <singleUpload  v-model="AddEditInfo.versopath" @input="versoPicFun"></singleUpload>
  </el-form-item>
  <el-form-item size="large">
    <el-button type="primary" @click="UpdateUser">提交</el-button>
  </el-form-item>
</el-form>
</template>
<script>
  import {Message,MessageBox} from 'element-ui'
  import {GetIdCardInfo,EditIdCardInfo} from '@/api/personnel'
  import singleUpload from '@/components/Upload/singleImg'
  export default {
    data() {
      return {
        AddEditInfo: {
          employeeUId: "",
          idcard: "",
          birthdate: "",
          lunarbirthdate: "",
          censusaddress: "",
          sex: "",
          age: "",
          indate: "",
          frontpath: "",
          versopath: "",
          createdate: "",
          updatedate: "",
          state: "",
        },
        rulesInfo: {
          idcard: [
            { required: true,trigger: 'blur',message: '请输入身份证号'},
            { validator: this.validID, trigger: 'blur' }],
          property:[{ required: true,trigger: 'blur',message: '请选择农历生日'}],
          lunarbirthdate:[{ required: true,trigger: 'blur',message: '请输入家庭住址'}],
          censusaddress:[{ required: true,trigger: 'blur',message: '请输入户籍地址'}],
          indate:[{ required: true,trigger: 'blur',message: '请输入有效期'}],
          frontpath:[{ required: true,trigger: 'blur',message: '请上传身份证正面'}],
          versopath:[{ required: true,trigger: 'blur',message: '请上传身份证反面'}],
          state:[{ required: true,trigger: 'blur',message: '请选择状态'}]
        },
        stateData:[
          { id: 0, display_name: '启用' },
          { id: 1, display_name: '禁用' }
        ],
      };
    },

    components:{
      singleUpload
    },
    mounted(){
      this.getInfo(this.$route.query.uId)
    },
    methods: {
      frontPicFun(data){
        this.AddEditInfo.frontpath = data
      },
      versoPicFun(data){
        this.AddEditInfo.versopath = data
      },
      getInfo(uId){
        GetIdCardInfo(uId).then(response=>{
          this.AddEditInfo = response.datas==null ? this.AddEditInfo={} :  response.datas
        })
      },
      UpdateUser() {
        this.AddEditInfo.employeeUId=this.$route.query.uId
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            EditIdCardInfo(this.AddEditInfo).then(response=>{
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
      validID(rule,value,callback){
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(value)) {
          this.go(value.length);
          callback()
        } else {
          callback(new Error('身份证号码不正确'))
        }
      },

      // 实现自动生成生日，性别，年龄
      go(val) {
        let iden = this.AddEditInfo.idcard;
        let sex = null;
        let birth = null;
        let myDate = new Date();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let age = 0;
        if(val===18){
          age = myDate.getFullYear() - iden.substring(6, 10) - 1;
          sex = iden.substring(16,17);
          birth = iden.substring(6,10)+"-"+iden.substring(10,12)+"-"+iden.substring(12,14);
          if (iden.substring(10, 12) < month || iden.substring(10, 12) == month && iden.substring(12, 14) <= day) age++;

        }
        if(val===15){
          age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
          sex = iden.substring(13,14);
          birth = "19"+iden.substring(6,8)+"-"+iden.substring(8,10)+"-"+iden.substring(10,12);
          if (iden.substring(8, 10) < month || iden.substring(8, 10) == month && iden.substring(10, 12) <= day) age++;
        }

        if(sex%2 === 0)
          sex = '女';
        else
          sex = '男';
        this.AddEditInfo.sex = sex;
        this.AddEditInfo.age = age;
        this.AddEditInfo.birthdate = birth;
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
