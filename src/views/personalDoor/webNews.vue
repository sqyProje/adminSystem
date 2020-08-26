<template >
  <!-- 整个盒子 -->
  <div class="root-box">
    <!-- 上半部分 -->
    <div class="top-root">
      <!-- 轮播图 -->
      <div class="block left-box">
        <el-carousel height="310px">
          <el-carousel-item v-for="(item,i) in list" :key="i">
            <img style="max-width: 100%;height:310px" :src="item.picpath" alt />
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--公告  -->
      <div class="right-box">
        <div class="gonggao-box">
          <div style="padding-left:15px;height:30px;line-height:30px;">公告</div>
          <el-form :inline="true" size="mini" :model="listQuery" class="demo-form-inline">
            <el-form-item label="公告搜索">
              <el-input v-model="listQuery.title" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :row-style="{height:'25px'}"
          :header-row-style="{height:'25px'}"
          :cell-style="{padding:'1px'}"
          :header-cell-style="{ background: '#3C82FE',color:'#FFFFFF',}"
          :data="AnnounceList"
          style="width: 100%"
        >
          <el-table-column prop="title" width="230" label="标题"></el-table-column>
          <el-table-column prop="sketch" label="简介" width="250" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="publishDate" width="230" label="发布时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="NoticeDetails(scope.row)" type="text" size="small">打开</el-button>
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
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 下半部分 -->

    <div class="left-box1">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-form :inline="true" size="mini" :model="newQuery" class="demo-form-inline">
            <el-form-item label="新闻搜索">
              <el-input v-model="newQuery.title" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="newsSubmit" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
          <el-tab-pane
            v-for="(item,i) in newsType"
            :key="i"
            :id="item.uId"
            :label="item.name"
            :name="item.name"
          >
            <div class="top-root">
              <div v-for="(item,i) in newsList" :key="item.i">
                <div v-if="i==0">
                  <div>
                    <img class="img-box" :src="item.picPath" alt />
                  </div>
                  <div class="biaoti">{{item.title}}</div>
                  <div class="neirong">{{item.sketch}}</div>
                  <div style="height:30px">
                    <span class="btn-size">来源：国家卫生健康委 {{item.publishDate}}</span>
                    <span class="btn-box btn-size" @click="SeeDetails(item)">查看详情 >></span>
                  </div>
                </div>
              </div>
              <div v-for="(item,i) in newsList" :key="item.i">
                <div class="bom-boxs" @click="SeeDetails(item)" v-if="i!=0">
                  <span>
                    <img src="../../assets/images/lingwps.png" alt />
                  </span>
                  <span>{{item.title}}{{item.title}}{{item.title}}{{item.title}}{{item.title}}</span>
                  <span class="el-icon-arrow-right"></span>
                </div>
              </div>
            </div>
            <div class="fenye">
                <el-pagination
                  background
                  @size-change="handleSizeChanges"
                  @current-change="handleCurrentChanges"
                  layout="total, sizes,prev, pager, next,jumper"
                  :current-page.sync="newQuery.pageNum"
                  :page-size="newQuery.pageSize"
                  :page-sizes="[10,20,30]"
                  :total="total"
                ></el-pagination>
              </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="bom-box">河南健康奇点网络科技有限公司©All Rights Reserved.</div>
  </div>
</template>
      
