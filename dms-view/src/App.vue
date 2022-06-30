<template>
  <a-layout class="layout">
    <div v-if="!isLog">
      <a-modal
        :visible="loginMo"
        title="宿舍管理系统 - 用户登录"
        :closable="false"
        :style="{ top: '40px', width: '400px' }"
        :maskClosable="false"
        :keyboard="false"
        okText="学生登陆"
        cancelText="管理员登录"
        :footer="null"
        :maskStyle="{
          'background-image': 'url(' + require('./img/bg1.png') + ')',
          'background-size': 'cover',
        }"
        :bodyStyle="{ paddingTop: 0 }"
      >
        <a-tabs v-model:activeKey="activeKey" animated size="default">
          <a-tab-pane key="1" tab="宿管端">
            <a-form :model="login.form" name="basic" autocomplete="off">
              <a-form-item style="text-align: center">
                <a-avatar :size="64" style="background-color: #1890ff">
                  <template #icon> <UserOutlined /></template>
                </a-avatar>
              </a-form-item>
              <a-form-item label="账号" name="username">
                <a-input v-model:value="login.form.username">
                  <template #prefix>
                    <user-outlined type="user" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="密码" name="password">
                <a-input-password v-model:value="login.form.password">
                  <template #prefix>
                    <!-- <loading-outlined type="user" /> -->
                    <lock-outlined type="user" />
                  </template>
                </a-input-password>
              </a-form-item>
              <!-- <a-form-item v-if="loging" style="text-align: center">
                <a-progress
                  :stroke-color="{
                    from: '#108ee9',
                    to: '#87d068',
                  }"
                  :showInfo="false"
                  :percent="100"
                  status="active"
                />
              </a-form-item> -->
              <a-form-item :wrapper-col="{ offset: 4 }">
                <a-button
                  @click="adminLogin"
                  type="primary"
                  style="width: 80%; height: 35px"
                  :loading="loading"
                  >宿管端登录</a-button
                >
                &nbsp;&nbsp;&nbsp;
                <!-- <a-button @click="studentLogin" type="danger"
                  >学生端登陆</a-button
                > -->
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="2" tab="学生端" force-render>
            <a-form :model="login.form" name="basic" autocomplete="off">
              <a-form-item style="text-align: center">
                <a-avatar :size="64" style="background-color: #1890ff">
                  <template #icon> <SmileOutlined /></template>
                </a-avatar>
              </a-form-item>
              <a-form-item label="账号" name="username">
                <a-input v-model:value="login.form.username">
                  <template #prefix>
                    <user-outlined type="user" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="密码" name="password">
                <a-input-password v-model:value="login.form.password">
                  <template #prefix>
                    <lock-outlined type="user" />
                  </template>
                </a-input-password>
              </a-form-item>
              <!-- <a-form-item v-if="loging" style="text-align: center">
                <a-progress
                  :stroke-color="{
                    from: '#108ee9',
                    to: '#87d068',
                  }"
                  :showInfo="false"
                  :percent="100"
                  status="active"
                />
              </a-form-item> -->
              <a-form-item :wrapper-col="{ offset: 4 }">
                <!-- <a-button @click="adminLogin" type="primary"
                  >宿管端登录</a-button
                >
                &nbsp;&nbsp;&nbsp; -->
                <a-button
                  @click="studentLogin"
                  type="primary"
                  style="width: 80%; height: 35px"
                  :loading="loading"
                  >学生端登陆</a-button
                >
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </div>
    <div v-else>
      <a-layout-header style="padding: 0 30px">
        <div class="logo">
          <label style="color: #fff; font-size: larger; font-weight: bold">
            <home-filled /> 宿舍管理系统{{
              " - " + (userinfo.type == 0 ? "管理员端" : "学生端")
            }}</label
          >
        </div>
        <a-menu
          @click="menuClick"
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <div v-for="item in menu" :key="item.key">
            <a-menu-item :key="item.key">
              <template #icon>
                <user-outlined v-if="item.icon == 'userinfo'" />
                <team-outlined v-if="item.icon == 'usersinfo'" />

                <lock-outlined v-if="item.icon == 'password'" />

                <home-outlined v-if="item.icon == 'home'" />
                <thunderbolt-outlined v-if="item.icon == 'ew'" />
                <schedule-outlined v-if="item.icon == 'rinfo'" />
                <check-square-outlined v-if="item.icon == 'rc'" />
                <tool-outlined v-if="item.icon == 'fix'" />
                <logout-outlined v-if="item.icon == 'logout'" />
              </template>
              {{ item.name }}
            </a-menu-item>
          </div>
        </a-menu>
      </a-layout-header>
      <a-layout-content style="padding: 10px 20px">
        <div
          :style="{
            background: '#fff',
            padding: '24px',
            minHeight: contentHeight + 'px',
          }"
        >
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        学生宿舍管理系统 ©2022 Created by Awei
      </a-layout-footer>
    </div>
  </a-layout>
</template>

