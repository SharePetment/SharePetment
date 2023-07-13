package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.dto.FeedDtoList;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedComments;
import com.saecdo18.petmily.feed.entity.FeedImage;
import com.saecdo18.petmily.feed.entity.FeedLike;
import com.saecdo18.petmily.feed.mapper.FeedMapper;
import com.saecdo18.petmily.feed.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feed.repository.FeedImageRepository;
import com.saecdo18.petmily.feed.repository.FeedLikeRepository;
import com.saecdo18.petmily.feed.repository.FeedRepository;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.FollowMemberRepository;
import com.saecdo18.petmily.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {

    private final FeedRepository feedRepository;
    private final MemberRepository memberRepository;
    private final FollowMemberRepository followMemberRepository;
    private final ImageRepository imageRepository;
    private final FeedImageRepository feedImageRepository;
    private final S3UploadService s3UploadService;
    private final FeedCommentsRepository feedCommentsRepository;
    private final FeedLikeRepository feedLikeRepository;
    private final FeedMapper feedMapper;
    private final static String BASE_URI = "http://43.202.86.53:8080/feeds/all/";

    @Override
    public FeedDto.Response createFeed(FeedDto.Post post) throws IOException {
        Member findMember = methodFindByMemberId(post.getMemberId());
        Feed createFeed = Feed.builder()
                .content(post.getContent())
                .member(findMember)
                .build();

        if (!post.getImages().isEmpty()) {
            for (MultipartFile multipartFile : post.getImages()) {
                String originalFilename = multipartFile.getOriginalFilename()+ UUID.randomUUID();
                String uploadFileURL = s3UploadService.saveFile(multipartFile, originalFilename);
                saveImage(createFeed, originalFilename, uploadFileURL);
            }
        }
        Feed saveFeed = feedRepository.save(createFeed);

        findMember.upCountFeed(); // 피드 생성시 해당 멤버 feedCount 증가

        return getFeed(saveFeed.getFeedId(), findMember.getMemberId());
    }

    @Override
    public FeedDto.Response getFeed(long feedId, long memberId) {
        Feed findFeed = methodFindByFeedId(feedId);
        return changeFeedToFeedDtoResponse(findFeed, memberId);
    }

    @Override
    public FeedDtoList getFeedsRecent(FeedDto.PreviousListIds listIds, long memberId) {
        int newDataCount = 10;
        PageRequest pageRequest = PageRequest.of(0, newDataCount, Sort.by(Sort.Direction.DESC, "createdAt"));

        List<Feed> feedList = new ArrayList<>();
        int page = 0;
        long totalCount = feedRepository.count();

        while (feedList.size() < newDataCount) {
            List<Feed> pageDataList = feedRepository.findAll(pageRequest).getContent();
            List<Feed> filteredDataList;
            if (memberId == 0) {
                filteredDataList = pageDataList.stream()
                        .filter(data -> !listIds.getPreviousListIds().contains(data.getFeedId()))
                        .collect(Collectors.toList());
            } else {
                filteredDataList = pageDataList.stream()
                        .filter(data -> !listIds.getPreviousListIds().contains(data.getFeedId()))
                        .filter(data -> data.getMember().getMemberId() != memberId)
                        .collect(Collectors.toList());
            }
            feedList.addAll(filteredDataList);

            page++;

            if((long) page * newDataCount >= totalCount)
                break;

            pageRequest = PageRequest.of(0, newDataCount, Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        return changeFeedListToFeedResponseDto(feedList);
    }

    @Override
    public FeedDtoList getFeedsByMember(int page, int size, long memberId) {
        Member findMember = methodFindByMemberId(memberId);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Feed> feedPage = feedRepository.findAllByMemberOrderByCreatedAtDesc(findMember, pageRequest);
        List<Feed> feedList = feedPage.getContent();

        return changeFeedListToFeedResponseDto(feedList);
    }

    @Override
    public FeedDtoList getFeedsByMemberFollow(long memberId, FeedDto.PreviousListIds listIds) {
        List<FollowMember> followMemberList = followMemberRepository.findByFollowingId(memberId)
                .orElseThrow(() -> new RuntimeException("팔로우한 멤버가 없습니다."));

        Set<Feed> feedSet = new HashSet<>();
        int dataCount = 20;
        int totalFeedCount = 0;

        while (feedSet.size() < dataCount && totalFeedCount < dataCount) {
            boolean added = false;
            for (FollowMember followMember : followMemberList) {
                PageRequest pageRequest = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "createdAt"));
                List<Feed> memberFeedList = feedRepository
                        .findAllByMemberOrderByCreatedAtDesc(followMember.getFollowerMember(), pageRequest)
                        .getContent();
                for (Feed feed : memberFeedList) {
                    if (!feedSet.contains(feed)) {
                        feedSet.add(feed);
                        totalFeedCount++;
                        added = true;
                    }
                }
            }
            feedSet = new HashSet<>(filterFeedsByPreviousListIds(new ArrayList<>(feedSet), listIds));
            if (!added) {
                break;
            }
        }

        List<Feed> feedList = new ArrayList<>(feedSet);

        Collections.shuffle(feedList);

        return changeFeedListToFeedResponseDto(feedList);
    }

    private List<Feed> filterFeedsByPreviousListIds(List<Feed> feedList, FeedDto.PreviousListIds listIds) {
        List<Feed> filterFeeds = new ArrayList<>();
        for (Feed feed : feedList) {
            if (!listIds.getPreviousListIds().contains(feed.getFeedId())) {
                filterFeeds.add(feed);
            }
        }
        return filterFeeds;
    }

    @Override
    public FeedDto.Response patchFeed(FeedDto.Patch patch) throws IOException {
        Feed findFeed = methodFindByFeedId(patch.getFeedId());
        findFeed.updateContent(patch.getContent());
        if(!patch.getMemberId().equals(findFeed.getMember().getMemberId()))
            throw new IllegalArgumentException("수정할 권한이 없습니다.");

        if (!patch.getAddImages().isEmpty()) {
            for (MultipartFile multipartFile : patch.getAddImages()) {
                String originalFilename = multipartFile.getOriginalFilename()+ UUID.randomUUID();
                String uploadFileURL = s3UploadService.saveFile(multipartFile,originalFilename);
                saveImage(findFeed, originalFilename, uploadFileURL);
            }
        }
        if (!patch.getDeleteImages().isEmpty()) {
            for (String originalFilename : patch.getDeleteImages()) {
                for (FeedImage feedImage : findFeed.getFeedImageList()) {
                    if (originalFilename.equals(feedImage.getImage().getOriginalFilename())) {
                        System.out.println(originalFilename+"!!!!!!!!!!!!!!"+feedImage.getImage().getOriginalFilename());
                        s3UploadService.deleteImage(feedImage.getImage().getOriginalFilename());
                        feedImageRepository.delete(feedImage);
                    }
                }
            }
        }

        return changeFeedToFeedDtoResponse(findFeed, patch.getMemberId());
    }

    @Override
    public void deleteFeed(long feedId, long memberId) {
        Feed findFeed = methodFindByFeedId(feedId);
        if (findFeed.getMember().getMemberId() == memberId) {
            Member findMember = methodFindByMemberId(memberId);
            findMember.downCountFeed();      // 피드 삭제시 멤버의 피드카운트 삭감

            for (FeedImage feedImage : findFeed.getFeedImageList()) {
                s3UploadService.deleteImage(feedImage.getImage().getOriginalFilename());
            }
            feedRepository.delete(findFeed);
            feedRepository.flush();
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

        return FeedDto.Like.builder()
                .likeCount(savedFeed.getLikes())
                .isLike(savedFeedLike.isLike())
                .build();
    }

    //----------------------------------------------------------------------

    private Member methodFindByMemberId(long memberId) {
        return memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    private Feed methodFindByFeedId(long feedId) {
        return feedRepository.findById(feedId).orElseThrow(
                () -> new RuntimeException("피드를 찾을 수 없습니다."));
    }

    private List<FeedCommentDto.Response> methodFindFeedCommentByFeedId(long feedId) {
        return feedCommentsRepository.findByFeedFeedId(feedId)
                .map(feedCommentsList -> {
                    List<FeedCommentDto.Response> feedCommentDtoList = new ArrayList<>();
                    for (FeedComments feedComments : feedCommentsList) {
                        FeedCommentDto.Response response = feedMapper.feedCommentsToFeedCommentDto(feedComments);
                        response.setMemberInfo(memberIdToMemberInfoDto(feedComments.getMember().getMemberId()));
                        feedCommentDtoList.add(response);
                    }
                    return feedCommentDtoList;
                })
                .orElseGet(Collections::emptyList);
    }

    private MemberDto.Info memberIdToMemberInfoDto(long memberId) {
        Member findMember = memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다.")
        );

        return MemberDto.Info.builder()
                .memberId(findMember.getMemberId())
                .imageURL(findMember.getImageURL())
                .nickname(findMember.getNickname())
                .build();
    }


    private List<ImageDto> feedImageToImageDtoList(List<FeedImage> feedImageList) {
        List<ImageDto> imageDtoList = new ArrayList<>();
        for (FeedImage feedImage : feedImageList) {
            Image image = feedImage.getImage();
            imageDtoList.add(feedMapper.imageToImageDto(image));
        }
        return imageDtoList;
    }

    private boolean feedLikesByMember(Feed feed, Member member) {
        Optional<FeedLike> feedLike = feedLikeRepository.findByMemberAndFeed(member, feed);
        return feedLike.map(FeedLike::isLike).orElse(false);
    }

    private FeedDto.Response changeFeedToFeedDtoResponse(Feed feed, long memberId) {
        FeedDto.Response response = feedMapper.FeedToFeedDtoResponse(feed);
        List<FeedCommentDto.Response> feedCommentDtoList = methodFindFeedCommentByFeedId(feed.getFeedId());
        if (!feedCommentDtoList.isEmpty()) {
            response.setFeedComments(feedCommentDtoList);
        }
        response.setMemberInfo(memberIdToMemberInfoDto(feed.getMember().getMemberId()));
        List<FeedImage> feedImageList = feedImageRepository.findByFeed(feed);
        response.setImages(feedImageToImageDtoList(feedImageList));
        if (memberId == 0) {
            response.setLike(false);
        } else {
            response.setLike(feedLikesByMember(feed, methodFindByMemberId(memberId)));
        }
        response.setShareURL(feed.getShareURI(BASE_URI).toString()+"/0");

        return response;
    }

    private FeedDtoList changeFeedListToFeedResponseDto(List<Feed> feedList) {
        List<FeedDto.Response> responseList = new ArrayList<>();
        for (Feed feed : feedList) {
            FeedDto.Response response = changeFeedToFeedDtoResponse(feed, 0);
            responseList.add(response);
        }


        return FeedDtoList.builder()
                .responseList(responseList)
                .build();
    }
}
