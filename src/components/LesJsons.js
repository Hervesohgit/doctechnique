
import React  from "react";
import {
    ExpandMore as ExpandMoreIcon,
    MeetingRoom as RendezVousIcon,
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
import 'prismjs/components/prism-properties';

export const services = {
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
                    id: 'config',
                    title: 'Configuration',
                    language: 'properties',
                    code:
                    `
# Configuration du service patient pour Spring Boot

# Nom de l'application
spring.application.name=patient-service

# Port du serveur
server.port=8000

# Database (adaptez pour la prod)
spring.datasource.url=jdbc:mysql://localhost:3306/bdpat
spring.datasource.username=root
spring.datasource.password=root

# Activer le debug
logging.level.org.springframework=DEBUG
logging.level.org.hibernate=INFO
logging.level.com.yourpackage=TRACE

# Désactiver la mise à jour automatique du schéma en prod
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate JPA
# spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Configuration d'Eureka (si utilisé)
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.prefer-ip-address=true


# # Configuration de logging
# logging.level.org.springframework=INFO
# logging.level.com.yourcompany=DEBUG

pharmacy.service.url=http://localhost:8003
employer.service.url=http://localhost:8001

                    `

                },
                {
                    id: 'dependences',
                    title: 'Dependences',
                    language: 'xml',
                    code: `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.4.4</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.herve.intergiciel</groupId>
	<artifactId>PatientManager</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>PatientManager</name>
	<description>Microservice de gestion des patients(CRUD, etc)</description>
	<url/>
	<licenses>
		<license/>
	</licenses>
	<developers>
		<developer/>
	</developers>
	<scm>
		<connection/>
		<developerConnection/>
		<tag/>
		<url/>
	</scm>
	<properties>
		<java.version>17</java.version>
		<spring-cloud.version>2024.0.1</spring-cloud.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
		<!-- depences pour les validations des attribut comme par exemple @NotNull -->
		<dependency>
    		<groupId>org.springframework.boot</groupId>
    		<artifactId>spring-boot-starter-validation</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-openfeign</artifactId>
		</dependency>

		
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-config</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
		</dependency>

		<dependency>
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<scope>runtime</scope>
		</dependency>

		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-databind</artifactId>
		</dependency>

		<!-- <dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency> -->

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
    	<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<version>1.18.32</version> <!-- Version plus récente -->
			<scope>provided</scope>
		</dependency>

		
	</dependencies>
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>\${spring-cloud.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<build>
    <plugins>
        <!-- Plugin Spring Boot pour créer un JAR exécutable -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
		 <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <source>\${java.version}</source>
                <target>\${java.version}</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>1.18.32</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>

</project>


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
        RendezVous: {
            name: "Rendez-Vous",
            icon: <RendezVousIcon />,
            snippets: [
                {
                    id: 'service',
                    title: 'Service',
                    language: 'java',
                    code: `package herve.com.pro.rdv.Services;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import herve.com.pro.rdv.DTOS.Patient;
import herve.com.pro.rdv.DTOS.Personnel;
import herve.com.pro.rdv.Enum.Liststatus;
import herve.com.pro.rdv.Exceptions.EmailException;
import herve.com.pro.rdv.FeignClient.PatientClient;
import herve.com.pro.rdv.FeignClient.PersonnelClient;
import herve.com.pro.rdv.Modele.Rendezvous;
import herve.com.pro.rdv.Repository.RdvRepository;
import jakarta.mail.internet.MimeMessage;

@Service
public class RdvServices {

    private final RdvRepository rdvRepository;
    private final PatientClient patientClient;
    private final PersonnelClient personnelClient;
    private final JavaMailSender mailSender;

    public RdvServices(RdvRepository rdvRepository, PatientClient patientClient, 
                      PersonnelClient personnelClient, JavaMailSender mailSender) {
        this.rdvRepository = rdvRepository;
        this.patientClient = patientClient;
        this.personnelClient = personnelClient;
        this.mailSender = mailSender;
    }

    public List<Rendezvous> getAllRendezvous() {
        return rdvRepository.findAll();
    }

    public Rendezvous getRendezvousById(Long id) {
        return rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
    }

    public Rendezvous createRendezvous(Rendezvous rendezvous) {
        Patient patient = patientClient.searchPatientById(rendezvous.getPatient());
        if (patient == null) {
            throw new RuntimeException("Patient not found");
        }
        Personnel personnel = personnelClient.getEmployeById(rendezvous.getPersonnel());
        if (personnel == null) {
            throw new RuntimeException("Personnel not found");
        }
        
        // Set status as pending confirmation
        rendezvous.setStatus(Liststatus.PENDING_CONFIRMATION);
        Rendezvous savedRdv = rdvRepository.save(rendezvous);

        sendConfirmationRequestToPersonnel(patient, personnel, savedRdv);

        return savedRdv;
    }

    public void confirmRendezvous(Long rdvId) {
        Rendezvous rdv = rdvRepository.findById(rdvId)
            .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
        
        rdv.setStatus(Liststatus.CONFIRMED);
        rdvRepository.save(rdv);
        
        Patient patient = patientClient.searchPatientById(rdv.getPatient());
        Personnel personnel = personnelClient.getEmployeById(rdv.getPersonnel());
        
        sendConfirmationToPatient(patient, personnel, rdv);
    }

    public void rejectRendezvous(Long rdvId) {
        Rendezvous rdv = rdvRepository.findById(rdvId)
            .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
        
        rdv.setStatus(Liststatus.CANCELED);
        rdvRepository.save(rdv);
        
        Patient patient = patientClient.searchPatientById(rdv.getPatient());
        Personnel personnel = personnelClient.getEmployeById(rdv.getPersonnel());
        
        sendRejectionToPatient(patient, personnel, rdv);
    }

    private void sendConfirmationRequestToPersonnel(Patient patient, Personnel personnel, Rendezvous rdv) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(personnel.getEmail());
            helper.setSubject("Demande de confirmation de rendez-vous avec " + patient.getName());

            String confirmUrl = "http://localhost:8080/rdv/confirm/" + rdv.getId();
            String rejectUrl = "http://localhost:8080/rdv/reject/" + rdv.getId();

            String content = String.format(
                    "<h3>Bonjour %s,</h3>" +
                    "<p>Vous avez une nouvelle demande de rendez-vous avec <strong>%s</strong> :</p>" +
                    "<ul>" +
                    "<li><strong>Date :</strong> %s</li>" +
                    "<li><strong>Lieu :</strong> %s</li>" +
                    "<li><strong>Motif :</strong> %s</li>" +
                    "<li><strong>Contact patient :</strong> %s</li>" +
                    "</ul>" +
                    "<p>Veuillez confirmer ou refuser ce rendez-vous :</p>" +
                    "<div style=\"margin-top: 20px;\">" +
                    "<a href=\"%s\" style=\"background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; margin-right: 10px;\">Confirmer</a>" +
                    "<a href=\"%s\" style=\"background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;\">Refuser</a>" +
                    "</div>" +
                    "<p style=\"margin-top: 20px;\">Ou copiez ces liens dans votre navigateur :</p>" +
                    "<p>Confirmation : %s</p>" +
                    "<p>Refus : %s</p>" +
                    "<p>Cordialement,<br>Votre équipe médicale</p>",
                    personnel.getNom(),
                    patient.getName(),
                    rdv.getDateTime()
                            .format(DateTimeFormatter.ofPattern("EEEE dd MMMM yyyy 'à' HH'h'mm", Locale.FRENCH)),
                    rdv.getLieu(),
                    rdv.getMotif(),
                    patient.getEmail(),
                    confirmUrl,
                    rejectUrl,
                    confirmUrl,
                    rejectUrl
            );

            helper.setText(content, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailException("Échec d'envoi de la demande de confirmation au personnel");
        }
    }

    private void sendConfirmationToPatient(Patient patient, Personnel personnel, Rendezvous rdv) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(patient.getEmail());
            helper.setSubject("Confirmation de votre rendez-vous avec " + personnel.getNom());

            String content = String.format(
                    "<h3>Bonjour %s,</h3>" +
                    "<p>Votre rendez-vous avec <strong>%s</strong> a été confirmé :</p>" +
                    "<ul>" +
                    "<li><strong>Date :</strong> %s</li>" +
                    "<li><strong>Lieu :</strong> %s</li>" +
                    "<li><strong>Motif :</strong> %s</li>" +
                    "</ul>" +
                    "<p>Nous vous remercions pour votre confiance et vous attendons à la date convenue.</p>" +
                    "<p>Cordialement,<br>%s</p>",
                    patient.getName(),
                    personnel.getNom(),
                    rdv.getDateTime()
                            .format(DateTimeFormatter.ofPattern("EEEE dd MMMM yyyy 'à' HH'h'mm", Locale.FRENCH)),
                    rdv.getLieu(),
                    rdv.getMotif(),
                    personnel.getNom()
            );

            helper.setText(content, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailException("Échec d'envoi de la confirmation au patient");
        }
    }

    private void sendRejectionToPatient(Patient patient, Personnel personnel, Rendezvous rdv) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(patient.getEmail());
            helper.setSubject("Annulation de votre rendez-vous avec " + personnel.getNom());

            String content = String.format(
                    "<h3>Bonjour %s,</h3>" +
                    "<p>Nous regrettons de vous informer que votre rendez-vous avec <strong>%s</strong> a été annulé :</p>" +
                    "<ul>" +
                    "<li><strong>Date prévue :</strong> %s</li>" +
                    "<li><strong>Lieu :</strong> %s</li>" +
                    "<li><strong>Motif :</strong> %s</li>" +
                    "</ul>" +
                    "<p>Nous vous prions de nous excuser pour ce contretemps.</p>" +
                    "<p>Veuillez prendre un nouveau rendez-vous si nécessaire.</p>" +
                    "<p>Cordialement,<br>%s</p>",
                    patient.getName(),
                    personnel.getNom(),
                    rdv.getDateTime()
                            .format(DateTimeFormatter.ofPattern("EEEE dd MMMM yyyy 'à' HH'h'mm", Locale.FRENCH)),
                    rdv.getLieu(),
                    rdv.getMotif(),
                    personnel.getNom()
            );

            helper.setText(content, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailException("Échec d'envoi de l'annulation au patient");
        }
    }
}
    `
                },
                {
                    id: 'controller',
                    title: 'Controller',
                    language: 'java',
                    code: `package herve.com.pro.rdv.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import herve.com.pro.rdv.Modele.Rendezvous;
