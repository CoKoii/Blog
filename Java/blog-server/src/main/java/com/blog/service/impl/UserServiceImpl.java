package com.blog.service.impl;

import com.blog.constant.MessageConstant;
import com.blog.constant.PasswordConstant;
import com.blog.constant.StatusConstant;
import com.blog.dto.UserDTO;
import com.blog.dto.UserLoginDTO;
import com.blog.entity.User;
import com.blog.exception.AccountNotFoundException;
import com.blog.mapper.UserMapper;
import com.blog.service.UserService;
import com.blog.vo.UserInfoVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    /**
     * 用户登录
     *
     * @param userLoginDTO
     * @return
     */
    @Override
    public User login(UserLoginDTO userLoginDTO) {
        String username = userLoginDTO.getUsername();
        String password = userLoginDTO.getPassword();

        //1、根据用户名查询数据库中的数据
        User user =  userMapper.getByUsername(username);

        //2、处理各种异常情况（用户名不存在、密码不对、账号被锁定）
        if (user == null) {
            //账号不存在
            log.info("账号不存在");
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }

        //密码比对
        password = DigestUtils.md5DigestAsHex(password.getBytes());

        if (!password.equals(user.getPassword())){
            //密码错误
            log.info("密码错误");
            throw new AccountNotFoundException(MessageConstant.PASSWORD_ERROR);
        }
        if (user.getStatus() == StatusConstant.DISABLE){
            //账号被锁定
            log.info("账号被锁定");
            throw new AccountNotFoundException(MessageConstant.ACCOUNT_LOCKED);
        }

        //3、返回实体对象
        return user;
    }

    /**
     * 用户注册
     *
     * @param userDTO
     */
    @Override
    public void register(UserDTO userDTO) {
        User user = new User();

        //对象属性拷贝
        BeanUtils.copyProperties(userDTO, user);

        //设置账号的状态，默认正常状态 1表示正常 0表示锁定
        user.setStatus(StatusConstant.ENABLE);

        //设置密码
        user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));

        //设置当前记录的创建时间和修改时间
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        userMapper.insert(user);
    }

    @Override
    public UserInfoVO getUserInfo() {



        return null;
    }


}
