<template>
  <div class="app-container">
    {{mileage}}
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号">
        {{ $route.params.plateNumber }}
      </el-table-column>
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
      <el-table-column label="里程数">
        <template slot-scope="scope">
          {{ scope.row.title }}
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

import AMapLoader from '@/utils/AMap'

export default {
  filters: {

  },
  data() {
    return {
      list: [

      ],
      mileage:[

      ],
      listLoading: true,
      map: null
    }
  },
  mounted() {
    AMapLoader().then(AMap => {
      console.log('高德地图加载成功')
      this.map = new AMap.Map('container', {
        center: [117.000923, 36.675807],
        zoom: 11
      })
    }, e => {
      console.log('高德地图加载失败' ,e)
    })
  },
  created() {
    this.fetchData()
    // console.log('params',this.$route.params);
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
          let lineArray = [];
          getPointListByPlateNumberAndDate(plateNumber,date).then(res=>{
            console.log(res.data);
            lineArray=[res.data.longitude_amap,res.data.latitude_amap];
          })
          // this.mileage = (AMap.GeometryUtil.distanceOfLine(lineArray));
        }
      })

    }
  }
}
</script>
