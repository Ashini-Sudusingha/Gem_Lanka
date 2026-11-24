package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.ActiveState;
import hibernate.BusinessCat;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.Position;
import hibernate.Store;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

@MultipartConfig
@WebServlet(name = "CreateStore", urlPatterns = {"/CreateStore"})
public class CreateStore extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        String businessName = request.getParameter("bussName") != null ? request.getParameter("bussName").trim() : "";
        String bussinessemail = request.getParameter("email") != null ? request.getParameter("email").trim() : "";
        String mobile = request.getParameter("mobile") != null ? request.getParameter("mobile").trim() : "";
        String categoryId = request.getParameter("categoryId") != null ? request.getParameter("categoryId").trim() : "0";
        String positionId = request.getParameter("positionId") != null ? request.getParameter("positionId").trim() : "0";
        String password = request.getParameter("password") != null ? request.getParameter("password") : "";
        String comfirmPassword = request.getParameter("comfirmPassword") != null ? request.getParameter("comfirmPassword") : "";

        // New Gem Merchant / Store Fields
        String ngjaLicenseNo = request.getParameter("ngjaLicenseNo") != null ? request.getParameter("ngjaLicenseNo").trim() : "";
        String brNumber = request.getParameter("brNumber") != null ? request.getParameter("brNumber").trim() : "";
        String nic = request.getParameter("nic") != null ? request.getParameter("nic").trim() : "";
        String address = request.getParameter("address") != null ? request.getParameter("address").trim() : "";
        String cityId = request.getParameter("cityId") != null ? request.getParameter("cityId").trim() : "0";
        String bankName = request.getParameter("bankName") != null ? request.getParameter("bankName").trim() : "";
        String bankBranch = request.getParameter("bankBranch") != null ? request.getParameter("bankBranch").trim() : "";
        String accountNo = request.getParameter("accountNo") != null ? request.getParameter("accountNo").trim() : "";
        String accountHolder = request.getParameter("accountHolder") != null ? request.getParameter("accountHolder").trim() : "";

        Part part1 = null;
        try {
            part1 = request.getPart("liseImage");
        } catch (Exception e) {
            // No file uploaded or non-multipart request
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseObject.addProperty("message", "Please sign in to register your gem store!");
            response.getWriter().write(new Gson().toJson(responseObject));
            return;
        }

        // Validation
        if (businessName.isEmpty()) {
            responseObject.addProperty("message", "Business Name cannot be empty!");
        } else if (bussinessemail.isEmpty()) {
            responseObject.addProperty("message", "Business Email cannot be empty!");
        } else if (!Util.isEmailValid(bussinessemail)) {
            responseObject.addProperty("message", "Invalid Business Email format!");
        } else if (mobile.isEmpty()) {
            responseObject.addProperty("message", "Business Mobile cannot be empty!");
        } else if (!Util.isMobileValid(mobile)) {
            responseObject.addProperty("message", "Invalid Mobile number!");
        } else if (!Util.isInteger(categoryId) || Integer.parseInt(categoryId) == 0) {
            responseObject.addProperty("message", "Please select a Business Category!");
        } else if (!Util.isInteger(positionId) || Integer.parseInt(positionId) == 0) {
            responseObject.addProperty("message", "Please select your Position in the business!");
        } else if (ngjaLicenseNo.isEmpty()) {
            responseObject.addProperty("message", "NGJA Dealer License Number is required for gemstone trading!");
        } else if (nic.isEmpty()) {
            responseObject.addProperty("message", "Owner National ID (NIC / Passport) is required!");
        } else if (address.isEmpty()) {
            responseObject.addProperty("message", "Physical shop or office address is required!");
        } else if (!password.isEmpty() && !Util.isPasswordValid(password)) {
            responseObject.addProperty("message", "Password must contain uppercase, lowercase, number, special character and min 8 characters!");
        } else if (!password.isEmpty() && !password.equals(comfirmPassword)) {
            responseObject.addProperty("message", "Confirmed password does not match the entered password!");
        } else {
            Session s = null;
            Transaction tx = null;
            try {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                s = sf.openSession();
                tx = s.beginTransaction();

                BusinessCat busicat = (BusinessCat) s.get(BusinessCat.class, Integer.parseInt(categoryId));
                Position posi = (Position) s.get(Position.class, Integer.parseInt(positionId));

                if (busicat == null) {
                    responseObject.addProperty("message", "Selected Business Category is invalid!");
                } else if (posi == null) {
                    responseObject.addProperty("message", "Selected Position is invalid!");
                } else {
                    City city = null;
                    if (Util.isInteger(cityId) && Integer.parseInt(cityId) > 0) {
                        city = (City) s.get(City.class, Integer.parseInt(cityId));
                    }

                    User user = (User) session.getAttribute("user");
                    ActiveState as = (ActiveState) s.get(ActiveState.class, 1);
                    if (as == null) {
                        as = new ActiveState();
                        as.setId(1);
                        as.setState("Active");
                    }

                    Store st = new Store();
                    st.setName(businessName);
                    st.setEmail(bussinessemail);
                    st.setMobile(mobile);
                    st.setNgja_license_no(ngjaLicenseNo);
                    st.setBr_number(brNumber);
                    st.setNic(nic);
                    st.setAddress(address);
                    st.setCity(city);
                    st.setBank_name(bankName);
                    st.setBank_branch(bankBranch);
                    st.setAccount_no(accountNo);
                    st.setAccount_holder(accountHolder);
                    st.setVerification_status("PENDING");
                    st.setBusinessCat(busicat);
                    st.setPosition(posi);
                    st.setUser(user);
                    st.setActiveState(as);
                    st.setCreated_at(new Date());
                    if (!password.isEmpty()) {
                        st.setPassword(password);
                    }

                    int id = (int) s.save(st);

                    // Save License File
                    if (part1 != null && part1.getSubmittedFileName() != null && !part1.getSubmittedFileName().isEmpty()) {
                        String primaryPath = "D:" + File.separator + "XamppNewFolder" + File.separator + "htdocs" + File.separator + "jemLanka" + File.separator + "license";
                        File targetDir = new File(primaryPath, String.valueOf(id));
                        if (!targetDir.exists()) {
                            targetDir.mkdirs();
                        }
                        String ext = part1.getSubmittedFileName().contains(".") ? part1.getSubmittedFileName().substring(part1.getSubmittedFileName().lastIndexOf(".")) : ".pdf";
                        File targetFile = new File(targetDir, "license_doc" + ext);
                        Files.copy(part1.getInputStream(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

                        st.setLicense("license/" + id + "/license_doc" + ext);
                        s.update(st);
                    } else {
                        st.setLicense("NGJA-" + ngjaLicenseNo);
                        s.update(st);
                    }

                    tx.commit();
                    session.setAttribute("store", st);

                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Store registered successfully! Your store is under verification by JemLanka.");
                }
            } catch (Exception ex) {
                if (tx != null) {
                    try { tx.rollback(); } catch (Exception ignored) {}
                }
                ex.printStackTrace();
                responseObject.addProperty("message", "Database error: " + ex.getMessage());
            } finally {
                if (s != null && s.isOpen()) {
                    s.close();
                }
            }
        }

        response.getWriter().write(new Gson().toJson(responseObject));
    }
}
