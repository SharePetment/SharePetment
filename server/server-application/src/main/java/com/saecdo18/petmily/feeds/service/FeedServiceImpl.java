package com.saecdo18.petmily.feeds.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feeds.dto.FeedDto;
import com.saecdo18.petmily.feeds.entity.Feed;
import com.saecdo18.petmily.feeds.entity.FeedImage;
import com.saecdo18.petmily.feeds.repository.FeedImageRepository;
import com.saecdo18.petmily.feeds.repository.FeedRepository;
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

@Service
@Transactional
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {

    private final FeedRepository feedRepository;
    private final MemberRepository memberRepository;
    private final ImageRepository imageRepository;
    private final FeedImageRepository feedImageRepository;
    private final S3UploadService s3UploadService;
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
                methodSaveImage(createFeed, originalFilename, uploadFileURL);
            }
        }

        return saveFeed.getShareURI(BASE_URI);
    }

    @Override
    public FeedDto.Response getFeed(long feedId) {
        return null;
    }


    @Override
    public void methodSaveImage(Feed feed, String originalFilename, String uploadFileURL) {
        Image image = Image.builder()
                .originalFileName(originalFilename)
                .uploadFileURL(uploadFileURL)
                .build();
        Image saveImage = imageRepository.save(image);
        FeedImage feedImage = FeedImage.builder()
                .feed(feed)
                .image(saveImage)
                .build();

        feedImageRepository.save(feedImage);
    }

    public Member methodFindByMemberId(long memberId) {
        return memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

}
