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

 Date: 04/16/2018 19:05:08 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Records of `sys_role`
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES ('1', '根用户root', '自动具备所有权限，无需授权的最强内置用户角色', b'1', '2017-12-19 14:44:14', '2018-02-07 20:14:01');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
