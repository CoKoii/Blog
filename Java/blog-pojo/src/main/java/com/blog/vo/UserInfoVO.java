package com.blog.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "用户登录成功后返回的数据格式")
public class UserInfoVO implements Serializable {

    @Schema(description = "自定义用户名")
    private String realname; // 自定义用户名

    @Schema(description = "邮箱")
    private String email; // 邮箱

}
