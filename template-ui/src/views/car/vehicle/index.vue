<template>
  <div class="app-container">
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

      <el-table-column label="车辆编号">
        <template slot-scope="scope">
          {{ scope.row.plateNumber }}
        </template>
      </el-table-column>

      <el-table-column label="车牌类型">
        <template slot-scope="scope">
          {{ scope.row.plateType }}
        </template>
      </el-table-column>

      <el-table-column label="驾驶员姓名">
        <template slot-scope="scope">
          {{ scope.row.driver.driverName }}
        </template>
      </el-table-column>

      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import {
  getVehicleList
} from "@/api/car";

/*getVehicleList().then(res=>{
  console.log(res);
}).catch(error=>{
  console.log(error);
})*/

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [
        {
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
        },
        {
          "vehicleId": 78,
          "carId": 97,
          "plateNumber": "川A79D5H",
          "plateType": "汽油车",
          "vehicleModel": "越野车",
          "car": {
            "carId": 97,
            "type": "车辆",
            "driverId": 97,
            "chipId": "B359237D",
            "imagePath": "6a8c2fe3-4d9b-4b8d-bbc9-6128c2396865",
            "driver": null
          },
          "driver": {
            "driverId": 97,
            "driverName": "扎西平措",
            "driverPhone": "18989097889"
          }
        },
      ],
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getVehicleList().then(res => {
        this.list = res.data;
        this.listLoading = false
      })
      /*getList().then(response => {
        // this.list = response.data.items
        this.listLoading = false
      })*/
    }
  }
}
</script>
