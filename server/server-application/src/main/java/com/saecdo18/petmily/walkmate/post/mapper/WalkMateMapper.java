package com.saecdo18.petmily.walkmate.post.mapper;

import com.saecdo18.petmily.walkmate.post.dto.WalkPatchDto;
import com.saecdo18.petmily.walkmate.post.dto.WalkPostDto;
import com.saecdo18.petmily.walkmate.post.dto.WalkResponseDto;
import com.saecdo18.petmily.walkmate.post.entity.WalkMate;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WalkMateMapper {

    WalkMate walkPostDtoToWalk(WalkPostDto walkPostDto);
    WalkMate walkPatchDtoToWalk(WalkPatchDto walkPatchDto);
    WalkResponseDto walkToWalkResponseDto(WalkMate walkMate);
}
