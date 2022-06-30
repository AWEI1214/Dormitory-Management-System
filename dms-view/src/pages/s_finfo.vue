<template>
  <a-modal
    v-model:visible="mo.add"
    style="top: 10px"
    cancelText="取消"
    okText="提交"
    title="新增报修申请信息"
    @ok="addSt"
  >
    <a-row>
      <a-col :span="24" style="padding: 10px">
        <a-form :model="sinfo">
          <a-form-item label="门牌号">
            <a-input readonly v-model:value="sinfo.key" />
          </a-form-item>
          <a-form-item label="申请人">
            <a-input readonly v-model:value="sinfo.name" />
          </a-form-item>
          <a-form-item label="报修内容">
            <a-input v-model:value="sinfo.content" />
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-modal>
  <a-row>
    <a-col :span="22" :offset="1">
      <h3>
        报修记录
        <a-button
          type="primary"
          @click="
            mo.add = true;
            sinfo = { key: userinfo.key, name: userinfo.name, content: '' };
          "
        >
          报修申请</a-button
        >
        <a-button
          style="margin: 0 5px"
          @click="
            util.exportCsv(
              '分数变动记录',
              util.deepCopy(table.cols),
              util.deepCopy(table.data)
            )
          "
          type="primary"
          >导出</a-button
        >
      </h3>
      <a-table :dataSource="table.data" :columns="table.cols">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              style="margin: 0 5px"
              @click="cancel(record)"
              :disabled="record.status != 0"
              type="primary"
              >撤销申请</a-button
            >
          </template>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>

<script>
import util from "../util.js";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
export default {
  data() {
    return {
      userinfo: util.getObjSession("userinfo"),
      sinfo: {},
      mo: {
        add: false,
      },
      search: {
        form: {
          content: "",
        },
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
            title: "宿舍门牌号",
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
            title: "申请时间",
            dataIndex: "createTime",
            align: "center",
          },
          {
            title: "操作",
            key: "action",
            align: "center",
          },
        ],
      },
    };
  },
  mounted() {
    this.loadAll();
    this.util = util;
  },
  methods: {
    loadAll() {
      util.method.getData(
        "fh",
        {
          key: this.userinfo.key,
        },
        false,
        (res) => {
          this.table.data = res.data;
        },
        (err) => {}
      );
    },
    cancel(row) {
      let self = this;
      const showConfirm = () => {
        Modal.confirm({
          title: "确定撤销报修申请?",
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode(
            "div",
            {
              style: "color:red;",
            },
            "此操作不可恢复"
          ),
          onOk() {
            util.method.updateData(
              "fh",
              "createTime",
              {
                createTime: row.createTime,
                status: -2,
              },
              (res) => {
                self.loadAll();
              }
            );
          },
          onCancel() {},
        });
      };
      showConfirm();
    },
    addSt() {
      if (this.sinfo.content == "") {
        this.$message.error("请输入申请内容");
        showConfirm();
        return false;
      }
      if (this.table.data.length > 0 && this.table.data[0].status == 0) {
        this.$message.error("存在未处理报修申请, 请等待管理员处理!");
      } else {
        this.sinfo.status = 0;
        util.method.addData("fh", null, util.deepCopy(this.sinfo), (res) => {
          this.$message.info("提交成功");
          this.mo.add = false;
          this.loadAll();
        });
      }
    },
  },
  components: {},
};
</script>

<style>
</style>