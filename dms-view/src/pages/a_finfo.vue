<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="10">
        <PhChart ref="chart1" :config="chart1config"></PhChart>
      </a-col>
      <a-col :span="7">
        <h3>报修申请审批占比</h3>
        <PieChart ref="chart2" :config="chart2config"></PieChart>
      </a-col>
      <a-col :span="7">
        <h3>报修申请处理占比</h3>
        <PieChart ref="chart3" :config="chart3config"></PieChart>
      </a-col>
    </a-row>
    <a-form
      :model="search.form"
      name="horizontal_login"
      layout="inline"
      autocomplete="off"
    >
      <a-form-item label="宿舍门牌号" name="key">
        <a-input v-model:value="search.form.key"> </a-input>
      </a-form-item>

      <a-form-item>
        <a-button style="margin: 0 5px" @click="loadAll()" type="primary"
          >搜索</a-button
        >
        <a-button
          style="margin: 0 5px"
          @click="
            search.form = {};
            loadAll();
          "
          type="primary"
          >重置</a-button
        >
        <a-button
          style="margin: 0 5px"
          @click="
            util.exportCsv(
              '宿舍报修申请信息',
              util.deepCopy(table.cols),
              util.deepCopy(table.data)
            )
          "
          type="primary"
          >导出</a-button
        >
      </a-form-item>
    </a-form>
    <a-divider />
    <div>
      <a-table :dataSource="table.data" :columns="table.cols">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              @click="replay(record)"
              :disabled="record.status != 0"
              type="primary"
              >审批</a-button
            >
          </template>
        </template>
      </a-table>
    </div>
    <!-- 审批 -->
    <a-modal
      v-model:visible="mo.add"
      style="top: 10px"
      cancelText="取消"
      okText="审批"
      title="报修申请审批"
      :confirm-loading="confirmLoading"
      @ok="addSt"
    >
      <a-row>
        <a-col :span="24" style="padding: 10px">
          <a-form :model="tmp">
            <a-form-item label="宿舍门牌号">
              <a-input readonly v-model:value="tmp.key" />
            </a-form-item>
            <a-form-item label="申请人">
              <a-input readonly v-model:value="tmp.name" />
            </a-form-item>
            <a-form-item label="申请时间">
              <a-input readonly v-model:value="tmp.createTime" />
            </a-form-item>
            <a-form-item readonly label="报修内容">
              <a-input v-model:value="tmp.content" type="textarea" />
            </a-form-item>
            <a-form-item label="审批结果">
              <a-radio-group v-model:value="tmp.status">
                <a-radio value="1">同意</a-radio>
                <a-radio value="-1">不同意</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="处理意见">
              <a-input v-model:value="tmp.str" type="textarea" />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import util from "../util.js";
import PhChart from "../components/PhChart.vue";
import PieChart from "../components/PieChart.vue";
export default {
  data() {
    return {
      chart1config: {
        name: "寝室报修次数排行",
        id: "c1",
      },
      chart2config: {
        name: "条数",
        id: "c2",
      },
      chart3config: {
        name: "条数",
        id: "c3",
      },
      tmp: {},
      userinfo: util.getObjSession("userinfo"),
      sinfo: {},
      mo: {
        add: false,
      },
      confirmLoading: false,
      search: {
        form: {},
      },
      table: {
        data: [],
        cols: [
          {
            title: "序号",
            width: "80px",
            dataIndex: "inde",
            align: "center",
            customRender({ text, record, index, column }) {
              return index + 1;
            },
          },
          {
            title: "门牌号",
            dataIndex: "key",
            align: "center",
          },
          {
            title: "报修内容",
            dataIndex: "content",
            align: "center",
          },
          {
            title: "报修人",
            dataIndex: "name",
            align: "center",
          },
          {
            title: "报修时间",
            dataIndex: "createTime",
            align: "center",
          },
          {
            title: "状态",
            dataIndex: "status",
            align: "center",
            customRender({ text, record, index, column }) {
              let str = "未知状态";
              if (text == 0) {
                str = "未处理";
              } else if (text == 1) {
                str = "已同意";
              } else if (text == -1) {
                str = "不同意";
              } else if (text == -2) {
                str = "已撤销";
              }
              return str;
            },
          },
          {
            title: "处理意见",
            dataIndex: "str",
            align: "center",
          },
          {
            title: "审批",
            key: "action",
            align: "center",
            width: "150px",
          },
        ],
      },
    };
  },
  mounted() {
    this.loadAll();
    this.loadChart();
    this.util = util;
  },
  methods: {
    loadAll() {
      util.method.getData(
        "fh",
        util.deepCopy(this.search.form),
        true,
        (res) => {
          this.table.data = res.data;
        },
        (err) => {}
      );
    },
    loadChart() {
      util.method.getData(
        "fh",
        null,
        false,
        (res) => {
          let y = [];
          let x = []; // 排行
          let z = [
            { name: "已审批", value: 0 },
            { name: "未审批", value: 0 },
          ]; // 审批
          let z1 = [
            { name: "同意", value: 0 },
            { name: "不同意", value: 0 },
          ]; // 处理
          res.data.forEach((item) => {
            let index = y.indexOf(item.key);
            if (index != -1) {
              x[index] += 1;
            } else {
              y.push(
                item.key
                  .replace("号楼", "")
                  .replace("楼层", "")
                  .replace("层", "")
                  .replace("楼", "")
              );
              //   y.push(item.key.slice(item.key.lastIndexOf("-") + 1));
              x.push(1);
            }
            if (item.status == -1) {
              z1[1].value++;
            } else if (item.status == 1) {
              z1[0].value++;
            }
            if (item.status == 0) {
              z[1].value++;
            } else {
              z[0].value++;
            }
          });
          this.$refs.chart1.setData({ y: y, x: x });
          this.$refs.chart2.setData(z);
          this.$refs.chart3.setData(z1);
        },
        (err) => {}
      );
    },
    addSt() {
      util.method.updateData(
        "fh",
        "createTime",
        util.deepCopy(this.tmp),
        (res) => {
          this.loadAll();
          this.loadChart();
          this.mo.add = false;
        }
      );
    },
    replay(row) {
      this.mo.add = true;
      this.tmp = util.deepCopy(row);
    },
  },
  components: { PhChart, PieChart },
};
</script>

<style>
</style>