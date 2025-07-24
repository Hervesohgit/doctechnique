// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Chip,
//   Divider,
//   TextField,
//   Button,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import {
//   ExpandMore as ExpandMoreIcon,
//   Code as CodeIcon,
//   ContentCopy as ContentCopyIcon,
//   Check as CheckIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { format } from 'date-fns';

// const API_BASE_URL = 'http://localhost:8080/patient'; // Ajustez selon votre configuration

// const PatientAPIDocumentation = () => {
//   const [expanded, setExpanded] = useState(null);
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(null);
//   const [newPatient, setNewPatient] = useState({
//     idPat: '',
//     nomPat: '',
//     prenomPat: '',
//     dateNaissance: '',
//     sexe: '',
//     adresse: '',
//     telephone: ''
//   });

//   const handleChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   const copyToClipboard = (text, endpoint) => {
//     navigator.clipboard.writeText(text);
//     setCopied(endpoint);
//     setTimeout(() => setCopied(null), 2000);
//   };

//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(API_BASE_URL);
//       setPatients(response.data);
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreatePatient = async () => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/create`, newPatient);
//       alert('Patient créé avec succès: ' + JSON.stringify(response.data));
//       fetchPatients();
//     } catch (error) {
//       console.error('Error creating patient:', error);
//       alert('Erreur lors de la création: ' + error.message);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const endpoints = [
//     {
//       method: 'POST',
//       path: '/create',
//       description: 'Créer un nouveau patient',
//       requestBody: {
//         idPat: 'Long',
//         nomPat: 'String',
//         prenomPat: 'String',
//         dateNaissance: 'Date (yyyy-MM-dd)',
//         sexe: 'String',
//         adresse: 'String',
//         telephone: 'String'
//       },
//       response: 'Patient object'
//     },
//     {
//       method: 'GET',
//       path: '/',
//       description: 'Lister tous les patients',
//       response: 'List<DtoPatient> ou message "Aucun patient trouvé"'
//     },
//     {
//       method: 'GET',
//       path: '/{id}',
//       description: 'Récupérer un patient par son ID',
//       response: 'Patient object'
//     },
//     {
//       method: 'PUT',
//       path: '/update/{id}',
//       description: 'Mettre à jour un patient',
//       requestBody: 'Patient object',
//       response: 'Patient mis à jour ou message d\'erreur'
//     },
//     {
//       method: 'DELETE',
//       path: '/delete/{id}',
//       description: 'Supprimer un patient',
//       response: '204 No Content'
//     },
//     {
//       method: 'POST',
//       path: '/exists/{id}',
//       description: 'Vérifier l\'existence d\'un patient',
//       response: 'Boolean (true/false) ou 404 Not Found'
//     }
//   ];

//   const getMethodColor = (method) => {
//     switch (method) {
//       case 'GET': return 'success';
//       case 'POST': return 'primary';
//       case 'PUT': return 'warning';
//       case 'DELETE': return 'error';
//       default: return 'default';
//     }
//   };

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Documentation Technique - API PatientManager
//       </Typography>
      
//       <Typography variant="body1" paragraph>
//         Cette API permet de gérer les patients avec les opérations CRUD standard.
//         L'URL de base est <code>{API_BASE_URL}</code>.
//       </Typography>

//       <Divider sx={{ my: 4 }} />

//       <Typography variant="h5" gutterBottom>
//         Endpoints disponibles
//       </Typography>

//       {endpoints.map((endpoint, index) => (
//         <Accordion
//           key={index}
//           expanded={expanded === `panel${index}`}
//           onChange={handleChange(`panel${index}`)}
//           sx={{ mb: 2 }}
//         >
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Chip
//                 label={endpoint.method}
//                 color={getMethodColor(endpoint.method)}
//                 size="small"
//               />
//               <Typography sx={{ fontWeight: 'bold' }}>
//                 {endpoint.path}
//               </Typography>
//               <Typography sx={{ color: 'text.secondary' }}>
//                 {endpoint.description}
//               </Typography>
//             </Box>
//           </AccordionSummary>
//           <AccordionDetails>
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2">Description:</Typography>
//               <Typography>{endpoint.description}</Typography>
//             </Box>

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2">URL complète:</Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <CodeIcon fontSize="small" />
//                 <code>{API_BASE_URL}{endpoint.path}</code>
//                 <Tooltip title={copied === `url${index}` ? 'Copié!' : 'Copier'}>
//                   <IconButton
//                     size="small"
//                     onClick={() => copyToClipboard(`${API_BASE_URL}${endpoint.path}`, `url${index}`)}
//                   >
//                     {copied === `url${index}` ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {endpoint.requestBody && (
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="subtitle2">Corps de la requête:</Typography>
//                 <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
//                   <pre style={{ margin: 0 }}>
//                     {typeof endpoint.requestBody === 'string' 
//                       ? endpoint.requestBody 
//                       : JSON.stringify(endpoint.requestBody, null, 2)}
//                   </pre>
//                   <Tooltip title={copied === `body${index}` ? 'Copié!' : 'Copier'}>
//                     <IconButton
//                       size="small"
//                       sx={{ position: 'absolute', top: 4, right: 4 }}
//                       onClick={() => copyToClipboard(
//                         typeof endpoint.requestBody === 'string' 
//                           ? endpoint.requestBody 
//                           : JSON.stringify(endpoint.requestBody, null, 2),
//                         `body${index}`
//                       )}
//                     >
//                       {copied === `body${index}` ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
//                     </IconButton>
//                   </Tooltip>
//                 </Paper>
//               </Box>
//             )}

//             <Box>
//               <Typography variant="subtitle2">Réponse:</Typography>
//               <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
//                 <pre style={{ margin: 0 }}>{endpoint.response}</pre>
//                 <Tooltip title={copied === `response${index}` ? 'Copié!' : 'Copier'}>
//                   <IconButton
//                     size="small"
//                     sx={{ position: 'absolute', top: 4, right: 4 }}
//                     onClick={() => copyToClipboard(endpoint.response, `response${index}`)}
//                   >
//                     {copied === `response${index}` ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
//                   </IconButton>
//                 </Tooltip>
//               </Paper>
//             </Box>
//           </AccordionDetails>
//         </Accordion>
//       ))}

//       <Divider sx={{ my: 4 }} />

//       <Typography variant="h5" gutterBottom>
//         Tester l'API
//       </Typography>

//       <Box sx={{ mb: 4 }}>
//         <Typography variant="subtitle1" gutterBottom>
//           Créer un nouveau patient
//         </Typography>
//         <Paper sx={{ p: 3, mb: 3 }}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
//             {Object.keys(newPatient).map((field) => (
//               <TextField
//                 key={field}
//                 label={field}
//                 variant="outlined"
//                 size="small"
//                 value={newPatient[field]}
//                 onChange={(e) => setNewPatient({ ...newPatient, [field]: e.target.value })}
//               />
//             ))}
//           </Box>
//           <Button
//             variant="contained"
//             onClick={handleCreatePatient}
//             sx={{ mt: 2 }}
//           >
//             Créer Patient
//           </Button>
//         </Paper>

//         <Typography variant="subtitle1" gutterBottom>
//           Liste des patients
//         </Typography>
//         <Button
//           variant="outlined"
//           onClick={fetchPatients}
//           disabled={loading}
//           sx={{ mb: 2 }}
//         >
//           {loading ? 'Chargement...' : 'Rafraîchir la liste'}
//         </Button>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Nom</TableCell>
//                 <TableCell>Prénom</TableCell>
//                 <TableCell>Date Naissance</TableCell>
//                 <TableCell>Sexe</TableCell>
//                 <TableCell>Adresse</TableCell>
//                 <TableCell>Téléphone</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {patients.length > 0 ? (
//                 patients.map((patient) => (
//                   <TableRow key={patient.idPat}>
//                     <TableCell>{patient.idPat}</TableCell>
//                     <TableCell>{patient.nomPat}</TableCell>
//                     <TableCell>{patient.prenomPat}</TableCell>
//                     <TableCell>
//                       {patient.dateNaissance ? format(new Date(patient.dateNaissance), 'dd/MM/yyyy') : '-'}
//                     </TableCell>
//                     <TableCell>{patient.sexe}</TableCell>
//                     <TableCell>{patient.adresse}</TableCell>
//                     <TableCell>{patient.telephone}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     Aucun patient trouvé
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };

// export default PatientAPIDocumentation;