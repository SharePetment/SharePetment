package com.saecdo18.petmily.image.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ImageDto {
    @ApiModelProperty(value = "이미지 아이디", example = "1", required = true)
    private Long imageId;
    @ApiModelProperty(value = "이미지 원본 파일 이름", example = "우리집 강아지", required = true)
    private String originalFilename;
    @ApiModelProperty(value = "이미지 URL", example = "http://image.jpg", required = true)
    private String uploadFileURL;
}
