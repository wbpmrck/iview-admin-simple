/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 50713
 Source Host           : localhost
 Source Database       : mall_xunfei

 Target Server Type    : MySQL
 Target Server Version : 50713
 File Encoding         : utf-8

 Date: 04/16/2018 19:04:31 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `sys_access`
-- ----------------------------
DROP TABLE IF EXISTS `sys_access`;
CREATE TABLE `sys_access` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '权限id.自增长',
  `name` varchar(64) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '权限名称',
  `desc` varchar(128) CHARACTER SET utf8 NOT NULL DEFAULT '' COMMENT '权限描述',
  `enable` bit(1) NOT NULL DEFAULT b'1' COMMENT '是否开启。默认权限是开启的。 如果权限关闭，则所有具有该权限的角色都无法使用该权限',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_sys_access_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COMMENT='系统表：权限信息';

-- ----------------------------
--  Records of `sys_access`
-- ----------------------------
BEGIN;
INSERT INTO `sys_access` VALUES ('1', 'access.read', '具有查询权限信息的权利', b'1', '2017-12-19 15:06:44', '2018-03-22 20:11:55'), ('2', 'access.update', '具有修改权限信息的权利', b'1', '2017-12-19 15:07:19', '2018-03-22 20:12:15'), ('3', 'access.create', '具有创建权限的权利', b'1', '2017-12-19 15:07:25', '2018-03-22 20:12:35'), ('4', 'role.read', '具有查询角色的权利', b'1', '2017-12-21 15:42:29', '2017-12-21 15:42:29'), ('5', 'role.update', '具有修改角色、给角色分配权限、分配账户的权利', b'1', '2017-12-21 19:41:51', '2017-12-21 19:41:51'), ('6', 'role.create', '具有创建新角色的权利', b'1', '2017-12-21 19:42:28', '2017-12-21 19:42:28'), ('7', 'account.read', '具有查询账户信息的权利', b'1', '2017-12-26 10:51:28', '2017-12-26 10:51:28'), ('8', 'account.update', '具有修改账户信息、密码等权利', b'1', '2017-12-26 10:51:31', '2017-12-26 10:51:31'), ('32', 'account.create', '具有创建新账户的权利', b'1', '2018-03-22 19:58:23', '2018-03-22 19:58:23');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
