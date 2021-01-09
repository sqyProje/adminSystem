<template>
  <div class="codebody">
	  <div class="top-logo">
				<img src="../../../assets/images/logo.png" alt="">
				<span style="display:inline-block;vertical-align:center">汝州市骨科医院</span>
			</div>
			<div class="meetInfo">
				<div class="title">{{CodeInfo.title}}</div>
				<div class="code">
					<img :src="CodeInfo.srcs" alt="">
				</div>
				<div class="signtext">扫一扫，会议签到</div>
				<div class=" item">
					<span>参会时间</span>
					<div>{{(CodeInfo.beginTime.substring(0,CodeInfo.beginTime.length-6)).replace('-','年').replace('-','月')}}</div>
					<div>{{CodeInfo.beginTime.substring(10,CodeInfo.beginTime.length)}}-{{CodeInfo.endTime.substring(10,CodeInfo.endTime.length)}}</div>
				</div>
			</div>
  </div>
</template>
<script>
export default {
	data(){
		return{
			CodeInfo:{
			tiltle:'',
			beginTime:'',
			endTime:'',
			srcs:''
			},
			timeCode:''
		}
	},
	created(){
		this.CodeInfo.title=this.$route.query.title
        this.CodeInfo.beginTime  = this.$route.query.startdate
        this.CodeInfo.endTime  = this.$route.query.enddate
        this.CodeInfo.srcs=this.baseURL+'/meeting_code/code?uId='+this.$route.query.uId
        this.timeCode=setInterval(() => {
					this.CodeInfo.srcs=this.baseURL+'/meeting_code/code?uId='+this.$route.query.uId+'&round='+Math.random()*10
        }, 20000)
	},
	beforeDestroy(){
		clearTimeout(this.timeCode)
	},
	methods:{
		prev(){
			clearTimeout(this.timeCode)
			this.$router.push({name:'meeting'})
		}
	}
}
</script>
<style scoped lang='scss'>
	.codebody{
		background:#e5fbfd;
		overflow: auto;
		padding-bottom: 100px;
	}
	.top-logo{
		font-size: 20px;
		color: #000;
		padding-top: 10px;
		vertical-align: top;
		display: inline-block;
		img{
			vertical-align: middle;
			margin: 0;
			width: 76px;
			height: 66px;
		}
	}
	.meetInfo{
		margin: 26px auto 0 ;
		width: 470px;
		text-align: center;
		margin-left: 360px;
		display: inline-block;
		.title{
			font-size: 38px;
    	font-weight: bold;
  	}
		.code{
			width:360px ;
			height: 380px;
			text-align: center;
			background: url(../../../assets/images/meetcode.png) 0 0 no-repeat;
			background-size:100% 100% ;
			text-align: center;
			margin: 50px auto 27px;
			img{
				width: 200px;
				height: 200px;
				margin: 156px auto 30px;
			}
		}
		.signtext{
			font-size: 30px;
			color: #0e8591;
			margin-bottom: 60px;
		}
	}

  .item {
		width: 470px;
		text-align: center;
    font-size: 36px;
		border: 1px solid #046f7a;
		color: #046f7a;
		span{
    	font-size: 30px;
			display: block;
			background:#e5fbfd;
			width: 180px;
			margin:-20px auto 10px;
		}
		div{
			font-size: 26px;
			height: 40px;
			line-height: 40px;
		}
  }
  
</style>