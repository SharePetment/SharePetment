package com.saecdo18.serverapplication.walkmate.post.service;

import com.saecdo18.serverapplication.walkmate.post.entity.WalkMate;
import com.saecdo18.serverapplication.walkmate.post.repository.WalkMateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WalkMateService {

    private final WalkMateRepository walkMateRepository;

    public WalkMateService(WalkMateRepository walkMateRepository) {
        this.walkMateRepository = walkMateRepository;
    }

    public WalkMate createWalk(WalkMate walkMate){

        return walkMateRepository.save(walkMate);
    }

    public WalkMate findWalk(long walkMateId){

        Optional<WalkMate> optionalWalkMate = walkMateRepository.findById(walkMateId);
        WalkMate findWalk = optionalWalkMate.orElseThrow();

        return findWalk;
    }

    public List<WalkMate> findWalks(){

        return walkMateRepository.findAll();
    }

    public void deleteWalk(long walkMateId){

        Optional<WalkMate> optionalWalkMate = walkMateRepository.findById(walkMateId);
        WalkMate findWalk = optionalWalkMate.orElseThrow();

        walkMateRepository.delete(findWalk);
    }
}
