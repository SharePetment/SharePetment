package com.saecdo18.petmily.feeds.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feeds.dto.FeedCommentDto;
import com.saecdo18.petmily.feeds.dto.FeedDto;
import com.saecdo18.petmily.feeds.entity.Feed;
import com.saecdo18.petmily.feeds.entity.FeedComments;
import com.saecdo18.petmily.feeds.entity.FeedImage;
import com.saecdo18.petmily.feeds.entity.FeedLike;
import com.saecdo18.petmily.feeds.mapper.FeedMapper;
import com.saecdo18.petmily.feeds.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feeds.repository.FeedImageRepository;
import com.saecdo18.petmily.feeds.repository.FeedLikeRepository;
import com.saecdo18.petmily.feeds.repository.FeedRepository;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {

    private final FeedRepository feedRepository;
    private final MemberRepository memberRepository;
    private final ImageRepository imageRepository;
    private final FeedImageRepository feedImageRepository;
    private final S3UploadService s3UploadService;
    private final FeedCommentsRepository feedCommentsRepository;
    private final FeedLikeRepository feedLikeRepository;
    private final FeedMapper feedMapper;
    private final static String BASE_URI = "http://localhost:8080/feeds/";

    @Override
    public URI createFeed(FeedDto.Post post) throws IOException {
        Member findMember = methodFindByMemberId(post.getMemberId());
        Feed createFeed = Feed.builder()
                .content(post.getContent())
                .member(findMember)
                .build();
        Feed saveFeed = feedRepository.save(createFeed);

        if (!post.getImages().isEmpty()) {
            for (MultipartFile multipartFile : post.getImages()) {
                String originalFilename = multipartFile.getOriginalFilename();
                String uploadFileURL = s3UploadService.saveFile(multipartFile);
                saveImage(createFeed, originalFilename, uploadFileURL);
            }
        }

        return saveFeed.getShareURI(BASE_URI);
    }

    @Override
    public FeedDto.Response getFeed(long feedId, long memberId) {
        Feed findFeed = methodFindByFeedId(feedId);
        FeedDto.Response response = feedMapper.FeedToFeedDtoResponse(findFeed);
        List<FeedCommentDto> feedCommentDtoList = methodFindFeedCommentByFeedId(feedId);
        if (!feedCommentDtoList.isEmpty()) {
            response.setFeedComments(feedCommentDtoList);
        }
        response.setMemberId(findFeed.getMember().getMemberId());
        response.setImages(feedImageToImageDtoList(findFeed.getFeedImageList()));
        response.setLike(feedLikesByMember(findFeed, methodFindByMemberId(memberId)));
        response.setShareURL(findFeed.getShareURI(BASE_URI).toString());

        return response;
    }

    @Override
    public void deleteFeed(long feedId, long memberId) {
        Feed findFeed = methodFindByFeedId(feedId);
        if (findFeed.getMember().getMemberId() == memberId) {
            for (FeedImage feedImage : findFeed.getFeedImageList()) {
                s3UploadService.deleteImage(feedImage.getImage().getOriginalFilename());
            }
            feedRepository.delete(findFeed);
        }else
            throw new IllegalArgumentException("삭제할 권한이 없습니다.");
    }


    @Override
    public void saveImage(Feed feed, String originalFilename, String uploadFileURL) {
        Image image = Image.builder()
                .originalFilename(originalFilename)
                .uploadFileURL(uploadFileURL)
                .build();
        Image saveImage = imageRepository.save(image);
        FeedImage feedImage = FeedImage.builder()
                .feed(feed)
                .image(saveImage)
                .build();

        feedImageRepository.save(feedImage);
    }

    @Override
    public FeedDto.Like likeByMember(long feedId, long memberId) {
        Feed findFeed = methodFindByFeedId(feedId);
        Member findMember = methodFindByMemberId(memberId);
        Optional<FeedLike> optionalFeedLike = feedLikeRepository.findByMemberAndFeed(findMember,
                findFeed);
        FeedLike feedLike;
        if (optionalFeedLike.isEmpty()) {
            feedLike = FeedLike.builder()
                    .feed(findFeed)
                    .member(findMember)
                    .build();
            findFeed.likeCount(true);
        } else {
            feedLike = optionalFeedLike.get();
            feedLike.updateIsLike();
            findFeed.likeCount(feedLike.isLike());
        }
        FeedLike savedFeedLike = feedLikeRepository.save(feedLike);
        Feed savedFeed = feedRepository.save(findFeed);

        FeedDto.Like like = FeedDto.Like.builder()
                .likeCount(savedFeed.getLikes())
                .isLike(savedFeedLike.isLike())
                .build();
        return like;
    }

    //----------------------------------------------------------------------

    public Member methodFindByMemberId(long memberId) {
        return memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    public Feed methodFindByFeedId(long feedId) {
        return feedRepository.findById(feedId).orElseThrow(
                () -> new RuntimeException("피드를 찾을 수 없습니다."));
    }

    public List<FeedCommentDto> methodFindFeedCommentByFeedId(long feedId) {
        return feedCommentsRepository.findByFeedFeedId(feedId)
                .map(feedCommentsList -> {
                    List<FeedCommentDto> feedCommentDtoList = new ArrayList<>();
                    for (FeedComments feedComments : feedCommentsList) {
                        FeedCommentDto feedCommentDto = feedMapper.feedCommentsToFeedCommentDto(feedComments);
                        feedCommentDto.setMemberId(feedComments.getMember().getMemberId());
                        feedCommentDtoList.add(feedCommentDto);
                    }
                    return feedCommentDtoList;
                })
                .orElseGet(Collections::emptyList);
    }

    public List<ImageDto> feedImageToImageDtoList(List<FeedImage> feedImageList) {
        List<ImageDto> imageDtoList = new ArrayList<>();
        for (FeedImage feedImage : feedImageList) {
            Image image = feedImage.getImage();
            imageDtoList.add(feedMapper.imageToImageDto(image));
        }
        return imageDtoList;
    }

    public boolean feedLikesByMember(Feed feed, Member member) {
        Optional<FeedLike> feedLike = feedLikeRepository.findByMemberAndFeed(member, feed);
        return feedLike.map(FeedLike::isLike).orElse(false);
    }


}
