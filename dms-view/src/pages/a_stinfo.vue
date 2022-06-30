<template>
  <div>
    <!-- 统计图表 -->
    <a-row :gutter="10">
      <a-col :span="8">
        <h3>班级人数占比</h3>
        <PieChart ref="chart3" :config="chart3config"></PieChart>
      </a-col>
      <a-col :span="8">
        <h3>楼层人数占比</h3>
        <PieChart ref="chart2" :config="chart2config"></PieChart>
      </a-col>
      <a-col :span="8">
        <h3>性别人数占比</h3>
        <PieChart ref="chart1" :config="chart1config"></PieChart>
      </a-col>
    </a-row>
    <a-form
      :model="search.form"
      name="horizontal_login"
      layout="inline"
      autocomplete="off"
    >
      <a-form-item label="学号" name="sid">
        <a-input v-model:value="search.form.sid"> </a-input>
      </a-form-item>
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="search.form.name"> </a-input>
      </a-form-item>
      <a-form-item label="宿舍门牌号" name="rid">
        <a-input v-model:value="search.form.rid"> </a-input>
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
          @click="
            mo.type = 'add';
            mo.add = true;
            sinfo = {
              username: '',
              password: '',
              name: '',
              sid: '',
              sex: '',
              cid: '',
            };
          "
          style="margin: 0 5px"
          type="primary"
          >新增
        </a-button>
        <a-button
          style="margin: 0 5px"
          @click="
            util.exportCsv(
              '学生信息',
              addCol(util.deepCopy(table.cols)),
              util.deepCopy(table.data)
            )
          "
          type="primary"
          >导出</a-button
        >
        <a-button style="margin: 0 5px" type="primary" @click="importSt"
          >导入</a-button
        >
      </a-form-item>
    </a-form>
    <a-divider />
    <div>
      <a-table
        :dataSource="table.data"
        :columns="table.cols"
        :rowKey="'username'"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              style="margin: 0px 10px"
              v-for="btn in column.btns"
              :key="btn.name"
              @click="btn.action(record)"
              type="primary"
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
      :okText="mo.type == 'add' ? '新增' : '修改'"
      :title="`${mo.type == 'add' ? '新增' : '修改'}学生信息`"
      :confirm-loading="confirmLoading"
      @ok="addStudent"
    >
      <a-row>
        <a-col :span="24" style="padding: 10px">
          <a-form :model="sinfo">
            <a-form-item label="账号">
              <a-input v-model:value="sinfo.username" />
            </a-form-item>
            <a-form-item label="密码">
              <a-input v-model:value="sinfo.password" />
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-model:value="sinfo.name" />
            </a-form-item>
            <a-form-item label="学号">
              <a-input v-model:value="sinfo.sid" />
            </a-form-item>
            <a-form-item label="性别">
              <a-radio-group v-model:value="sinfo.sex">
                <a-radio value="1">男</a-radio>
                <a-radio value="0">女</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="班级">
              <a-select
                v-model:value="sinfo.cid"
                style="width: 200px"
                :options="select.cids"
              >
              </a-select>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import util from "../util.js";
