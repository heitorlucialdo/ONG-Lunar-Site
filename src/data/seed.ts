import type {
  Alert,
  Appointment,
  AppUser,
  Base,
  Kennel,
  Pet,
  Porte,
  Task,
  Temperamento,
  Tutor,
} from './types'

// Anchored to "now" so agenda, alerts and schedules always look current.
const NOW = new Date()
function iso(offsetDays: number, time?: string): string {
  const d = new Date(NOW)
  d.setDate(d.getDate() + offsetDays)
  if (time) {
    const [h, m] = time.split(':').map(Number)
    d.setHours(h, m, 0, 0)
  }
  return d.toISOString()
}
function dayOnly(offsetDays: number): string {
  return iso(offsetDays).slice(0, 10)
}

// ── Tutores ────────────────────────────────────────────────────────────
export const tutors: Tutor[] = [
  { id: 'tut_maria', name: 'Maria Fernanda Alves', phone: '(11) 98812-4471', email: 'maria.alves@email.com', cpf: '312.445.908-11', address: 'Rua das Acácias, 240 — Pinheiros, São Paulo/SP', notes: 'Prefere contato por WhatsApp no período da tarde.' },
  { id: 'tut_rafael', name: 'Rafael Monteiro', phone: '(11) 99640-2210', email: 'rafael.monteiro@email.com', cpf: '087.221.334-50', address: 'Av. Sumaré, 1180 — Perdizes, São Paulo/SP' },
  { id: 'tut_juliana', name: 'Juliana Prado Camargo', phone: '(11) 97731-9082', email: 'ju.camargo@email.com', address: 'Rua Cardeal Arcoverde, 55 — Vila Madalena, São Paulo/SP', notes: 'Tutora de dois animais.' },
  { id: 'tut_carlos', name: 'Carlos Eduardo Nunes', phone: '(11) 98123-7745', email: 'cadu.nunes@email.com', cpf: '445.902.118-73', address: 'Rua Harmonia, 900 — Sumarezinho, São Paulo/SP' },
  { id: 'tut_beatriz', name: 'Beatriz Rocha Lemos', phone: '(11) 99017-6634', email: 'beatriz.lemos@email.com', address: 'Al. Lorena, 320 — Jardins, São Paulo/SP' },
  { id: 'tut_gustavo', name: 'Gustavo Henrique Dias', phone: '(11) 98450-1129', email: 'gustavo.dias@email.com', cpf: '221.774.556-02', address: 'Rua Girassol, 74 — Vila Madalena, São Paulo/SP' },
  { id: 'tut_leticia', name: 'Letícia Barros Xavier', phone: '(11) 97202-5518', email: 'leticia.xavier@email.com', address: 'Rua Fradique Coutinho, 410 — Pinheiros, São Paulo/SP' },
  { id: 'tut_andre', name: 'André Tavares Pinto', phone: '(11) 99560-3341', email: 'andre.tavares@email.com', cpf: '556.010.229-84', address: 'Av. Pompéia, 2200 — Pompéia, São Paulo/SP' },
]

const VETS = ['Dra. Camila Ribeiro', 'Dr. Bruno Sato', 'Dra. Helena Vasquez']

// ── Pets ───────────────────────────────────────────────────────────────
// Campos de abrigo (base ONG/Recanto, porte, castração, temperamento) são
// injetados pelo mapa `shelterFields` abaixo, para manter os objetos enxutos.
type PetSeed = Omit<Pet, 'base' | 'porte' | 'castrado' | 'temperamento' | 'intakeDate' | 'relatoDores'>