import herve.com.pro.rdv.Services.RdvServices;
import lombok.Data;

@RestController
@RequestMapping("/rdv")
@Data
public class RdvController {
    private final RdvServices rdvServices;

    // Endpoint pour confirmer un rendez-vous
    @PostMapping("/confirm/{id}")
    public Rendezvous confirmRendezvous(@PathVariable Long id) {
        rdvServices.confirmRendezvous(id);
        return rdvServices.getRendezvousById(id); 
    }

    // Endpoint pour rejeter un rendez-vous
    @PostMapping("/reject/{id}")
    public Rendezvous rejectRendezvous(@PathVariable Long id) {
        rdvServices.rejectRendezvous(id);
        return rdvServices.getRendezvousById(id); 
    }
    // Afficher les rendez-vous
    @GetMapping
    public ResponseEntity<List<Rendezvous>> getRdv() {
        List<Rendezvous> rendezvous = rdvServices.getAllRendezvous();
        if (rendezvous.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(rendezvous);
    }

    // creer new rendezvous
    @PostMapping
    public ResponseEntity<Rendezvous> createRdv(@RequestBody Rendezvous rendezvous) {

        return ResponseEntity.ok(rdvServices.createRendezvous(rendezvous));
    }

}
`
                },
                {
                    id: 'entity',
                    title:'Entity',
                    language: 'java',
                    code: `
package herve.com.pro.rdv.Modele;

import java.time.LocalDateTime;

import herve.com.pro.rdv.Enum.Liststatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Rendezvous {

   

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patient;

    @Column(nullable = false)
    private Long personnel;

    private String title;

    private String motif;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private String lieu;

    private Liststatus status; // PENDING_CONFIRMATION, CONFIRMED, CANCELED
}
                    `

                },
                {
                    id:'dto',
                    title:'DTO',
                    language: 'java',
                    code: `
//file Patient.java
package herve.com.pro.rdv.DTOS;

import lombok.Data;

@Data
public class Patient {
    private Long id;
    private String name;
    private String email;

}

//file Personnel.java

package herve.com.pro.rdv.DTOS;

import lombok.Data;

@Data
public class Personnel {
    private Long id;
    private String nom;
    private String email;
}

`
                }
                ,
                {
                    id: 'client',
                    title: 'CLient',
                    language: 'java',
                    code: `
//file patientClient.java
package herve.com.pro.rdv.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import herve.com.pro.rdv.DTOS.Patient;

@FeignClient(name = "patient-service", url = "\${patient.service.url}")
public interface PatientClient {
    @GetMapping("/patient/{id}")
    Patient searchPatientById(@PathVariable Long id);

