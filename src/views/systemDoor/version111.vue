<template>
  <div class="app-container">
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, MessageBox } from 'element-ui'
  export default {
    data(){
      return {
        config: {
          size: 24, // 大小, 默认 24, 建议18 - 58
          url: "//f2e.cn.ronghub.com/sdk/emoji-48.png", // Emoji 背景图片
          lang: "zh", // Emoji 对应名称语言, 默认 zh
          // 扩展表情
          extension: {
            dataSource: {
              u1F914: {
                en: "thinking face", // 英文名称
                zh: "思考", // 中文名称
                tag: "🤔", // 原生 Emoji
                position: "0 0" // 所在背景图位置坐标
              }
            },
            // 新增 Emoji 背景图 url
            url: "//cdn.ronghub.com/thinking-face.png"
          }
        },
        imEmojiList:'',
        imTOkenCount:0,
        conversationList:[],
        appkey : 'kj7swf8oknb42',
        loaded: false,
      }
    },
    created(){
      this.imClientInit(this.appkey);
    },
    methods:{
      imClientInit: function(appkey) {
        // 初始化im
        RongIMLib.RongIMClient.init(appkey);
        this.imEmojiInit(this.config);
        this.setConnectionStatusLis(); // 必须设置监听器后，再连接融云服务器，
        this.setOnReceiveMessageLis();
        this.getToken();
      },
      imEmojiInit: function(config) {
        // 初始化表情
        RongIMLib.RongIMEmoji.init(config);
        this.imEmojiList = RongIMLib.RongIMEmoji.list;
      },
      setConnectionStatusLis: function() {
        // 设置监听器
        let that = this;
        RongIMClient.setConnectionStatusListener({
          onChanged: function(status) {
            switch (status) {
              case RongIMLib.ConnectionStatus.CONNECTED:
                console.log("链接成功");
                break;
              case RongIMLib.ConnectionStatus.CONNECTING:
                console.log("正在链接");
                break;
              case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log("断开连接");
                that.alertMsgShow = true;
                that.alertMsg = "当前消息回话已断开。";
                break;
              case RongIMLib.ConnectionStatus
                .KICKED_OFFLINE_BY_OTHER_CLIENT:
                that.alertMsgShow = true;
                that.alertMsg = "其他页面登录，当前消息回话已断开。";
                break;
              case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                console.log("域名不正确");
                break;
              case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log("网络不可用");
                break;
            }
          }
        });
      },
      setOnReceiveMessageLis: function() {
        // 消息监听器
        let that = this;
        RongIMClient.setOnReceiveMessageListener({
          // 接收到的消息
          onReceived: function (message) {
            console.log(message)
            var messageContent = message.content;
            // 判断消息类型
            switch(message.messageType) {
              case RongIMClient.MessageType.TextMessage: // 文字消息
                console.log('文字内容', messageContent.content);
                break;
              case RongIMClient.MessageType.ImageMessage: // 图片消息
                console.log('图片缩略图 base64', messageContent.content);
                console.log('原图 url', messageContent.imageUri);
                break;
              case RongIMClient.MessageType.HQVoiceMessage: // 音频消息
                console.log('音频 type ', messageContent.type); // 编解码类型，默认为 aac 音频
                console.log('音频 url', messageContent.remoteUrl); // 播放：<audio src={remoteUrl} />
                console.log('音频 时长', messageContent.duration);
                break;
              case RongIMClient.MessageType.RichContentMessage: // 富文本(图文)消息
                console.log('文本内容', messageContent.content);
                console.log('图片 base64', messageContent.imageUri);
                console.log('原图 url', messageContent.url);
                break;
              case RongIMClient.MessageType.UnknownMessage: // 未知消息
                console.log('未知消息, 请检查消息自定义格式是否正确', message);
                break;
              default:
                console.log('收到消息', message);
                break;
            }
          }
        })
      },
      getToken: function() {
        // 获取token
        let that = this;
        // 获取token值成功后进行connect连接
        /*if (that.$store.state.user.isLogin) {
          // 用户登录成功后采取获取token
          if (that.$store.state.user.user.imToken) {*/
            //先从store找imtoken
           // that.toConnect('Xkcb2nIpylL7C8aGI80eUCRR4JPw5XxSxA1rDRnd8rahz2l3P1nmfcNVAgNi5CMPFUV4CmES3CE=@fdt1.cn.rongnav.com;fdt1.cn.rongcfg.com');
          /*} else {
            that.userApi.getImToken({}, function(res) {
              that.toConnect(res.imToken);
            });
          }
        }*/
      },
      toConnect: function(token) {
        let that = this;
        RongIMClient.connect(
          token,
          {
            onSuccess: function(userId) {
              that.senderId = userId;
              that.getTotalUnreadNum();
              that.getConversationList()
            },
            onTokenIncorrect: function() {
              console.log("token无效");
              that.imTOkenCount++;
              if(that.imTOkenCount<2){
                that.getToken();
              }
            },
            onError: function(errorCode) {
              let that = this;
              var info = "";
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  that.alertMsgShow = true;
                  that.alertMsg = "服务器连接超时";
                  break;
                case RongIMLib.ConnectionState
                  .UNACCEPTABLE_PAROTOCOL_VERSION:
                  info = "不可接受的协议版本";
                  break;
                case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                  info = "appkey不正确";
                  break;
                case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                  that.alertMsgShow = true;
                  that.alertMsg = "消息服务暂时不可用";
                  break;
              }
            }
          }
        );
      },
      getTotalUnreadNum: function() {
        let that = this;
        RongIMClient.getInstance().getTotalUnreadCount({
          onSuccess: function(count) {
            // count => 所有会话总未读数。
            console.log('所有会话总未读数'+count);
            that.totalUnreadNum = count;
          },
          onError: function(error) {
            // error => 获取总未读数错误码。
          }
        });
      },
      getConversationList: function(callback) {
        // 获取会话列表
        let that = this;
        RongIMClient.getInstance().getConversationList(
          {
            onSuccess: function(list) {
              // list => 会话列表集合。
              console.log(list);
              if (list.length > 0) {
            //    console.log(list[0].targetId);
                /*let newList = [];
                list.forEach(function(item, key) {
                  newList.push({
                    targetId: item.targetId,
                    targetName:
                      item.latestMessage.messageDirection == 1
                        ? item.latestMessage.content.extra.split(
                        ",|"
                        )[1]
                        : item.latestMessage.content.extra.split(
                        ",|"
                        )[0]
                  });
                });
                that.conversationList = newList;*/
              }
              if(callback){
                callback();
              }
            },
            onError: function(error) {
              console.log(error)
              // do something...
            }
          },
          null
        );
      },
    }
  }

</script>
