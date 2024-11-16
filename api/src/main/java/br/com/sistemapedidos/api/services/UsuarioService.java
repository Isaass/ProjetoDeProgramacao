package br.com.sistemapedidos.api.services;

import br.com.sistemapedidos.api.dtos.UsuarioCadastroDTO;
import br.com.sistemapedidos.api.dtos.UsuarioDTO;
import br.com.sistemapedidos.api.dtos.UsuarioLoginDTO;
import br.com.sistemapedidos.api.models.UsuarioModel;
import br.com.sistemapedidos.api.repositories.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Método para cadastrar um novo usuário com senha criptografada
    public UsuarioDTO cadastrarUsuario(UsuarioCadastroDTO usuarioCadastroDTO) {
        UsuarioModel usuario = modelMapper.map(usuarioCadastroDTO, UsuarioModel.class);
        usuario.setSenha(passwordEncoder.encode(usuarioCadastroDTO.getSenha())); // Criptografa a senha antes de salvar
        UsuarioModel savedUsuario = usuarioRepository.save(usuario);
        return modelMapper.map(savedUsuario, UsuarioDTO.class);
    }

    // Método de login com verificação de senha criptografada
    public Optional<UsuarioDTO> login(UsuarioLoginDTO loginDTO) {
        Optional<UsuarioModel> usuario = usuarioRepository.findByNomeUsuario(loginDTO.getNomeUsuario());
        if (usuario.isPresent() && passwordEncoder.matches(loginDTO.getSenha(), usuario.get().getSenha())) {
            // Se a senha fornecida no login corresponde à senha criptografada
            return Optional.of(modelMapper.map(usuario.get(), UsuarioDTO.class));
        }
        return Optional.empty(); // Retorna vazio se o login falhar
    }

    // Método para atualizar o perfil e permitir edição parcial dos campos
    public UsuarioDTO atualizarPerfil(Long id, UsuarioCadastroDTO usuarioCadastroDTO) {
        UsuarioModel usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza somente os campos que não são nulos no DTO de entrada
        if (usuarioCadastroDTO.getNomeCompleto() != null) {
            usuario.setNomeCompleto(usuarioCadastroDTO.getNomeCompleto());
        }
        if (usuarioCadastroDTO.getRole() != null) {
            usuario.setRole(usuarioCadastroDTO.getRole());
        }
        if (usuarioCadastroDTO.getSenha() != null && !usuarioCadastroDTO.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(usuarioCadastroDTO.getSenha()));
        }

        // Atualiza o usuário no banco de dados
        UsuarioModel updatedUsuario = usuarioRepository.save(usuario);
        return modelMapper.map(updatedUsuario, UsuarioDTO.class);
    }

    // Método para listar todos os usuários (exemplo de uso do ModelMapper)
    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioDTO.class))
                .collect(Collectors.toList());
    }

    // Método para listar um usuário por ID (exemplo de uso do ModelMapper)
    public UsuarioDTO listarUsuariosPorId(long id) {
        UsuarioModel usuarioModel = usuarioRepository.findById(id).orElseThrow();
        return modelMapper.map(usuarioModel, UsuarioDTO.class);
    }

    // Método para deletar um usuário pelo ID
    public boolean deleteUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true; // Retorna true se o usuário foi deletado com sucesso
        }
        return false; // Retorna false se o usuário não for encontrado
    }
}
