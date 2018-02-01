--   -------------------------------------------------- 
--   Generated by Enterprise Architect Version 11.0.1106
--   Created On : 星期二, 19 十二月, 2017 
--   DBMS       : MySql 
--   -------------------------------------------------- 

DROP TABLE IF EXISTS `sys_account_role` CASCADE
;
CREATE TABLE `sys_account_role`
(
	`id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '自增长id',
	`account_id` BIGINT NOT NULL DEFAULT -1 COMMENT '账户id',
	`role_id` BIGINT NOT NULL DEFAULT -1 COMMENT '角色id',
	`create_time` DATETIME(0) NOT NULL DEFAULT now(),
	`update_time` DATETIME(0) NOT NULL DEFAULT now(),
	PRIMARY KEY (`id`)

)  COMMENT='系统表：账户角色关系'
;


