package com.blog.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserDTO implements Serializable {

    private Long id;

    private String username;

    private String password;

    private String email;

    private String avatar;

}
