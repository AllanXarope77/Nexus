const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- CONTINGÊNCIA LOCAIS (Caso o Atlas seja rejeitado) ---
let localMockDatabase = [
  { _id: '64f1b2c3e4b0a123456789ab', title: 'NR-33: Espaços Confinados', type: 'TREINAMENTO TÉCNICO', reward: 'Certificação Nível 1', status: 'PENDENTE' },
  { _id: '64f1b2c3e4b0a123456789ac', title: 'NR-35: Trabalho em Altura', type: 'SEGURANÇA ATIVA', reward: 'Certificação Nível 1', status: 'PENDENTE' }
];
let isUsingAtlas = false;

// --- CONEXÃO COM O MONGODB ATLAS ---
// Lembre-se de substituir SUA_SENHA_AQUI pela senha limpa do banco.
const MONGO_URI = 'mongodb+srv://allannascimentoalmeida15_db_user:12345@cluster0.2lm8nwv.mongodb.net/?appName=Cluster0';

console.log('[SISTEMA]: Iniciando tentativa de Handshake com MongoDB Atlas Cluster...');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 }) // Desiste em 5 segundos se a rede travar
  .then(() => {
    console.log('[MONGODB]: Sincronizado e Conectado com sucesso ao Cluster0 Atlas!');
    isUsingAtlas = true;
  })
  .catch((err) => {
    console.error('\n[AVISO DE OPERAÇÃO]: Conexão rejeitada ou bloqueada pelo Firewall/IP.');
    console.error(`[MOTIVO ATLASt]: ${err.message}`);
    console.log('\n[🛡️ PROTOCOLO DE SURVIVAL ATIVADO]: O Servidor está rodando em modo IN-MEMORY COHORT.');
    console.log('[INFO]: O App vai funcionar normalmente, gravando dados temporários para a sua apresentação.\n');
    isUsingAtlas = false;
  });

// --- SCHEMA DA COLEÇÃO DO MONGODB ---
const QuestSchema = new mongoose.Schema({
  title: String,
  type: String,
  reward: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Quest = mongoose.model('Quest', QuestSchema);

// --- ROTAS DA API COM STRATEGY PATTERN (ATLAS OU LOCAL MOCK) ---

// 1. GET - Listar Missões
app.get('/v1/quests', async (req, res) => {
  try {
    if (isUsingAtlas) {
      console.log('[SERVER]: Lendo documentos diretamente da collection no Atlas...');
      const quests = await Quest.find().sort({ createdAt: -1 });
      return res.status(200).json(quests);
    } else {
      console.log('[SERVER - MODE LOCAL]: Retornando buffer in-memory.');
      return res.status(200).json(localMockDatabase);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. POST - Criar Documento (db.collection.insertOne)
app.post('/v1/quests', async (req, res) => {
  try {
    const { title, type, reward } = req.body;

    if (isUsingAtlas) {
      const newQuest = new Quest({ title, type, reward, status: 'PENDENTE' });
      const savedQuest = await newQuest.save();
      console.log(`[ATLAS]: Documento salvo com ID: ${savedQuest._id}`);
      return res.status(201).json(savedQuest);
    } else {
      // Simulação NoSQL local
      const mockMongoId = Math.random().toString(16).substring(2, 26);
      const newLocalDoc = { _id: mockMongoId, title, type, reward, status: 'PENDENTE' };
      localMockDatabase.unshift(newLocalDoc);
      console.log(`[LOCAL CONTINGÊNCIA]: Documento gerado na memória RAM. ID: ${mockMongoId}`);
      return res.status(201).json(newLocalDoc);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. PATCH - Atualizar Status ($set)
app.patch('/v1/quests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isUsingAtlas) {
      const updated = await Quest.findByIdAndUpdate(id, { status }, { new: true });
      return res.status(200).json(updated);
    } else {
      localMockDatabase = localMockDatabase.map(q => q._id === id ? { ...q, status } : q);
      console.log(`[LOCAL CONTINGÊNCIA]: Campo atualizado no ID: ${id}`);
      return res.status(200).json({ success: true, id });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- INICIALIZAÇÃO DO ECOSSISTEMA ---
app.listen(PORT, () => {
  console.log(`[NEXUS OS ACTIVE]: Servidor escutando requisições na porta local ${PORT}`);
});
