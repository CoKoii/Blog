package com.blog.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "blog.jwt")
@Data
public class JwtProperties {

    /**
     * 管理端员工生成jwt令牌相关配置
     */
    // 管理端jwt密钥
    private String userSecretKey;

    // 管理端jwt过期时间
    private long userTtl;

    // 管理端jwt令牌名称
    private String userTokenName;

}
