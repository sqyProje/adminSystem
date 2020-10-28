<template>
<el-form ref="AddEditInfo" :model="AddEditInfo" :rules="rulesInfo" label-width="150px" size="mini">
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="身份证号" prop="idcard">
        <el-input v-model="AddEditInfo.idcard"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="生日信息" prop="lunarbirthdate"><!--@blur="blurFun"-->
        <el-input readonly="readonly" v-model="AddEditInfo.lunarbirthdate"  @focus="focusFun"></el-input>
        <div class="main"  v-show="dataFlag">
          <el-card class="box-card">
          <div class="choose_year">
            <div class="icon" @click="chooseYears(-1)"><i class="el-icon-d-arrow-left"></i></div>
            <div class="icon" @click="chooseMonth(-1)"><i class="el-icon-arrow-left"></i></div>
            <div class="date">
              <el-select name="year" v-model="year" style="width: 100px;" @change="selectYear">
                <el-option v-for="item in yearArray" :value="item" :key="item">{{item}}</el-option>
              </el-select>
              <el-select name="year" v-model="month" style="width: 100px;" @change="selectMonth">
                <el-option value="1">1</el-option>
                <el-option value="2">2</el-option>
                <el-option value="3">3</el-option>
                <el-option value="4">4</el-option>
                <el-option value="5">5</el-option>
                <el-option value="6">6</el-option>
                <el-option value="7">7</el-option>
                <el-option value="8">8</el-option>
                <el-option value="9">9</el-option>
                <el-option value="10">10</el-option>
                <el-option value="11">11</el-option>
                <el-option value="12">12</el-option>
              </el-select>
             <!-- {{year}}.{{month.toString().padStart(2, '0')}}-->
            </div>
            <div class="icon" @click="chooseMonth(1)"><i class="el-icon-arrow-right"></i></div>
            <div class="icon" @click="chooseYears(1)"><i class="el-icon-d-arrow-right"></i></div>
          </div>
          <div class="days_area">
            <div class="day week" v-for="week in weeks" :key="week">{{week}}</div>
            <div class="day"  v-for="(day, index) in days" :key="index"   @click.prevent="chooseThisDay($event,day.gregorian,day.lunar)"><!--:class="day.gregorian === today ? 'choose_day' : ''"-->
              <p>{{day.gregorian}}</p><!-- v-html="day.lunar"-->
              <span>{{day.lunar}}</span>
            </div>
          </div>
          <el-button type="primary" @click="dataFlag=!dataFlag" style="float: right;margin-bottom: 6px">关闭</el-button>
          </el-card>
        </div>
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
        <el-date-picker type="date" v-model="AddEditInfo.indate"  :editable="false" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
    <el-button type="primary" @click="UpdateUser" :disabled="submitFlag">提交</el-button>
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
        year: 0,
        month: 0,
        today: 0,
        days: [],
        weeks: ['一', '二', '三', '四', '五', '六', '日'],
        yearArray:[1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050],
        dataFlag:false,
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
          lunarbirthdate:[{ required: true,trigger: 'blur',message: '请选择农历生日'}],
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
        submitFlag:false
      };
    },

    components:{
      singleUpload
    },
    mounted(){

      this.getInfo(this.$route.query.uId)
      const now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth() + 1
      this.today = now.getDate()
      this.getDays()

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
          this.AddEditInfo = response.datas==null ?  this.AddEditInfo :  response.datas
        })
      },
      focusFun(){
        this.dataFlag = true
      },
      blurFun(){
        setTimeout(()=>{
          this.dataFlag = false
        },500)
      },
      UpdateUser() {
        this.AddEditInfo.employeeUId=this.$route.query.uId
        this.$refs.AddEditInfo.validate(valid => {
          if (valid) {
            EditIdCardInfo(this.AddEditInfo).then(response=>{
              if (response.status === 0) {
                this.submitFlag = true
                this.$options.methods.getInfo(this.$route.query.uId)
                Message({
                  message: response.msg,
                  type: 'success',
                  duration: 3 * 1000
                })
                setTimeout(()=>{
                  this.submitFlag = false
                },5000)
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
      selectYear(value){
        this.year=value
        this.today = 1
        this.getDays()
      },
      selectMonth(value){
        //console.log(value)
        this.month = value.toString().padStart(2, '0')
        this.today = 1
        this.getDays()
        /*if (this.month < 1) {
          this.month = 12
          this.chooseYears(-1)
        } else if (this.month > 12) {
          this.month = 1
          this.chooseYears(1)
        } else {
          this.getDays()
        }*/
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
      },
      getDays () { // 获取当前月份所有公历日期及其农历日期
        this.days = []
        const day = new Date()
        day.setFullYear(this.year, this.month - 1, 1) // 此处较之前调整，获取当月第一天
        const month = new Date()
        month.setFullYear(this.year, this.month, 0) // 此处较之前调整，获取当月
        for (let i = 1; i < day.getDay(); i++) { // 当月第一天距离所在周周一的空白占位
          this.days.push({ gregorian: '', lunar: '' })//,only:''
        }
        for (let i = 1; i <= month.getDate(); i++) { // 获取当月天数填充日历
          this.days.push({ gregorian: i, lunar: this.getLunarDay(this.year, this.month, i)})//,only: this.getLunarYear(this.year, this.month, i)
        }
      },
      chooseYears (state) { // 改变年份
        if(this.year < 2050){
          this.year += state
          this.today = 1
          this.getDays()
        }

      },
      chooseMonth (state) { // 改变月份
        this.month += state
        this.today = 1
        if (this.month < 1) {
          this.month = 12
          this.chooseYears(-1)
        } else if (this.month > 12) {
          this.month = 1
          this.chooseYears(1)
        } else {
          this.getDays()
        }
      },
      chooseThisDay (e,day,old) { // 选择某天，主要是考虑可以当时间选择器用
       // this.AddEditInfo.lunarbirthdate = e.target.innerText
        this.AddEditInfo.lunarbirthdate = old
        this.dataFlag = false
       /* if (day > 0) {
          this.today = day
        }*/
      },
      getLunarDay (solarYear, solarMonth, solarDay) { // 拷贝别人又自己调整过的获取农历日期的代码，想要原来的代码估计百度一下就有了
        const madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
        const numString = '一二三四五六七八九十'
        const monString = '正二三四五六七八九十冬腊'
        const CalendarData = [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95]
        if (!(solarYear < 1921 || solarYear > 2999)) { // 注意看此处限定了年份，设置自己需要的范围即可
          solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11
          const timeArr = [solarYear, solarMonth, solarDay]
          let TheDate = (timeArr.length !== 3) ? new Date() : new Date(timeArr[0], timeArr[1], timeArr[2])
          let total, m, n, k
          let isEnd = false
          let theDateYear = TheDate.getFullYear()
          total = (theDateYear - 1921) * 365 + Math.floor((theDateYear - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38
          if (theDateYear % 4 === 0 && TheDate.getMonth() > 1) {
            total++
          }
          for (m = 0; ; m++) {
            k = (CalendarData[m] < 0xfff) ? 11 : 12
            for (n = k; n >= 0; n--) {
              if (total <= this.getBit(CalendarData[m], n)) {
                isEnd = true
                break
              }
              total = total - this.getBit(CalendarData[m], n)
            }
            if (isEnd) {
              break
            }
          }
          let cMonth, cDay ,cYear;
           cYear = 1921 + m
          cMonth = k - n + 1
          cDay = total
          if (k === 12) {
            if (cMonth === Math.floor(CalendarData[m] / 0x10000) + 1) {
              cMonth = 1 - cMonth
            }
            if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
              cMonth--
            }
          }
          let cDayStr = numString.charAt(cDay - 1)
          let run = ''
           if (cMonth < 1) {
            run = '(闰)'
          }
          if (cDay % 10 !== 0 || cDay === 10) {
            cDayStr = numString.charAt((cDay - 1) % 10)
          }
         cDay= cDay === 1 ?  monString.charAt(cMonth - 1) + '月' : (cDay < 11 ? '初' : (cDay < 20 ? '十' : (cDay < 30 ? '廿' : '三十'))) + cDayStr
         // return cDay
           return cDay= cYear +"年"+monString.charAt(cMonth - 1)+"月"+cDay
         // return cDay = "<span class='hiddenClass' >"+cYear +"年</span><span class='hiddenClass'> "+monString.charAt(cMonth - 1) +"月</span><span>"+cDay+"</span>"
        }
      },
      getBit (m, n) { // 处理二进制数据的
        return 29 + ((m >> n) & 1)
      }

    }
  };
</script>
<style>
  .hiddenClass{
    display: inline-block;
    height: 0;
    width: 0;
    overflow: hidden;
  }
  .el-card .el-card__body{
    padding: 10px;
  }
</style>
<style lang="scss" scoped>

  .main{
    width: 400px;
    position: absolute;
    left:0 ;
    top:30px;
    z-index: 100;
    .choose_year{
      display: flex;
      margin-bottom: 4px;
      .icon{
        width: 20px;
        height: 28px;
        line-height:28px;
        text-align: center;
      }
      .date{
        width: 80%;
        text-align: center;
        height: 28px;
        line-height: 28px;
        font-size: 10px;
      }
    }
    .days_area{
      display: flex;
      flex-wrap: wrap;
      .day{
        width: 52px;
        text-align: center;
        padding: 1px 0;
        margin: 1px;
        line-height: 0;
        p{
          margin: 0;
          font-size: 13px;
          width:100%;
          height: 20px;

          line-height: 20px;

        }
        span{
          font-size: 12px;
          cursor: pointer;
          height: 24px;
          line-height: 14px;
          color: #999;
        }
      }
      .week{
        background-color: dodgerblue;
        color: #fff;
        font-weight: bold;
        height: 18px;
        line-height: 15px;
        margin-top: 5px;
      }
      .choose_day{
        background-color: dodgerblue;
        color: #fff;
        font-weight: bold;
        span{
          color: #fff;
        }
      }
    }
  }
</style>

