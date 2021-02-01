<template>
  <div class="app-container">

    <el-header style="margin-top: 10px"><!--页头（返回按钮）-->
      <el-page-header @back="routerBack" content="工时详情">
      </el-page-header>
    </el-header>

    <el-table
      v-loading="listLoading"
      :data="workList"
      element-loading-text="加载中···"
      :default-sort = "{prop: 'date', order: 'descending'}"
      border
      fit
    >
      <!--:default-sort = "{prop: 'date', order: 'descending'}"默认排序列-->
      <!--highlight-current-row选中行高亮-->
      <el-table-column label="车牌号" align="center" width="250">
        {{ $route.params.plateNumber | plateNumberFilter }}
      </el-table-column>
      <el-table-column label="日期" align="center" prop="date">
        <template slot-scope="scope">
          {{ scope.row.date | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column label="里程数" align="center">
        <template slot-scope="scope">
          {{ scope.row.mileage | mileageFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <!--路由跳转-->
          <el-button
            type="primary"
            size="small"
            icon="el-icon-position"
            @click="routerAhead(scope.row)"
            :disabled="scope.row.mileage===0" >
            轨迹详情
          </el-button>
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
  mileageFilter,
} from "@/utils/globalFilters";

import AMapLoader from '@/utils/AMap'

export default {
  filters: {
    plateNumberFilter(plateNumber){
      return plateNumberFilter(plateNumber); //使用globalFilters里的过滤器
    },
    mileageFilter(mileage){
      return mileageFilter(mileage); //使用globalFilters里的过滤器
    },
    /**
     * 将yyyy-mm-dd日期字符串转为yyyy/mm/dd类型的日期对象
     * @param date
     * @returns {string}
     */
    dateFilter(date){
      let objectDate = new Date(date);//直接将日期字符串转为日期对象
      return objectDate.toLocaleDateString();
    }
  },
  data() {
    return {
      workList: [ //工时对象数组
        /*plateNumber,
        date,
        mileage*/
      ],
      listLoading: true,
      map: null
    }
  },
  created() {
    // 异步加载utils里的高德地图官方js
    // 因为这个页面需要利用高德官方组件GeometryUtil.distanceOfLine()来计算里程
    AMapLoader().then(AMap => {
      this.map = AMap; // 加载成功后将异步加载的高德原生js赋给this.map
      console.log('高德地图api加载成功');
      this.fetchData(); //获取到数据并且填充
    }, e => {
      console.log('高德地图api加载失败',e)
    })
  },
  methods: {
    test(mileage){
      console.log(mileage);
    },
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
            let lineArray = []; //初始化一个临时数组
            for (let point of res.data) {
              // console.log('point',point);
              /*console.log('longitude_amap',point.longitude_amap);
              console.log('latitude_amap',point.latitude_amap);*/
              lineArray.push([point.longitude_amap,point.latitude_amap]); //将坐标点的经纬度赋值按顺序添加到临时数组中
            }
            // console.log(lineArray);
            //将临时数组扔到高德原生js的路径长度计算工具（此函数是异步！！切记）
            let mileage = this.map.GeometryUtil.distanceOfLine(lineArray);
            // 将车牌号、日期、里程按顺序push到workList数组中
            this.workList.push({plateNumber, date, mileage});
          })
        }
        this.listLoading = false;
      })
    },
    // 路由前进
    routerAhead(row){
      if (row.mileage===0) return;
      this.$router.push({
        name: 'Map', //跳转到名为Map的路由去
        params: {    //携带以下参数
          plateNumber: row.plateNumber,
          date: row.date,
          mileage: row.mileage
        }
      })
    },
    // 路由回退
    routerBack(){
      this.$router.go(-1)
    }
  }
}
</script>
