package com.flowx.server.services;

import com.flowx.server.models.User;
import com.flowx.server.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //signin method
    public String signin(String email, String password) {
        User user = userRepository.findByUserEmail(email);
        if (user != null) {
            if (user.getPassword().equals(password)) {
                return "User with email " + email + " signed in successfully.";
            } else {
                return "Incorrect password.";
            }
        } else {
            return "User with email " + email + " not found.";
        }
    }

    //signup method
    public String signup(User user) {
        //check if the user already exists
        if (userRepository.existsById(user.getEmail())) {
            return "User with email " + user.getEmail() + " already exists.";
        }

        //check if the id is null
        if (user.getId() == null) {
            return "User id cannot be null.";
        }

        //check if the id has a length of 12
        if (user.getId().length() != 12) {
            return "User id must be 12 characters long.";
        }

        //check if the user name is null
        if (user.getName() == null) {
            return "User name cannot be null.";
        }

        //check if the user address is null
        if (user.getAddress() == null) {
            return "User address cannot be null.";
        }

        //check if the user phone is null
        if (user.getPhone() == null) {
            return "User phone cannot be null.";
        }

        //check if the user phone has a length of 10
        if (user.getPhone().length() != 10) {
            return "User phone must be 10 characters long.";
        }

        //check if the user division is null
        if (user.getDivision() == null) {
            return "User division cannot be null.";
        }

        //check if the user division code is null
        if (user.getDivisionCode() == null) {
            return "User division code cannot be null.";
        }

        //check if the user password is null
        if (user.getPassword() == null) {
            return "User password cannot be null.";
        }

        //check if the user password and confirm password is null
        if (user.getPassword() == null || user.getConfirmPassword() == null) {
            return "User password and confirm password cannot be null.";
        }

        //check if the user password and confirm password match
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            return "User password and confirm password do not match.";
        }

        //save the user
        userRepository.save(user);
        return "User with email " + user.getEmail() + " signed up successfully.";
    }

    //update method
    public String update(String email, User user) {
        User existingUser = userRepository.findByUserEmail(email);
        if (existingUser != null) {
            //check if the user name is null
            if (user.getName() != null) {
                existingUser.setName(user.getName());
            }

            //check if the user address is null
            if (user.getAddress() != null) {
                existingUser.setAddress(user.getAddress());
            }

            //check if the user phone is null
            if (user.getPhone() != null) {
                existingUser.setPhone(user.getPhone());
            }

            //check if the user division is null
            if (user.getDivision() != null) {
                existingUser.setDivision(user.getDivision());
            }

            //check if the user division code is null
            if (user.getDivisionCode() != null) {
                existingUser.setDivisionCode(user.getDivisionCode());
            }

            //check if the user password and confirm password is null
            if (user.getPassword() != null && user.getConfirmPassword() != null) {
                //check if the user password and confirm password match
                if (user.getPassword().equals(user.getConfirmPassword())) {
                    existingUser.setPassword(user.getPassword());
                } else {
                    return "User password and confirm password do not match.";
                }
            }

            //save the updated user
            userRepository.save(existingUser);
            return "User with email " + email + " updated successfully.";
        } else {
            return "User with email " + email + " not found.";
        }
    }
}
