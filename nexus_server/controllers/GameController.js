const User = require('../models/User');

const getMaxExpForLevel = (lvl) => {
  return 100 * Math.pow(2, lvl - 1);
};

const GameController = {
  // Registro
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      const userExists = await User.findOne({ username });
      if (userExists) return res.status(400).json({ error: "Codinome já existe." });

      const newUser = new User({ username, password });
      await newUser.save();
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username, password });
      if (!user) return res.status(401).json({ error: "Credenciais inválidas." });
      res.status(200).json({ success: true, username: user.username });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Buscar Status
  getStats: async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: "Não encontrado." });

      res.status(200).json({
        level: user.level,
        exp: user.exp,
        maxExpForCurrentLevel: getMaxExpForLevel(user.level),
        strength: user.strength,
        agility: user.agility,
        quests: user.quests
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Injetar Missão (Ponto onde estava dando erro)
  createQuest: async (req, res) => {
    try {
      const { username, title, description, expReward, category } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: "Usuário inválido." });

      const newQuest = {
        id: Math.random().toString(36).substring(7),
        title: title.toUpperCase(),
        description,
        expReward: parseInt(expReward),
        completed: false,
        category: category || 'TECH'
      };

      user.quests.unshift(newQuest);
      user.markModified('quests');
      await user.save();

      res.status(200).json({ success: true, quests: user.quests });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Concluir Missão
  finishQuest: async (req, res) => {
    try {
      const { username, questId } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: "Usuário inválido." });

      const quest = user.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return res.status(400).json({ error: "Erro na missão." });

      quest.completed = true;
      let currentExp = user.exp + quest.expReward;
      let currentLevel = user.level;
      let currentMax = getMaxExpForLevel(currentLevel);

      while (currentExp >= currentMax) {
        currentExp -= currentMax;
        currentLevel += 1;
        currentMax = getMaxExpForLevel(currentLevel);
        user.strength += 2;
        user.agility += 2;
      }

      user.exp = currentExp;
      user.level = currentLevel;
      user.markModified('quests');
      await user.save();

      res.status(200).json({
        level: user.level,
        exp: user.exp,
        maxExpForCurrentLevel: currentMax,
        strength: user.strength,
        agility: user.agility,
        quests: user.quests
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = GameController;