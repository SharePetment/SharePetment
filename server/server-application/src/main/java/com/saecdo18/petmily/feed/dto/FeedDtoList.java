package com.saecdo18.petmily.feed.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FeedDtoList {

    List<FeedDto.Response> responseList;
}
