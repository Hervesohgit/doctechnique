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
import Prism from 'prismjs';
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

    public Patient serchPatientById(Long id) {
        return infoPatientRepository.findById(id)
                .orElseThrow(() -> new PatientErrorExceptions("Not patient with ID " + id));
    }

    public boolean patientexists(Long id) {
        return infoPatientRepository.existsById(id);
    }

    public Patient updatePatient(Long id, Patient infoPatient) {
        Patient patientToUpdate = infoPatientRepository.findById(id)
                .orElseThrow(() -> new PatientErrorExceptions("Patient non trouvé avec l'ID : " + id));

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

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.herve.intergiciel.PatientManager.DTO.DtoPatient;
import com.herve.intergiciel.PatientManager.Modeles.Patient;
import com.herve.intergiciel.PatientManager.Services.PatientService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/patient")
@AllArgsConstructor
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

    // definition des types de valeur que contiendra le genre
    // definition des types de valeur que contiendra le groupe sanguin
   


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
                    code: `@Data
public class DtoPatient {
    private Long idPat;
    private String nomPat;
    private String prenomPat;
    private int age;
}`
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
                    id: 'personnel-service',
                    title: 'Service',
                    language: 'java',
                    code: `package com.herve.intergiciel.PersonnelManager.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.herve.intergiciel.PersonnelManager.DTO.DtoPersonnel;
import com.herve.intergiciel.PersonnelManager.Exceptions.PersonnelErrorExceptions;
import com.herve.intergiciel.PersonnelManager.Modeles.Personnel;
import com.herve.intergiciel.PersonnelManager.Repositories.PersonnelRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PersonnelService {
    private PersonnelRepository personnelRepository;

    public Personnel create(Personnel personnel) {
        return this.personnelRepository.save(personnel);
    }

    public List<DtoPersonnel> search() {
        return personnelRepository.findAll()
                .stream()
                .map(DtoPersonnel::fromEntity)
                .collect(Collectors.toList());
    }

    public Personnel searchPersonnelById(Long id) {
        return personnelRepository.findById(id)
                .orElseThrow(() -> new PersonnelErrorExceptions("Personnel non trouvé avec l'ID " + id));
    }

    public boolean personnelExists(Long id) {
        return personnelRepository.existsById(id);
    }

    public Personnel updatePersonnel(Long id, Personnel personnel) {
        Personnel personnelToUpdate = personnelRepository.findById(id)
                .orElseThrow(() -> new PersonnelErrorExceptions("Personnel non trouvé avec l'ID : " + id));

        personnelToUpdate.setName(personnel.getName());
        personnelToUpdate.setPrenom(personnel.getPrenom());
        personnelToUpdate.setTel(personnel.getTel());
        personnelToUpdate.setDateN(personnel.getDateN());
        personnelToUpdate.setEmail(personnel.getEmail());
        personnelToUpdate.setRole(personnel.getRole());
        personnelToUpdate.setSexe(personnel.getSexe());
        personnelToUpdate.setAddr(personnel.getAddr());

        return personnelRepository.save(personnelToUpdate);
    }

    public void delete(Long id) {
        if (!personnelRepository.existsById(id)) {
            throw new PersonnelErrorExceptions("Personnel non trouvé");
        } else {
            personnelRepository.deleteById(id);
        }
    }
}`
                },
                {
                    id: 'personnel-controller',
                    title: 'Controller',
                    language: 'java',
                    code: `package com.herve.intergiciel.PersonnelManager.Controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.herve.intergiciel.PersonnelManager.DTO.DtoPersonnel;
import com.herve.intergiciel.PersonnelManager.Modeles.Personnel;
import com.herve.intergiciel.PersonnelManager.Services.PersonnelService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/personnel")
@AllArgsConstructor
public class PersonnelController {
    private final PersonnelService personnelService;

    @PostMapping(path = "/create", consumes = "application/json")
    public ResponseEntity<Personnel> create(@RequestBody Personnel personnel) {
        return ResponseEntity.ok(personnelService.create(personnel));
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<?> search() {
        List<DtoPersonnel> personnelList = personnelService.search();
        if (personnelList.isEmpty()) {
            return ResponseEntity.ok("Aucun personnel trouvé");
        }
        return ResponseEntity.ok(personnelList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> searchPersonnelById(@PathVariable Long id) {
        return ResponseEntity.ok(personnelService.searchPersonnelById(id));
    }

    @PutMapping(path = "/update/{id}", consumes = "application/json")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Personnel personnel) {
        if (!id.equals(personnel.getIdPers())) {
            return ResponseEntity.badRequest().body("ID dans l'URL ne correspond pas au corps de la requête");
        }
        try {
            return ResponseEntity.ok(personnelService.updatePersonnel(id, personnel));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        personnelService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/exists/{id}")
    public ResponseEntity<Boolean> personnelExists(@PathVariable Long id) {
        boolean exists = personnelService.personnelExists(id);
        if (!exists) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exists);
    }
}`
                },
                {
                    id: 'personnel-model',
                    title: 'Entity',
                    language: 'java',
                    code: `package com.herve.intergiciel.PersonnelManager.Modeles;

import java.sql.Date;

import com.herve.intergiciel.PersonnelManager.Enum.Genre;
import com.herve.intergiciel.PersonnelManager.Enum.RolePersonnel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Entity
@Data
@Table(name = "personnel")
public class Personnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPers;

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

    @NotNull(message = "Le rôle du personnel est obligatoire")
    private RolePersonnel role;
}
`
                },
                {
                    id: 'personnel-dto',
                    title: 'DTO',
                    language: 'java',
                    code: `@Data
public class DtoPersonnel {
    private Long idPers;
    private String nomPers;
    private String prenomPers;
    private String role;
}`
                },
                {
                    id: 'personnel-example-request',
                    title: 'Exemple Requête POST',
                    language: 'json',
                    code: `{
  "name": "Martin",
  "prenom": "Sophie",
  "tel": "+33698765432",
  "addr": "456 Avenue Example, Lyon",
  "sexe": "F",
  "dateN": "1985-05-10",
  "email": "sophie.martin@example.com",
  "role": "MEDECIN"
}`
                }
            ]
        },
        pharmacy: {
            name: "Pharmacy",
            icon: <PharmacyIcon />,
            snippets: [
                {
                    id: 'pharmacy-service',
                    title: 'Service',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.herve.intergiciel.PharmacyManager.DTO.DtoMedicament;
import com.herve.intergiciel.PharmacyManager.Exceptions.PharmacyErrorExceptions;
import com.herve.intergiciel.PharmacyManager.Modeles.Medicament;
import com.herve.intergiciel.PharmacyManager.Repositories.MedicamentRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PharmacyService {
    private MedicamentRepository medicamentRepository;

    public Medicament create(Medicament medicament) {
        return this.medicamentRepository.save(medicament);
    }

    public List<DtoMedicament> search() {
        return medicamentRepository.findAll()
                .stream()
                .map(DtoMedicament::fromEntity)
                .collect(Collectors.toList());
    }

    public Medicament searchMedicamentById(Long id) {
        return medicamentRepository.findById(id)
                .orElseThrow(() -> new PharmacyErrorExceptions("Médicament non trouvé avec l'ID " + id));
    }

    public boolean medicamentExists(Long id) {
        return medicamentRepository.existsById(id);
    }

    public Medicament updateMedicament(Long id, Medicament medicament) {
        Medicament medicamentToUpdate = medicamentRepository.findById(id)
                .orElseThrow(() -> new PharmacyErrorExceptions("Médicament non trouvé avec l'ID : " + id));

        medicamentToUpdate.setName(medicament.getName());
        medicamentToUpdate.setDescription(medicament.getDescription());
        medicamentToUpdate.setPrix(medicament.getPrix());
        medicamentToUpdate.setQuantite(medicament.getQuantite());

        return medicamentRepository.save(medicamentToUpdate);
    }

    public void delete(Long id) {
        if (!medicamentRepository.existsById(id)) {
            throw new PharmacyErrorExceptions("Médicament non trouvé");
        } else {
            medicamentRepository.deleteById(id);
        }
    }
}`
                },
                {
                    id: 'pharmacy-controller',
                    title: 'Controller',
                    language: 'java',
                    code: `package com.herve.intergiciel.PharmacyManager.Controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.herve.intergiciel.PharmacyManager.DTO.DtoMedicament;
import com.herve.intergiciel.PharmacyManager.Modeles.Medicament;
import com.herve.intergiciel.PharmacyManager.Services.PharmacyService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/pharmacy")
@AllArgsConstructor
public class PharmacyController {
    private final PharmacyService pharmacyService;

    @PostMapping(path = "/create", consumes = "application/json")
    public ResponseEntity<Medicament> create(@RequestBody Medicament medicament) {
        return ResponseEntity.ok(pharmacyService.create(medicament));
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<?> search() {
        List<DtoMedicament> medicaments = pharmacyService.search();
        if (medicaments.isEmpty()) {
            return ResponseEntity.ok("Aucun médicament trouvé");
        }
        return ResponseEntity.ok(medicaments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> searchMedicamentById(@PathVariable Long id) {
        return ResponseEntity.ok(pharmacyService.searchMedicamentById(id));
    }

    @PutMapping(path = "/update/{id}", consumes = "application/json")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Medicament medicament) {
        if (!id.equals(medicament.getIdMed())) {
            return ResponseEntity.badRequest().body("ID dans l'URL ne correspond pas au corps de la requête");
        }
        try {
            return ResponseEntity.ok(pharmacyService.updateMedicament(id, medicament));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        pharmacyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/exists/{id}")
    public ResponseEntity<Boolean> medicamentExists(@PathVariable Long id) {
        boolean exists = pharmacyService.medicamentExists(id);
        if (!exists) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exists);
    }
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
}`
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