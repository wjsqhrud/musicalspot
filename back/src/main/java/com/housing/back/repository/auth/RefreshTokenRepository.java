package com.housing.back.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.housing.back.entity.auth.RefreshTokenEntity;
import com.housing.back.entity.auth.UserEntity;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.Date;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {    

    RefreshTokenEntity findByToken(String token);
    
  
    void deleteByToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshTokenEntity r WHERE r.user = :user AND r.deviceInfo = :deviceInfo AND r.ipAddress = :ipAddress AND r.expiryDate < :expiryDate")
    int deleteExpiredTokens(@Param("user") UserEntity user, @Param("deviceInfo") String deviceInfo, @Param("ipAddress") String ipAddress, @Param("expiryDate") Date expiryDate);


    @Transactional
    void deleteByUser(UserEntity user);
}
