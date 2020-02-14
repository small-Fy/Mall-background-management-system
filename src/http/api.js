// import axios from "./axios";
import service from "./index";

// 所有接口的api封装
export default class Api {
    //    用户登录 
    static login(username, password) {
            return service.post("login", { username, password });
        }
        // 获取用户列表
    static getUser(pagenum, pagesize, query) {
            if (query) {
                return service.get(`users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`);
            } else {
                return service.get(`users?pagenum=${pagenum}&pagesize=${pagesize}`);
            }
        }
        // 添加用户
    static addUser(username, password, email, mobile) {
            return service.post(`users`, { username, password, email, mobile });
        }
        // 修改用户状态(uId位数字，type为布尔)
    static updateUser(uId, type) {
            return service.put(`users/${uId}/state/${type}`);
        }
        // 查询用户信息
    static getUserMsg(id) {
            return service.get(`users/${id}`);
        }
        // 编辑用户信息
    static editUserMsg(id, email, mobile) {
            return service.put(`users/${id}`, { email, mobile });
        }
        // 删除单个用户
    static delUser(id) {
            return service.delete(`users/${id}`);
        }
        // 分配用户角色
    static allotUser(id, rid) {
            return service.put(`users/${id}/role`, { rid });
        }
        // 所有权限列表
    static allPer(type) {
            return service.get(`rights/${type}`);
        }
        // 左侧菜单权限
    static menuPer() {
            return service.get(`menus`);
        }
        // 角色列表
    static getRoles() {
            return service.get(`roles`);
        }
        // 添加角色
    static addRoles(roleName, roleDesc) {
            return service.post(`roles`, { roleName, roleDesc });
        }
        // 查询角色
    static getRoleMsg(id) {
            return service.get(`roles/${id}`);
        }
        // 编辑角色
    static editRoles(id, roleName, roleDesc) {
            return service.put(`roles/${id}`, { roleName, roleDesc });
        }
        // 删除角色
    static delRoles(id) {
            return service.delete(`roles/${id}`);
        }
        // 角色授权
    static autRoles(roleId, rids) {
            return service.post(`roles/${roleId}/rights`, { rids });
        }
        // 删除角色指定权限
    static delAutRoles(roleId, rightId) {
            return service.delete(`roles/${roleId}/rights/${rightId}`);
        }
        // 商品分类数据列表
    static getCat(pagenum, pagesize, type = 3) {
            if (pagenum && pagesize) {
                return service.get(`categories?pagenum=${pagenum}&pagesize=${pagesize}&type=${type}`);
            } else {
                return service.get(`categories?type=${type}`);
            }
        }
        // 添加分类
    static addCat(cat_pid, cat_name, cat_level) {
            return service.post(`categories`, { cat_pid, cat_name, cat_level });
        }
        // 根据 id 查询分类
    static queryCat(id) {
            return service.get(`categories/${id}`);
        }
        // 编辑提交分类
    static editCat(id, cat_name) {
            return service.put(`categories/${id}`, { cat_name });
        }
        // 删除分类
    static delCat(id) {
            return service.delete(`categories/${id}`);
        }
        // 参数列表
    static getParameter(id, sel) {
            return service.get(`categories/${id}/attributes?sel=${sel}`);
        }
        // 添加动态参数或者静态属性
    static addParameter(id, attr_name, attr_sel, attr_vals) {
            // 如果是many
            if (attr_vals) {
                return service.post(`categories/${id}/attributes`, { attr_name, attr_sel, attr_vals });
            } else {
                return service.post(`categories/${id}/attributes`, { attr_name, attr_sel });
            }
        }
        // 删除参数
    static delParameter(id, attrid) {
            return service.delete(`categories/${id}/attributes/${attrid}`);
        }
        // 编辑提交参数
    static editParameter(id, attrid, attr_name, attr_sel, attr_vals) {
            if (attr_vals) {
                return service.put(`categories/${id}/attributes/${attrid}`, { attr_name, attr_sel, attr_vals });
            } else {
                return service.put(`categories/${id}/attributes/${attrid}`, { attr_name, attr_sel });
            }
        }
        // 商品列表数据
    static getGoods(query, pagenum, pagesize) {
            return service.get(`goods?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`);
        }
        // 添加商品
    static addGoods(goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs) {
            return service.post(`goods`, { goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs });
        }
        // 根据 ID 查询商品
    static queryGoods(id) {
            return service.get(`goods/${id}`);
        }
        // 删除商品
    static delGoods(id) {
            return service.delete(`goods/${id}`);
        }
        // 图片上传
    static uploadPic(file) {
            return service.post(`upload`, { file });
        }
        // 订单数据列表
    static getOrders(query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr) {
            if (user_id && pay_status && is_send && order_fapiao_title && order_fapiao_company && order_fapiao_content && consignee_addr) {
                return service.get(`orders?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}&user_id=${user_id}&pay_status=${pay_status}&is_send=${is_send}&order_fapiao_title=${order_fapiao_title}&order_fapiao_company=${order_fapiao_company}&order_fapiao_content=${order_fapiao_content}&consignee_addr=${consignee_addr}`);
            } else {
                return service.get(`orders?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
            }
        }
        // 修改订单状态
    static editOrder(id, is_send, order_pay, order_price, order_number, pay_status) {
            return service.put(`orders/${id}`, { is_send, order_pay, order_price, order_number, pay_status });
        }
        // 查看订单详情
    static showOrder(id) {
            return service.get(`orders/${id}`);
        }
        // 查看物流信息
    static showLogistics(id) {
            return service.get(`/kuaidi/${id}`);
        }
        // 基于时间统计的折线图
    static showChart() {
        return service.get(`reports/type/1`);
    }
}