const basePets: PetSeed[] = [
  {
    id: 'LUN-000128', name: 'Luna', species: 'cachorro', breed: 'Border Collie', sex: 'femea',
    birthDate: '2021-03-14', ageLabel: '5 anos', weightKg: 12.4,
    tutorId: 'tut_maria', allergies: ['Dipirona'], description: 'Dócil, responde bem a comandos. Chegou com apatia e recusa alimentar.',
    notes: 'Monitorar hidratação a cada 4h.',
    status: 'internado', stage: 'internacao', priority: 'alta',
    location: { setor: 'Internação', canil: 'Canil B', box: 'Box 04' },
    createdAt: iso(-19), lastVisit: iso(-2), nextVisit: iso(1, '10:30'),
    weights: [
      { id: 'w1', kg: 13.1, date: dayOnly(-60), time: '09:10', author: 'Dra. Camila Ribeiro' },
      { id: 'w2', kg: 12.8, date: dayOnly(-30), time: '11:20', author: 'Dr. Bruno Sato' },
      { id: 'w3', kg: 12.2, date: dayOnly(-14), time: '08:40', note: 'Perda de peso relevante', author: 'Dra. Camila Ribeiro' },
      { id: 'w4', kg: 12.4, date: dayOnly(-2), time: '08:15', author: 'Enf. Paula Menezes' },
    ],
    medications: [
      { id: 'm1', name: 'Amoxicilina 500mg', dose: '1 comprimido', frequency: '12/12h', times: ['08:00', '20:00'], startDate: dayOnly(-2), endDate: dayOnly(5), responsible: 'Dra. Camila Ribeiro', active: true, notes: 'Administrar com alimento.' },
      { id: 'm2', name: 'Ringer Lactato', dose: '250 ml', frequency: 'Contínuo', times: ['06:00', '12:00', '18:00'], startDate: dayOnly(-2), responsible: 'Enf. Paula Menezes', active: true },
    ],
    vaccines: [
      { id: 'v1', name: 'V10 (Polivalente)', date: dayOnly(-320), nextDate: dayOnly(45), status: 'em-dia', responsible: 'Dr. Bruno Sato' },
      { id: 'v2', name: 'Antirrábica', date: dayOnly(-360), nextDate: dayOnly(5), status: 'proxima', responsible: 'Dra. Camila Ribeiro' },
    ],
    records: [
      { id: 'r1', date: iso(-2), vet: 'Dra. Camila Ribeiro', complaint: 'Apatia e recusa alimentar há 3 dias', symptoms: 'Prostração, mucosas pálidas', diagnosis: 'Gastroenterite aguda', temperature: 39.4, heartRate: 118, respRate: 32, weight: 12.4, procedures: ['Fluidoterapia', 'Coleta de sangue'], exams: ['Hemograma completo'], recommendations: 'Jejum por 12h, reintrodução gradual de dieta leve.', notes: 'Reavaliar em 48h.' },
    ],
    timeline: [
      { id: 't1', date: dayOnly(-2), time: '08:15', type: 'consulta', title: 'Consulta realizada', description: 'Diagnóstico de gastroenterite aguda.' },
      { id: 't2', date: dayOnly(-2), time: '08:40', type: 'internacao', title: 'Internação iniciada', description: 'Transferida para o Canil B, Box 04.' },
      { id: 't3', date: dayOnly(-2), time: '09:00', type: 'medicamento', title: 'Medicamento iniciado', description: 'Amoxicilina 500mg 12/12h.' },
      { id: 't4', date: dayOnly(-1), time: '08:15', type: 'peso', title: 'Peso atualizado', description: '12,4 kg.' },
    ],
    documents: [
      { id: 'd1', name: 'Hemograma_Luna_09.pdf', kind: 'exame', sizeKb: 248, uploadedAt: iso(-2), by: 'Dra. Camila Ribeiro' },
      { id: 'd2', name: 'Receituario_Luna.pdf', kind: 'receituario', sizeKb: 96, uploadedAt: iso(-2), by: 'Dra. Camila Ribeiro' },
    ],
  },
  {
    id: 'LUN-000131', name: 'Thor', species: 'cachorro', breed: 'Golden Retriever', sex: 'macho',
    birthDate: '2019-07-02', ageLabel: '7 anos', weightKg: 31.8,
    tutorId: 'tut_rafael', allergies: [], description: 'Pós-operatório de ortopedia (joelho).',
    status: 'observacao', stage: 'observacao', priority: 'normal',
    location: { setor: 'Observação', sala: 'Sala 2' },
    createdAt: iso(-40), lastVisit: iso(-1), nextVisit: iso(3, '09:00'),
    weights: [
      { id: 'w1', kg: 32.4, date: dayOnly(-40), time: '10:00', author: 'Dr. Bruno Sato' },
      { id: 'w2', kg: 31.9, date: dayOnly(-10), time: '10:00', author: 'Dr. Bruno Sato' },
      { id: 'w3', kg: 31.8, date: dayOnly(-1), time: '09:30', author: 'Enf. Paula Menezes' },
    ],
    medications: [
      { id: 'm1', name: 'Meloxicam 2mg', dose: '1,5 ml', frequency: '24/24h', times: ['09:00'], startDate: dayOnly(-1), endDate: dayOnly(6), responsible: 'Dr. Bruno Sato', active: true },
    ],
    vaccines: [
      { id: 'v1', name: 'V10 (Polivalente)', date: dayOnly(-200), nextDate: dayOnly(165), status: 'em-dia', responsible: 'Dr. Bruno Sato' },
      { id: 'v2', name: 'Antirrábica', date: dayOnly(-200), nextDate: dayOnly(165), status: 'em-dia', responsible: 'Dr. Bruno Sato' },
    ],
    records: [
      { id: 'r1', date: iso(-1), vet: 'Dr. Bruno Sato', complaint: 'Retorno pós-cirúrgico', diagnosis: 'Ruptura de ligamento cruzado — pós-operatório', temperature: 38.6, heartRate: 92, respRate: 24, weight: 31.8, procedures: ['Curativo', 'Avaliação de sutura'], recommendations: 'Repouso, evitar escadas por 21 dias.' },
    ],
    timeline: [
      { id: 't1', date: dayOnly(-2), time: '14:00', type: 'internacao', title: 'Cirurgia realizada', description: 'Osteotomia — joelho direito.' },
      { id: 't2', date: dayOnly(-1), time: '09:30', type: 'consulta', title: 'Retorno pós-cirúrgico', description: 'Evolução dentro do esperado.' },
    ],
    documents: [
      { id: 'd1', name: 'Laudo_ortopedia_Thor.pdf', kind: 'laudo', sizeKb: 512, uploadedAt: iso(-2), by: 'Dr. Bruno Sato' },
    ],
  },
  {
    id: 'LUN-000119', name: 'Nina', species: 'gato', breed: 'Siamês', sex: 'femea',
    birthDate: '2022-11-20', ageLabel: '3 anos', weightKg: 3.9,
    tutorId: 'tut_juliana', allergies: ['Frango'], description: 'Acompanhamento de doença renal crônica.',
    status: 'internado', stage: 'isolamento', priority: 'critica',
    location: { setor: 'Isolamento', box: 'Box 01' },
    createdAt: iso(-70), lastVisit: iso(0, '07:50'), nextVisit: iso(0, '18:00'),
    weights: [
      { id: 'w1', kg: 4.3, date: dayOnly(-70), time: '09:00', author: 'Dra. Helena Vasquez' },
      { id: 'w2', kg: 4.0, date: dayOnly(-20), time: '09:00', author: 'Dra. Helena Vasquez' },
      { id: 'w3', kg: 3.9, date: dayOnly(0), time: '07:50', note: 'Desidratação leve', author: 'Dra. Helena Vasquez' },
    ],
    medications: [
      { id: 'm1', name: 'Benazepril 5mg', dose: '1/2 comprimido', frequency: '24/24h', times: ['08:00'], startDate: dayOnly(-20), responsible: 'Dra. Helena Vasquez', active: true },
      { id: 'm2', name: 'Fluidoterapia SC', dose: '80 ml', frequency: '12/12h', times: ['08:00', '18:00'], startDate: dayOnly(-1), responsible: 'Enf. Paula Menezes', active: true, notes: 'Aquecer a solução.' },
    ],
    vaccines: [
      { id: 'v1', name: 'Quíntupla felina', date: dayOnly(-40), nextDate: dayOnly(325), status: 'em-dia', responsible: 'Dra. Helena Vasquez' },
      { id: 'v2', name: 'Antirrábica', date: dayOnly(-400), nextDate: dayOnly(-35), status: 'atrasada', responsible: 'Dra. Helena Vasquez' },
    ],
    records: [
      { id: 'r1', date: iso(0, '07:50'), vet: 'Dra. Helena Vasquez', complaint: 'Piora do quadro renal', symptoms: 'Vômito, desidratação', diagnosis: 'DRC estágio III — descompensada', temperature: 38.1, heartRate: 180, respRate: 34, weight: 3.9, procedures: ['Fluidoterapia', 'Ultrassom abdominal'], exams: ['Ureia', 'Creatinina', 'SDMA'], recommendations: 'Internação em isolamento. Dieta renal.' },
    ],
    timeline: [
      { id: 't1', date: dayOnly(0), time: '07:50', type: 'consulta', title: 'Consulta de urgência', description: 'DRC descompensada.' },
      { id: 't2', date: dayOnly(0), time: '08:10', type: 'transferencia', title: 'Transferida para Isolamento', description: 'Box 01.' },
    ],
    documents: [
      { id: 'd1', name: 'USG_abdominal_Nina.pdf', kind: 'exame', sizeKb: 780, uploadedAt: iso(0), by: 'Dra. Helena Vasquez' },
    ],
  },
  {
    id: 'LUN-000102', name: 'Amora', species: 'gato', breed: 'SRD', sex: 'femea',
    birthDate: '2020-05-01', ageLabel: '6 anos', weightKg: 4.6,
    tutorId: 'tut_juliana', allergies: [], description: 'Castração eletiva.',
    status: 'saudavel', stage: 'consultorio', priority: 'normal',
    location: { setor: 'Consultório', sala: 'Sala 1' },
    createdAt: iso(-90), lastVisit: iso(0, '09:15'), nextVisit: iso(14, '15:00'),
    weights: [{ id: 'w1', kg: 4.6, date: dayOnly(0), time: '09:15', author: 'Dra. Camila Ribeiro' }],
    medications: [],
    vaccines: [{ id: 'v1', name: 'Quíntupla felina', date: dayOnly(-90), nextDate: dayOnly(275), status: 'em-dia', responsible: 'Dra. Camila Ribeiro' }],
    records: [{ id: 'r1', date: iso(0, '09:15'), vet: 'Dra. Camila Ribeiro', complaint: 'Avaliação pré-cirúrgica', diagnosis: 'Apta para castração', temperature: 38.5, heartRate: 160, respRate: 28, weight: 4.6, recommendations: 'Jejum de 8h antes do procedimento.' }],
    timeline: [{ id: 't1', date: dayOnly(0), time: '09:15', type: 'consulta', title: 'Avaliação pré-cirúrgica' }],
    documents: [],
  },
  {
    id: 'LUN-000141', name: 'Simba', species: 'cachorro', breed: 'Lhasa Apso', sex: 'macho',
    birthDate: '2018-01-10', ageLabel: '8 anos', weightKg: 7.2,
    tutorId: 'tut_carlos', allergies: ['Poeira'], description: 'Dermatite recorrente.',
    status: 'observacao', stage: 'triagem', priority: 'alta',
    location: { setor: 'Triagem' },
    createdAt: iso(-5), lastVisit: iso(0, '10:40'), nextVisit: iso(0, '11:30'),
    weights: [
      { id: 'w1', kg: 7.5, date: dayOnly(-30), time: '10:00', author: 'Dr. Bruno Sato' },
      { id: 'w2', kg: 7.2, date: dayOnly(0), time: '10:40', author: 'Enf. Paula Menezes' },
    ],
    medications: [{ id: 'm1', name: 'Apoquel 5,4mg', dose: '1 comprimido', frequency: '24/24h', times: ['12:00'], startDate: dayOnly(-5), endDate: dayOnly(2), responsible: 'Dr. Bruno Sato', active: true }],
    vaccines: [{ id: 'v1', name: 'V8 (Polivalente)', date: dayOnly(-150), nextDate: dayOnly(2), status: 'proxima', responsible: 'Dr. Bruno Sato' }],
    records: [{ id: 'r1', date: iso(-5), vet: 'Dr. Bruno Sato', complaint: 'Prurido intenso e lesões de pele', diagnosis: 'Dermatite atópica', temperature: 38.8, heartRate: 104, respRate: 26, weight: 7.5, recommendations: 'Banho com shampoo específico 2x/semana.' }],
    timeline: [{ id: 't1', date: dayOnly(-5), time: '15:00', type: 'consulta', title: 'Consulta dermatológica' }],
    documents: [],
  },
  {
    id: 'LUN-000108', name: 'Pipoca', species: 'coelho', breed: 'Mini Lop', sex: 'femea',
    birthDate: '2023-02-18', ageLabel: '3 anos', weightKg: 1.7,
    tutorId: 'tut_beatriz', allergies: [], description: 'Checkup e controle de peso.',
    status: 'saudavel', stage: 'canil', priority: 'baixa',
    location: { setor: 'Canil', canil: 'Canil A', box: 'Box 09' },
    createdAt: iso(-120), lastVisit: iso(-3), nextVisit: iso(30, '14:00'),
    weights: [
      { id: 'w1', kg: 1.6, date: dayOnly(-40), time: '11:00', author: 'Dra. Helena Vasquez' },
      { id: 'w2', kg: 1.7, date: dayOnly(-3), time: '11:00', author: 'Dra. Helena Vasquez' },
    ],
    medications: [],
    vaccines: [{ id: 'v1', name: 'Mixomatose', date: dayOnly(-60), nextDate: dayOnly(120), status: 'em-dia', responsible: 'Dra. Helena Vasquez' }],
    records: [{ id: 'r1', date: iso(-3), vet: 'Dra. Helena Vasquez', complaint: 'Checkup de rotina', diagnosis: 'Saudável', temperature: 38.9, weight: 1.7, recommendations: 'Dieta rica em fibras.' }],
    timeline: [{ id: 't1', date: dayOnly(-3), time: '11:00', type: 'consulta', title: 'Checkup de rotina' }],
    documents: [],
  },
  {
    id: 'LUN-000137', name: 'Rex', species: 'cachorro', breed: 'Pastor Alemão', sex: 'macho',
    birthDate: '2017-09-30', ageLabel: '9 anos', weightKg: 34.5,
    tutorId: 'tut_gustavo', allergies: [], description: 'Cardiopatia em acompanhamento.',
    status: 'internado', stage: 'internacao', priority: 'alta',
    location: { setor: 'Internação', canil: 'Canil B', box: 'Box 02' },
    createdAt: iso(-8), lastVisit: iso(-1), nextVisit: iso(0, '16:00'),
    weights: [
      { id: 'w1', kg: 35.2, date: dayOnly(-30), time: '09:00', author: 'Dra. Camila Ribeiro' },
      { id: 'w2', kg: 34.5, date: dayOnly(-1), time: '09:00', author: 'Enf. Paula Menezes' },
    ],
    medications: [
      { id: 'm1', name: 'Pimobendan 5mg', dose: '1 comprimido', frequency: '12/12h', times: ['08:00', '20:00'], startDate: dayOnly(-8), responsible: 'Dra. Camila Ribeiro', active: true },
      { id: 'm2', name: 'Furosemida 40mg', dose: '1/2 comprimido', frequency: '12/12h', times: ['09:00', '21:00'], startDate: dayOnly(-8), responsible: 'Dra. Camila Ribeiro', active: true },
    ],
    vaccines: [{ id: 'v1', name: 'V10 (Polivalente)', date: dayOnly(-100), nextDate: dayOnly(265), status: 'em-dia', responsible: 'Dra. Camila Ribeiro' }],
    records: [{ id: 'r1', date: iso(-8), vet: 'Dra. Camila Ribeiro', complaint: 'Tosse e cansaço', diagnosis: 'Insuficiência cardíaca congestiva', temperature: 38.4, heartRate: 140, respRate: 40, weight: 35.2, exams: ['Ecocardiograma', 'Raio-X torácico'], recommendations: 'Restrição de exercícios, dieta hipossódica.' }],
    timeline: [
      { id: 't1', date: dayOnly(-8), time: '10:00', type: 'internacao', title: 'Internação iniciada' },
      { id: 't2', date: dayOnly(-1), time: '09:00', type: 'peso', title: 'Peso atualizado', description: '34,5 kg.' },
    ],
    documents: [{ id: 'd1', name: 'Eco_Rex.pdf', kind: 'exame', sizeKb: 640, uploadedAt: iso(-8), by: 'Dra. Camila Ribeiro' }],
  },
  {
    id: 'LUN-000144', name: 'Mel', species: 'cachorro', breed: 'Poodle', sex: 'femea',
    birthDate: '2016-12-05', ageLabel: '9 anos', weightKg: 6.8,
    tutorId: 'tut_leticia', allergies: [], description: 'Limpeza de tártaro.',
    status: 'alta', stage: 'alta', priority: 'normal',
    location: { setor: 'Recepção' },
    createdAt: iso(-2), lastVisit: iso(0, '08:00'), nextVisit: undefined,
    weights: [{ id: 'w1', kg: 6.8, date: dayOnly(0), time: '08:00', author: 'Dr. Bruno Sato' }],
    medications: [],
    vaccines: [{ id: 'v1', name: 'V10 (Polivalente)', date: dayOnly(-30), nextDate: dayOnly(335), status: 'em-dia', responsible: 'Dr. Bruno Sato' }],
    records: [{ id: 'r1', date: iso(0, '08:00'), vet: 'Dr. Bruno Sato', complaint: 'Profilaxia dentária', diagnosis: 'Procedimento concluído', weight: 6.8, procedures: ['Limpeza de tártaro'], recommendations: 'Escovação dental 3x/semana.' }],
    timeline: [
      { id: 't1', date: dayOnly(0), time: '08:00', type: 'consulta', title: 'Procedimento realizado' },
      { id: 't2', date: dayOnly(0), time: '11:00', type: 'alta', title: 'Alta liberada' },
    ],
    documents: [],
  },
  {
    id: 'LUN-000096', name: 'Loro', species: 'ave', breed: 'Papagaio-verdadeiro', sex: 'macho',
    birthDate: '2010-06-01', ageLabel: '16 anos', weightKg: 0.42,
    tutorId: 'tut_andre', allergies: [], description: 'Avaliação de plumagem e bico.',
    status: 'saudavel', stage: 'canil', priority: 'baixa',
    location: { setor: 'Canil', canil: 'Canil A', box: 'Box 12' },
    createdAt: iso(-15), lastVisit: iso(-1), nextVisit: iso(45, '10:00'),
    weights: [{ id: 'w1', kg: 0.42, date: dayOnly(-1), time: '10:00', author: 'Dra. Helena Vasquez' }],
    medications: [],
    vaccines: [],
    records: [{ id: 'r1', date: iso(-1), vet: 'Dra. Helena Vasquez', complaint: 'Muda de penas atípica', diagnosis: 'Deficiência nutricional', weight: 0.42, recommendations: 'Suplementação de vitamina A.' }],
    timeline: [{ id: 't1', date: dayOnly(-1), time: '10:00', type: 'consulta', title: 'Avaliação geral' }],
    documents: [],
  },
  {
    id: 'LUN-000112', name: 'Frajola', species: 'gato', breed: 'Persa', sex: 'macho',
    birthDate: '2019-04-22', ageLabel: '7 anos', weightKg: 5.4,
    tutorId: 'tut_maria', allergies: [], description: 'Retorno oftalmológico.',
    status: 'saudavel', stage: 'consultorio', priority: 'normal',
    location: { setor: 'Consultório', sala: 'Sala 3' },
    createdAt: iso(-25), lastVisit: iso(0, '11:00'), nextVisit: iso(21, '11:00'),
    weights: [{ id: 'w1', kg: 5.4, date: dayOnly(0), time: '11:00', author: 'Dra. Helena Vasquez' }],
    medications: [{ id: 'm1', name: 'Colírio lubrificante', dose: '1 gota', frequency: '8/8h', times: ['08:00', '16:00', '00:00'], startDate: dayOnly(-25), responsible: 'Dra. Helena Vasquez', active: true }],
    vaccines: [{ id: 'v1', name: 'Quíntupla felina', date: dayOnly(-25), nextDate: dayOnly(340), status: 'em-dia', responsible: 'Dra. Helena Vasquez' }],
    records: [{ id: 'r1', date: iso(0, '11:00'), vet: 'Dra. Helena Vasquez', complaint: 'Retorno — ceratoconjuntivite seca', diagnosis: 'Em melhora', weight: 5.4, recommendations: 'Manter colírio.' }],
    timeline: [{ id: 't1', date: dayOnly(0), time: '11:00', type: 'consulta', title: 'Retorno oftalmológico' }],
    documents: [],
  },
  {
    id: 'LUN-000087', name: 'Bidu', species: 'roedor', breed: 'Hamster Sírio', sex: 'macho',
    birthDate: '2024-08-10', ageLabel: '2 anos', weightKg: 0.13,
    tutorId: 'tut_beatriz', allergies: [], description: 'Lesão em pata.',
    status: 'observacao', stage: 'observacao', priority: 'normal',
    location: { setor: 'Observação', sala: 'Sala 2' },
    createdAt: iso(-1), lastVisit: iso(0, '13:00'), nextVisit: iso(2, '13:00'),
    weights: [{ id: 'w1', kg: 0.13, date: dayOnly(0), time: '13:00', author: 'Dra. Camila Ribeiro' }],
    medications: [],
    vaccines: [],
    records: [{ id: 'r1', date: iso(0, '13:00'), vet: 'Dra. Camila Ribeiro', complaint: 'Claudicação de pata dianteira', diagnosis: 'Entorse leve', weight: 0.13, recommendations: 'Repouso em recinto acolchoado.' }],
    timeline: [{ id: 't1', date: dayOnly(0), time: '13:00', type: 'consulta', title: 'Consulta' }],
    documents: [],
  },
  {
    id: 'LUN-000153', name: 'Zeus', species: 'cachorro', breed: 'Rottweiler', sex: 'macho',
    birthDate: '2022-02-14', ageLabel: '4 anos', weightKg: 42.0,
    tutorId: 'tut_gustavo', allergies: [], description: 'Triagem — ingestão de corpo estranho (suspeita).',
    status: 'critico', stage: 'triagem', priority: 'critica',
    location: { setor: 'Triagem' },
    createdAt: iso(0), lastVisit: iso(0, '14:20'), nextVisit: iso(0, '14:40'),
    weights: [{ id: 'w1', kg: 42.0, date: dayOnly(0), time: '14:20', author: 'Enf. Paula Menezes' }],
    medications: [],
    vaccines: [{ id: 'v1', name: 'V10 (Polivalente)', date: dayOnly(-80), nextDate: dayOnly(285), status: 'em-dia', responsible: 'Dr. Bruno Sato' }],
    records: [{ id: 'r1', date: iso(0, '14:20'), vet: 'Dr. Bruno Sato', complaint: 'Vômito e abdômen tenso', symptoms: 'Dor abdominal aguda', temperature: 39.0, heartRate: 130, respRate: 38, weight: 42.0, exams: ['Raio-X abdominal'], recommendations: 'Avaliação cirúrgica urgente.' }],
    timeline: [{ id: 't1', date: dayOnly(0), time: '14:20', type: 'consulta', title: 'Triagem de urgência' }],
    documents: [],
  },
  {
    id: 'LUN-000121', name: 'Belinha', species: 'cachorro', breed: 'Shih Tzu', sex: 'femea',
    birthDate: '2020-10-08', ageLabel: '6 anos', weightKg: 5.9,
    tutorId: 'tut_leticia', allergies: [], description: 'Vacinação anual.',
    status: 'saudavel', stage: 'consultorio', priority: 'baixa',
    location: { setor: 'Consultório', sala: 'Sala 1' },
    createdAt: iso(-200), lastVisit: iso(0, '15:30'), nextVisit: iso(365, '15:30'),
    weights: [{ id: 'w1', kg: 5.9, date: dayOnly(0), time: '15:30', author: 'Enf. Paula Menezes' }],
    medications: [],
    vaccines: [
      { id: 'v1', name: 'V10 (Polivalente)', date: dayOnly(0), nextDate: dayOnly(365), status: 'em-dia', responsible: 'Dra. Camila Ribeiro' },
      { id: 'v2', name: 'Antirrábica', date: dayOnly(0), nextDate: dayOnly(365), status: 'em-dia', responsible: 'Dra. Camila Ribeiro' },
    ],
    records: [{ id: 'r1', date: iso(0, '15:30'), vet: 'Dra. Camila Ribeiro', complaint: 'Vacinação anual', diagnosis: 'Saudável', weight: 5.9 }],
    timeline: [{ id: 't1', date: dayOnly(0), time: '15:30', type: 'vacina', title: 'Vacinação anual' }],
    documents: [],
  },
  {
    id: 'LUN-000159', name: 'Kiwi', species: 'ave', breed: 'Calopsita', sex: 'femea',
    birthDate: '2023-05-30', ageLabel: '3 anos', weightKg: 0.09,
    tutorId: 'tut_andre', allergies: [], description: 'Postura anormal de ovos.',
    status: 'observacao', stage: 'observacao', priority: 'alta',
    location: { setor: 'Observação', sala: 'Sala 3' },
    createdAt: iso(-2), lastVisit: iso(0, '16:30'), nextVisit: iso(1, '16:30'),
    weights: [{ id: 'w1', kg: 0.09, date: dayOnly(0), time: '16:30', author: 'Dra. Helena Vasquez' }],
    medications: [{ id: 'm1', name: 'Cálcio oral', dose: '0,1 ml', frequency: '24/24h', times: ['10:00'], startDate: dayOnly(-2), endDate: dayOnly(5), responsible: 'Dra. Helena Vasquez', active: true }],
    vaccines: [],
    records: [{ id: 'r1', date: iso(0, '16:30'), vet: 'Dra. Helena Vasquez', complaint: 'Dificuldade de postura', diagnosis: 'Distocia', weight: 0.09, recommendations: 'Suplementação de cálcio e calor.' }],
    timeline: [{ id: 't1', date: dayOnly(0), time: '16:30', type: 'consulta', title: 'Consulta' }],
    documents: [],
  },
]

