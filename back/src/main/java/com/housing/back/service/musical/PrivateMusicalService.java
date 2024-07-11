package com.housing.back.service.musical;

import com.housing.back.common.JwtUtils;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.entity.musical.MusicalEntity;
import com.housing.back.entity.musical.MusicalLikeEntity;
import com.housing.back.repository.auth.UserRepository;
import com.housing.back.repository.musical.MusicalLikeRepository;
import com.housing.back.repository.musical.MusicalRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PrivateMusicalService {

    private final MusicalRepository musicalRepository;
    private final MusicalLikeRepository musicalLikeRepository;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    
    public ResponseEntity<Boolean> hasUserLikedMusical(String authorizationHeader, Long musicalId) {
        String token = authorizationHeader.substring(7);
        String userId = jwtUtils.extractUserId(token);

        Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userId);
        UserEntity userEntity = userEntityOptional.get();

        MusicalEntity musicalEntity = musicalRepository.findById(musicalId)
                                                       .orElseThrow(() -> new IllegalArgumentException("Invalid musical ID"));

        boolean hasLiked = musicalLikeRepository.findByUserAndMusical(userEntity, musicalEntity).isPresent();
        return ResponseEntity.ok(hasLiked);
    }

    public ResponseEntity<?> toggleMusicalLike(String authorizationHeader, Long musicalId) {
        String token = authorizationHeader.substring(7);
        String userId = jwtUtils.extractUserId(token);

        Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userId);
        UserEntity userEntity = userEntityOptional.get();

        MusicalEntity musicalEntity = musicalRepository.findById(musicalId)
                                                       .orElseThrow(() -> new IllegalArgumentException("Invalid musical ID"));

        Optional<MusicalLikeEntity> musicalLikeEntityOptional = musicalLikeRepository.findByUserAndMusical(userEntity, musicalEntity);

        if (musicalLikeEntityOptional.isPresent()) {
            // 좋아요 누른 적이 있다면 좋아요 취소
            musicalLikeRepository.delete(musicalLikeEntityOptional.get());
            musicalEntity.setLikeCount(musicalEntity.getLikeCount() - 1);
        } else {
            // 좋아요 누른 적이 없다면 좋아요 추가
            MusicalLikeEntity musicalLikeEntity = new MusicalLikeEntity();
            musicalLikeEntity.setUser(userEntity);
            musicalLikeEntity.setMusical(musicalEntity);
            musicalLikeEntity.setLiked(true);
            musicalLikeRepository.save(musicalLikeEntity);
            musicalEntity.setLikeCount(musicalEntity.getLikeCount() + 1);
        }

        musicalRepository.save(musicalEntity);

        return ResponseEntity.ok().build();
    }

}
