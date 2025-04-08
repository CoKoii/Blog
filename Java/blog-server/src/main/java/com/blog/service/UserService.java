package com.blog.service;

import com.blog.dto.UserDTO;
import com.blog.dto.UserLoginDTO;
import com.blog.entity.User;
import com.blog.vo.UserInfoVO;

public interface UserService {

    /**
     * 用户登录
     * @param userLoginDTO
     * @return
     */
    User login(UserLoginDTO userLoginDTO);

    /**
     * 用户注册
     * @param userDTO
     */
    void register(UserDTO userDTO);

    /**
     * 更新用户信息
     * @param userInfoVO
     */
    UserInfoVO getUserInfo();
}