// Enriquecimento por animal — base institucional e dados de abrigo.
const shelterFields: Record<string, { base: Base; porte: Porte; castrado: boolean; temperamento: Temperamento; relatoDores?: string }> = {
  'LUN-000128': { base: 'ong', porte: 'M', castrado: true, temperamento: 'docil', relatoDores: 'Sensibilidade abdominal à palpação.' },
  'LUN-000131': { base: 'ong', porte: 'G', castrado: true, temperamento: 'docil', relatoDores: 'Dor no joelho direito (pós-operatório).' },
  'LUN-000119': { base: 'recanto', porte: 'P', castrado: true, temperamento: 'docil' },
  'LUN-000102': { base: 'recanto', porte: 'P', castrado: false, temperamento: 'docil' },
  'LUN-000141': { base: 'ong', porte: 'P', castrado: true, temperamento: 'ativo' },
  'LUN-000108': { base: 'recanto', porte: 'P', castrado: false, temperamento: 'docil' },
  'LUN-000137': { base: 'ong', porte: 'G', castrado: true, temperamento: 'docil', relatoDores: 'Cansaço aos esforços.' },
  'LUN-000144': { base: 'recanto', porte: 'P', castrado: true, temperamento: 'docil' },
  'LUN-000096': { base: 'ong', porte: 'P', castrado: false, temperamento: 'ativo' },
  'LUN-000112': { base: 'ong', porte: 'P', castrado: true, temperamento: 'docil' },
  'LUN-000087': { base: 'recanto', porte: 'P', castrado: false, temperamento: 'ativo' },
  'LUN-000153': { base: 'ong', porte: 'G', castrado: true, temperamento: 'ativo', relatoDores: 'Dor abdominal aguda.' },
  'LUN-000121': { base: 'recanto', porte: 'P', castrado: true, temperamento: 'docil' },
  'LUN-000159': { base: 'recanto', porte: 'P', castrado: false, temperamento: 'docil' },
}

