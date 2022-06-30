<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="11">
        <PhChart ref="chart1" :config="chart1config"></PhChart>
      </a-col>
      <a-col :span="6">
        <h3>加分次数占比</h3>
        <BarChart ref="chart2" :config="chart2config"></BarChart>
      </a-col>
      <a-col :span="7">
        <h3>减分次数占比</h3>
        <BarChart ref="chart3" :config="chart3config"></BarChart>
      </a-col>
    </a-row>
    <a-form
      :model="search.form1"
      name="horizontal_login"
      layout="inline"
      autocomplete="off"
    >
      <a-form-item label="公告">
        <a-input v-model:value="gg" style="width: 500px"> </a-input>
      </a-form-item>
      <a-form-item>
        <a-button style="margin: 0 5px" type="primary" @click="addGg"
          >发布公告</a-button
        >
        <a-button
          style="margin: 0 5px"
          @click="
            util.exportCsv(
              '卫生分数变动信息',
              util.deepCopy(hTable.cols),
              util.deepCopy(hTable.data)
            )
          "
          type="primary"
          >导出</a-button
        >
      </a-form-item>
    </a-form>
    <a-divider />
    <a-form
      :model="search.form"
      name="horizontal_login"
      layout="inline"
      autocomplete="off"
    >
      <a-form-item label="寝室号">
        <a-input v-model:value="search.form.key" style="width: 200px">
        </a-input>
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
      </a-form-item>
    </a-form>
    <a-divider />
    <div>
      <a-row :gutter="15">
        <a-col :span="13">
          <a-table :dataSource="table.data" :columns="table.cols">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button
                  style="margin: 0 5px"
                  @click="plus(record)"
                  type="primary"
                  >加分</a-button
                >
                <a-button
                  style="margin: 0 5px"
                  @click="reduce(record)"
                  type="primary"
                  >减分</a-button
                >
              </template>
              <template v-if="column.key === 'sc'">
                <a-input
                  v-model:value="record.sc"
                  style="width: 100px; text-align: center"
                  type="number"
                />
              </template>
              <template v-if="column.key === 'str'">
                <a-input
                  v-model:value="record.str"
                  style="width: 150px; text-align: center"
                />
              </template>
            </template>
          </a-table>
        </a-col>
        <a-col :span="11">
          <a-table :dataSource="hTable.data" :columns="hTable.cols"> </a-table>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import util from "../util.js";
