<template>
  <div class="app-container">

    <el-header style="margin-top: 10px">
      <el-page-header @back="goBack" content="轨迹详情">
      </el-page-header>
    </el-header>

    <el-amap vid="aMap"
             class="aMap"
             :center="center"
             :zoom="zoom"><!--高德地图地图组件-->
      <el-amap-polyline
        :path="path"
        :lineJoin="'round'"
        strokeColor="#3366FF"
        strokeWeight="5"
        strokeStyle= "solid"
        borderWeight= "2"
        lineJoin="round"
      /><!--轨迹折线-->

    </el-amap>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="plateNumber | plateNumberFilter" readonly>
          <template slot="prepend">车牌号</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="mileage | mileageFilter" readonly>
          <template slot="prepend">里程</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="aveAltitude" readonly>
          <template slot="prepend">平均海拔</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="estimateFuelConsumptionAll" readonly>
          <template slot="prepend">总耗油（估算）</template>
        </el-input>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="startPoint | pointFilter" readonly>
          <template slot="prepend">起点</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="startTime | dateFilter" readonly>
          <template slot="prepend">起点时间</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="endPoint | pointFilter" readonly>
          <template slot="prepend">终点</template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-input :value="endTime | dateFilter" readonly>
          <template slot="prepend">终点时间</template>
        </el-input>
      </el-col>
    </el-row>


  </div>
</template>

<script>

import { getList } from '@/api/table'

import {
  plateNumberFilter,
  mileageFilter
} from "@/utils/globalFilters";

import {
  getPointListByPlateNumberAndDate
} from "@/api/car";

export default {
  computed: {
    // 车牌号
    plateNumber() {
      return this.$route.params.plateNumber;
    },
    // 里程数
    mileage() {
      return this.$route.params.mileage;
    },
    // 平均海拔
    aveAltitude() {
      let total = 0;
      for (let point of this.pointList) {
        total += point.altitude;
      }
      let ave = total/(this.pointList.length);
      return ave.toFixed(3)+'米';
    },
    // 估算总耗油量（升/百公里）
    estimateFuelConsumptionAll() {
      return ((this.mileage/1000/100)*7.5).toFixed(3)+'升';
    },
    startPoint() {
      return this.path[0];
    },
    endPoint() {
      return this.path[this.path.length-1];
    },
    startTime() {
      if (this.pointList.length==0) return ;
      return this.pointList[0].record_time;
    },
    endTime() {
      if (this.pointList.length==0) return ;
      return this.pointList[this.pointList.length-1].record_time;
    }
  },
  filters: {
    dateFilter(date){
      let objectDate = new Date(date);
      return objectDate.toLocaleDateString()+' '+objectDate.toLocaleTimeString();
    },
    pointFilter(point){
      if (point==undefined) return ;
      return '经度：'+point[0]+'，纬度：'+point[1];
    },
    plateNumberFilter(plateNumber) {
      return plateNumberFilter(plateNumber);
    },
    mileageFilter(mileage){
      return mileageFilter(mileage);
    }
  },
  data() {
    return {
      zoom: 14,  //初始缩放级别（数字越大约精细，最大18）
      center: [104.066143,30.573095],   //地图中心点坐标（默认是成都市政府）
      path:[
        // [latitude_amap,longitude_amap]
      ],
      pointList: [  //坐标点对象数组
        /*{ //坐标点对象
          altitude,       //坐标点海拔高度
          latitude_amap,  //坐标点纬度
          longitude_amap, //坐标点经度
          record_time     //坐标点记录的时间
        }*/
      ],
      listLoading: true
    }
  },
  created() {
    this.fetchData();
    // console.log(this.$route.params);
  },
  methods: {
    fetchData() {
      let plateNumber = this.$route.params.plateNumber;
      let date = this.$route.params.date;
      // let mileage = this.$route.params.mileage;
      getPointListByPlateNumberAndDate(plateNumber,date).then(res=>{
        // console.log(res.data);
        this.pointList = res.data;
        for (let i = 0; i < res.data.length; i++) {
          /*console.log(res.data[i].longitude_amap);  //经度
          console.log(res.data[i].latitude_amap);   //纬度*/
          this.path.push([res.data[i].longitude_amap,res.data[i].latitude_amap]);
        }
        // console.log(this.path);
        this.center = this.path[0];
      })
      this.listLoading = false;
    },
    goBack(){
      history.back();
    }
  }
}
</script>

<style scoped>

  .aMap {
    height: 600px;
    width: 100%;
  }

  .el-input {
    width: 80%;
  }

  .el-col {
    margin-top: 5px;
    padding: 5px;
  }

</style>