export const pets: Pet[] = basePets.map((p) => {
  const s = shelterFields[p.id] ?? { base: 'ong' as Base, porte: 'M' as Porte, castrado: false, temperamento: 'docil' as Temperamento }
  return { ...p, ...s, intakeDate: p.createdAt }
})

// ── Alas / Nichos — ocupação (segregado por base) ──────────────────────
export const kennels: Kennel[] = [
  { id: 'k_ong_a', name: 'Ala A', sector: 'Alojamento', base: 'ong', capacity: 10, occupied: 8 },
  { id: 'k_ong_b', name: 'Ala B', sector: 'Tratamento', base: 'ong', capacity: 10, occupied: 5 },
  { id: 'k_ong_iso', name: 'Isolamento', sector: 'Quarentena', base: 'ong', capacity: 4, occupied: 2 },
  { id: 'k_rec_c', name: 'Ala C', sector: 'Alojamento', base: 'recanto', capacity: 10, occupied: 7 },
  { id: 'k_rec_d', name: 'Ala D', sector: 'Alojamento', base: 'recanto', capacity: 10, occupied: 6 },
  { id: 'k_rec_obs', name: 'Observação', sector: 'Observação', base: 'recanto', capacity: 6, occupied: 3 },
]

// ── Agenda ─────────────────────────────────────────────────────────────
export const appointments: Appointment[] = [
  { id: 'a1', petId: 'LUN-000102', tutorId: 'tut_juliana', vet: VETS[0], datetime: iso(0, '09:15'), durationMin: 30, type: 'procedimento', status: 'concluido' },
  { id: 'a2', petId: 'LUN-000112', tutorId: 'tut_maria', vet: VETS[2], datetime: iso(0, '11:00'), durationMin: 30, type: 'retorno', status: 'concluido' },
  { id: 'a3', petId: 'LUN-000141', tutorId: 'tut_carlos', vet: VETS[1], datetime: iso(0, '11:30'), durationMin: 30, type: 'consulta', status: 'em-andamento' },
  { id: 'a4', petId: 'LUN-000153', tutorId: 'tut_gustavo', vet: VETS[1], datetime: iso(0, '14:40'), durationMin: 45, type: 'procedimento', status: 'confirmado' },
  { id: 'a5', petId: 'LUN-000121', tutorId: 'tut_leticia', vet: VETS[0], datetime: iso(0, '15:30'), durationMin: 20, type: 'vacina', status: 'agendado' },
  { id: 'a6', petId: 'LUN-000137', tutorId: 'tut_gustavo', vet: VETS[0], datetime: iso(0, '16:00'), durationMin: 30, type: 'retorno', status: 'agendado' },
  { id: 'a7', petId: 'LUN-000119', tutorId: 'tut_juliana', vet: VETS[2], datetime: iso(0, '18:00'), durationMin: 30, type: 'internacao', status: 'agendado' },
  { id: 'a8', petId: 'LUN-000128', tutorId: 'tut_maria', vet: VETS[0], datetime: iso(1, '10:30'), durationMin: 30, type: 'retorno', status: 'agendado' },
  { id: 'a9', petId: 'LUN-000131', tutorId: 'tut_rafael', vet: VETS[1], datetime: iso(3, '09:00'), durationMin: 40, type: 'retorno', status: 'agendado' },
  { id: 'a10', petId: 'LUN-000108', tutorId: 'tut_beatriz', vet: VETS[2], datetime: iso(2, '14:00'), durationMin: 30, type: 'consulta', status: 'agendado' },
  { id: 'a11', petId: 'LUN-000159', tutorId: 'tut_andre', vet: VETS[2], datetime: iso(1, '16:30'), durationMin: 30, type: 'retorno', status: 'agendado' },
]

