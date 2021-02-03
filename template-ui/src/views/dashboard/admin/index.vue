<template>
  <div class="dashboard-editor-container">

    <panel-group/>

    <el-row :gutter="32">

      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="16"
        :xl="16"
        style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>

  import PanelGroup from "./components/PanelGroup";
  import BarChart from "./components/BarChart";
  import TransactionTable from "./components/TransactionTable";

  import {
    getVehicleList
  } from "@/api/car";

  export default {
    name: "index",
    components:{
      PanelGroup,
      BarChart,
      TransactionTable
    },
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }

  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }

</style>
