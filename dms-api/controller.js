const resu = require("./res.js");
const db = require("./db.js");
const define = require("./define.js");

/* 用户处理相关 */
/**
 * 通过用户名获取用户
 * @param {string} username 用户名
 * @param {function} cb 查询回调
 */
const getUserByUserName = async (username,type, cb) => {
    db.selectOne(define.TB_USER, {
        username: username,
        type:type
    }, cb);
}
const insertData = (req, cb) => {
    req.data.createTime = new Date().toLocaleString();
    if (req.key) {
        let key = req.key.key;
        let keyName = req.key.name;
        let where = {};
        where[key] = req.data[key];
        db.selectOne(req.table, where, (res) => {
            if (res) {
                cb(resu.getForbiddenRes(keyName + " 已存在"));
            } else {
                db.insert(req.table, req.data, () => {
                    cb(resu.getOkRes());
                });
            }
        })
    } else {
        db.insert(req.table, req.data, () => {
            cb(resu.getOkRes());
        });
    }
};
const insertUser = (username, password, cb) => {
    db.insert(define.TB_USER, {
        username: username,
        password: password,
        createTime: new Date().toLocaleString()
    }, cb);
}
const editUserPasswd = (passinfo, cb) => {
    db.update(define.TB_USER, {
        username: passinfo.username
    }, {
        password: passinfo.newPassword
    }, cb);
};
const resetUserPass = (username, cb) => {
    editUserPasswd({
        username: username,
        newPassword: "123456"
    }, cb);
}
const getDataCount = (table, cb) => {
    db.getCount(table, {}, cb);
}
const searchDataCount = (table, where, cb) => {
    db.getCount(table, where, cb);
}
const searchData = (req, cb) => {
    let table = req.params.table;
    delete req.params.table;
    const keys = Object.keys(req.params);
    keys.forEach(key => {
        req.params[key] = new RegExp(req.params[key]);
    });
    db.select(table, req.params, cb, req.offset, req.pageSize, {
        createTime: -1
    });
};
const getData = (req, cb) => {
    if (req.isQuery) {
        const keys = Object.keys(req.where);
        keys.forEach(key => {
            req.where[key] = new RegExp(req.where[key]);
        });
    }
    req.where = req.where==null?{}:req.where;
    db.select(req.table, req.where, cb);
};
const deleteData = (req, cb) => {
    db.del(req.table, req.where, cb);
}
const updateData = (req, cb) => {
    let where = {};
    where[req.key] = req.data[req.key];
    delete req.data._id;
    db.update(req.table, where, req.data, cb);
};

const getGroup = (table,groupParams,cb)=>{
    db.aggregate(table,groupParams,cb);
};

/**
 * 同步方法
 * @param {function} action 执行方法,接收resolve
 * @param {function} out 结果输出方法,接收action中的value
 * @returns promise 用于异步转同步
 */
const func = (action, out) => {
    let promise = new Promise(function (resolve, reject) {
        action(resolve);
    });
    promise.then(function (value) {
        out(value);
    }, function (value) {});
    return promise;
};

module.exports = {
    // 方法模板
    TMP: async (ctx) => {
        return func((r) => {

        }, (out) => {

        });
    },
    GET_GROUP: async (ctx) => {
        return func((r) => {
            let req = ctx.request.body;
            let table = req.params.table;
            let groupParams = req.groupParams;
            let offset = req.offset;
            let pageSize = req.pageSize;
            getGroup(table,groupParams,(res)=>{
                r(resu.getSearchRes(res.length, res.splice(offset,pageSize)));
            });
        }, (out) => {
            ctx.body = out;
        });
    },
    GET_DATA: async (ctx) => {
        return func((r) => {
            getData(ctx.request.body, (res) => {
                r(resu.getOkRes(res));
            });
        }, (out) => {
            ctx.body = out;
        });
    },
    /// 插入数据
    INSERT_DATA: async (ctx) => {
        return func((r) => {
            insertData(ctx.request.body, (res) => {
                r(res);
            })
        }, (out) => {
            ctx.body = out;
        });
    },
    // 更新数据
    UPDATE_DATA: async (ctx) => {
        return func((r) => {
            updateData(ctx.request.body, () => {
                r();
            });
        }, (out) => {
            ctx.body = resu.getOkRes();
        });
    },
    // 重置用户密码
    RESET_PASSWORD: async (ctx) => {
        return func((r) => {
            let req = ctx.request.body;
            resetUserPass(req.username, () => {
                r();
            })
        }, (out) => {
            ctx.body = resu.getOkRes();
        });
    },
    // 删除数据
    DELETE_DATA: async (ctx) => {
        return func((r) => {
            // deleteData
            let req = ctx.request.body;
            deleteData(req, (res) => {
                r(resu.getOkRes(res));
            });
        }, (out) => {
            ctx.body = out;
        });
    },
    // 搜索
    SEARCH_DATA: async (ctx) => {
        return func((r) => {
            let req = ctx.request.body;
            let table = req.params.table;
            searchData(req, (data) => {
                searchDataCount(table, req.params, (count) => {
                    r(resu.getSearchRes(count, data));
                });
            });
        }, (out) => {
            ctx.body = out;
        });
    },
    // 取条数
    GET_COUNT: async (ctx) => {
        return func((r) => {
            let table = ctx.request.body.table;
            getDataCount(table, r);
        }, (out) => {
            ctx.body = resu.getOkRes(out);
        });
    },
    // 登录
    LOG_IN: async (ctx, next) => {
        return func((r) => {
            let loginInfo = ctx.request.body;
            getUserByUserName(loginInfo.username,loginInfo.type, (res) => {
                let rres = null;
                if (!res) {
                    rres = resu.getForbiddenRes("账号或密码错误");
                } else {
                    if (res.password == loginInfo.password) {
                        rres = resu.getOkRes(res);
                    } else {
                        rres = resu.getForbiddenRes("账号或密码错误");
                    }
                }
                r(rres);
            });
        }, (out) => {
            ctx.body = out;
        });
    },
    // 创建用户
    SIGN_UP: async (ctx, next) => {
        return func((r) => {
            let userInfo = ctx.request.body;
            let username = userInfo.username;
            let password = userInfo.password;
            // let roleId = userInfo.roleId;
            // 查询用户
            getUserByUserName(username, (res) => {
                if (res) {
                    r(resu.getForbiddenRes("用户名已存在"));
                } else {
                    insertUser(username, password, (res) => {
                        r(resu.getOkRes(res));
                    })
                }
            });
        }, (res) => {
            ctx.body = res;
        });
    },
    // 修改个人信息
    EDIT_USER_INFO: async (ctx) => {
        return func((r) => {
            let editInfo = ctx.request.body;
        }, (out) => {
            ctx.body = out;
        });
    },
    // 修改密码
    CHANGE_PASSWD: async (ctx) => {
        return func((r) => {
            let passinfo = ctx.request.body;
            getUserByUserName(passinfo.username, (res) => {
                if (!res) {
                    r(resu.getForbiddenRes("用户查询失败"));
                } else {
                    if (res.password == passinfo.oldPassword) {
                        // 修改
                        editUserPasswd(passinfo, (res) => {
                            r(resu.getOkRes(res));
                        });
                    } else {
                        r(resu.getForbiddenRes("原密码错误"));
                    }
                }
            });
        }, (out) => {
            ctx.body = out;
        });
    },
}