<script>
import util from "./util.js";
import {
  HomeOutlined,
  HomeFilled,
  UserOutlined,
  ThunderboltOutlined,
  ScheduleOutlined,
  CheckSquareOutlined,
  ToolOutlined,
  LogoutOutlined,
  TeamOutlined,
  LockOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
export default {
  name: "App",
  data() {
    return {
      loading: false,
      loging: false,
      loginMo: false,
      isLog: false,
      // activeKey: 1,
      userinfo: {},
      login: {
        form: {
          password: "",
          username: "",
        },
      },
      menu: [],
      selectedKeys: [],
      contentHeight: window.innerHeight - 155,
    };
  },
  mounted() {
    let userinfo = util.getObjSession("userinfo");
    this.userinfo = userinfo;
    if (!userinfo) {
      this.loginMo = true;
    } else if (userinfo.type == 0) {
      if (util.getSession("showN") == null) {
        notification.open({
          message: `系统提示`,
          description: `${userinfo.nickname},欢迎登陆宿舍管理系统!`,
        });
        util.setSession("showN", "1");
      }
      // 管理员
      this.menu = this.getAdminMenu();
      this.isLog = true;
      this.$router.push({
        path: this.menu[0].key,
      });
      this.selectedKeys = [this.menu[0].key];
    } else if (userinfo.type == 1) {
      if (util.getSession("showN") == null) {
        notification.open({
          message: `系统提示`,
          description: `${userinfo.name},欢迎登陆宿舍管理系统!`,
        });
        util.setSession("showN", "1");
      }
      // 学生
      this.menu = this.getStudentMenu();
      this.isLog = true;
      this.$router.push({
        path: this.menu[0].key,
      });
      this.selectedKeys = [this.menu[0].key];
    }
  },
  methods: {
    getLogin(type) {
      this.loging = true;
      let self = this;
      setTimeout(function () {
        util.method.login(
          self.login.form.username,
          self.login.form.password,
          type,
          (res) => {
            self.loging = false;
            // self.loading = false;/
            if (res.status == 200) {
              console.log(res.data);
              if (type == 1) {
                util.method.getData(
                  "student",
                  {
                    username: res.data.username,
                  },
                  false,
                  (res) => {
                    if (!res.data[0].key) {
                      self.$message.info("宿舍未分配, 请等待管理员分配宿舍");
                    } else {
                      res.data[0].type = 1;
                      util.setSession("userinfo", res.data[0]);
                      window.location.href = "./";
                    }
                  }
                );
              } else {
                util.setSession("userinfo", res.data);
                window.location.href = "./";
              }
            } else {
              self.$message.error(res.msg);
            }
          },
          (err) => {
            self.$message.error("登陆失败 " + err);
            self.loging = false;

            // self.loading = false;
          }
        );

        self.loading = false;
      }, 800);
    },
    adminLogin() {
      this.loading = true;
      this.getLogin(0);
      // this.loading = false;/
    },
    studentLogin() {
      this.loading = true;
      this.getLogin(1);
      // this.loading = false;
    },
    getStudentMenu() {
      return [
        {
          key: "s_self",
          name: "个人中心",
          icon: "userinfo",
        },
        {
          key: "s_cinfo",
          name: "宿舍水电费管理",
          icon: "ew",
        },
        {
          key: "s_info",
          name: "寝室信息管理",
          icon: "rinfo",
        },
        {
          key: "s_pinfo",
          name: "寝室卫生检查信息管理",
          icon: "rc",
        },
        {
          key: "s_finfo",
          name: "寝室报修信息管理",
          icon: "fix",
        },
        {
          key: "logout",
          name: "退出登录",
          icon: "logout",
        },
      ];
    },
    getAdminMenu() {
      return [
        {
          key: "a_stinfo",
          name: "学生信息管理",
          icon: "usersinfo",
        },
        {
          key: "a_sinfo",
          name: "寝室信息",
          icon: "rinfo",
        },
        {
          key: "a_cinfo",
          name: "水电费信息管理",
          icon: "ew",
        },
        {
          key: "a_pinfo",
          name: "寝室卫生检查信息管理",
          icon: "rc",
        },
        {
          key: "a_finfo",
          name: "寝室报修信息管理",
          icon: "fix",
        },
        {
          key: "a_basic",
          name: "基础信息管理",
          icon: "usersinfo",
        },
        {
          key: "logout",
          name: "退出登录",
          icon: "logout",
        },
      ];
    },
    menuClick({ item, key, keyPath }) {
      console.log(item, key, keyPath);
      if (key == "logout") {
        util.logout();
      } else {
        this.$router.push({
          path: `/${key}`,
        });
      }
    },
  },
  components: {
    HomeOutlined,
    HomeFilled,
    UserOutlined,
    ThunderboltOutlined,
    ScheduleOutlined,
    CheckSquareOutlined,
    ToolOutlined,
    LogoutOutlined,
    TeamOutlined,
    LockOutlined,
    SmileOutlined,
  },
};
</script>

<style>
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}

/* .qq {
  color: aqua !important;
  background-color: tomato !important;
} */

.logo {
  float: left;
  width: 250px;
}

[data-theme="dark"] .site-layout-content {
  background: #141414;
}
</style>
