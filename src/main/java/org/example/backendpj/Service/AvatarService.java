package org.example.backendpj.Service;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.UserAvatar;
import org.example.backendpj.Repository.UserAvatarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AvatarService {

    @Autowired
    private UserAvatarRepository avatarRepo;

    @Autowired
    private Cloudinary cloudinary;

    public void uploadAvatar(User user, MultipartFile file) throws IOException {

        // 1. set tất cả avatar cũ = false
        List<UserAvatar> avatars = avatarRepo.findByUserId(user.getId());
        for (UserAvatar av : avatars) {
            av.setCurrent(false);
        }

        // 2. upload ảnh mới
        Map result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "avatars"));

        // 3. lưu DB
        UserAvatar newAvatar = new UserAvatar();
        newAvatar.setUser(user);
        newAvatar.setUrl(result.get("secure_url").toString());
        newAvatar.setPublicId(result.get("public_id").toString());
        newAvatar.setCurrent(true);
        newAvatar.setCreatedAt(LocalDateTime.now());

        avatarRepo.save(newAvatar);
    }
}