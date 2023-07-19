package com.saecdo18.petmily.feed.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
@Builder
public class FeedDtoList {

    List<FeedDto.Response> responseList;
}
