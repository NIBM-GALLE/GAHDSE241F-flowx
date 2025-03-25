package com.flowx.server.repositories;

import com.flowx.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByUserEmail(String email);
}
