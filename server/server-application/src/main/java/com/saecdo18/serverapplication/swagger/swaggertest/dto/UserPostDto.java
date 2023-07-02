package com.saecdo18.serverapplication.swagger.swaggertest.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;

@Getter
public class UserPostDto {
    @ApiModelProperty(value = "계량기번호", dataType = "string", required = true)
    private String nickname;
    private String password;
}
