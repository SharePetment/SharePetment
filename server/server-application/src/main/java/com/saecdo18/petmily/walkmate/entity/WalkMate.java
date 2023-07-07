package com.saecdo18.petmily.walkmate.entity;

import com.saecdo18.petmily.feed.entity.BaseEntity;
import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
public class WalkMate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walkMatePostId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String mapURL;

    @Column
    private String chatURL;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String time;

    @Column
    private Boolean open;

    @Column(nullable = false)
    private Integer maximum;

    @Column
    private Integer likeCount;

    @OneToMany(mappedBy = "walkMate", cascade = CascadeType.REMOVE)
    private List<WalkMateComment> comments;

//    fetch = FetchType.EAGER

    @Builder
    public WalkMate(Member member, String title, String content, String mapURL, String chatURL,
                    String location, String time, Boolean open, Integer maximum, Integer likeCount) {

        this.member = member;
        this.title = title;
        this.content = content;
        this.mapURL = mapURL;
        this.chatURL = chatURL;
        this.location = location;
        this.time = time;
        this.open = open;
        this.maximum = maximum;
        this.likeCount = likeCount;
    }

    public void updateWalk(String title, String content, String mapURL, String chatURL, String location,
                           String time, Boolean open, Integer maximum) {

        this.title = title;
        this.content = content;
        this.mapURL = mapURL;
        this.chatURL = chatURL;
        this.location = location;
        this.time = time;
        this.open = open;
        this.maximum = maximum;
    }

    public void setMember(Member member){
        this.member=member;
    }
    public void setComments(List<WalkMateComment> comments){
        this.comments=comments;
    }

    public void likeCount(boolean like){
        if (like)
            likeCount++;
        else
            likeCount--;
    }
}