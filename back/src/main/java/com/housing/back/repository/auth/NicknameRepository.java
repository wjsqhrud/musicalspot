package com.housing.back.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.housing.back.entity.auth.NickNameEntity;
import com.housing.back.entity.auth.UserEntity;

import java.util.Optional;


@Repository
public interface NicknameRepository extends JpaRepository<NickNameEntity, Long> {
    boolean existsByNickname(String nickname);
    Optional<NickNameEntity> findByUser(UserEntity user);
    Optional<NickNameEntity> findByNickname(String nickname);

    @Transactional
    @Modifying
    void deleteByUser(UserEntity user); // 이 부분을 추가합니다.
    Optional<NickNameEntity> findByUserId(Long userId);
    
}