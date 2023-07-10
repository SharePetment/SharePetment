package com.saecdo18.petmily.pet.dto;

import com.saecdo18.petmily.image.dto.ImageDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class PetDto {

//    @AllArgsConstructor
//    @NoArgsConstructor
    @Getter
    @Builder
    @ApiModel(value = "펫 생성용 DTO")
    public static class Post{
        @ApiModelProperty(value = "펫 이미지", example = "string", required = true)
        private MultipartFile images;
        @NotBlank
        @ApiModelProperty(value = "펫 이름", example = "초코", required = true)
        private String name;
        @ApiModelProperty(value = "펫 나이", example = "6", required = true)
        private int age;
        @NotBlank
        @ApiModelProperty(value = "펫 성별", example = "수컷", required = true)
        private String sex;
        @NotBlank
        @ApiModelProperty(value = "펫 종", example = "강아지 시고르자브종", required = true)
        private String species;
        @ApiModelProperty(value = "펫 정보", example = "안녕하세요 강아지입니다", required = true)
        private String information;


    }

    @Getter
    @Builder
    @ApiModel(value = "펫 수정용 DTO")
    public static class Patch{
//        private String profile;
        @ApiModelProperty(value = "펫 이미지", example = "string", required = true)
        private MultipartFile images;
        @ApiModelProperty(value = "펫 이름", example = "초코", required = true)
        private String name;
        @ApiModelProperty(value = "펫 나이", example = "6", required = true)
        private int age;
        @ApiModelProperty(value = "펫 성별", example = "수컷", required = true)
        private String sex;
        @ApiModelProperty(value = "펫 종", example = "강아지 시고르자브종", required = true)
        private String species;
        @ApiModelProperty(value = "펫 정보", example = "안녕하세요 강아지입니다", required = true)
        private String information;


    }

    @Getter
    @Builder
    @Setter
    @ApiModel(value = "펫 응답용 DTO")
    public static class Response {
        @ApiModelProperty(value = "펫 식별자", example = "1", required = true)
        private Long petId;
        //        private String profile;
        private ImageDto images;
        @ApiModelProperty(value = "펫 이름", example = "초코", required = true)
        private String name;
        @ApiModelProperty(value = "펫 나이", example = "6", required = true)
        private int age;
        @ApiModelProperty(value = "펫 성별", example = "수컷", required = true)
        private String sex;
        @ApiModelProperty(value = "펫 종", example = "강아지 시고르자브종", required = true)
        private String species;
        @ApiModelProperty(value = "펫 정보", example = "안녕하세요 강아지입니다", required = true)
        private String information;
        @ApiModelProperty(value = "견주 식별자", example = "5", required = true)
        private long memberId;
        private String createdAt;
        private String modifiedAt;


    }



}
