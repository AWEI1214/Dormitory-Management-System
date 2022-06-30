const getRes = (status, data, msg) => {
    return {
        status: status,
        data: data,
        msg: msg
    }
};
const getOkRes = (data) => {
    return getRes(200, data);
}
const getErrorRes = (msg) => {
    return getRes(500, null, msg);
}
const getForbiddenRes = (msg) => {
    return getRes(403, null, msg);
}
const getSearchRes = (total,tableData)=>{
    return getOkRes({
        total:total,
        tableData:tableData
    });
};

module.exports = {
    getOkRes,
    getErrorRes,
    getForbiddenRes,
    getSearchRes
}