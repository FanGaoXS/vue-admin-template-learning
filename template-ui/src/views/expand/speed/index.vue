<template>
  <el-container>
    <el-main>

      <!--进度条
      show-text: 是否显示进度条中间的文字或图片，默认是true（显示）
                 我的逻辑是判断当前测速的次数是否是最大或者是否出错
                 如果是最大或出错就显示官方的正确和错误的logo提示（好看）
                 平时正常测速的时候就不显示文字（很丑）
      percentage：进度条的百分比（响应式根据次数来动态增加）
      status：进度条的状态，利用过滤器来筛选，如果次数达到最大次数则设为
              ‘success’，如果为错误设为'exception'（动态给进度条设置样式）
      -->
      <el-progress
        type="circle"
        :show-text="count===maxCount || isError"
        :percentage="count"
        :width="200"
        :stroke-width="10"
        :status="count | statusFilter(maxCount,isError) "></el-progress>
      <el-row el-row :gutter="10">
        <el-col
          :xs="{span: 24,offset: 0}"
          :sm="{span: 12,offset: 6}"
          :md="{span: 8,offset: 8}">
          <el-input :value="speedArray | aveSpeedFilter" readonly>
            <template slot="prepend">{{isDownload?'下载':'上行'}}平均速率</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row el-row :gutter="10">
        <el-col
          :xs="{span: 24,offset: 0}"
          :sm="{span: 12,offset: 6}"
          :md="{span: 8,offset: 8}">
          <el-input :value="speedArray | maxSpeedFilter" readonly>
            <template slot="prepend">{{isDownload?'下载':'上行'}}最大速率</template>
          </el-input>
        </el-col>
      </el-row>
      <el-button
        @click="downloadButton"
        :disabled="flag"
        type="primary"
        :loading="flag"
        size="medium">测试下载速度
      </el-button>
      <el-button
        @click="uploadButton"
        :disabled="flag"
        type="success"
        :loading="flag"
        size="medium">测试上行速度
      </el-button>
    </el-main>
  </el-container>
</template>