    @PostMapping("/patient/exists/{id}")
    boolean patientExists(@PathVariable Long id);

}

//file personnelClient.java
package herve.com.pro.rdv.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import herve.com.pro.rdv.DTOS.Personnel;

@FeignClient(name = "personnel-service", url = "\${personnel.service.url}")
public interface PersonnelClient {

   @GetMapping("/rh/employe/{id}")
    Personnel getEmployeById(@PathVariable Long id);

    
    @GetMapping("/rh/employe/exists/{id}")
    boolean employeExists(@PathVariable Long id); 

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
                    code: `package herve.pro.intergiciel.dosmed.Services;

import herve.pro.intergiciel.dosmed.DTO.HistoricalRequest;
import herve.pro.intergiciel.dosmed.Exceptions.HistoricalNotFoundException;
import herve.pro.intergiciel.dosmed.Repository.HistoricalRepository;
import herve.pro.intergiciel.dosmed.feignClient.PatientServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import herve.pro.intergiciel.dosmed.Modeles.Historical;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HistoricalService {

    private final HistoricalRepository historicalRepository;
    private final PatientServiceClient patientServiceClient;

    public  Historical createHistorical(HistoricalRequest historical) {
        try {
            Historical historicalEntity = new Historical();
            
            historicalEntity.setAllergy(historical.getAllergy());
            historicalEntity.setAntecedent(historical.getAntecedent());
            historicalEntity.setMalEncours(historical.getMalEncours());
            historicalEntity.setDocuments(historical.getDocuments());
            historicalEntity.setPatient(historical.getPatient());
            
            if (!patientServiceClient.patientExists(historical.getPatient())) {
                throw new HistoricalNotFoundException("Patient non trouvé avec l'ID : " + historical.getPatient());
            } else {

                return historicalRepository.save(historicalEntity);
            }

        } catch (DataIntegrityViolationException e) {
            throw new HistoricalNotFoundException("Violation de contrainte : " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<Historical> getAllHistoricals() {
        return historicalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Historical getHistoricalById(Long id) {
        return historicalRepository.findById(id)
                .orElseThrow(() -> new HistoricalNotFoundException("Historique non trouvé avec l'ID : " + id));
    }

    public Historical updateHistorical(Long id, Historical historicalDetails) {
        Historical historical = historicalRepository.findById(id)
                .orElseThrow(() -> new HistoricalNotFoundException("Historique non trouvé avec l'ID : " + id));

        historical.setAllergy(historicalDetails.getAllergy());
        historical.setAntecedent(historicalDetails.getAntecedent());
        historical.setMalEncours(historicalDetails.getMalEncours());
        historical.setDocuments(historicalDetails.getDocuments());
        
        // Ne mettez à jour le patient que si nécessaire (car champ unique)
        if (!historical.getPatient().equals(historicalDetails.getPatient())) {
            historical.setPatient(historicalDetails.getPatient());
        }

        return historicalRepository.save(historical);
    }

    public void deleteHistorical(Long id) {
        if (!historicalRepository.existsById(id)) {
            throw new HistoricalNotFoundException("Historique non trouvé avec l'ID : " + id);
        }
        historicalRepository.deleteById(id);
    }


}`
                },
                {
                    id: 'diagnostic-controller',
                    title: 'Controller',
                    language: 'java',
                    code: `package herve.pro.intergiciel.dosmed.CONTROLLER;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import herve.pro.intergiciel.dosmed.DTO.HistoricalRequest;
import herve.pro.intergiciel.dosmed.Modeles.Historical;
import herve.pro.intergiciel.dosmed.Services.HistoricalService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dossier")
@RequiredArgsConstructor
// @CrossOrigin(origins = "*")
public class DossierController {

    private final HistoricalService historicalService;
    // private final ObjectMapper objectMapper;

    @PostMapping("/create")
    public ResponseEntity<?> createDossier(@RequestBody HistoricalRequest request) {
        try {
            Historical historical = historicalService.createHistorical(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(historical);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Conflit de données : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur interne : " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Historical>> getAllDossiers() {
        return ResponseEntity.ok(historicalService.getAllHistoricals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Historical> getHistoricalById(@PathVariable Long id) {
        return ResponseEntity.ok(historicalService.getHistoricalById(id));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateHistorical(
            @PathVariable Long id,
            @RequestBody Historical historical) {
        if (!id.equals(historical.getId())) {
            return ResponseEntity.badRequest().body("ID in URL ne correspond pas au corps de la requête");
        }
        try {
            return ResponseEntity.ok(historicalService.updateHistorical(id, historical));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteHistorical(@PathVariable Long id) {
        historicalService.deleteHistorical(id);
        return ResponseEntity.noContent().build();
    }
}
`
                }
            ]
        }
    };