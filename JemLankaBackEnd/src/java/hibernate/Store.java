package hibernate;

import controller.*;
import hibernate.ActiveState;
import hibernate.BusinessCat;
import hibernate.City;
import hibernate.Position;
import hibernate.User;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

@Entity
@Table(name = "store")
public class Store implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name", nullable = false, length = 45)
    private String name;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "mobile", nullable = false, length = 10)
    private String mobile;

    @Column(name = "license", length = 255)
    private String license;

    @Column(name = "ngja_license_no", length = 50)
    private String ngja_license_no;

    @Column(name = "br_number", length = 50)
    private String br_number;

    @Column(name = "nic", length = 20)
    private String nic;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @Column(name = "bank_name", length = 100)
    private String bank_name;

    @Column(name = "bank_branch", length = 100)
    private String bank_branch;

    @Column(name = "account_no", length = 50)
    private String account_no;

    @Column(name = "account_holder", length = 100)
    private String account_holder;

    @Column(name = "verification_status", length = 20)
    private String verification_status = "PENDING";

    @ManyToOne
    @JoinColumn(name = "bussiness_cat_id")
    private BusinessCat businessCat;

    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date created_at;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "active_id")
    private ActiveState activeState;

    @Column(name = "otp", length = 10)
    private String otp;
    
    @Column(name = "password", length = 20)
    private String password;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getLicense() {
        return license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getNgja_license_no() {
        return ngja_license_no;
    }

    public void setNgja_license_no(String ngja_license_no) {
        this.ngja_license_no = ngja_license_no;
    }

    public String getBr_number() {
        return br_number;
    }

    public void setBr_number(String br_number) {
        this.br_number = br_number;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public String getBank_name() {
        return bank_name;
    }

    public void setBank_name(String bank_name) {
        this.bank_name = bank_name;
    }

    public String getBank_branch() {
        return bank_branch;
    }

    public void setBank_branch(String bank_branch) {
        this.bank_branch = bank_branch;
    }

    public String getAccount_no() {
        return account_no;
    }

    public void setAccount_no(String account_no) {
        this.account_no = account_no;
    }

    public String getAccount_holder() {
        return account_holder;
    }

    public void setAccount_holder(String account_holder) {
        this.account_holder = account_holder;
    }

    public String getVerification_status() {
        return verification_status;
    }

    public void setVerification_status(String verification_status) {
        this.verification_status = verification_status;
    }

    public BusinessCat getBusinessCat() {
        return businessCat;
    }

    public void setBusinessCat(BusinessCat businessCat) {
        this.businessCat = businessCat;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ActiveState getActiveState() {
        return activeState;
    }

    public void setActiveState(ActiveState activeState) {
        this.activeState = activeState;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
