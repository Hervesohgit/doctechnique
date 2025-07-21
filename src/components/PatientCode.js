import React, { useState, useEffect, useRef } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Tabs,
    Tab,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    IconButton,
    Tooltip,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    useTheme
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    ExpandMore as ExpandMoreIcon,
    ContentCopy as ContentCopyIcon,
    Check as CheckIcon,
    MedicalInformation as MedicalIcon,
    People as PeopleIcon,
    LocalPharmacy as PharmacyIcon,
    Description as DossierIcon,
    Healing as DiagnosticIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import Prism, { languages } from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';

const customStyles = `
  .code-container pre {
    background: #272822 !important;
    margin: 0 !important;
    border-radius: 0 0 4px 4px;
  }
  .code-container code {
    background: transparent !important;
    color: #f8f8f2 !important;
  }
`;

const Doctechnique = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [currentService, setCurrentService] = useState('patient');
    const [tabValue, setTabValue] = useState(0);
    const [copiedId, setCopiedId] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const codeRef = useRef(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [tabValue, currentService]);

    useEffect(() => {
        setTabValue(0);
    }, [currentService]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleServiceChange = (newValue) => {
        setCurrentService(newValue);
        setDrawerOpen(false);
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const services = {
        patient: {
            name: "Patient",
            icon: <MedicalIcon />,
            snippets: [
                {
                    id: 'service',
                    title: 'Service',
                    language: 'java',
                    code: `package com.herve.intergiciel.PatientManager.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.herve.intergiciel.PatientManager.DTO.DtoPatient;
import com.herve.intergiciel.PatientManager.Exceptions.PatientErrorExceptions;
import com.herve.intergiciel.PatientManager.Modeles.Patient;
import com.herve.intergiciel.PatientManager.Repositories.PatientRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PatientService {
    private PatientRepository infoPatientRepository;

    public Patient create(Patient infoPatient) {
        return this.infoPatientRepository.save(infoPatient);
    }



    public List<DtoPatient> search() {
    return infoPatientRepository.findAll()
            .stream()
            .map(DtoPatient::fromEntity)
            .collect(Collectors.toList());
}

    // @Transactional(readOnly = true)

    public Patient serchPatientById(Long id) {

        return infoPatientRepository.findById(id)
                .orElseThrow(() -> new PatientErrorExceptions(" Not patient with ID " + id));

    }

    public boolean patientexists(Long id) {
        
        return infoPatientRepository.existsById(id);
    }

    public Patient updatePatient(Long id, Patient infoPatient) {
        Patient patientToUpdate = infoPatientRepository.findById(id)
                .orElseThrow(() -> new PatientErrorExceptions("Historique non trouvé avec l'ID : " + id));

        patientToUpdate.setName(infoPatient.getName());
        patientToUpdate.setPrenom(infoPatient.getPrenom());
        patientToUpdate.setTel(infoPatient.getTel());
        patientToUpdate.setDateN(infoPatient.getDateN());
        patientToUpdate.setEmail(infoPatient.getEmail());
        patientToUpdate.setGroupeSanguin(infoPatient.getGroupeSanguin());
        patientToUpdate.setSexe(infoPatient.getSexe());
        patientToUpdate.setAddr(infoPatient.getAddr());

        return infoPatientRepository.save(patientToUpdate);
    }

    public void delete(Long id) {
        if (!infoPatientRepository.existsById(id)) {
            throw new PatientErrorExceptions("Patient not found");
        } else {
            infoPatientRepository.deleteById(id);
        }
    }

}`
                },
                {
                    id: 'controller',
                    title: 'Controller',
                    language: 'java',
                    code: `package com.herve.intergiciel.PatientManager.Controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.herve.intergiciel.PatientManager.DTO.DtoPatient;
import com.herve.intergiciel.PatientManager.Exceptions.PatientErrorExceptions;
import com.herve.intergiciel.PatientManager.Modeles.Patient;
import com.herve.intergiciel.PatientManager.Services.PatientService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/patient")
@AllArgsConstructor
// @CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
//         RequestMethod.DELETE, RequestMethod.OPTIONS })
public class PatientController {

    private final PatientService infoPatientService;

    @PostMapping(path = "/create", consumes = "application/json")
    public ResponseEntity<Patient> create(@RequestBody Patient infoPatient) {
        return ResponseEntity.ok(infoPatientService.create(infoPatient));
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<?> search() {
        List<DtoPatient> patients = infoPatientService.search();
        if (patients.isEmpty()) {
            return ResponseEntity.ok("Aucun patient trouvé");
        }
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> searchPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(infoPatientService.serchPatientById(id));
    }

    @PutMapping(path = "/update/{id}", consumes = "application/json")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Patient infoPatient) {
        if (!id.equals(infoPatient.getIdPat())) {
            return ResponseEntity.badRequest().body("ID dans l'URL ne correspond pas au corps de la requête");
        }
        try {
            return ResponseEntity.ok(infoPatientService.updatePatient(id, infoPatient));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        infoPatientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/exists/{id}")
    public ResponseEntity<Boolean> patientExists(@PathVariable Long id) {
        boolean exists = infoPatientService.patientexists(id);
        if (!exists) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exists);
    }
}

}`
                },
                {
                    id: 'create-endpoint',
                    title: 'Endpoint',
                    language: 'java',
                    code: `@PostMapping(path = "/create", consumes = "application/json")
public ResponseEntity<Patient> create(@RequestBody Patient infoPatient) {
    return ResponseEntity.ok(infoPatientService.create(infoPatient));
}`
                },
                {
                    id: 'model',
                    title: 'Entity',
                    language: 'java',
                    code: `package com.herve.intergiciel.PatientManager.Modeles;


import java.sql.Date;

import com.herve.intergiciel.PatientManager.Enum.Genre;
import com.herve.intergiciel.PatientManager.Enum.GroupeSanguin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPat;

    @NotNull(message = "Ce champ est obligatoire")
    private String name;
    
    private String prenom;

    @Pattern(regexp = "^[+0][0-9]*$", message = "Le téléphone doit commencer par + ou 0")
    private String tel;

    private String addr;
   
    @NotNull(message = "Ce champ est obligatoire")
    private Genre sexe;

    @Column(name = "date_naissance")
    private Date dateN;

    @Email(message = "Email invalide ou est deja utilisé")
    @Column(unique = true)
    private String email;

    private GroupeSanguin groupeSanguin;


}

`
                },
                {
                    id: 'dto',
                    title: 'DTO',
                    language: 'java',
                    code: `package com.herve.intergiciel.PatientManager.DTO;

import java.sql.Date;

import com.herve.intergiciel.PatientManager.Enum.Genre;
import com.herve.intergiciel.PatientManager.Enum.GroupeSanguin;
import com.herve.intergiciel.PatientManager.Modeles.Patient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoPatient {

    private Long idPat;
    private String name;
    private String prenom;
    private String tel;
    private String addr;
    private Genre sexe;
    private Date dateN;
    private GroupeSanguin groupeSanguin;

    // 🔁 Ajoute cette méthode ici
    public static DtoPatient fromEntity(Patient patient) {
        return new DtoPatient(
            patient.getIdPat(),
            patient.getName(),
            patient.getPrenom(),
            patient.getTel(),
            patient.getAddr(),
            patient.getSexe(),
            patient.getDateN(),
            patient.getGroupeSanguin()
        );
    }
}
`
                },
                {
                    id: 'example-request',
                    title: 'Exemple Requête POST',
                    language: 'json',
                    code: `{
  "name": "Dupont",
  "prenom": "Jean",
  "tel": "+33612345678",
  "addr": "123 Rue Example, Paris",
  "sexe": "M",
  "dateN": "1990-01-01",
  "email": "jean.dupont@example.com",
  "groupeSanguin": "A_POSITIF"
}`

                },
            ]
        },
        personnel: {
            name: "Personnel",
            icon: <PeopleIcon />,
            snippets: [
                {
                    id: 'service',
                    title: 'Service',
                    language: 'java',
                    code: `package com.herve.intergiciel.RHManager.RHServices;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.herve.intergiciel.RHManager.Exceptions.EmployeNotFoundException;
import com.herve.intergiciel.RHManager.Modeles.Employe;
import com.herve.intergiciel.RHManager.RHRepository.EmployesRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EmployeService {
    
    private EmployesRepository employesRepository;

    public Employe create(Employe employe){
        return this.employesRepository.save(employe);
    }

    public List<Employe> search(){
        return this.employesRepository.findAll();
    }

    public Employe searchEmployeById(Long id){
        Employe employe=employesRepository.findById(id)
            .orElseThrow(() -> new EmployeNotFoundException("No Employe with ID "+id));
            return employe;
    }

    public Employe update( Long id, Employe employe) {

        Employe employeToUpdate=employesRepository.findById(id)
            .orElseThrow(() -> new EmployeNotFoundException("Employe not found"));

        employeToUpdate.setNom(employe.getNom());
        employeToUpdate.setPrenom(employe.getPrenom());
        employeToUpdate.setAdresse(employe.getAdresse());
        employeToUpdate.setDateEmbauche(employe.getDateEmbauche());
        employeToUpdate.setDateNaissance(employe.getDateNaissance());
        employeToUpdate.setEmail(employe.getEmail());
        employeToUpdate.setSexe(employe.getSexe());
        employeToUpdate.setTelephone(employe.getTelephone());

        return employesRepository.save(employeToUpdate);
    }

    public void delete( Long id) {

        if (!employesRepository.existsById(id)) {
            throw new EmployeNotFoundException("Not Employe with ID "+id);
        }
        employesRepository.deleteById(id);
    }

    public boolean employeExists(Long id){
        if (employesRepository.existsById(id)) {
            return true;
        } else {
            throw new EmployeNotFoundException("Not Employe with ID "+id);
            
        }
    }
    

}
`
                },
                {
                    id: 'controller',
                    title: 'Controller',
                    language: 'java',
                    code: `package com.herve.intergiciel.RHManager.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.herve.intergiciel.RHManager.Modeles.Employe;
import com.herve.intergiciel.RHManager.RHRepository.EmployesRepository;
import com.herve.intergiciel.RHManager.RHServices.EmployeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rh/employe")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CRUDEmploye {

    private final EmployeService employeService;


    @PostMapping(path = "/create", consumes = "application/json")
    public ResponseEntity<Employe> create(@RequestBody Employe infoPatient) {
        return ResponseEntity.ok(employeService.create(infoPatient));
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<Employe>> search() {
        List<Employe> employes=employeService.search();
        return ResponseEntity.ok(employes);
    }

    @GetMapping(path = "/{id}", produces = "application/json")
    public ResponseEntity<Employe> getEmployeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeService.searchEmployeById(id));
    }

    @PutMapping(path = "update/{id}", consumes = "application/json")
    public ResponseEntity<Employe> updateEmploye(@PathVariable Long id, @RequestBody Employe employe) {
        return ResponseEntity.ok(employeService.update(id , employe));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmploye(@PathVariable Long id) {
        employeService.delete(id);
        return ResponseEntity.noContent().build();

    }
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> employeExists(@PathVariable Long id) {
        boolean exists = employeService.employeExists(id);
        return ResponseEntity.ok(exists);
    }
}

}`
                },
                {
                    id: 'model',
                    title: 'Entity',
                    language: 'java',
                    code: `package com.herve.intergiciel.RHManager.Modeles;


import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "employes")
@Setter
@Getter
public class Employe {
    public enum Genre{HOMME, FEMME, AUTRE, homme, femme, autre, Homme, Femme, H, F, h, f, masculin, feminin, FEMININ, MASCULIN, M}
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Ce champ est obligatoire")
    private String nom;
    private String prenom;

    @NotNull
    private Genre sexe;

    @DateTimeFormat(pattern = "yyyy-MM-jj")
    @NotNull
    @Pattern(regexp = "^[0-9]{4}-[0-9]{2}-[0-9]{2}$", message = "La date de naissance doit être au format yyyy-MM-jj.")
    private String dateNaissance;

    @Pattern(regexp = "^[+00][0-9]*$", message = "Le numéro de téléphone doit contenir uniquement des chiffres.")
    private String telephone;

    private String adresse;

    @Email
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$", message = "L'adresse e-mail n'est pas valide.")
    @NotNull
    private String email;


    @DateTimeFormat(pattern = "yyyy-MM-jj")
    private String dateEmbauche;
    
//     @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<Document> documents = new ArrayList<>();
// }

}

`
                },

                {
                    id: 'personnel-example-request',
                    title: 'Exemple Requête POST',
                    language: 'json',
                    code: `{

  "nom": "Doe",
  "prenom": "John",
  "sexe": "HOMME",
  "dateNaissance": "1990-05-15",
  "telephone": "+00123456789",
  "adresse": "123 Rue Principale, Paris",
  "email": "john.doe@example.com",
  "dateEmbauche": "2022-09-01"
}
`
                }
            ]
        },
        pharmacy: {
            name: "Pharmacy",
            icon: <PharmacyIcon />,
            snippets: [
                {
                    id: 'service',
                    title: 'Service',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.herve.intergiciel.PharmacyManager.Dto.MedicamentDTO;
import com.herve.intergiciel.PharmacyManager.Exception.MedicamentNotFoundException;
import com.herve.intergiciel.PharmacyManager.Modele.Medicament;
import com.herve.intergiciel.PharmacyManager.Repository.MedicamentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MedicamentService {
    private final MedicamentRepository medicamentRepository;
    private final ModelMapper modelMapper;

    public MedicamentDTO createMedicament(MedicamentDTO medicamentDTO) {
        log.debug("Création d'un nouveau médicament: {}", medicamentDTO);
        Medicament medicament = modelMapper.map(medicamentDTO, Medicament.class);
        Medicament savedMedicament = medicamentRepository.save(medicament);
        return modelMapper.map(savedMedicament, MedicamentDTO.class);
    }

    public List<MedicamentDTO> getAllMedicaments() {
        log.debug("Récupération de tous les médicaments");
        return medicamentRepository.findAll()
                .stream()
                .map(medicament -> modelMapper.map(medicament, MedicamentDTO.class))
                .collect(Collectors.toList());
    }

    public MedicamentDTO getMedicamentById(Long id) {
        log.debug("Recherche du médicament avec ID: {}", id);
        Medicament medicament = medicamentRepository.findById(id)
                .orElseThrow(() -> new MedicamentNotFoundException("Medicament not found with id: " + id));
        return modelMapper.map(medicament, MedicamentDTO.class);
    }

    public MedicamentDTO updateMedicament(String code, MedicamentDTO medicamentDTO) {
        log.debug("Mise à jour du médicament avec code: {}", code);
        Medicament existingMedicament = medicamentRepository.findByCode(code)
                .orElseThrow(() -> new MedicamentNotFoundException("Medicament not found with code: " + code));

        // Mise à jour sélective pour éviter d'écraser les valeurs non fournies
        if (medicamentDTO.getNom() != null) {
            existingMedicament.setNom(medicamentDTO.getNom());
        }
        if (medicamentDTO.getDescription() != null) {
            existingMedicament.setDescription(medicamentDTO.getDescription());
        }
        if (medicamentDTO.getPrixUnitaire() > 0) {
            existingMedicament.setPrixUnitaire(medicamentDTO.getPrixUnitaire());
        }
        if (medicamentDTO.getQuantiteStock() >= 0) {
            existingMedicament.setQuantiteStock(medicamentDTO.getQuantiteStock());
        }
        if (medicamentDTO.getDateExpiration() != null) {
            existingMedicament.setDateExpiration(medicamentDTO.getDateExpiration());
        }
        if (medicamentDTO.getFabriquant() != null) {
            existingMedicament.setFabriquant(medicamentDTO.getFabriquant());
        }
        if (medicamentDTO.getCategorie() != null) {
            existingMedicament.setCategorie(medicamentDTO.getCategorie());
        }

        Medicament updatedMedicament = medicamentRepository.save(existingMedicament);
        log.info("Médicament {} mis à jour avec succès", code);
        return modelMapper.map(updatedMedicament, MedicamentDTO.class);
    }

    public boolean verifyMedicamentAvailability(List<Long> medicamentIds) {
        log.debug("Vérification de la disponibilité pour {} médicaments", medicamentIds.size());
        return medicamentIds.stream()
                .allMatch(id -> medicamentRepository.existsById(id));
    }

    public void deleteMedicament(Long id) {
        log.debug("Suppression du médicament avec ID: {}", id);
        if (!medicamentRepository.existsById(id)) {
            throw new MedicamentNotFoundException("Medicament not found with id: " + id);
        }
        medicamentRepository.deleteById(id);
        log.info("Médicament {} supprimé avec succès", id);
    }
}
`
                },
                {
                    id: 'controller',
                    title: 'Controller',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.herve.intergiciel.PharmacyManager.Dto.MedicamentDTO;
import com.herve.intergiciel.PharmacyManager.Exception.MedicamentNotFoundException;
import com.herve.intergiciel.PharmacyManager.Service.MedicamentService;

import java.util.List;

@RestController
@RequestMapping("/medicaments")
@RequiredArgsConstructor
@Slf4j
// @CrossOrigin(origins = "*") 
public class MedicamentController {
    private final MedicamentService medicamentService;

    @PostMapping
    public ResponseEntity<MedicamentDTO> createMedicament(@RequestBody @Valid MedicamentDTO medicamentDto) {
        log.info("Création d'un nouveau médicament");
        MedicamentDTO createdMedicament = medicamentService.createMedicament(medicamentDto);
        return new ResponseEntity<>(createdMedicament, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MedicamentDTO>> getAllMedicaments() {
        log.info("Récupération de tous les médicaments");
        List<MedicamentDTO> medicaments = medicamentService.getAllMedicaments();
        return ResponseEntity.ok(medicaments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentDTO> getMedicamentById(@PathVariable Long id) {
        log.info("Récupération du médicament avec ID: {}", id);
        MedicamentDTO medicament = medicamentService.getMedicamentById(id);
        return ResponseEntity.ok(medicament);
    }

    @PutMapping("/{code}")
    public ResponseEntity<?> updateMedicament(
            @PathVariable String code,
            @RequestBody @Valid MedicamentDTO medicamentDTO) {
        
        log.info("Tentative de mise à jour du médicament avec code: {}", code);
        try {
            MedicamentDTO updatedMedicament = medicamentService.updateMedicament(code, medicamentDTO);
            log.info("Médicament {} mis à jour avec succès", code);
            return ResponseEntity.ok(updatedMedicament);
        } catch (MedicamentNotFoundException e) {
            log.error("Médicament non trouvé: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du médicament", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la mise à jour");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicament(@PathVariable Long id) {
        log.info("Suppression du médicament avec ID: {}", id);
        medicamentService.deleteMedicament(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyMedicamentAvailability(@RequestBody List<Long> medicamentIds) {
        log.info("Vérification de la disponibilité pour {} médicaments", medicamentIds.size());
        boolean allAvailable = medicamentService.verifyMedicamentAvailability(medicamentIds);
        return ResponseEntity.ok(allAvailable);
    }
}`
                }, {
                    id: 'model',
                    title: 'Entity',
                    language: 'java',
                    code: `
                    package com.herve.intergiciel.PharmacyManager.Modele;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medicaments")
public class Medicament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String nom;

    private String description;

    @Column(name = "prix_unitaire", nullable = false)
    private double prixUnitaire;

    @Column(name = "quantite_stock", nullable = false)
    private int quantiteStock;

    @Column(name = "date_expiration")
    @Temporal(TemporalType.DATE)
    private Date dateExpiration;

    @Column(name = "fabriquant")
    private String fabriquant;

    @Column(name = "categorie")
    private String categorie;
}

`
                },
                {
                    id: 'dto',
                    title: 'DTO',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Dto;

import lombok.Data;

import java.util.Date;

@Data
public class MedicamentDTO {
    private String code;
    private String nom;
    private String description;
    private double prixUnitaire;
    private int quantiteStock;
    private Date dateExpiration;
    private String fabriquant;
    private String categorie;
}


`
                },
                {
                    id: 'mapper',
                    title: 'Mapper',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Config;


import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}

`
                },
                {
                    id: 'exception',
                    title: 'Exception',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Exception1;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.herve.intergiciel.PharmacyManager.Exception.MedicamentNotFoundException;


@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MedicamentNotFoundException.class)
    public ResponseEntity<String> handleMedicamentNotFoundException(MedicamentNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return new ResponseEntity<>("Une erreur est survenue: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

`
                },
                {
                    id: 'repository',
                    title: 'Repository',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.herve.intergiciel.PharmacyManager.Modele.Medicament;

import java.util.Optional;

@Repository
public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    Optional<Medicament> findByCode(String code);
    boolean existsByCode(String code);  // Notez le "_" pour accéder à l'ID du Patient
}
`

                },

                {
                    id: 'example-request',
                    title: 'Exemple Requête POST',
                    language: 'json',
                    code: `{
    "code": "MED123",
    "nom": "Médicament Test",
    "description": "Description du médicament test",
    "prixUnitaire": 10.0,
    "quantiteStock": 100,
    "dateExpiration": "2025-12-31",
    "fabriquant": "Fabriquant Test",
    "categorie": "Catégorie Test"
}`
                }

            ]
        },
        dossier: {
            name: "Dossier Médical",
            icon: <DossierIcon />,
            snippets: [
                {
                    id: 'dossier-service',
                    title: 'Service',
                    language: 'java',
                    code: `package com.herve.intergiciel.DossierManager.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.herve.intergiciel.DossierManager.DTO.DtoDossierMedical;
import com.herve.intergiciel.DossierManager.Exceptions.DossierMedicalErrorExceptions;
import com.herve.intergiciel.DossierManager.Modeles.DossierMedical;
import com.herve.intergiciel.DossierManager.Repositories.DossierMedicalRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DossierMedicalService {
    private DossierMedicalRepository dossierMedicalRepository;

    public DossierMedical create(DossierMedical dossierMedical) {
        return this.dossierMedicalRepository.save(dossierMedical);
    }

    public List<DtoDossierMedical> search() {
        return dossierMedicalRepository.findAll()
                .stream()
                .map(DtoDossierMedical::fromEntity)
                .collect(Collectors.toList());
    }

    public DossierMedical searchDossierMedicalById(Long id) {
        return dossierMedicalRepository.findById(id)
                .orElseThrow(() -> new DossierMedicalErrorExceptions("Dossier médical non trouvé avec l'ID " + id));
    }

    public boolean dossierMedicalExists(Long id) {
        return dossierMedicalRepository.existsById(id);
    }

    public DossierMedical updateDossierMedical(Long id, DossierMedical dossierMedical) {
        DossierMedical dossierToUpdate = dossierMedicalRepository.findById(id)
                .orElseThrow(() -> new DossierMedicalErrorExceptions("Dossier médical non trouvé avec l'ID : " + id));

        dossierToUpdate.setDateCreation(dossierMedical.getDateCreation());
        dossierToUpdate.setDiagnostique(dossierMedical.getDiagnostique());
        dossierToUpdate.setTraitement(dossierMedical.getTraitement());
        dossierToUpdate.setNotes(dossierMedical.getNotes());
        // Potentially update patient association if applicable

        return dossierMedicalRepository.save(dossierToUpdate);
    }

    public void delete(Long id) {
        if (!dossierMedicalRepository.existsById(id)) {
            throw new DossierMedicalErrorExceptions("Dossier médical non trouvé");
        } else {
            dossierMedicalRepository.deleteById(id);
        }
    }
}
    `
                }
            ]
        },
        diagnostic: {
            name: "Diagnostic",
            icon: <DiagnosticIcon />,
            snippets: [
                {
                    id: 'diagnostic-service',
                    title: 'Service',
                    language: 'java',
                    code: `package com.herve.intergiciel.DiagnosticManager.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.herve.intergiciel.DiagnosticManager.DTO.DtoDiagnostic;
import com.herve.intergiciel.DiagnosticManager.Exceptions.DiagnosticErrorExceptions;
import com.herve.intergiciel.DiagnosticManager.Modeles.Diagnostic;
import com.herve.intergiciel.DiagnosticManager.Repositories.DiagnosticRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DiagnosticService {
    private DiagnosticRepository diagnosticRepository;

    public Diagnostic create(Diagnostic diagnostic) {
        return this.diagnosticRepository.save(diagnostic);
    }

    public List<DtoDiagnostic> search() {
        return diagnosticRepository.findAll()
                .stream()
                .map(DtoDiagnostic::fromEntity)
                .collect(Collectors.toList());
    }

    public Diagnostic searchDiagnosticById(Long id) {
        return diagnosticRepository.findById(id)
                .orElseThrow(() -> new DiagnosticErrorExceptions("Diagnostic non trouvé avec l'ID " + id));
    }

    public boolean diagnosticExists(Long id) {
        return diagnosticRepository.existsById(id);
    }

    public Diagnostic updateDiagnostic(Long id, Diagnostic diagnostic) {
        Diagnostic diagnosticToUpdate = diagnosticRepository.findById(id)
                .orElseThrow(() -> new DiagnosticErrorExceptions("Diagnostic non trouvé avec l'ID : " + id));

        diagnosticToUpdate.setDateDiagnostic(diagnostic.getDateDiagnostic());
        diagnosticToUpdate.setResultat(diagnostic.getResultat());
        diagnosticToUpdate.setRecommandations(diagnostic.getRecommandations());
        // Potentially update patient or personnel association

        return diagnosticRepository.save(diagnosticToUpdate);
    }

    public void delete(Long id) {
        if (!diagnosticRepository.existsById(id)) {
            throw new DiagnosticErrorExceptions("Diagnostic non trouvé");
        } else {
            diagnosticRepository.deleteById(id);
        }
    }
}`
                }
            ]
        }
    };

    const currentSnippets = services[currentService].snippets;
    const safeTabValue = Math.min(tabValue, currentSnippets.length - 1);

    const drawer = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Toolbar>
                <Typography variant="h6" sx={{ my: 2 }}>
                    Services
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {Object.keys(services).map((key) => (
                    <ListItem button key={key} onClick={() => handleServiceChange(key)}>
                        <ListItemIcon>{services[key].icon}</ListItemIcon>
                        <ListItemText primary={services[key].name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <style>{customStyles}</style>

            <AppBar position="static" className="mb-8">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Documentation Technique
                    </Typography>
                    {!isMobile && (
                        <Tabs
                            value={currentService}
                            onChange={(e, newValue) => setCurrentService(newValue)}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="scrollable"
                        >
                            {Object.keys(services).map((key) => (
                                <Tab
                                    key={key}
                                    value={key}
                                    label={services[key].name}
                                    icon={services[key].icon}
                                    iconPosition="start"
                                />
                            ))}
                        </Tabs>
                    )}
                </Toolbar>
            </AppBar>

            <nav>
                <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>

            <Box className="p-8">
                <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
                    Documentation - {services[currentService].name}
                </Typography>

                <Paper className="mt-6 mb-6">
                    <Tabs
                        value={safeTabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                    >
                        {currentSnippets.map((snippet) => (
                            <Tab key={snippet.id} label={snippet.title} />
                        ))}
                    </Tabs>
                </Paper>

                <div className="mb-8">
                    {currentSnippets[safeTabValue] && (
                        <div className="relative rounded-lg overflow-hidden shadow-lg">
                            <div className="px-4 py-3 bg-gray-800 flex justify-between items-center rounded-t-lg">
                                <Typography variant="subtitle2" className="text-white">
                                    {currentSnippets[safeTabValue].title}
                                </Typography>
                                <Tooltip title={copiedId === currentSnippets[safeTabValue].id ? 'Copié!' : 'Copier'}>
                                    <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(currentSnippets[safeTabValue].code, currentSnippets[safeTabValue].id)}
                                        className="text-white hover:bg-gray-700"
                                    >
                                        {copiedId === currentSnippets[safeTabValue].id ?
                                            <CheckIcon fontSize="small" /> :
                                            <ContentCopyIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className="code-container">
                                <pre>
                                    <code ref={codeRef} className={`language-${currentSnippets[safeTabValue].language}`}>
                                        {currentSnippets[safeTabValue].code}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                <Divider className="my-8" />

                <Typography variant="h5" gutterBottom className="text-white">
                    Structure de l'API
                </Typography>

                <Accordion className="mb-4">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Endpoints disponibles</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="bg-gray-500 text-black p-4 rounded-lg">
                            <pre className="m-0">
                                <code className="language-java text-black">
                                    {currentService === 'patient' && `// Endpoints Patient
POST   /patient/create       - Créer un patient
GET    /patient              - Lister tous les patients
GET    /patient/{id}         - Récupérer un patient par ID
PUT    /patient/update/{id}  - Mettre à jour un patient
DELETE /patient/delete/{id}  - Supprimer un patient
POST   /patient/exists/{id}  - Vérifier l'existence d'un patient`}
                                    {currentService === 'personnel' && `// Endpoints Personnel
POST   /personnel/create     - Ajouter un membre du personnel
GET    /personnel            - Lister tout le personnel
GET    /personnel/{id}       - Récupérer un membre du personnel par ID
PUT    /personnel/update/{id}- Mettre à jour un membre du personnel
DELETE /personnel/delete/{id}- Supprimer un membre du personnel
POST   /personnel/exists/{id}- Vérifier l'existence d'un membre du personnel`}
                                    {currentService === 'pharmacy' && `// Endpoints Pharmacy
POST   /pharmacy/create      - Ajouter un médicament
GET    /pharmacy             - Lister tous les médicaments
GET    /pharmacy/{id}        - Récupérer un médicament par ID
PUT    /pharmacy/update/{id} - Mettre à jour un médicament
DELETE /pharmacy/delete/{id} - Supprimer un médicament
POST   /pharmacy/exists/{id} - Vérifier l'existence d'un médicament`}
                                    {currentService === 'dossier' && `// Endpoints Dossier Médical
POST   /dossier/create       - Créer un dossier médical
GET    /dossier              - Lister tous les dossiers médicaux
GET    /dossier/{id}         - Récupérer un dossier médical par ID
PUT    /dossier/update/{id}  - Mettre à jour un dossier médical
DELETE /dossier/delete/{id}  - Supprimer un dossier médical
POST   /dossier/exists/{id}  - Vérifier l'existence d'un dossier médical`}
                                    {currentService === 'diagnostic' && `// Endpoints Diagnostic
POST   /diagnostic/create    - Créer un diagnostic
GET    /diagnostic           - Lister tous les diagnostics
GET    /diagnostic/{id}      - Récupérer un diagnostic par ID
PUT    /diagnostic/update/{id}- Mettre à jour un diagnostic
DELETE /diagnostic/delete/{id}- Supprimer un diagnostic
POST   /diagnostic/exists/{id}- Vérifier l'existence d'un diagnostic`}
                                </code>
                            </pre>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
};

export default Doctechnique;