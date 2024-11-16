package br.com.sistemapedidos.api.dtos;

import lombok.Data;

@Data
public class UsuarioCadastroDTO {
    private String nomeUsuario;
    private String nomeCompleto; // Novo campo para o nome completo
    private String senha;
    private String role; // Adminstrador ou Cabo de Turma
}
