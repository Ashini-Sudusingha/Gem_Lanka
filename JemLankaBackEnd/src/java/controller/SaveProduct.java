package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.ActiveState;
import hibernate.Category;
import hibernate.Clarity;
import hibernate.Color;
import hibernate.Country;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Shape;
import hibernate.States;
import hibernate.Store;
import hibernate.Treatment;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SaveProduct", urlPatterns = {"/SaveProduct"})
public class SaveProduct extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        String title = request.getParameter("productName") != null ? request.getParameter("productName").trim() : "";
        String categoryId = request.getParameter("categoryId") != null ? request.getParameter("categoryId").trim() : "0";
        String originId = request.getParameter("originId") != null ? request.getParameter("originId").trim() : "0";
        String shapeId = request.getParameter("shapeId") != null ? request.getParameter("shapeId").trim() : "0";
        String cutStyle = request.getParameter("cutStyle") != null ? request.getParameter("cutStyle").trim() : "";
        String colorId = request.getParameter("colorId") != null ? request.getParameter("colorId").trim() : "0";
        String calarityId = request.getParameter("calarityId") != null ? request.getParameter("calarityId").trim() : "0";
        String treatmentId = request.getParameter("treatmentId") != null ? request.getParameter("treatmentId").trim() : "0";
        String description = request.getParameter("description") != null ? request.getParameter("description").trim() : "";
        String weight = request.getParameter("weight") != null ? request.getParameter("weight").trim() : "";
        String length = request.getParameter("length") != null ? request.getParameter("length").trim() : "";
        String width = request.getParameter("Width") != null ? request.getParameter("Width").trim() : "";
        String height = request.getParameter("hight") != null ? request.getParameter("hight").trim() : "";
        String qty = request.getParameter("stockquantity") != null ? request.getParameter("stockquantity").trim() : "1";
        String states = request.getParameter("states") != null ? request.getParameter("states").trim() : "1";
        String sellprice = request.getParameter("sellprice") != null ? request.getParameter("sellprice").trim() : "";
        String cost = request.getParameter("cost") != null ? request.getParameter("cost").trim() : "0.0";
        String pricePerCarat = request.getParameter("pricePerCarat") != null ? request.getParameter("pricePerCarat").trim() : "";

        // Gem Lab & Media
        String labName = request.getParameter("labName") != null ? request.getParameter("labName").trim() : "";
        String certNumber = request.getParameter("certNumber") != null ? request.getParameter("certNumber").trim() : "";
        String certUrl = request.getParameter("certUrl") != null ? request.getParameter("certUrl").trim() : "";
        String videoUrl = request.getParameter("videoUrl") != null ? request.getParameter("videoUrl").trim() : "";

        Part part1 = null;
        Part part2 = null;
        Part part3 = null;
        Part certImagePart = null;

        try {
            part1 = request.getPart("image1");
            part2 = request.getPart("image2");
            part3 = request.getPart("image3");
            certImagePart = request.getPart("certImage");
        } catch (Exception e) {
            // Ignore if optional or missing
        }

        // Validations
        if (title.isEmpty()) {
            responseObject.addProperty("message", "Product title cannot be empty!");
        } else if (!Util.isInteger(categoryId) || Integer.parseInt(categoryId) == 0) {
            responseObject.addProperty("message", "Please select a Gemstone Category!");
        } else if (!Util.isInteger(shapeId) || Integer.parseInt(shapeId) == 0) {
            responseObject.addProperty("message", "Please select a Gemstone Shape!");
        } else if (!Util.isInteger(calarityId) || Integer.parseInt(calarityId) == 0) {
            responseObject.addProperty("message", "Please select Clarity grade!");
        } else if (!Util.isInteger(colorId) || Integer.parseInt(colorId) == 0) {
            responseObject.addProperty("message", "Please select a Color!");
        } else if (!Util.isInteger(treatmentId) || Integer.parseInt(treatmentId) == 0) {
            responseObject.addProperty("message", "Please select Gemstone Treatment!");
        } else if (weight.isEmpty() || !Util.isDouble(weight) || Double.parseDouble(weight) <= 0) {
            responseObject.addProperty("message", "Please enter a valid Carat Weight greater than 0!");
        } else if (length.isEmpty() || !Util.isDouble(length)) {
            responseObject.addProperty("message", "Please enter length in millimeters (mm)!");
        } else if (width.isEmpty() || !Util.isDouble(width)) {
            responseObject.addProperty("message", "Please enter width in millimeters (mm)!");
        } else if (height.isEmpty() || !Util.isDouble(height)) {
            responseObject.addProperty("message", "Please enter height / depth in millimeters (mm)!");
        } else if (sellprice.isEmpty() || !Util.isDouble(sellprice) || Double.parseDouble(sellprice) <= 0) {
            responseObject.addProperty("message", "Selling price must be greater than 0!");
        } else if (!Util.isInteger(qty) || Integer.parseInt(qty) <= 0) {
            responseObject.addProperty("message", "Stock quantity must be at least 1!");
        } else if (part1 == null || part1.getSubmittedFileName() == null || part1.getSubmittedFileName().isEmpty()) {
            responseObject.addProperty("message", "Primary product image (Image 1) is required!");
        } else {
            Session s = null;
            Transaction tx = null;
            try {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                s = sf.openSession();
                tx = s.beginTransaction();

                Category category = (Category) s.get(Category.class, Integer.parseInt(categoryId));
                Shape shape = (Shape) s.get(Shape.class, Integer.parseInt(shapeId));
                Clarity clarity = (Clarity) s.get(Clarity.class, Integer.parseInt(calarityId));
                Color color = (Color) s.get(Color.class, Integer.parseInt(colorId));
                Treatment treatment = (Treatment) s.get(Treatment.class, Integer.parseInt(treatmentId));
                States status = (States) s.get(States.class, Util.isInteger(states) ? Integer.parseInt(states) : 1);
                ActiveState active = (ActiveState) s.get(ActiveState.class, 1);

                Country origin = null;
                if (Util.isInteger(originId) && Integer.parseInt(originId) > 0) {
                    origin = (Country) s.get(Country.class, Integer.parseInt(originId));
                }

                // Determine Store association
                Store sellerStore = null;
                HttpSession session = request.getSession(false);
                if (session != null && session.getAttribute("user") != null) {
                    User loggedUser = (User) session.getAttribute("user");
                    Criteria stCrit = s.createCriteria(Store.class);
                    stCrit.add(Restrictions.eq("user", loggedUser));
                    List<Store> storeList = stCrit.list();
                    if (!storeList.isEmpty()) {
                        sellerStore = storeList.get(0);
                    }
                }

                // Fallback to existing store for testing if no logged store
                if (sellerStore == null) {
                    Criteria defaultStoreCrit = s.createCriteria(Store.class);
                    defaultStoreCrit.setMaxResults(1);
                    List<Store> list = defaultStoreCrit.list();
                    if (!list.isEmpty()) {
                        sellerStore = list.get(0);
                    }
                }

                Product p = new Product();
                p.setTitle(title);
                p.setCat(category);
                p.setOrigin(origin);
                p.setShape(shape);
                p.setCut_style(cutStyle);
                p.setColor(color);
                p.setClarity(clarity);
                p.setTreatment(treatment);
                p.setDescription(description);
                p.setWeight(Double.parseDouble(weight));
                p.setLength(Double.parseDouble(length));
                p.setWidth(Double.parseDouble(width));
                p.setHight(Double.parseDouble(height));
                p.setQty(Integer.parseInt(qty));
                p.setPrice(Double.parseDouble(sellprice));
                p.setCost(Util.isDouble(cost) ? Double.parseDouble(cost) : 0.0);

                // Auto calculate price per carat if not explicitly given
                if (Util.isDouble(pricePerCarat) && Double.parseDouble(pricePerCarat) > 0) {
                    p.setPrice_per_carat(Double.parseDouble(pricePerCarat));
                } else if (Double.parseDouble(weight) > 0) {
                    p.setPrice_per_carat(Double.parseDouble(sellprice) / Double.parseDouble(weight));
                }

                // Certification details
                p.setLab_name(labName);
                p.setCert_number(certNumber);
                p.setCert_url(certUrl);
                p.setVideo_url(videoUrl);

                p.setActive(active);
                p.setStatus(status);
                p.setStore(sellerStore);
                p.setCreated_at(new Date());

                int productId = (int) s.save(p);

                // Save product images
                String basePath = "D:" + File.separator + "XamppNewFolder" + File.separator + "htdocs" + File.separator + "jemLanka" + File.separator + "productImage";
                File productFolder = new File(basePath, String.valueOf(productId));
                if (!productFolder.exists()) {
                    productFolder.mkdirs();
                }

                if (part1 != null && part1.getSubmittedFileName() != null && !part1.getSubmittedFileName().isEmpty()) {
                    File file1 = new File(productFolder, "image1.png");
                    Files.copy(part1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
                if (part2 != null && part2.getSubmittedFileName() != null && !part2.getSubmittedFileName().isEmpty()) {
                    File file2 = new File(productFolder, "image2.png");
                    Files.copy(part2.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
                if (part3 != null && part3.getSubmittedFileName() != null && !part3.getSubmittedFileName().isEmpty()) {
                    File file3 = new File(productFolder, "image3.png");
                    Files.copy(part3.getInputStream(), file3.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }

                // Save cert image if uploaded
                if (certImagePart != null && certImagePart.getSubmittedFileName() != null && !certImagePart.getSubmittedFileName().isEmpty()) {
                    String ext = certImagePart.getSubmittedFileName().contains(".") ? certImagePart.getSubmittedFileName().substring(certImagePart.getSubmittedFileName().lastIndexOf(".")) : ".jpg";
                    File certFile = new File(productFolder, "certificate" + ext);
                    Files.copy(certImagePart.getInputStream(), certFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    p.setCert_image("productImage/" + productId + "/certificate" + ext);
                    s.update(p);
                }

                tx.commit();
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Gemstone product registered successfully!");
                responseObject.addProperty("productId", productId);
            } catch (Exception ex) {
                if (tx != null) {
                    try { tx.rollback(); } catch (Exception ignored) {}
                }
                ex.printStackTrace();
                responseObject.addProperty("message", "Error saving product: " + ex.getMessage());
            } finally {
                if (s != null && s.isOpen()) {
                    s.close();
                }
            }
        }

        response.getWriter().write(new Gson().toJson(responseObject));
    }
}
