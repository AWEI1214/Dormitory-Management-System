<template>
  <a-row>
    <a-col :span="16" :offset="4">
      <a-descriptions title="个人信息" bordered>
        <a-descriptions-item label="姓名">{{
          userinfo.name
        }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{
          userinfo.sex == 1 ? "男" : "女"
        }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{
          userinfo.sid
        }}</a-descriptions-item>
        <a-descriptions-item label="所在宿舍楼">{{
          userinfo.bid
        }}</a-descriptions-item>
        <a-descriptions-item label="宿舍楼层">{{
          userinfo.lid
        }}</a-descriptions-item>
        <a-descriptions-item label="宿舍门牌号">{{
          userinfo.rid
        }}</a-descriptions-item>
        <a-descriptions-item label="床铺号">{{
          userinfo.bedid
        }}</a-descriptions-item>
        <a-descriptions-item label="所在班级">{{
          userinfo.cid
        }}</a-descriptions-item>
        <a-descriptions-item label="水电费信息公告">
          {{ g1 }}
        </a-descriptions-item>
        <a-descriptions-item label="寝室卫生信息公告">
          {{ g2 }}
        </a-descriptions-item>
      </a-descriptions>
      <a-card>
        <a-button
          @click="
            mo.add = true;
            sinfo = { password: '', repassword: '', oldPassword: '' };
          "
          type="primary"
          >修改密码</a-button
        >
      </a-card>
      <!-- 新增修改信息 -->
      <a-modal
        v-model:visible="mo.add"
        style="top: 10px"
        cancelText="取消"
        okText="修改"
        title="修改密码"
        :confirm-loading="confirmLoading"
        @ok="editPasswd"
      >
        <a-row>
          <a-col :span="24" style="padding: 10px">
            <a-form :model="sinfo">
              <a-form-item label="输入原密码">
                <a-input v-model:value="sinfo.oldPassword" type="password" />
              </a-form-item>
              <a-form-item label="输入新密码">
                <a-input v-model:value="sinfo.password" type="password" />
              </a-form-item>
              <a-form-item label="新密码确认">
                <a-input v-model:value="sinfo.repassword" type="password" />
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-modal>
    </a-col>
  </a-row>
</template>

<script>
import util from "../util.js";
export default {
  data() {
    return {
      g1: "",
      g2: "",
      userinfo: util.getObjSession("userinfo"),
      sinfo: {
        password: "",
        repassword: "",
        oldPassword: "",
      },
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
            dataIndex: "inde",
            align: "center",
            customRender({ text, record, index, column }) {
              return index + 1;
            },
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
          },
          {
            title: "宿舍楼",
            dataIndex: "bid",
            align: "center",
          },
          {
            title: "楼层",
            dataIndex: "bl",
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
            dataIndex: "class",
            align: "center",
          },
          {
            title: "操作",
            dataIndex: "action",
            align: "center",
          },
        ],
      },
    };
  },
  mounted() {
    this.loadGg();
  },
  methods: {
    editPasswd() {
      let self = this;
      if (
        this.sinfo.password == "" ||
        this.sinfo.repassword == "" ||
        this.sinfo.oldPassword == ""
      ) {
        this.$message.error("信息不能为空!");
        return false;
      }
      util.method.getData(
        "user",
        {
          username: this.userinfo.username,
        },
        false,
        (res) => {
          if (res.data[0].password != this.sinfo.oldPassword) {
            this.$message.error("原密码输入错误!");
          } else {
            if (this.sinfo.password != this.sinfo.repassword) {
              this.$message.error("两次新密码输入不一致!");
            } else {
              util.method.updateData(
                "user",
                "username",
                {
                  username: self.userinfo.username,
                  password: self.sinfo.password,
                },
                (res) => {
                  util.method.updateData(
                    "student",
                    "username",
                    {
                      username: self.userinfo.username,
                      password: self.sinfo.password,
                    },
                    (res) => {
                      self.$message.info("密码修改成功, 正在退出!");
                      util.logout();
                    }
                  );
                }
              );
            }
          }
        }
      );
    },
    loadGg() {
      util.method.getData(
        "gg",
        {
          type: 0,
        },
        false,
        (res) => {
          if (res.data.length > 0) {
            this.g1 = res.data[0].value;
          }
        }
      );
      util.method.getData(
        "gg",
        {
          type: 1,
        },
        false,
        (res) => {
          if (res.data.length > 0) {
            this.g2 = res.data[0].value;
          }
        }
      );
    },
  },
  components: {},
};
</script>

<style>
</style>