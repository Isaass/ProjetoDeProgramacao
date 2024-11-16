package br.com.sistemapedidos.api.controllers;

import br.com.sistemapedidos.api.dtos.UsuarioCadastroDTO;
import br.com.sistemapedidos.api.dtos.UsuarioDTO;
import br.com.sistemapedidos.api.dtos.UsuarioLoginDTO;
import br.com.sistemapedidos.api.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioDTO> cadastrarUsuario(@RequestBody UsuarioCadastroDTO usuarioCadastroDTO) {
        UsuarioDTO novoUsuario = usuarioService.cadastrarUsuario(usuarioCadastroDTO);
        return ResponseEntity.ok(novoUsuario);
    }

    @PostMapping("/entrar")
    public ResponseEntity<UsuarioDTO> login(@RequestBody UsuarioLoginDTO loginDTO) {
        Optional<UsuarioDTO> usuario = usuarioService.login(loginDTO);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public  ResponseEntity<UsuarioDTO> pegarUsuarioPorId(@PathVariable Long id) {
        UsuarioDTO usuarioDTO = usuarioService.listarUsuariosPorId(id);
        return ResponseEntity.ok(usuarioDTO);
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<UsuarioDTO> atualizarPerfil(@PathVariable Long id, @RequestBody UsuarioCadastroDTO usuarioCadastroDTO) {
        UsuarioDTO usuarioAtualizado = usuarioService.atualizarPerfil(id, usuarioCadastroDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        boolean isDeleted = usuarioService.deleteUsuario(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
