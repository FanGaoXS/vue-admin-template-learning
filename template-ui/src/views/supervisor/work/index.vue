<template>
  <div class="app-container">

    <el-header style="margin-top: 10px">
      <el-page-header @back="goBack" content="工时详情">
      </el-page-header>
    </el-header>

    <el-table
      v-loading="listLoading"
      :data="workList"
      element-loading-text="Loading"
      :default-sort = "{prop: 'date', order: 'descending'}"
      border
      fit
    >
      <!--highlight-current-row选中行高亮-->
      <!--<el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>-->
      <el-table-column label="车牌号" align="center">
        {{ $route.params.plateNumber | plateNumberFilter }}
      </el-table-column>
      <el-table-column label="日期" align="center" prop="date">
        <template slot-scope="scope">
          {{ scope.row.date | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="里程数" align="center">
        <template slot-scope="scope">
          {{ scope.row.mileage | mileageFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!--路由跳转-->
          <router-link :to="{
            name: 'Map', //跳转到名为Map的路由去
            params: {    //携带以下参数
              plateNumber: scope.row.plateNumber,
              date: scope.row.date,
              mileage:scope.row.mileage
            }
          }">
            <el-button type="primary" size="small" icon="el-icon-edit">
              轨迹详情
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>

import { getList } from '@/api/table'

import {
  getWorkListByPlateNumber,
  getPointListByPlateNumberAndDate
} from "@/api/car";

import {
  plateNumberFilter,
  mileageFilter
} from "@/utils/globalFilters";

import AMapLoader from '@/utils/AMap'

export default {
  filters: {
    plateNumberFilter(plateNumber){
      return plateNumberFilter(plateNumber);
    },
    mileageFilter(mileage){
      return mileageFilter(mileage); //执行globalFilters里的过滤器
    },
    dateFilter(date){
      let objectDate = new Date(date);
      return objectDate.toLocaleDateString();
    }
  },
  data() {
    return {
      workList: [
        /*plateNumber,
        date,
        mileage*/
      ],
      listLoading: true,
      map: null
    }
  },
  created() {
    AMapLoader().then(AMap => {
      this.map = AMap;
      console.log('高德地图api加载成功');
      this.fetchData();
    }, e => {
      console.log('高德地图api加载失败',e)
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // console.log(this.$route.params);
      let plateNumber = this.$route.params.plateNumber;
      getWorkListByPlateNumber(plateNumber).then(res=>{
        // console.log(res.data);
        for (let date of res.data) {
          // console.log(date);
          getPointListByPlateNumberAndDate(plateNumber,date).then(res=>{
            // console.log('res.data',res.data);
            let lineArray = [];
            for (let point of res.data) {
              // console.log('point',point);
              /*console.log('longitude_amap',point.longitude_amap);
              console.log('latitude_amap',point.latitude_amap);*/
              lineArray.push([point.longitude_amap,point.latitude_amap]);
            }
            /*console.log('lineArray',lineArray);
            console.log('AMap',this.map);*/
            let mileage = this.map.GeometryUtil.distanceOfLine(lineArray);
            // console.log(date+'->'+mileage);
            this.workList.push({plateNumber, date, mileage});
          })
          this.listLoading = false;
        }
      })
    },
    goBack(){
      history.back();
    }
  }
}
</script>