<script>
const defaultListQuery = {
  name: "",
  sketch: "",
  pageNum: 1,
  pageSize: 6,
};
const newListQuery = {
  title: "",
  type: "",
  pageNum: 1,
  pageSize: 10,
};
import {
  NewsDetails,
  slideshow,
  newsType,
  AnnounceList,
  newsList,
} from "@/api/personalDoor";
import { Loading } from 'element-ui';
import loginUserVue from '../manageDoor/menu_pers/loginUser.vue';
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      newQuery: Object.assign({}, newListQuery),
      list: [],
      newsType: [],
      activeName:'新闻',
      AnnounceList: [],
      total: null,
      newsList:[],
      type: "a7c11246617946ed815ba662b1cc4d16",
    };
  },
  methods: {
    handleClick(tab, event) {
      this.newQuery.type = tab.$vnode.data.attrs.id;
      this.type = this.newQuery.type
      // console.log(tab.$vnode.data.attrs.id);
      newsList(this.type).then((res) => {
        this.newsList = res.datas.list;
        
      });
    },
    // 新闻详情
    SeeDetails(row) {
      this.$router.push({ name: "NewsDetails", query: { uId: row.uId } });
    },
    // 公告详情
    NoticeDetails(row) {
      this.$router.push({
        name: "AnnouncementNewsDetails",
        query: { uId: row.uId },
      });
    },
    onSubmit() {
      this.initTable();
    },
    newsSubmit() {
      this.newsinitTable();
    },
    initTable() {
      AnnounceList(this.listQuery)
        .then((response) => {
          this.AnnounceList = response.datas.list;
          this.total = response.datas.total;
        })
        .catch((error) => {
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
    // 新闻搜索分页
    newsinitTable() {
      console.log(1);
      // this.handleClick()
      newsList(this.newQuery)
        .then((response) => {
          this.newsList = response.datas.list;
          this.total = response.datas.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleResetSearch() {
      this.newQuery = Object.assign({}, newQuery);
      this.newsinitTable();
    },
    handleSizeChanges(val) {
      this.newQuery.pageNum = 1;
      this.newQuery.pageSize = val;
      this.newsinitTable();
    },
    handleCurrentChanges(val) {
      this.newQuery.pageNum = val;
      this.newsinitTable();
    },
  },
  created() {
    this.initTable(),
    // this.newsinitTable()
      slideshow().then((res) => {
        this.list = res.datas;
      }),
      newsType().then((res) => {
        this.newsType = res.datas;
      });
       newsList(this.type).then((res) => {
        this.newsList = res.datas.list;
        // this.newsList = response.datas.list;
        //   this.total = response.datas.total;
      });
  }
}
</script>

<style scoped>
.fenye {
  margin-left: 30%;
}
.img-box {
  width: 608px;
  height: 250px;
  background-size: 100% 100%;
}
.gonggao-box {
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
}
.root-box {
  background-color: #f1f1f1;
}
.top-root {
  display: flex;
  justify-content: space-between;
}
.left-box {
  width: 863px;
  height: 350px;
  padding: 20px 10px 20px 15px;
  margin-top: 10px;
  margin-left: 10px;
  background: rgba(255, 255, 255, 1);
}
.left-box1 {
  width: 99%;
  min-height: 460px;
  padding: 0px 10px 20px 15px;
  margin-top: 10px;
  margin-left: 10px;
  background: rgba(255, 255, 255, 1);
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.right-box {
  width: 863px;
  height: 350px;
  margin: 10px 15px 0px 10px;
  background: rgba(255, 255, 255, 1);
}
.hint-box {
  width: 863px;
  height: 43px;
  background: rgba(91, 163, 221, 1);
  line-height: 43px;
  font-size: 14px;
  padding-left: 20px;
}
.headline {
  padding: 0px 240px 0px 414px;
}
.demonstration {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-bottom: 5px;
}
.bom-box {
  text-align: center;
  font-size: 12px;
  height: 60px;
  line-height: 60px;
}

.biaoti {
  width: 516px;
  height: 23px;
  font-size: 22px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  margin-bottom: 10px;
}
.neirong {
  width: 608px;
  font-size: 14px;
  color: rgba(76, 76, 76, 1);
  margin-bottom: 10px;
  padding-right: 22px;
}
.btn-box {
  width: 100px;
  height: 30px;
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 2px;
  margin-left: 239px;
  display: inline-block;
  text-align: center;
}
.btn-size {
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
  line-height: 30px;
}
.el-icon-arrow-right {
  padding-left: 200px;
}
.bom-boxs {
  margin: 10px;
}
</style>