import PieChart from "../components/PieChart.vue";
export default {
  data() {
    let self = this;
    return {
      chart1config: {
        name: "人数",
        id: "c1",
      },
      chart2config: {
        name: "人数",
        id: "c2",
      },
      chart3config: {
        name: "人数",
        id: "c3",
      },
      sinfo: {
        username: "",
        password: "",
        name: "",
        sid: "",
        sex: "",
        cid: "",
      },
      mo: {
        type: "add",
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
            dataIndex: "inde",
            align: "center",
            width: "60px",
            customRender({ text, record, index, column }) {
              return index + 1;
            },
          },
          {
            title: "账号",
            dataIndex: "username",
            align: "center",
          },
          {
            title: "姓名",
            dataIndex: "name",
            align: "center",
          },
          {
            title: "学号",
            dataIndex: "sid",
            align: "center",
          },
          {
            title: "性别",
            dataIndex: "sex",
            align: "center",
            customRender({ text, record, index, column }) {
              return text == "1" ? "男" : "女";
            },
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
            title: "门牌号",
            dataIndex: "rid",
            align: "center",
          },
          {
            title: "床铺号",
            dataIndex: "bedid",
            align: "center",
          },
          {
            title: "班级",
            dataIndex: "cid",
            align: "center",
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            btns: [
              {
                name: "修改",
                action(row) {
                  self.sinfo = util.deepCopy(row);
                  self.mo.type = "edit";
                  self.mo.add = true;
                },
              },
              {
                name: "删除",
                action(row) {
                  // if(row.key){
                  //     self.$message.error("已分配宿舍,请取消分配后操作");
                  //     return false;
                  // }
                  util.method.delData(
                    "student",
                    {
                      username: row.username,
                    },
                    (res) => {
                      util.method.getData(
                        "room",
                        { key: row.key },
                        false,
                        (res) => {
                          let rinfo = res.data[0];
                          util.method.updateData(
                            "room",
                            "key",
                            { key: row.key, ps: rinfo.ps - 1 },
                            (res) => {}
                          );
                        },
                        (err) => {}
                      );
                      util.method.delData(
                        "user",
                        {
                          username: row.username,
                        },
                        (res) => {
                          self.loadAll();
                          this.loadChart();
                        }
                      );
                    }
                  );
                },
              },
            ],
          },
        ],
      },
      select: {
        cids: [],
      },
    };
  },
  mounted() {
    this.util = util;
    this.loadAll();
    this.loadChart();
    this.getCids();
  },
  methods: {
    importSt() {
      util.fileImport((res) => {
        let rres = util.csvToObject(res);
        util.method.getData(
          "student",
          null,
          false,
          (res) => {
            let allStudent = res.data;

            rres.forEach((item) => {
              let hs = false;
              for (let i = 0; i < allStudent.length; i++) {
                if (allStudent[i].username == item.username) {
                  hs = true;
                  break;
                }
              }
              if (!hs) {
                // 不存在,插入
                // 查询key
                util.method.getData(
                  "room",
                  { key: item.key },
                  false,
                  (res) => {
                    if (res.data.length > 0) {
                      this.importStudent(item);
                    } else {
                      this.importStudent(item);
                      // this.$message.error(`${item.username} 用户所在宿舍 ${item.key} 不存在`);
                      // 追加key和其他信息,班级,宿舍楼,楼层,门牌号
                      // 宿舍
                      debugger;
                      let req = { rid: item.rid, bid: item.bid, lid: item.lid };
                      req.key = item.key;
                      req.ps = 0;
                      req.wc = 0;
                      req.ec = 0;
                      req.score = 100;
                      util.method.addData(
                        "room",
                        { key: "key", name: "1" },
                        req,
                        (res) => {}
                      );
                      util.method.addData(
                        "bedids",
                        { key: "name", name: "1" },
                        { name: item.bedid },
                        (res) => {}
                      );
                      util.method.addData(
                        "cids",
                        { key: "name", name: "1" },
                        { name: item.cid },
                        (res) => {}
                      );
                      util.method.addData(
                        "lids",
                        { key: "name", name: "1" },
                        { name: item.lid },
                        (res) => {}
                      );
                      util.method.addData(
                        "rids",
                        { key: "name", name: "1" },
                        { name: item.rid },
                        (res) => {}
                      );
                      util.method.addData(
                        "bids",
                        { key: "name", name: "1" },
                        { name: item.bid },
                        (res) => {}
                      );
                    }
                  },
                  (err) => {}
                );
              } else {
                this.$message.error(`${item.username} 用户已存在`);
              }
            });
          },
          (err) => {}
        );
      });
    },
    loadAll() {
      this.table.data = [];
      util.method.getData(
        "student",
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
        "student",
        null,
        false,
        (res) => {
          let count1 = 0;
          let count0 = 0;
          let c2data = {};
          let c3data = {};
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].sex == 1) {
              count1++;
            } else {
              count0++;
            }
            if (res.data[i].bid && c2data[res.data[i].bid]) {
              c2data[res.data[i].bid] = c2data[res.data[i].bid] + 1;
            } else if (res.data[i].bid) {
              c2data[res.data[i].bid] = 1;
            }
            if (c3data[res.data[i].cid]) {
              c3data[res.data[i].cid] = c3data[res.data[i].cid] + 1;
            } else {
              c3data[res.data[i].cid] = 1;
            }
          }
          this.$refs.chart1.setData([
            {
              value: count1,
              name: "男",
            },
            {
              value: count0,
              name: "女",
            },
          ]);

          let c2d = [];
          let keyss = Object.keys(c2data);
          keyss.forEach((item) => {
            c2d.push({
              value: c2data[item],
              name: item,
            });
          });
          this.$refs.chart2.setData(c2d);

          let c3d = [];
          let keyss2 = Object.keys(c3data);
          keyss2.forEach((item) => {
            c3d.push({
              value: c3data[item],
              name: item,
            });
          });
          this.$refs.chart3.setData(c3d);
        },
        (err) => {}
      );
    },
    addCol(cols) {
      cols.push(
        {
          title: "密码",
          dataIndex: "password",
        },
        {
          title: "key",
          dataIndex: "key",
        }
      );
      return cols;
    },
    addStudent() {
      let tmp = util.deepCopy(this.sinfo);
      let keys = Object.keys(tmp);
      for (let i = 0; i < keys.length; i++) {
        if (tmp[keys[i]] == "") {
          this.$message.error("信息不能为空");
          return false;
        }
      }
      if (this.mo.type == "add") {
        util.method.addData(
          "student",
          {
            key: "username",
            name: "用户名",
          },
          util.deepCopy(this.sinfo),
          (res) => {
            if (res.status == 200) {
              this.$message.success("新增成功");
              // this.mo.add = false;
              this.loadAll();
              util.method.addData(
                "user",
                null,
                {
                  username: this.sinfo.username,
                  password: this.sinfo.password,
                  nickname: this.sinfo.name,
                  type: 1,
                },
                (res) => {}
              );
            } else {
              this.$message.error(res.msg);
            }
          },
          (err) => {
            this.$message.error(err);
          }
        );
      } else {
        util.method.updateData(
          "student",
          "username",
          util.deepCopy(this.sinfo),
          (res) => {
            this.loadAll();
            this.loadChart();
            this.mo.add = false;
          }
        );
      }
    },
    importStudent(sinfo) {
      util.method.addData(
        "student",
        null,
        util.deepCopy(sinfo),
        (res) => {
          if (res.status == 200) {
            this.loadAll();
            this.$message.info(`${sinfo.username} 用户已导入`);

            util.method.getData(
              "room",
              { key: sinfo.key },
              false,
              (res) => {
                let rinfo = res.data[0];
                util.method.updateData(
                  "room",
                  "key",
                  { key: sinfo.key, ps: rinfo.ps + 1 },
                  (res) => {}
                );
              },
              (err) => {}
            );

            util.method.addData(
              "user",
              null,
              {
                username: sinfo.username,
                password: sinfo.password,
                nickname: sinfo.name,
                type: 1,
              },
              (res) => {}
            );
          } else {
            this.$message.error(res.msg);
          }
        },
        (err) => {
          this.$message.error(err);
        }
      );
    },
    getCids() {
      util.method.getData("cids", {}, false, (res) => {
        let cids = [];
        res.data.forEach((item) => {
          cids.push({
            value: item.name,
            label: item.name,
          });
        });
        this.select.cids = cids;
      });
    },
  },
  components: {
    PieChart,
  },
};
</script>

<style>
</style>