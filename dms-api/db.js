const MongoClient = require('mongodb').MongoClient;
const define = require("./define.js");
const dbName = "dmsdb";
const url = `mongodb://127.0.0.1:27017/${dbName}`;
let db = null;

let SUPER_ADMIN_USERNAME = "dmsadmin";
let SUPER_ADMIN_PASSWORD = "dmspasswd";

const select = (table, where, cb, skip, limit, sort) => {
    let keys = Object.keys(where);
    keys.forEach(key => {
        if (where[key] == null || where[key] == undefined) {
            delete where[key];
        }
    });
    db.collection(table).find(where)
        .sort({createTime: -1})
        .skip(skip || 0) //跳过的条数
        .limit(limit || 9999999) //查询几条
        .toArray(function (err, result) {
            if (err) throw err;
            cb(result);
        });
}
const selectOne = (table, where, cb) => {
    select(table, where, (res) => {
        if (res && res.length > 0) {
            cb(res[0]);
        } else {
            cb(null);
        }
    });
}
const insert = (table, data, cb) => {
    if (data.length) {
        db.collection(table).insertMany(data, function (err, res) {
            if (err) throw err;
            cb(res);
        });
    } else {
        db.collection(table).insertOne(data, function (err, res) {
            if (err) throw err;
            cb(res);
        });
    }
};
const del = (table, where, cb) => {
    db.collection(table).deleteMany(where, function (err, obj) {
        if (err) throw err;
        cb(obj.result);
    });
};

const aggregate = (table,groupParams,cb) =>{
    // let group = {_id:"$category",priceTotal: {$sum: "$charge"},countTotal: {$sum: 1}};
    db.collection(table).aggregate([{$group:groupParams}]).toArray(function(err,docs){
        cb(docs);
   });
};

/**
 * 更新条目
 * @param {string} table 表名
 * @param {object} where 更新条件
 * @param {object} data 更新数据
 * @param {function} cb 更新结束回调
 */
const update = (table, where, data, cb) => {
    db.collection(table).updateMany(where, {
        $set: data
    }, function (err, res) {
        if (err) throw err;
        cb(res.result);
    });
}

const getCount = (table, where, cb) => {
    db.collection(table).find(where).count(function (err, result) {
        if (err) throw err;
        cb(result);
    });
};

MongoClient.connect(url, function (err, sdb) {
    if (err) throw err;
    console.log(`${dbName} connect ok!`);
    db = sdb.db(dbName);
    selectOne(define.TB_USER, {
        username: SUPER_ADMIN_USERNAME
    }, (res) => {
        if (!res) {
            insert(define.TB_USER, {
                username: SUPER_ADMIN_USERNAME,
                password: SUPER_ADMIN_PASSWORD,
                nickname:"系统管理员",
                createTime: new Date().toLocaleString()
            }, () => {});
        };
    });
});

module.exports = {
    select,
    selectOne,
    insert,
    update,
    getCount,
    del,aggregate
}