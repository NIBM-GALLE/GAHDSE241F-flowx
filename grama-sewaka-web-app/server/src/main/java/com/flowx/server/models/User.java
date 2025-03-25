package com.flowx.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;

    private String name;

    private String address;

    private String phone;

    private String division;
    private String divisionCode;

    private String email;

    @JsonIgnore
    private String password;

    private String confirmPassword;

    public User(String name, String address, String phone, String division, String divisionCode, String email, String password) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.division = division;
        this.divisionCode = divisionCode;
        this.email = email;
        this.password = password;
    }

    public User(String name, String address, String phone, String division, String divisionCode, String email, String password, String confirmPassword) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.division = division;
        this.divisionCode = divisionCode;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    public User() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getDivisionCode() {
        return divisionCode;
    }

    public void setDivisionCode(String divisionCode) {
        this.divisionCode = divisionCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
