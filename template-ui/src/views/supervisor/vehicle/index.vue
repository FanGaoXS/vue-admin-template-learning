<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand" label-width="120px">
            <el-form-item label="车牌号">
              <span>{{ scope.row.plateNumber | plateNumberFilter  }}</span>
            </el-form-item>
            <el-form-item label="车牌类型">
              <span>{{ scope.row.plateType }}</span>
            </el-form-item>
            <el-form-item label="车辆类型">
              <span>{{ scope.row.vehicleModel }}</span>
            </el-form-item>
            <el-form-item label="车辆或机械">
              <span>{{ scope.row.car.type }}</span>
            </el-form-item>
            <el-form-item label="百公里油耗量">
              <span> 7.5（升/百公里）</span>
            </el-form-item>
            <el-form-item label="驾驶员姓名">
              <span>{{ scope.row.driver.driverName }}</span>
            </el-form-item>
            <el-form-item label="驾驶员电话号码">
              <span>{{ scope.row.driver.driverPhone }}</span>
            </el-form-item>
            <el-form-item label="车辆照片">
              <!--<span><img :src="'/image/car/'+props.row.imagePath" style="width: 50%;display: block;"></span>-->
              <!--图片预览，支持放大-->
              <el-image
                style="width: 200px;height: 200px"
                :src="IMAGE_BASE_URL+scope.row.car.imagePath"
                fit="cover"
                :preview-src-list="[IMAGE_BASE_URL+scope.row.car.imagePath]">
              </el-image>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="车牌号" align="center" width="250">
        <template slot-scope="scope">
          {{ scope.row.plateNumber | plateNumberFilter }}
        </template>
      </el-table-column>

      <el-table-column label="车牌类型" align="center" >
        <template slot-scope="scope">
          <el-tag :type=" scope.row.plateType | plateTypeFilter ">
            {{ scope.row.plateType }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="车辆类型" align="center" >
        <template slot-scope="scope">
          {{ scope.row.vehicleModel }}
        </template>
      </el-table-column>

      <el-table-column label="驾驶员姓名" align="center" >
        <template slot-scope="scope">
          {{ scope.row.driver.driverName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <!--路由跳转（跳转到名为Work的路由，并且将车牌号作为参数传递过去）-->
          <el-button
            type="primary"
            size="small"
            icon="el-icon-time"
            @click="routerAhead(scope.row)">
            查看工时
          </el-button>
        </template>
      </el-table-column>

    </el-table>
<!--    <router-view></router-view>-->
  </div>
</template>

<script>
import { getList } from '@/api/table'

import {
  plateNumberFilter
} from "@/utils/globalFilters";

import {
  getVehicleList
} from "@/api/car";

import {
  IMAGE_BASE_URL
} from "@/utils/myRequest";

export default {
  filters: {
    //车牌类型过滤
    plateTypeFilter(plateType){
      // 如果是汽油车则显示灰色样式，新能源显示success样式
      const plateTypeMap = {
        '汽油车': '',
        '新能源': 'success',
      };
      return plateTypeMap[plateType];
    },

    plateNumberFilter(plateNumber){
      return plateNumberFilter(plateNumber); //执行globalFilters里的过滤器
    }

  },
  data() {
    return {
      list: [ //车辆对象数组
        /*{
          "vehicleId": 77,
          "carId": 96,
          "plateNumber": "川AS28T4",
          "plateType": "汽油车",
          "vehicleModel": "越野车",
          "car": {
            "carId": 96,
            "type": "车辆",
            "driverId": 96,
            "chipId": "C2196C0D",
            "imagePath": "e53a7c40-8536-43b0-b700-a9bc36e4024d",
            "driver": null
          },
          "driver": {
            "driverId": 96,
            "driverName": "旦巴顿珠",
            "driverPhone": "17308917971"
          }
        },*/
      ],
      listLoading: true,
      IMAGE_BASE_URL: IMAGE_BASE_URL+'/image/car/'
    }
  },
  created() {
    this.fetchData(); //组件初始化完成后取得数据并且填充
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getVehicleList().then(res => { //利用axios从后端获取数据然后填充
        this.list = res.data;
        this.listLoading = false;
      })
    },
    // 路由前进
    routerAhead(row){
      this.$router.push({
        name: 'Work',
        params: {
          plateNumber: row.plateNumber
        }
      })
    },
  },
}
</script>

<style scoped>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
