package br.com.sistemapedidos.api.controllers;

import br.com.sistemapedidos.api.dtos.PedidoDTO;
import br.com.sistemapedidos.api.services.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoDTO> criarPedido(@RequestBody PedidoDTO pedidoDTO) {
        PedidoDTO novoPedido = pedidoService.criarPedido(pedidoDTO);
        return ResponseEntity.ok(novoPedido);
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> listarPedidos() {
        List<PedidoDTO> pedidos = pedidoService.listarPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> buscarPedidoPorId(@PathVariable Long id) {
        PedidoDTO pedido = pedidoService.listarPedidoPorId(id);
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> atualizarPedido(@PathVariable Long id, @RequestBody PedidoDTO pedidoDTO) {
        PedidoDTO pedidoAtualizado = pedidoService.atualizarPedido(id, pedidoDTO);
        return ResponseEntity.ok(pedidoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable Long id) {
        pedidoService.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
