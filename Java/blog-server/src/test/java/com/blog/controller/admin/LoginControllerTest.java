package com.blog.controller.admin;

import com.blog.dto.UserDTO;
import com.blog.dto.UserLoginDTO;
import com.blog.result.Result;
import com.blog.vo.UserLoginVO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Slf4j
@SpringBootTest
class LoginControllerTest {

    @Autowired
    private UserController userController;

    /**
     * 用户登录测试
     */
    @Test
    void login() {
        // 创建用户登录DTO对象并设置属性
        UserLoginDTO userLoginDTO = new UserLoginDTO();
        userLoginDTO.setUsername("test-user04");
        userLoginDTO.setPassword("787945");

        Result<UserLoginVO> result = userController.login(userLoginDTO);

        // Log the result
        log.info("Login result: {}", result);
    }

    /**
     * 用户注册测试
     */
    @Test
    void register() {
        // 创建用户注册DTO对象并设置属性
        UserDTO userDTO = new UserDTO();

        userDTO.setRealname("曹");
        userDTO.setUsername("admin2");
        userDTO.setPassword("zmrgzs12345");
        userDTO.setEmail("admin2@example.com");

        // 调用注册方法
        userController.register(userDTO);

        log.info("用户注册完毕！");

    }
}