package br.com.sistemapedidos.api.controllers;

import br.com.sistemapedidos.api.dtos.LocalDTO;
import br.com.sistemapedidos.api.services.LocalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locais")
public class LocalController {

    @Autowired
    private LocalService localService;

    @PostMapping
    public ResponseEntity<LocalDTO> criarLocal(@RequestBody LocalDTO localDTO) {
        LocalDTO novoLocal = localService.criarLocal(localDTO);
        return ResponseEntity.ok(novoLocal);
    }

    @GetMapping
    public ResponseEntity<List<LocalDTO>> listarLocais() {
        List<LocalDTO> locais = localService.listarLocais();
        return ResponseEntity.ok(locais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalDTO> getLocalPorId(@PathVariable Long id) {
        LocalDTO localDTO = localService.listarLocaisPorId(id);
        return ResponseEntity.ok(localDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocalDTO> atualizarLocal(@PathVariable Long id, @RequestBody LocalDTO localDTO) {
        LocalDTO localAtualizado = localService.atualizarLocal(id, localDTO);
        return ResponseEntity.ok(localAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLocal(@PathVariable Long id) {
        localService.deletarLocal(id);
        return ResponseEntity.noContent().build();
    }
}
