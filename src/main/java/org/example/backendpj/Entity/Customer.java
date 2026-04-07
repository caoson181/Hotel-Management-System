package org.example.backendpj.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "member_level", length = 50)
    private String memberLevel;

    @Column(name = "customer_rank", length = 50)
    private String customerRank;

    @Column(name = "tier_upgrade_pending")
    private Boolean tierUpgradePending;

    public Customer() {
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMemberLevel() {
        return memberLevel;
    }

    public void setMemberLevel(String memberLevel) {
        this.memberLevel = memberLevel;
    }

    public String getCustomerRank() {
        return customerRank;
    }

    public void setCustomerRank(String customerRank) {
        this.customerRank = customerRank;
    }

    public boolean isTierUpgradePending() {
        return Boolean.TRUE.equals(tierUpgradePending);
    }

    public Boolean getTierUpgradePending() {
        return tierUpgradePending;
    }

    public void setTierUpgradePending(boolean tierUpgradePending) {
        this.tierUpgradePending = tierUpgradePending;
    }

}