import PhChart from "../components/PhChart.vue";
import BarChart from "../components/PieChart.vue";
export default {
  data() {
    return {
      search: { form1: {}, form: {} },
      chart1config: {
        name: "卫生分得分排行",
        id: "c1",
      },
      chart2config: {
        name: "次数",
        id: "c2",
        hideLe: true,
      },
      chart3config: {
        name: "次数",
        hideLe: true,
        id: "c3",
      },
      sinfo: {},
      gg: "",
      mo: {
        add: false,
        set: false,
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
            title: "卫生分数",
            dataIndex: "score",
            align: "center",
          },
          {
            title: "分值",
            key: "sc",
            align: "center",
          },
          {
            title: "项目",
            key: "str",
            align: "center",
          },
          {
            title: "操作",
            key: "action",
            align: "center",
          },
        ],
      },
      hTable: {
        cols: [
          {
            title: "序号",
            dataIndex: "inde",
            align: "center",
            customRender({ text, record, index, column }) {
              return index + 1;
            },
          },
          {
            title: "门牌号",
            dataIndex: "rid",
            align: "center",
          },
          {
            title: "分值",
            dataIndex: "score",
            align: "center",
          },
          {
            title: "项目",
            dataIndex: "str",
            align: "center",
          },
          {
            title: "操作人",
            dataIndex: "usr",
            align: "center",
          },
          {
            title: "操作时间",
            dataIndex: "createTime",
            align: "center",
          },
        ],
        data: [],
      },
      roomId: null,
    };
  },
  mounted() {
    this.util = util;
    util.method.getData(
      "gg",
      {
        type: 1,
      },
      false,
      (res) => {
        if (res.data.length > 0) {
          this.gg = res.data[0].value;
        }
      }
    );
    this.loadAll();
    this.loadChart();
  },
  methods: {
    loadAll() {
      util.method.getData(
        "room",
        util.deepCopy(this.search.form),
        true,
        (res) => {
          this.table.data = res.data;
        },
        (err) => {}
      );
      let res = util.deepCopy(this.search.form);
      let t = res.key;
      delete res.key;
      res["rid"] = t;
      util.method.getData(
        "ph",
        res,
        true,
        (res) => {
          this.hTable.data = res.data;
        },
        (err) => {}
      );
    },

    loadChart() {
      util.method.getData(
        "room",
        null,
        false,
        (res) => {
          let y = [];
          let x = [];
          res.data.forEach((item) => {
            y.push(
              item.key
                .replace("号楼", "")
                .replace("楼层", "")
                .replace("层", "")
                .replace("楼", "")
            );
            // y.push(item.rid);
            x.push(item.score);
          });

          this.$refs.chart1.setData({ y: y, x: x });
        },
        (err) => {}
      );
      util.method.getData(
        "ph",
        null,
        false,
        (res) => {
          let y = [];
          let x = [];
          let z = [];
          res.data.forEach((item) => {
            let index = y.indexOf(item.rid);
            if (index != -1) {
              if (item.type == "加分") {
                x[index] += 1;
              } else {
                z[index] += 1;
              }
            } else {
              y.push(item.rid);
              if (item.type == "加分") {
                x.push(1);
                z.push(0);
              } else {
                x.push(0);
                z.push(1);
              }
            }
          });
          let c2 = [];
          let c3 = [];
          for (let i = 0; i < y.length; i++) {
            c2.push({ value: x[i], name: y[i] });
            c3.push({ value: z[i], name: y[i] });
          }
          this.$refs.chart2.setData(c2);
          this.$refs.chart3.setData(c3);
        },
        (err) => {}
      );
    },
    addGg() {
      util.method.addData(
        "gg",
        {
          key: "type",
          name: "dd",
        },
        {
          type: 1,
          value: this.gg,
        },
        (res) => {
          util.method.updateData(
            "gg",
            "type",
            {
              type: 1,
              value: this.gg,
            },
            (res) => {
              this.$message.info("发布成功");
            }
          );
        }
      );
    },
    plus(row) {
      if (row.sc == undefined || row.sc.trim() == "") {
        this.$message.error("请输入分值");
        return false;
      }
      this.setScoreAndAddPh(
        row.key,
        1,
        parseFloat(row.sc),
        parseFloat(row.score),
        row.str
      );
    },
    reduce(row) {
      if (row.sc == undefined || row.sc.trim() == "") {
        this.$message.error("请输入分值");
        return false;
      }
      this.setScoreAndAddPh(
        row.key,
        0,
        parseFloat(row.sc),
        parseFloat(row.score),
        row.str
      );
    },
    setScoreAndAddPh(key, type, value, total, str) {
      util.method.addData(
        "ph",
        null,
        {
          rid: key,
          type: type == 1 ? "加分" : "减分",
          score: (type == 1 ? "+" : "-") + value,
          str: str,
          usr: util.getObjSession("userinfo").nickname,
        },
        (res) => {
          util.method.updateData(
            "room",
            "key",
            {
              key: key,
              score: total + (type == 1 ? 1 : -1) * value,
            },
            (res) => {
              this.loadAll();
              this.loadChart();
            }
          );
        }
      );
    },
    setRoom(record) {
      console.log(record);
      this.mo.add = true;
      this.roomId = record.rid;
    },
    setStudentRoom(record) {
      console.log(record);
    },
    removeSt(tag) {},
  },
  components: {
    PhChart,
    BarChart,
  },
};
</script>

<style>
</style>