package com.housing.back.service.musical;

import com.housing.back.common.JwtUtils;
import com.housing.back.common.TestResponseMessage;
import com.housing.back.dto.response.TestResponseDto;
import com.housing.back.entity.auth.UserEntity;
import com.housing.back.entity.musical.MusicalEntity;
import com.housing.back.entity.musical.MusicalLikeEntity;
import com.housing.back.exception.CustomDatabaseException;
import com.housing.back.repository.auth.UserRepository;
import com.housing.back.repository.musical.MusicalLikeRepository;
import com.housing.back.repository.musical.MusicalRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.dao.DataAccessException;
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
    
    public ResponseEntity<TestResponseDto> hasUserLikedMusical(HttpServletRequest request, Long musicalId) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return TestResponseDto.unAuthorized();
            }
            token = token.substring(7);
            
            String username = jwtUtils.extractUserId(token);

            Optional<UserEntity> userEntityOptional = userRepository.findByUserId(username);
            if(!userEntityOptional.isPresent()){
                return TestResponseDto.userNotFound();
            }        
            UserEntity userEntity = userEntityOptional.get();

            Optional<MusicalEntity> optionalMusical = musicalRepository.findById(musicalId);
            if (!optionalMusical.isPresent()) {
                return TestResponseDto.notFound();
            }
            MusicalEntity musicalEntity = optionalMusical.get();

            boolean hasLiked = musicalLikeRepository.findByUserAndMusical(userEntity, musicalEntity).isPresent();
            return TestResponseDto.success(hasLiked);
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }

    // 좋아요 토글 메서드
    public ResponseEntity<TestResponseDto> toggleMusicalLike(HttpServletRequest request, Long musicalId) {
        try {
            String token = request.getHeader("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return TestResponseDto.unAuthorized();
            }
            token = token.substring(7);

            String userName = jwtUtils.extractUserId(token);

            Optional<UserEntity> userEntityOptional = userRepository.findByUserId(userName);
            if (!userEntityOptional.isPresent()) {
                return TestResponseDto.userNotFound();
            }
            UserEntity userEntity = userEntityOptional.get();

            Optional<MusicalEntity> optionalMusical = musicalRepository.findById(musicalId);
            if (!optionalMusical.isPresent()) {
                return TestResponseDto.userNotFound();
            }
            MusicalEntity musicalEntity = optionalMusical.get();

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
            return TestResponseDto.success();
        } catch (DataAccessException e) {
            throw new CustomDatabaseException(TestResponseMessage.DATABASE_ERROR.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(TestResponseMessage.GENERAL_ERROR.getMessage(), e);
        }
    }
}
