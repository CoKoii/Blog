package com.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    private Long id; // 主键

    private String realname; // 真实姓名

    private String username; // 用户名

    private String password; // 加密后的密码

    private String email; // 邮箱

    private String avatar; // 头像URL

    private Integer status; // 账号状态

    private LocalDateTime createTime; // 创建时间

    private LocalDateTime updateTime; // 最后修改时间

    private Integer isDeleted; // 软删除标记

}
