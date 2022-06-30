<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="12">
        <PhChart ref="chart1" :config="chart1config"></PhChart>
      </a-col>
      <a-col :span="12">
        <PhChart ref="chart2" :config="chart2config"></PhChart>
      </a-col>
    </a-row>
    <a-form
      :model="search.form"
      name="horizontal_login"
      layout="inline"
      autocomplete="off"
    >
      <a-form-item label="寝室号">
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
        <!-- <a-button style="margin:0 5px" type="primary">导入</a-button> -->
        <!-- <a-button  style="margin:0 5px" type="primary">导出</a-button> -->
      </a-form-item>
      <a-form-item label="公告">
        <a-input v-model:value="gg" style="width: 500px"> </a-input>
      </a-form-item>
      <a-form-item>
        <a-button style="margin: 0 5px" @click="addGg" type="primary"
          >发布公告</a-button
        >
      </a-form-item>
    </a-form>
    <a-divider />
    <div>
      <a-row :gutter="15">
        <a-col :span="12">
          <h2>
            水电费余额
            <a-button
              style="margin: 0 5px"
              @click="
                util.exportCsv(
                  '水电费余额信息',
                  util.deepCopy(table.cols),
                  util.deepCopy(table.data)
                )
              "
              type="primary"
              >导出</a-button
            >
          </h2>
          <a-table :dataSource="table.data" :columns="table.cols">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button @click="setRoom(record)" type="primary">{{
                  column.title
                }}</a-button>
              </template>
            </template>
          </a-table>
        </a-col>
        <a-col :span="12">
          <h2>
            水电费使用记录
            <a-button
              type="primary"
              @click="
                sinfo = { rid: '', type: '', c: '' };
                mo.add = true;
              "
              >新增</a-button
            >
            <a-button
              style="margin: 0 5px"
              @click="
                util.exportCsv(
                  '水电费使用记录信息',
                  util.deepCopy(hTable.cols),
                  util.deepCopy(hTable.data)
                )
              "
              type="primary"
              >导出</a-button
            >
          </h2>
          <a-table :dataSource="hTable.data" :columns="hTable.cols">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button @click="setRoom(record)" type="primary">{{
                  column.title
                }}</a-button>
              </template>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </div>
    <!-- 新增修改信息 -->
    <a-modal
      v-model:visible="mo.add"
      style="top: 10px; width: 400px"
      cancelText="取消"
      okText="追加"
      title="新增水电费使用信息"
      :confirm-loading="confirmLoading"
      @ok="addSt"
    >
      <a-row>
        <a-col :span="24" style="padding: 10px">
          <a-form :model="sinfo">
            <a-form-item label="寝室">
              <a-select
                v-model:value="sinfo.rid"
                style="width: 200px"
                :options="select.rids"
              ></a-select>
            </a-form-item>
            <a-form-item label="类型">
              <a-select
                v-model:value="sinfo.type"
                style="width: 200px"
                :options="[
                  { label: '电费', value: '电费' },
                  { label: '水费', value: '水费' },
                ]"
              ></a-select>
            </a-form-item>
            <a-form-item label="金额">
              <a-input v-model:value="sinfo.c" />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import PhChart from "../components/PhChart.vue";
import util from "../util.js";
import urls from "../urls.js";
export default {
  data() {
    return {
      chart1config: {
        name: "水费余额排行",
        id: "c1",
      },
      chart2config: {
        name: "电费余额排行",
        id: "c2",
      },
      gg: "",
      sinfo: { rid: "", type: "", c: "" },
      select: {
        rids: [],
      },
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
            title: "水费",
            dataIndex: "wc",
            align: "center",
          },
          {
            title: "电费",
            dataIndex: "ec",
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
            title: "宿舍号",
            dataIndex: "key",
            align: "center",
          },
          {
            title: "类型",
            dataIndex: "type",
            align: "center",
          },
          {
            title: "金额",
            dataIndex: "c",
            align: "center",
          },
        ],
        data: [],
      },
      roomId: null,
      roomSetData: [],
    };
  },
  mounted() {
    this.util = util;
    this.loadAll();
    this.loadChart();
    util.method.getData("room", {}, false, (res) => {
      let cids = [];
      res.data.forEach((item) => {
        cids.push({
          value: item.key,
          label: item.key,
        });
      });
      this.select.rids = cids;
    });
    util.method.getData(
      "gg",
      {
        type: 0,
      },
      false,
      (res) => {
        if (res.data.length > 0) {
          this.gg = res.data[0].value;
        }
      }
    );
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
      util.method.getData(
        "wech",
        null,
        false,
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
          let z = [];
          res.data.forEach((item) => {
            y.push(
              item.key
                .replace("号楼", "")
                .replace("楼层", "")
                .replace("层", "")
                .replace("楼", "")
            );
            x.push(item.wc);
            z.push(item.ec);
          });

          this.$refs.chart1.setData({ y: y, x: x });
          this.$refs.chart2.setData({ y: y, x: z });
        },
        (err) => {}
      );
      // util.method.getData("wech", null, false, res => {
      //     this.hTable.data = res.data;
      // }, err => {})
    },
    addGg() {
      util.method.addData(
        "gg",
        {
          key: "type",
          name: "dd",
        },
        {
          type: 0,
          value: this.gg,
        },
        (res) => {
          util.method.updateData(
            "gg",
            "type",
            {
              type: 0,
              value: this.gg,
            },
            (res) => {
              this.$message.info("发布成功");
            }
          );
        }
      );
    },
    addSt() {
      if (this.sinfo.rid == "" || this.sinfo.type == "" || this.sinfo.c == "") {
        this.$message.error("信息不能为空");
        return false;
      }
      if (!(parseFloat(this.sinfo.c) > 0)) {
        this.$message.error("请输入正确金额");
        return false;
      }
      let key = this.sinfo.rid;
      let type = this.sinfo.type;
      let c = this.sinfo.c;
      let self = this;
      util.method.addData(
        "wech",
        null,
        {
          key: key,
          type: type,
          c: parseFloat(c),
        },
        (res) => {
          let oldC = null;
          self.table.data.forEach((item) => {
            if (item.key == key) {
              if (type == "电费") {
                oldC = item.ec;
              } else {
                oldC = item.wc;
              }
            }
          });
          let data = {
            key: key,
          };
          if (type == "电费") {
            data.ec = oldC - c;
          } else {
            data.wc = oldC - c;
          }
          util.method.updateData("room", "key", data, (res) => {
            self.loadAll();
            self.mo.add = false;
          });
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
  components: { PhChart },
};
</script>

<style>
</style>