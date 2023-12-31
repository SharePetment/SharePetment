package com.saecdo18.petmily.feed.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
@Builder
@Setter
public class FeedDtoList {

    List<FeedDto.Response> responseList;
}
