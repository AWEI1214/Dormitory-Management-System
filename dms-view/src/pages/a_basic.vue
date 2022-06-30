<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="8">
        <h2>
          宿舍列表
          <a-button
            @click="showAdd('rids', '宿舍门牌号')"
            style="margin: 0 5px"
            type="primary"
            >新增宿舍</a-button
          >
        </h2>
        <a-table :dataSource="table.t3" :columns="getCol('rids', '宿舍门牌号')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button
                v-for="btn in column.btns"
                :key="btn.name"
                @click="btn.action(record)"
                type="primary"
                >{{ btn.name }}</a-button
              >
            </template>
          </template>
        </a-table>
      </a-col>
      <a-col :span="8">
        <h2>
          床铺列表
          <a-button
            @click="showAdd('bedids', '床铺号')"
            style="margin: 0 5px"
            type="primary"
            >新增床铺</a-button
          >
        </h2>
        <a-table :dataSource="table.t4" :columns="getCol('bedids', '床铺号')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button
                v-for="btn in column.btns"
                :key="btn.name"
                @click="btn.action(record)"
                type="primary"
                >{{ btn.name }}</a-button
              >
            </template>
          </template>
        </a-table>
      </a-col>
      <a-col :span="8">
        <h2>
          班级列表
          <a-button
            @click="showAdd('cids', '班级编号')"
            style="margin: 0 5px"
            type="primary"
            >新增班级</a-button
          >
        </h2>
        <a-table :dataSource="table.t5" :columns="getCol('cids', '班级编号')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button
                v-for="btn in column.btns"
                :key="btn.name"
                @click="btn.action(record)"
                type="primary"
                >{{ btn.name }}</a-button
              >
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-row :gutter="10">
      <a-col :span="12">
        <h2>
          楼层列表
          <a-button
            @click="showAdd('lids', '楼层号')"
            style="margin: 0 5px"
            type="primary"
            >新增楼层</a-button
          >
        </h2>
        <a-table :dataSource="table.t2" :columns="getCol('lids', '楼层号')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button
                v-for="btn in column.btns"
                :key="btn.name"
                @click="btn.action(record)"
                type="primary"
                >{{ btn.name }}</a-button
              >
            </template>
          </template>
        </a-table>
      </a-col>
      <a-col :span="12">
        <h2>
          宿舍楼列表
          <a-button
            @click="showAdd('bids', '宿舍楼号')"
            style="margin: 0 5px"
            type="primary"
            >新增宿舍楼
          </a-button>
        </h2>

        <a-table :dataSource="table.t1" :columns="getCol('bids', '宿舍楼号')">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button
                v-for="btn in column.btns"
                :key="btn.name"
                @click="btn.action(record)"
                type="primary"
                >{{ btn.name }}</a-button
              >
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <!-- 新增修改信息 -->
    <a-modal
      v-model:visible="mo.add"
      style="top: 10px"
      cancelText="取消"
      okText="新增"
      :title="`新增${addTitle}`"
      @ok="postAdd()"
    >
      <a-row>
        <a-col :span="24" style="padding: 10px">
          <a-form :model="sinfo">
            <a-form-item v-model:label="addTitle">
              <a-input
                v-model:value="addValue"
                type="textarea"
                @keyup.enter="postAdd()"
              />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import util from "../util.js";
export default {
  data() {
    return {
      addTitle: "",
      addValue: "",
      sinfo: {},
      mo: {
        add: false,
      },
      search: {
        form: {},
      },
      table: {
        t1: [],
        t2: [],
        t3: [],
        t4: [],
        t5: [],
      },
    };
  },
  mounted() {
    this.loadAll();
  },
  methods: {
    getCol(table, name) {
      let self = this;
      return [
        {
          title: "序号",
          dataIndex: "inde",
          align: "center",
          customRender({ text, record, index, column }) {
            return index + 1;
          },
        },
        {
          title: name,
          dataIndex: "name",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          btns: [
            {
              name: "删除",
              action(row) {
                util.method.delData(
                  table,
                  {
                    name: row.name,
                  },
                  (res) => {
                    self.loadAll();
                  },
                  (error) => {}
                );
              },
            },
          ],
        },
      ];
    },
    loadAll() {
      util.method.getData("bids", {}, false, (res) => {
        this.table.t1 = res.data;
      });
      util.method.getData("lids", {}, false, (res) => {
        this.table.t2 = res.data;
      });
      util.method.getData("rids", {}, false, (res) => {
        this.table.t3 = res.data;
      });
      util.method.getData("bedids", {}, false, (res) => {
        this.table.t4 = res.data;
      });
      util.method.getData("cids", {}, false, (res) => {
        this.table.t5 = res.data;
      });
    },
    showAdd(table, name) {
      this.addTitle = name;
      this.addTable = table;
      this.addValue = "";
      this.mo.add = true;
    },
    postAdd() {
      util.method.addData(
        this.addTable,
        {
          key: "name",
          name: this.addTitle,
        },
        {
          name: this.addValue,
        },
        (res) => {
          if (res.status == 200) {
            this.loadAll();
            this.mo.add = false;
          } else {
            this.$message.error(res.msg);
          }
        },
        (error) => {}
      );
    },
  },
  components: {},
};
</script>

<style>
</style>