<script>

  import {
    uploadSpeedTest
  } from "@/api/speed";

  export default {
    name: "index",
    data() {
      return {
        msg: 'HelloVuejs!',
        isDownload: true,
        count: 0,         //次数
        maxCount: 100,    //最大次数
        speedArray:[],    //速率数组（用于求最大和平均）
        flag: false,      //控制按钮是否能被点击
        waitTime: 300,    //控制单次测速间隔
        isError: false    //控制测速是否出错
      }
    },
    filters: {
      /**
       * 状态过滤器，如果当前次数等于最大返回success
       * 如果测试过程中出错，返回exception，其余时间
       * 不显示（为空字符串）
       * @param status
       * @param maxCount
       * @param isError
       * @returns {string}
       */
      statusFilter(status,maxCount,isError){
        if (status===maxCount) return 'success';
        if (isError) return 'exception';
      },
      /**
       * 平均速率过滤器：
       *      先得到速率之和，然后用和除以数量
       * @param speedArray
       * @returns {string}
       */
      aveSpeedFilter(speedArray) {
        if (speedArray.length===0) return ;
        let totalSpeed = 0;
        let number = speedArray.length;
        for (let speed of speedArray) {
          totalSpeed += speed;
        }
        let aveSpeed = totalSpeed/number;
        return aveSpeed.toFixed(2)+'Mbps';
      },
      /**
       * 最大速率过滤器：
       *       先得到速率之和，然后依次筛选出最大速率
       * @param speedArray
       * @returns {string}
       */
      maxSpeedFilter(speedArray){
        if (speedArray.length===0) return ;
        let maxSpeed = 0;
        for (let speed of speedArray) {
          if (speed>maxSpeed) maxSpeed = speed;
        }
        return maxSpeed.toFixed(2)+'Mbps';
      },
    },
    methods: {


      downloadButton(){
        console.log('开始测试下载速度->>>>');
        this.isDownload = true;
        this.isError = false;
        this.count = 0;
        this.speedArray = [];
        this.flag = true;
        this.startDownload();
      },

      startDownload(){
        setTimeout(()=>{
          this.download();
        },this.waitTime)
        this.count+=10;
      },
      /**
       * 下载测速体：
       *      定义Image对象，给Image对象指定图片资源的地址（可以是本地也可以是远程服务器）
       *      同时你必须要手动指定该图片的大小（单位Byte字节）仍然是需要获得发起请求该图片
       *      资源的时间戳。onload钩子会在图片加载完成的时候执行后面这个函数，所以我们需要
       *      在该函数里执行结束时的相应操作，比如得到完成下载时候的时间戳等....
       */
      download(){
        let image = new Image(); //定义Image对象
        let imageSrc=process.env["VUE_APP_BASE_URL"]+'/image/speed/test.JPG';
        let imageSize=7984555;
        image.src = imageSrc + '?n=' +Math.random(); //随机访问该图片资源
        let startTime = new Date().getTime(); //开始下载时的时间戳
        let that = this;
        image.onload = function () { //图片加载完时会执行的回调函数
          let endTime = new Date().getTime(); //完成下载的时的时间
          /*console.log('startTime',startTime);
          console.log('endTime',endTime);*/
          // console.log('延迟',endTime-startTime,'ms'); //误差为6ms
          let diffSeconds = (endTime - startTime)/1000; //差时间转为秒
          let speedBps = (imageSize/diffSeconds)*8; //每秒下载多少B的资源
          let speedKBps = speedBps / 1024;  //每秒下载多少KB（千B）的资源
          let speedMbps = speedKBps / 1024; //每秒下载多少MB（兆B）的资源
          console.log('['+that.count/10+']'+'下载速率',speedMbps,'Mbps');
          //将该次测速得到的速率追加到速率速组里
          that.speedArray.push(speedMbps);
          // delete image; //下载完成后删除该图片资源
          if (that.count<that.maxCount){//如果没有到达最大次数，则依然执行
            that.startDownload();
          } else {
            that.flag = false;
          }
        };
      },


      /**
       * 开始上传测速：
       *   初始化变量
       */
      uploadButton(){
        console.log('开始测试上行速度->>>>');
        this.isDownload = true;
        this.isError = false;
        this.count = 0;
        this.speedArray = [];
        this.flag = true;
        this.startUpload();
      },
      /**
       * 间隔waitTime执行一次上传，完成后次数+20
       */
      startUpload(){
        setTimeout(()=>{
          this.upload();
        },this.waitTime)
        this.count+=20;
      },
      /**
       * 上传测速体：
       *    原理就是得到客户端的时间戳为startTime，然后向服务端发起POST请求（请求体尽量大）
       *    请求成功的时候执行回调函数，从服务端返回的时候执行success的时候获得时间戳为endTime
       *    和contentLength（单位字节Byte），再利用contentLength除以服务端时间
       *    和客户端时间差（注意需要将时间戳的单位ms转为s）就得到标准的每秒请求多少字节
       *    根据国家宽带速率，需要乘以8，所以得到Bps。然后再根据单位换算得到响应
       *    的Kbps、Mbps。
       *    Tips：1Byte=8Bits          （1字节=8字）
       *          1Kb=1024Byte         （1Kb=1024B）
       *          1Mb=1024Kb           （1Mb=1024Kb）
       */
      upload(){
        let startTime = new Date().getTime();
        // console.log('startTime->',startTime);
        let text =`A`;   //一个字母大小为1字节Byte
        let totalText ;
        for (let i = 0; i < 1024 * 1024 * 2; i++) {
          totalText+=text; //post大小为2M的请求
        }
        let formData = new FormData();
        formData.append('text',totalText);
        uploadSpeedTest(formData).then(res=>{
          let endTime = new Date().getTime()
          // let endTime = res.data.endTime;
          let contentLength = res.data.contentLength;
          let diffTime = endTime-startTime;
          /*console.log('startTime->',startTime)
          console.log('endTime->',endTime);
          console.log('contentLength->',contentLength);
          console.log('diffTime->',diffTime);*/
          let speedBps = (contentLength*8)/(diffTime/1000);
          let speedKbps = speedBps / 1024 ;
          let speedMbps = speedKbps / 1024 ;
          console.log('['+this.count/20+']'+'上行速率',speedMbps,'Mbps（仅供参考）');
          //将该次测速得到的速率追加到速率速组里
          this.speedArray.push(speedMbps);
          if (this.count<this.maxCount){//如果没有到达最大次数，则依然执行
            this.startUpload();
          } else {
            this.flag = false;
          }
        }).catch(err=>{
          this.isError=true;
          this.flag = false;
          console.log(err);
        })

      },


    },
  }
</script>

<style scoped>
  .el-header, .el-footer {
    /*background-color: #B3C0D1;*/
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    /*background-color: #E9EEF3;*/
    color: #333;
    text-align: center;
    /*width: 50%;*/
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-row{
    margin: 15px;
  }
</style>
