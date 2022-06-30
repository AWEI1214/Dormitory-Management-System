<template>
  <a-row>
    <a-col :span="16" :offset="4">
      <a-descriptions title="寝室信息" bordered :column="2">
        <a-descriptions-item label="所在宿舍楼">{{
          regFrom.rinfo.bid
        }}</a-descriptions-item>
        <a-descriptions-item label="宿舍楼层">{{
          regFrom.rinfo.lid
        }}</a-descriptions-item>
        <a-descriptions-item label="宿舍门牌号">{{
          regFrom.rinfo.rid
        }}</a-descriptions-item>
        <a-descriptions-item label="水费余额">{{
          regFrom.rinfo.wc
        }}</a-descriptions-item>
        <a-descriptions-item label="宿舍卫生分数">{{
          regFrom.rinfo.score
        }}</a-descriptions-item>
        <a-descriptions-item label="电费余额">{{
          regFrom.rinfo.ec
        }}</a-descriptions-item>
      </a-descriptions>
    </a-col>
  </a-row>
  <br />
  <a-row>
    <a-col :span="16" :offset="4">
      <a-descriptions title="床铺信息" bordered :column="2">
        <a-descriptions-item
          v-for="item in regFrom.binfo"
          :key="item.username"
          :label="item.bedid"
          >{{ item.name }}
        </a-descriptions-item>
      </a-descriptions>
    </a-col>
  </a-row>
</template>

<script>
import { reactive } from "@vue/reactivity";
import { ref, onMounted } from "vue";
import util from "../util.js";
export default {
  setup() {
    const regFrom = reactive({
      rinfo: {},
      binfo: [],
      userinfo: util.getObjSession("userinfo"),
    });

    const loadAll = () => {
      util.method.getData(
        "room",
        {
          key: regFrom.userinfo.key,
        },
        false,
        (res) => {
          regFrom.rinfo = res.data[0];
        }
      );
      util.method.getData(
        "student",
        {
          key: regFrom.userinfo.key,
        },
        false,
        (res) => {
          regFrom.binfo = res.data.sort((a, b) => {
            return a.bedid - b.bedid;
          });
        }
      );
    };

    onMounted(() => {
      loadAll();
    });

    return {
      regFrom,
    };
  },
};
</script>