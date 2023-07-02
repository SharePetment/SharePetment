package com.saecdo18.serverapplication.swagger.swaggertest.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class User {
    private int id;
    private String nickname;
    private String password;
}
