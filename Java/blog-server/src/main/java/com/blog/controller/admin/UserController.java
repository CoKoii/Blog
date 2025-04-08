package com.blog.controller.admin;

import com.blog.constant.JwtClaimsConstant;
import com.blog.dto.UserDTO;
import com.blog.dto.UserLoginDTO;
import com.blog.entity.User;
import com.blog.properties.JwtProperties;
import com.blog.result.Result;
import com.blog.service.UserService;
import com.blog.utils.JwtUtil;
import com.blog.vo.UserInfoVO;
import com.blog.vo.UserLoginVO;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final JwtProperties jwtProperties;

    /**
     * 用户登录
     * @param userLoginDTO
     * @return
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<UserLoginVO> login(@RequestBody UserLoginDTO userLoginDTO){
        log.info("用户登录：{}", userLoginDTO);

        //1. 获取用户登录信息
        User user = userService.login(userLoginDTO);

//        2. 生成jwt令牌
        HashMap<String, Object> claims = new HashMap<>();
        claims.put(JwtClaimsConstant.USER_ID, user.getId());
        String token = JwtUtil.createJWT(
                jwtProperties.getUserSecretKey(),
                jwtProperties.getUserTtl(),
                claims
        );

        log.info("用户登录成功，生成jwt令牌：{}", token);

        UserLoginVO userLoginVO = UserLoginVO.builder()
                .token(token)
                .build();

        log.info("用户登录成功，返回结果：{}", userLoginVO);

        return Result.success(userLoginVO);
    }

    /**
     * 用户注册
     *
     */
    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result register(@RequestBody UserDTO userDTO){
        log.info("用户注册：{}", userDTO);
        userService.register(userDTO);
        return Result.success();
    }

    /**
     * 获取用户信息
     */
    private Result<UserInfoVO> getUserInfo(){
        log.info("获取用户信息");
        UserInfoVO userInfoVO = userService.getUserInfo();
        return Result.success(userInfoVO);
    }




}
