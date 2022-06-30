import urls from "./urls";
const util = {}
util.getFetch = (url, method, okCallback, errorCallback, data, headers) => {
  let option = {
    method: method,
    credentials: 'include'
  };
  if (data) {
    option.body = data;
  }
  if (headers) {
    option.headers = headers;
  }
  fetch(urls.prev + url, option)
    .then(response => response.json())
    .then(response => {
      if (response.status == -1) {
        if (window.needLogin == 1) {
          window.needLogin = 1;
        }
        util.logout();
      } else if (response.status == -2) {
        util.logout();
      } else {
        if (okCallback) okCallback(response);
      }
    })
    .catch(error => {
      if (errorCallback) errorCallback(error);
    });
}
util.getJsonPost = (url, okCallback, errorCallback, data) => {
  util.getFetch(url, "POST", okCallback, errorCallback, JSON.stringify(data), util.fetchConfig.contentTypeJson);
}
util.getJsonDelete = (url, okCallback, errorCallback) => {
  util.getFetch(url, "DELETE", okCallback, errorCallback);
}
util.getJsonGet = (url, okCallback, errorCallback) => {
  util.getFetch(url, "GET", okCallback, errorCallback, null, null);
}
util.fetchConfig = {
  contentTypeJson: {
    'content-type': 'application/json'
  },
  contentTypeText: {
    'content-type': 'application/txt'
  }
};
util.elMessageType = {
  sec: "success",
  msg: "message",
  warn: "warning",
  error: "error"
}
util.deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}
util.showMessage = (context, str, type, duration) => {
  context.$message({
    message: str,
    type: type,
    duration: duration ? duration : type == "error" ? 5000 : 2000
  })
}
util.getSession = (key) => {
  return sessionStorage.getItem(key);
}
util.getObjSession = (key) => {
  return JSON.parse(util.getSession(key));
}
util.setSession = (key, value) => {
  return sessionStorage.setItem(key, typeof (value) == "string" ? value : JSON.stringify(value));
}
util.clearSession = () => {
  sessionStorage.clear();
}
util.numberTransColName = (number) => {
  let pr = null;
  if (number > 26) {
    pr = util.numberTransColName(Math.floor(number / 26) - 1);
    number = number % 26;
  }
  var ordA = 'A'.charCodeAt(0);
  var ordZ = 'Z'.charCodeAt(0);
  var len = ordZ - ordA + 1;
  var s = "";
  while (number >= 0) {
    s = String.fromCharCode(number % len + ordA) + s;
    number = Math.floor(number / len) - 1;
  }
  if (pr != null) {
    s = pr + s;
  }
  return s;
}
util.logout = () => {
  util.clearSession();
  window.location.href = "./";
}
// csv字符串转对象
util.csvToObject = (csvString) => {
  var csvarry = csvString.split("\r\n");
  var datas = [];
  var headers = csvarry[0].split(",");
  for (var i = 1; i < csvarry.length; i++) {
    var data = {};
    var temp = csvarry[i].split(",");
    for (var j = 0; j < temp.length; j++) {
      data[headers[j]] = temp[j];
    }
    datas.push(data);
  }
  return datas;
}
// 导入
util.fileImport = (cb) => {
  var element = document.createElement('input');
  element.setAttribute('type', "file");
  element.setAttribute('id', "files");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.addEventListener("change", function () {
    var selectedFile = document.getElementById('files').files[0];
    var reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onload = function () {
      document.body.removeChild(element);
      cb(this.result);
    }
  });

  element.click();

}
// 导出
util.exportCsv = (filename, header, data) => {
  let str = "";
  let headers = [];
  // 处理头
  for (let i = 1; i < header.length; i++) {
    if (header[i].dataIndex) {
      str += `${header[i].dataIndex},`;
      headers.push(header[i].dataIndex);
    }
  }
  str = str.slice(0, -1);
  str += "\r\n";
  for (let i = 0; i < data.length; i++) {
    headers.forEach(item => {
      str += `${data[i][item]!=undefined?data[i][item]:''},`;
    });
    str = str.slice(0, -1);
    str += "\r\n";
  }
  str = str.slice(0, -2);
  // 处理体
  util.downloadTXT(`${filename}_${new Date().getTime()}.csv`, str);
}
util.downloadTXT = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
util.method = {
  login(username, password, type, okCb, errCb) {
    util.getJsonPost(urls.LOGIN, okCb, errCb, {
      type: type,
      password: password,
      username: username
    });
  },
  changeSelfPassword(oldPassword, newPasssword, username, okCb, errCb) {
    util.getJsonPost(urls.CHANGE_SELF_PASSWORD, okCb, errCb, {
      oldPassword: oldPassword,
      newPassword: newPasssword,
      username: username
    });
  },
  getDataCount(table, okCb, errCb) {
    util.getJsonPost(urls.GET_COUNT, okCb, errCb, {
      table: table
    });
  },
  addUser(username, password, okCb, errCb) {
    util.getJsonPost(urls.SIGNUP, okCb, errCb, {
      username: username,
      password: password,
      okCb,
      errCb
    });
  },
  updateData(table, key, data, okCb, errCb) {
    util.getJsonPost(urls.UPDATE_DATA, okCb, errCb, {
      table: table,
      key: key,
      data: data
    })
  },
  addData(table, key, data, okCb, errCb) {
    util.getJsonPost(urls.INSERT_DATA, okCb, errCb, {
      table: table,
      key: key,
      data: data
    })
  },
  delData(table, where, okCb, errCb) {
    util.getJsonPost(urls.DELETE_DATA, okCb, errCb, {
      table: table,
      where: where,
    })
  },
  getData(table, where, isQuery, okCb, errCb) {
    util.getJsonPost(urls.GET_DATA, okCb, errCb, {
      table: table,
      where: where,
      isQuery: isQuery
    })
  },
  saveLog(action, msg) {
    let userinfo = util.getObjSession("userinfo")
    let username = userinfo.username;
    let nickname = userinfo.nickname;
    util.method.addData("logs", null, {
      username: username,
      nickname: nickname,
      action: action,
      msg: msg
    });
  },
  logDel(msg) {
    util.method.saveLog("删除", msg);
  },
  logAdd(msg) {
    util.method.saveLog("新增", msg);
  },
  logEdit(msg) {
    util.method.saveLog("编辑", msg);
  }
};

export default util;