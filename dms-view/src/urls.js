// const path = "http://192.168.0.105:8766"
const path = "http://localhost:3000"

const urls = {}
urls.serverAddr = path;
urls.prev = "/dms";
urls.LOGIN = "/login";
urls.LOGOUT = "/logout";
urls.SIGNUP = "/signup";
urls.SEARCH_DATA = "/data";
urls.INSERT_DATA = "/data/insert";
urls.GET_DATA = "/data/item";
urls.GET_GROUP = "/data/group";

urls.GET_COUNT = "/count";
urls.DELETE_DATA = "/data/del";
urls.UPDATE_DATA = "/data/update";
urls.RESET_PASSWORD = "/password/reset";
urls.DELETE_USER = "/user/del";



urls.GET_ALL_ROLE = "/roles";
urls.GET_INPUT_ALL_ROLE = "/roles-input";

urls.CHANGE_SELF_PASSWORD = "/password-change";

urls.ROLE_ADD = "/role-add";
urls.USER_EDIT = "/user-edit/";
urls.ROLE_EDIT = "/role-edit/";

export default urls;