// ── Tarefas ──────────────────────────────────────────────────────────
export const tasks: Task[] = [
  { id: 'tk1', title: 'Administrar Amoxicilina', petId: 'LUN-000128', assignee: 'Enf. Paula Menezes', priority: 'alta', dueDate: iso(0, '20:00'), status: 'pendente', category: 'medicacao' },
  { id: 'tk2', title: 'Fluidoterapia SC', petId: 'LUN-000119', assignee: 'Enf. Paula Menezes', priority: 'critica', dueDate: iso(0, '18:00'), status: 'pendente', category: 'medicacao' },
  { id: 'tk3', title: 'Atualizar peso', petId: 'LUN-000137', assignee: 'Enf. Paula Menezes', priority: 'normal', dueDate: iso(0, '17:00'), status: 'em-andamento', category: 'monitoramento' },
  { id: 'tk4', title: 'Raio-X abdominal', petId: 'LUN-000153', assignee: 'Dr. Bruno Sato', priority: 'critica', dueDate: iso(0, '14:40'), status: 'em-andamento', category: 'exame' },
  { id: 'tk5', title: 'Preparar alta', petId: 'LUN-000144', assignee: 'Recep. Tainá Lopes', priority: 'normal', dueDate: iso(0, '11:00'), status: 'concluida', category: 'alta' },
  { id: 'tk6', title: 'Higienizar Box 04', petId: 'LUN-000128', assignee: 'Aux. José Carlos', priority: 'baixa', dueDate: iso(0, '19:00'), status: 'pendente', category: 'higiene' },
  { id: 'tk7', title: 'Verificar temperatura', petId: 'LUN-000131', assignee: 'Enf. Paula Menezes', priority: 'normal', dueDate: iso(0, '18:30'), status: 'pendente', category: 'monitoramento' },
  { id: 'tk8', title: 'Administrar Pimobendan', petId: 'LUN-000137', assignee: 'Enf. Paula Menezes', priority: 'alta', dueDate: iso(0, '20:00'), status: 'pendente', category: 'medicacao' },
  { id: 'tk9', title: 'Suplementação de cálcio', petId: 'LUN-000159', assignee: 'Dra. Helena Vasquez', priority: 'alta', dueDate: iso(1, '10:00'), status: 'pendente', category: 'medicacao' },
]

