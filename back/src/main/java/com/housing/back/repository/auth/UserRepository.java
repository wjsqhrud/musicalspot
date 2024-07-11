package com.housing.back.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.housing.back.entity.auth.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long>{

    boolean existsByUserId(String userId);

    Optional<UserEntity> findByUserId(String userId);
    
}