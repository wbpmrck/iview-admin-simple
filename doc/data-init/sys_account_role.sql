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

 Date: 04/16/2018 19:05:03 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `sys_account_role`
-- ----------------------------
DROP TABLE IF EXISTS `sys_account_role`;
CREATE TABLE `sys_account_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '自增长id',
  `account_id` bigint(20) NOT NULL DEFAULT '-1' COMMENT '账户id',
  `role_id` bigint(20) NOT NULL DEFAULT '-1' COMMENT '角色id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_sys_account_role` (`account_id`,`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='系统表：账户角色关系';

-- ----------------------------
--  Records of `sys_account_role`
-- ----------------------------
BEGIN;
INSERT INTO `sys_account_role` VALUES ('1', '1', '1', '2018-02-09 16:08:09', '2018-02-09 16:08:09');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
