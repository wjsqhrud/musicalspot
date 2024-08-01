package com.housing.back.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.housing.back.entity.auth.VerificationCodeEntity;

import jakarta.transaction.Transactional;


@Repository
public interface CertificationRepository extends JpaRepository<VerificationCodeEntity, Long>{
    
    VerificationCodeEntity findByUserId(String userId);

    @Transactional
    void deleteByUserId(String userId);

    @Transactional
    void deleteByUserIdAndEmail(String userId, String email);
}
