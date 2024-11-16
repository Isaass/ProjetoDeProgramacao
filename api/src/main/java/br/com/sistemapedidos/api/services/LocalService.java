package br.com.sistemapedidos.api.services;

import br.com.sistemapedidos.api.dtos.LocalDTO;
import br.com.sistemapedidos.api.models.LocalModel;
import br.com.sistemapedidos.api.repositories.LocalRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocalService {

    @Autowired
    private LocalRepository localRepository;

    @Autowired
    private ModelMapper modelMapper;

    public LocalDTO criarLocal(LocalDTO localDTO) {
        LocalModel local = modelMapper.map(localDTO, LocalModel.class);
        LocalModel savedLocal = localRepository.save(local);
        return modelMapper.map(savedLocal, LocalDTO.class);
    }

    public List<LocalDTO> listarLocais() {
        return localRepository.findAll().stream()
                .map(local -> modelMapper.map(local, LocalDTO.class))
                .collect(Collectors.toList());
    }

    public LocalDTO listarLocaisPorId(Long id) {
        LocalModel local = localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local não encontrado"));
        return modelMapper.map(local, LocalDTO.class);
    }

    public LocalDTO atualizarLocal(Long id, LocalDTO localDTO) {
        LocalModel local = localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local não encontrado"));

        // Atualiza apenas os campos fornecidos no DTO
        if (localDTO.getNome() != null && !localDTO.getNome().isEmpty()) {
            local.setNome(localDTO.getNome());
        }
        if (localDTO.getEndereco() != null && !localDTO.getEndereco().isEmpty()) {
            local.setEndereco(localDTO.getEndereco());
        }
        if (localDTO.getRota() != null) {
            local.setRota(localDTO.getRota());
        }

        LocalModel updatedLocal = localRepository.save(local);
        return modelMapper.map(updatedLocal, LocalDTO.class);
    }


    public void deletarLocal(Long id) {
        localRepository.deleteById(id);
    }
}
