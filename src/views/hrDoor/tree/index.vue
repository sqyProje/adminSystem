
<template>
  <div>
    <div class="container">
      <div class="text-center">
        <vue2-org-tree
          name="test"
          :data="toChildTree"
          :props="defaultProps"
          :horizontal="horizontal"
          :collapsable="collapsable"
          :label-class-name="labelClassName"
          :render-content="renderContent"
          @on-expand="onExpand"
        ></vue2-org-tree>
        <!--:label-class-name="labelClassName"
        :render-content="renderContent"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"-->
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        data: {
          childMenu:[
            {
              childMenu:[
                {
                  childMenu:[
                  ],
                  "createdate":"2020-06-19 14:33:25",
                  name:"前台",
                  "pName":"人事",
                  "pid":"3a20469776a54529b003cff5fb92c7ec",
                  "sketch":"前台",
                  "state":0,
                  "uId":"7c23f62a9d104d4c9c1dd8ed67f4d1bd",
                  "updatedate":null
                },
                {
                  childMenu:[
                  ],
                  "createdate":"2020-06-19 14:33:40",
                  name:"行政",
                  "pName":"人事",
                  "pid":"3a20469776a54529b003cff5fb92c7ec",
                  "sketch":"行政",
                  "state":0,
                  "uId":"d2a76d0ee93847959d788ff68cfd339c",
                  "updatedate":null
                }],
              "createdate":"2020-06-19 10:35:32",
              name:"人事",
              "pName":"总经理",
              "pid":"c412809ef03948ab8d2b634745ed6182",
              "sketch":"人事部分",
              "state":0,
              "uId":"3a20469776a54529b003cff5fb92c7ec",
              "updatedate":null
            },
            {
              childMenu:[
                {
                  childMenu:[
                  ],
                  "createdate":"2020-06-19 14:33:59",
                  name:"前端",
                  "pName":"技术",
                  "pid":"f8b6c946c59c4cd89ae75cd28d8e180a",
                  "sketch":"前端",
                  "state":0,
                  "uId":"00745521cea145a9aa0f691e3ecb4455",
                  "updatedate":null
                },
                {
                  childMenu:[
                  ],
                  "createdate":"2020-06-19 14:33:59",
                  name:"后台",
                  "pName":"技术",
                  "pid":"f8b6c946c59c4cd89ae75cd28d8e180a",
                  "sketch":"后台",
                  "state":0,
                  "uId":"af77572cb46d4f64a53a7f4f61a9b5e6",
                  "updatedate":"2020-06-19 14:34:24"
                }],
              "createdate":"2020-06-19 10:36:49",
              name:"技术",
              "pName":"总经理",
              "pid":"c412809ef03948ab8d2b634745ed6182",
              "sketch":"软件研发，项目调研发",
              "state":0,
              "uId":"f8b6c946c59c4cd89ae75cd28d8e180a",
              "updatedate":"2020-06-19 10:36:55"
            }],
          "createdate":"2020-06-19 10:24:14",
          name:"总经理",
          "pName":"",
          "pid":"",
          "sketch":"总经理",
          "state":0,
          "uId":"c412809ef03948ab8d2b634745ed6182",
          "updatedate":"2020-06-19 10:33:21"
        },
        defaultProps: {
          label: 'name',
          children: 'childMenu'
        },
        horizontal: false,
        collapsable: false,
        expandAll: false,
        labelClassName: "bg-white"
      };
    },
    props:{
      toChildTree:{
        type:Object,
      }
    },

    created(){
      console.log(this.toChildTree)
    },
    methods: {
      renderContent(h, data) {
        return data.name;
      },
      onExpand(data) {
        if ("expand" in data) {
          data.expand = !data.expand;
          if (!data.expand && data.childMenu) {
            this.collapse(data.childMenu);
          }
        } else {
          this.$set(data, "expand", true);
        }
      },
      onNodeClick(e, data) {
        alert(data.name);
      },
      collapse(list) {
        var _this = this;
        list.forEach(function(child) {
          if (child.expand) {
            child.expand = false;
          }
          child.childMenu && _this.collapse(child.childMenu);
        });
      },
    }
  };
</script>
