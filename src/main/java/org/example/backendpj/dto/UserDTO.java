package org.example.backendpj.dto;

public class UserDTO {
    public Integer customerId;
    public String fullName;
    public String gender;
    public String dateOfBirth;
    public String phoneNumber;
    public String email;

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
}
