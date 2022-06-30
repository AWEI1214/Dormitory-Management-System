<template>
    <div>
        <a-row><h2 style="text-align: center; width: 100%;">{{"公告: " + gg}}</h2></a-row>
        <a-row>
            <a-col :span="24">
                <a-descriptions title="水电费使用信息" bordered :column="4">
                    <a-descriptions-item label="宿舍门牌号">{{rinfo.key}}</a-descriptions-item>
                    <a-descriptions-item label="水费余额">{{rinfo.wc + " 元"}}</a-descriptions-item>
                    <a-descriptions-item label="电费余额">{{rinfo.ec + " 元"}}</a-descriptions-item>
                    <a-descriptions-item label="操作">
                        <label>充值金额: <a-input v-model:value="c" style="width:100px;margin-right:20px"/> </label>
                        <a-button type="primary" @click="recharge('w')">水费充值</a-button>
                        <a-button type="primary" @click="recharge('e')" style="margin-left: 20px;">电费充值</a-button>
                    </a-descriptions-item>
                </a-descriptions>
                <br>
                <!-- 新增修改信息 -->
                <a-modal v-model:visible="mo.add" style="top: 10px;" cancelText="取消" okText="新增" title="新增学生信息"
                    :confirm-loading="confirmLoading" @ok="addSt">
                    <a-row>
                        <a-col :span="24" style="padding:10px">
                            <a-form :model="sinfo" :label-col="labelCol" :wrapper-col="wrapperCol">
                                <a-form-item label="账号">
                                    <a-input v-model:value="sinfo.username" />
                                </a-form-item>
                                <a-form-item label="密码">
                                    <a-input v-model:value="sinfo.password" />
                                </a-form-item>
                                <a-form-item label="姓名">
                                    <a-input v-model:value="sinfo.name" />
                                </a-form-item>
                                <a-form-item label="性别">
                                    <a-radio-group v-model:value="sinfo.resource">
                                        <a-radio value="1">男</a-radio>
                                        <a-radio value="0">女</a-radio>
                                    </a-radio-group>
                                </a-form-item>
                                <a-form-item label="班级">
                                    <a-input v-model:value="sinfo.desc" type="textarea" />
                                </a-form-item>
                            </a-form>
                        </a-col>
                    </a-row>
                </a-modal>
            </a-col>
        </a-row>
        <a-row :gutter="10">
            <a-col :span="12">
                <h2>水电费充值记录 <a-button style="margin:0 5px"
                 @click="util.exportCsv('水电费充值记录',util.deepCopy(table.cols),util.deepCopy(table.data))"
                  type="primary">导出</a-button></h2>
                <a-table :dataSource="table.data" :columns="table.cols"></a-table>
            </a-col>
            <a-col :span="12">
                <h2>水电费使用记录 <a-button style="margin:0 5px"
                 @click="util.exportCsv('水电费使用记录',util.deepCopy(hTable.cols),util.deepCopy(hTable.data))"
                  type="primary">导出</a-button></h2>
                <a-table :dataSource="hTable.data" :columns="hTable.cols"></a-table>
            </a-col>
        </a-row>

    </div>
</template>

<script>
import util from "../util.js"
    export default {
        data() {
            return {
                gg:"",
                c:'',
                userinfo: util.getObjSession("userinfo"),
                rinfo:{},
                sinfo: {},
                mo: {
                    add: false
                },
                confirmLoading: false,
                search: {
                    form: {}
                },
                table: {
                    data: [],
                    cols: [{
                        title: '序号',
                        dataIndex: 'inde',
                        align: 'center',
                        customRender({
                            text,
                            record,
                            index,
                            column
                        }) {
                            return index + 1;
                        }
                    }, {
                        title: '寝室号',
                        dataIndex: 'key',
                        align: 'center'
                    }, {
                        title: '充值金额',
                        dataIndex: 'value',
                        align: 'center'
                    }, {
                        title: '充值类型',
                        dataIndex: 'type',
                        align: 'center'
                    } ,{
                        title: '充值人',
                        dataIndex: 'name',
                        align: 'center'
                    },{
                        title: '充值时间',
                        dataIndex: 'createTime',
                        align: 'center'
                    },]
                },
                hTable: {
                    data: [
                        ],
                    cols: [{
                        title: '序号',
                        dataIndex: 'inde',
                        align: 'center',
                        customRender({
                            text,
                            record,
                            index,
                            column
                        }) {
                            return index + 1;
                        }
                    }, {
                        title: '寝室号',
                        dataIndex: 'key',
                        align: 'center'
                    }, {
                        title: '金额',
                        dataIndex: 'c',
                        align: 'center'
                    }, {
                        title: '类型',
                        dataIndex: 'type',
                        align: 'center'
                    },{
                        title: '金额变动发生时间',
                        dataIndex: 'createTime',
                        align: 'center'
                    },]
                },
            }
        },
        mounted() {
            this.loadAll();
            this.util = util;
        },
        methods: {
            recharge(type){
                if(this.c==''){
                    this.$message.error("请填写充值金额");
                    return false;
                }
                if(!(parseFloat(this.c) > 0)){
                    this.$message.error("请输入正确金额");
                    return false;
                }
                if(type=="e"){
                    util.method.addData("rech",null,{key:this.userinfo.key,name:this.userinfo.name,type:"电费",value:parseFloat(this.c)},res=>{
                        util.method.updateData("room","key",{key:this.userinfo.key,ec:this.rinfo.ec + parseFloat(this.c)},res=>{
                            this.loadAll();
                        });
                    });
                }else{
                    util.method.addData("rech",null,{key:this.userinfo.key,name:this.userinfo.name,type:"水费",value:parseFloat(this.c)},res=>{
                        util.method.updateData("room","key",{key:this.userinfo.key,wc:this.rinfo.wc + parseFloat(this.c)},res=>{
                            this.loadAll();
                        });
                    });
                }
            },
            loadAll(){
                util.method.getData("room",{key:this.userinfo.key},false,res=>{
                    this.rinfo = res.data[0];
                });
                util.method.getData("wech",{key:this.userinfo.key},false,res=>{
                    this.hTable.data = res.data;
                });
                util.method.getData("rech",{key:this.userinfo.key},false,res=>{
                    this.table.data = res.data;
                });
                util.method.getData("gg",{type:0},false,res=>{
                    this.gg = res.data[0].value;
                });
            },
        },
        components: {}
    }
</script>

<style>

</style>