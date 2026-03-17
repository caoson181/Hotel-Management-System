    package org.example.backendpj.Service;

    import org.example.backendpj.Entity.User;
    import org.example.backendpj.Repository.UserRepository;
    import org.springframework.stereotype.Service;

    @Service
    public class UserService {

        private final UserRepository userRepository;

        public UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        public void updateProfile(String input, String fullName, String email, String phone) {

            User user = userRepository
                    .findByUsernameOrEmail(input, input)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setFullName(fullName);
            user.setEmail(email);
            user.setPhoneNumber(phone);

            userRepository.save(user);
        }
        public User findByUsername(String username) {
            return userRepository.findByUsernameOrEmail(username, username)
                    .orElse(null);
        }
    }