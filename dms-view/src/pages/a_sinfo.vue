<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="13">
        <h3>
          各寝室人数情况
          <a-input
            v-model:value="chart.cid"
            placeholder="搜索班级"
            style="width: 100px"
          ></a-input>
          <a-button style="margin: 0 5px" @click="loadChart1()" type="primary"
            >搜索</a-button
          >
        </h3>
        <BarChart ref="chart1" :config="chart1config"></BarChart>
      </a-col>
      <a-col :span="11">
        <h3>各寝室人数占比情况</h3>
        <PieChart ref="chart2" :config="chart2config"></PieChart>
      </a-col>
    </a-row>
    <a-form
      :model="search.form"
      name="horizontal_login"
      layout="inline"
      autocomplete="off"
    >
      <a-form-item label="寝室号" name="sid">
        <a-input v-model:value="search.form.rid"> </a-input>
      </a-form-item>
      <a-form-item label="楼号" name="bid">
        <a-input v-model:value="search.form.bid"> </a-input>
      </a-form-item>
      <a-form-item label="楼层" name="lid">
        <a-input v-model:value="search.form.lid"> </a-input>
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
        <a-button @click="mo.add = true" style="margin: 0 5px" type="primary"
          >新增</a-button
        >
        <a-button
          style="margin: 0 5px"
          @click="
            util.exportCsv(
              '寝室信息',
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
              v-for="btn in column.btns"
              :key="btn.name"
              @click="btn.action(record)"
              type="primary"
              style="margin: 0 5px"
            >
              {{ btn.name }}</a-button
            >
          </template>
        </template>
      </a-table>
    </div>
    <!-- 新增修改信息 -->
    <a-modal
      v-model:visible="mo.add"
      style="top: 10px"
      cancelText="取消"
      okText="新增"
      title="新增寝室信息"
      :confirm-loading="confirmLoading"
      @ok="addSt"
    >
      <a-row>
        <a-col :span="24" style="padding: 10px">
          <a-form :model="sinfo">
            <a-form-item label="宿舍楼">
              <a-select
                v-model:value="sinfo.bid"
                style="width: 200px"
                :options="select.bids"
              ></a-select>
            </a-form-item>
            <a-form-item label="楼层">
              <a-select
                v-model:value="sinfo.lid"
                style="width: 200px"
                :options="select.lids"
              ></a-select>
            </a-form-item>
            <a-form-item label="寝室门牌号">
              <a-select
                v-model:value="sinfo.rid"
                style="width: 200px"
                :options="select.rids"
              >
              </a-select>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      v-model:visible="mo.set"
      style="top: 10px; width: 800px"
      :footer="null"
      :title="'学生寝室分配 - ' + roomId"
      :confirm-loading="confirmLoading"
      @ok="addSt"
    >
      <a-list
        :grid="{ gutter: 10, column: 4 }"
        :locale="{ emptyText: '未分配学生' }"
        :data-source="roomSetData"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <!-- <a-card >{{item.name + ' ' + item.sid}}</a-card> -->
            <a-tag :closable="true" @close="removeSt(item)">
              {{
                item.name +
                " - " +
                item.sid +
                (item.bedid ? " - " + item.bedid : "")
              }}
            </a-tag>
          </a-list-item>
        </template>
      </a-list>
      <a-table
        :dataSource="stTable.data"
        :rowKey="'username'"
        :columns="stTable.cols"
        :locale="{ emptyText: '无可分配学生' }"
        :pagination="{ defaultPageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <!-- 分配按钮 -->
            <a-button @click="setStudentRoom(record)" type="primary">{{
              column.title
            }}</a-button>
          </template>
          <template v-if="column.key === 'bedid'">
            <a-select
              v-model:value="record.bedid"
              style="width: 200px"
              :options="select.bedids"
            >
            </a-select>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import util from "../util.js";
import BarChart from "../components/BarChart.vue";
import PieChart from "../components/PieChart.vue";
export default {
  data() {
    let self = this;
    return {
      allRData: null,
      chart: { cid: "" },
      chart1config: {
        id: "c1",
        name: "人数",
      },
      chart2config: {
        id: "c2",
        hideLe: true,
      },
      sinfo: {},
      mo: {
        add: false,
        set: false,
      },
      confirmLoading: false,
      search: {
        form: {},
      },
      select: {
        rids: [],
        bids: [],
        lids: [],
        bedids: [],
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
            dataIndex: "rid",
            align: "center",
          },
          {
            title: "宿舍楼",
            dataIndex: "bid",
            align: "center",
          },
          {
            title: "楼层",
            dataIndex: "lid",
            align: "center",
          },
          {
            title: "宿舍分配人数",
            dataIndex: "ps1",
            align: "center",
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            btns: [
              {
                name: "分配",
                action(row) {
                  self.setRoom(row);
                },
              },
              {
                name: "删除",
                action(row) {
                  if (row.ps1) {
                    self.$message.error("宿舍已被分配,请取消分配后操作");
                    return false;
                  }
                  util.method.delData(
                    "room",
                    {
                      key: row.key,
                    },
                    (res) => {
                      self.loadAll();
                      self.loadChart();
                    }
                  );
                },
              },
            ],
          },
        ],
      },
      stTable: {
        cols: [
          {
            dataIndex: "cid",
            title: "班级",
            align: "center",
          },
          {
            dataIndex: "sid",
            title: "学号",
            align: "center",
          },
          {
            dataIndex: "name",
            title: "姓名",
            align: "center",
          },
          {
            key: "bedid",
            title: "床位号",
            align: "center",
          },
          {
            key: "action",
            title: "分配",
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
    this.loadAllSelect();
    this.loadChart();
  },
  methods: {
    getRoomPs(roomObj) {
      let key = roomObj.key;
      let promise = new Promise(function (resolve, reject) {
        util.method.getData(
          "student",
          { key: key },
          false,
          (res) => {
            roomObj.ps1 = res.data.length;
            resolve(roomObj);
          },
          (err) => {}
        );
      });
      promise.then((res) => {
        return res;
      });
      return promise;
    },
    loadAll() {
      util.method.getData(
        "room",
        util.deepCopy(this.search.form),
        true,
        (res) => {
          this.table.data = res.data;
          this.table.data.forEach((item) => {
            this.getRoomPs(item);
          });
          if (this.allRData == null) {
            this.allRData = this.table.data;
          }
        }
      );
    },
    loadChart() {
      util.method.getData(
        "room",
        {},
        false,
        (res1) => {
          // let count1 = 0
          // let count0 = 0;
          let c2data = {
            x: [],
            y: [],
          };
          let c3data = {};

          util.method.getData(
            "student",
            null,
            false,
            (res) => {
              let data = res.data;
              for (let i = 0; i < res1.data.length; i++) {
                c2data.x.push(res1.data[i].key);
                let key = res1.data[i].key;
                let keyCount = 0;
                data.forEach((item) => {
                  if (item.key == key) {
                    keyCount++;
                  }
                });
                // c2data.y.push(res.data[i].ps);
                // c3data[res.data[i].key] = res.data[i].ps;
                c2data.y.push(keyCount);
                c3data[res1.data[i].key] = keyCount;
              }
              // this.$refs.chart1.setData({x:[],y:[]});

              let c3d = [];
              let keyss2 = Object.keys(c3data);
              keyss2.forEach((item) => {
                c3d.push({
                  value: c3data[item],
                  name: item,
                });
              });
              this.$refs.chart2.setData(c3d);
            },
            (err) => {}
          );
        },
        (err) => {}
      );
    },
    loadChart1() {
      util.method.getData(
        "student",
        { cid: this.chart.cid },
        true,
        (res) => {
          let keys = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].key) {
              keys.push(res.data[i].key);
            }
          }
          util.method.getData(
            "room",
            {},
            false,
            (res) => {
              let c2data = {
                x: [],
                y: [],
              };
              //   console.log(res.data[i], "打印");
              for (let i = 0; i < res.data.length; i++) {
                if (keys.indexOf(res.data[i].key) != -1) {
                  //   c2data.x.push(res.data[i].rid);
                  c2data.x.push(
                    res.data[i].key
                      .replace("号楼", "")
                      .replace("楼层", "")
                      .replace("层", "")
                      .replace("楼", "")
                  );

                  // c2data.y.push(res.data[i].ps);
                  let ps1 = 0;
                  this.allRData.forEach((item) => {
                    if (item.key == res.data[i].key) {
                      ps1 = item.ps1;
                    }
                  });
                  c2data.y.push(ps1);
                }
              }
              this.$refs.chart1.setData(c2data);
            },
            (err) => {}
          );
        },
        (err) => {}
      );
    },
    loadAllSelect() {
      util.method.getData("rids", {}, false, (res) => {
        let cids = [];
        res.data.forEach((item) => {
          cids.push({
            value: item.name,
            label: item.name,
          });
        });
        this.select.rids = cids;
      });
      util.method.getData("bids", {}, false, (res) => {
        let cids = [];
        res.data.forEach((item) => {
          cids.push({
            value: item.name,
            label: item.name,
          });
        });
        this.select.bids = cids;
      });
      util.method.getData("lids", {}, false, (res) => {
        let cids = [];
        res.data.forEach((item) => {
          cids.push({
            value: item.name,
            label: item.name,
          });
        });
        this.select.lids = cids;
      });
      util.method.getData("bedids", {}, false, (res) => {
        let cids = [];
        res.data.forEach((item) => {
          cids.push({
            value: item.name,
            label: item.name,
          });
        });
        this.select.bedids = cids;
      });
    },
    // 新增宿舍
    addSt() {
      let req = util.deepCopy(this.sinfo);
      req.key = `${this.sinfo.bid}-${this.sinfo.lid}-${this.sinfo.rid}`;
      req.ps = 0;
      req.wc = 0;
      req.ec = 0;
      req.score = 100;
      util.method.addData(
        "room",
        {
          key: "key",
          name: "该楼楼层的宿舍号",
        },
        req,
        (res) => {
          if (res.status != 200) {
            this.$message.error(res.msg);
          } else {
            this.loadAll();
            this.loadChart();
            this.mo.add = false;
          }
        }
      );
    },
    setRoom(record, key) {
      this.roomSetData = [];
      // stTable.data
      util.method.getData("student", {}, false, (res) => {
        let data = [];
        res.data.forEach((item) => {
          if (!item.key) {
            data.push(item);
          } else {
            if (item.key == (record != null ? record.key : key)) {
              this.roomSetData.push(item);
            }
          }
        });
        this.stTable.data = data;
      });
      // console.log(record);
      this.mo.set = true;
      if (record) {
        this.roomId = record.key;
        this.rid = record.rid;
        this.bid = record.bid;
        this.lid = record.lid;
        this.ps = record.ps;
      }
    },
    setStudentRoom(record) {
      util.method.updateData(
        "student",
        "username",
        {
          username: record.username,
          bedid: record.bedid,
          rid: this.rid,
          lid: this.lid,
          bid: this.bid,
          key: this.roomId,
        },
        (res) => {
          this.setRoom(null, this.roomId);
        }
      );
      util.method.updateData(
        "room",
        "key",
        {
          key: this.roomId,
          ps: this.ps + 1,
        },
        (res) => {
          this.ps++;
          this.loadAll();
          this.loadChart();
        }
      );
    },
    removeSt(record) {
      //   console.log(record);
      util.method.updateData(
        "student",
        "username",
        {
          username: record.username,
          bedid: null,
          rid: null,
          lid: null,
          bid: null,
          key: null,
        },
        (res) => {
          this.setRoom(null, this.roomId);
        }
      );
      util.method.updateData(
        "room",
        "key",
        {
          key: this.roomId,
          ps: this.ps - 1,
        },
        (res) => {
          this.loadAll();
          this.loadChart();
          this.ps--;
        }
      );
    },
  },
  components: {
    BarChart,
    PieChart,
  },
};
</script>

<style>
</style>