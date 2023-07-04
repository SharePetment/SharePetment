package com.saecdo18.petmily.feeds.mapper;

import com.saecdo18.petmily.feeds.dto.FeedCommentDto;
import com.saecdo18.petmily.feeds.dto.FeedDto;
import com.saecdo18.petmily.feeds.entity.Feed;
import com.saecdo18.petmily.feeds.entity.FeedComments;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FeedMapper {
    FeedDto.Response FeedToFeedDtoResponse(Feed feed);
    FeedCommentDto feedCommentsToFeedCommentDto(FeedComments feedComments);

    ImageDto imageToImageDto(Image image);

}