// ── Alertas ────────────────────────────────────────────────────────────
export const alerts: Alert[] = [
  { id: 'al1', type: 'critico', priority: 'critica', date: iso(0, '14:20'), petId: 'LUN-000153', message: 'Zeus em estado crítico aguardando avaliação cirúrgica.', action: 'Abrir prontuário', read: false },
  { id: 'al2', type: 'medicamento', priority: 'alta', date: iso(0, '18:00'), petId: 'LUN-000119', message: 'Fluidoterapia de Nina agendada para as 18:00.', action: 'Ver medicação', read: false },
  { id: 'al3', type: 'vacina', priority: 'alta', date: iso(-35), petId: 'LUN-000119', message: 'Antirrábica de Nina está atrasada há 35 dias.', action: 'Agendar vacina', read: false },
  { id: 'al4', type: 'vacina', priority: 'normal', date: iso(2), petId: 'LUN-000141', message: 'Vacina V8 de Simba vence em 2 dias.', action: 'Agendar vacina', read: false },
  { id: 'al5', type: 'alta', priority: 'normal', date: iso(0, '11:00'), petId: 'LUN-000144', message: 'Alta prevista de Mel para hoje.', action: 'Ver pet', read: true },
  { id: 'al6', type: 'consulta', priority: 'normal', date: iso(0, '16:00'), petId: 'LUN-000137', message: 'Retorno de Rex em breve (16:00).', action: 'Ver agenda', read: true },
  { id: 'al7', type: 'peso', priority: 'baixa', date: iso(0), petId: 'LUN-000096', message: 'Loro sem atualização de peso há 15 dias.', action: 'Registrar peso', read: true },
]

// ── Usuário / equipe ───────────────────────────────────────────────────
export const currentUser: AppUser = {
  id: 'u_susi', name: 'Susielene Monteiro', role: 'admin', email: 'associacaolunaar@gmail.com',
}

/** Equipe / operadores do sistema (limite de 5 — RNF do Projeto Lunaar). */
export const team: AppUser[] = [
  { id: 'u_susi', name: 'Susielene Monteiro', role: 'admin', email: 'associacaolunaar@gmail.com' },
  { id: 'u_carla', name: 'Carla Fahima', role: 'usuario', email: 'recanto@lunaar.org' },
  { id: 'u_paula', name: 'Paula Menezes', role: 'usuario', email: 'paula.menezes@lunaar.org' },
  { id: 'u_jose', name: 'José Carlos', role: 'usuario', email: 'jose.carlos@lunaar.org' },
  { id: 'u_taina', name: 'Tainá Lopes', role: 'usuario', email: 'taina.lopes@lunaar.org' },
]

/** Next available sequential number for new pet codes. */
export const nextPetSeq = 160
