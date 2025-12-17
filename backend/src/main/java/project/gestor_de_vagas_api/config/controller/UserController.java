package project.gestor_de_vagas_api.config.controller;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.gestor_de_vagas_api.config.controller.dto.CreateUserDto;
import project.gestor_de_vagas_api.config.controller.dto.UsuarioMeDto;
import project.gestor_de_vagas_api.entities.Role;
import project.gestor_de_vagas_api.entities.User;
import project.gestor_de_vagas_api.repository.RoleRepository;
import project.gestor_de_vagas_api.repository.UserRepository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
public class UserController {


    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @PreAuthorize("permitAll()")
    @Transactional
    @PostMapping("/users")
    public ResponseEntity<Void> newUser(@RequestBody CreateUserDto dto) {

        var basicRole = roleRepository.findByName(Role.Values.BASIC.name());

        var userFromDb = userRepository.findByUsername(dto.username());
        if (userFromDb.isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY);
        }

        var user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRoles(Set.of(basicRole));

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<User>> listUsers() {
        var users = userRepository.findAll();

        return ResponseEntity.ok(users);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UsuarioMeDto> me(JwtAuthenticationToken token) {

        UUID userId = UUID.fromString(token.getName());

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        String scope = token.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("SCOPE_", ""))
                .orElse("BASIC");

        return ResponseEntity.ok(
                new UsuarioMeDto(user.getUsername(), scope)
        );
    }
}
