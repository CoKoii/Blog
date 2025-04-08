package com.blog.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据用户名查询用户
     * @param username
     * @return
     */
    @Select("select * from user where username = #{username}")
    User getByUsername(String username);


    /**
     * 插入用户
     * @param user
     */
    /*@Select("insert into user (realname, username, password, email, avatar, status, create_time, update_time) " +
            "values (#{realname}, #{username}, #{password}, #{email}, #{avatar}, #{status}, #{createTime}, #{updateTime})")
    void insert(User user);*/
}
