import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side Gemini client with official header
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Draft Parent Summary
app.post('/api/ai/draft-parent-summary', async (req, res) => {
  try {
    const { learnerName, observations, currentFocus, strandSummaries } = req.body;

    if (!ai) {
      // Deterministic evidence-grounded fallback if no API key
      const independentSkills = (observations || [])
        .filter((o: any) => o.status === 'independent')
        .map((o: any) => o.skillName);
      const supportSkills = (observations || [])
        .filter((o: any) => o.status === 'needs_support')
        .map((o: any) => o.skillName);
      const developingSkills = (observations || [])
        .filter((o: any) => o.status === 'developing')
        .map((o: any) => o.skillName);

      const practiced = observations && observations.length > 0
        ? observations.map((o: any) => o.skillName).slice(0, 4).join(', ')
        : 'Foundational phonics correspondences and oral blending';

      const summary = {
        whatWePractised: `${learnerName} has been actively working on ${practiced}.`,
        independent: independentSkills.length > 0
          ? `${learnerName} now independently demonstrates ${independentSkills.slice(0, 3).join(', ')} without prompting.`
          : `${learnerName} shows consistent engagement and is beginning to apply foundational listening routines.`,
        needsSupport: supportSkills.length > 0
          ? `We are continuing to provide gentle modelling and extra repetition for ${supportSkills.slice(0, 2).join(' and ')}.`
          : developingSkills.length > 0
            ? `${learnerName} is developing confidence in ${developingSkills.slice(0, 2).join(' and ')} with occasional teacher prompts.`
            : `Consolidating smooth blending across three-sound words.`,
        nextTeachingFocus: currentFocus || (supportSkills[0] ? `Targeted practice with ${supportSkills[0]}` : 'Advancing to cumulative word reading'),
        homeActivity: `Play a quick 2-minute oral sound game at home: say a simple 3-sound word slowly like "s-a-t" or "c-u-p" and invite ${learnerName} to leap and say the whole word together.`
      };

      return res.json({ success: true, summary, aiGenerated: false });
    }

    const prompt = `You are a certified early literacy specialist assisting a teacher using the Simphonics literacy method.
Learner Name: ${learnerName}
Current Focus: ${currentFocus || 'Foundational blending and letter sounds'}
Observed Skills & States:
${JSON.stringify(observations, null, 2)}
Strand Overview:
${JSON.stringify(strandSummaries, null, 2)}

TASK: Draft an encouraging, strictly factual parent summary.
CRITICAL RULES:
- Ground all statements strictly in the recorded observations provided above.
- NEVER invent difficulties, deficits, or achievements absent from the evidence.
- NEVER diagnose learning disabilities or use clinical labels.
- Provide simple, warm, jargon-free explanations parents understand.
- Return a JSON object with EXACTLY these 5 fields:
  1. "whatWePractised": Clear sentence of what was taught and practised.
  2. "independent": What the child can do reliably without prompting.
  3. "needsSupport": What still benefits from teacher modelling or scaffolding.
  4. "nextTeachingFocus": The immediate next step in instruction.
  5. "homeActivity": One manageable 2-minute playful home activity reinforcing the skill using common household items.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, summary: parsed, aiGenerated: true });
    } catch (genErr) {
      console.warn('Gemini API call failed, using grounded fallback:', genErr);
      // Fall through to deterministic evidence-grounded summary below
      const independentSkills = (observations || [])
        .filter((o: any) => o.status === 'independent')
        .map((o: any) => o.skillName);
      const supportSkills = (observations || [])
        .filter((o: any) => o.status === 'needs_support')
        .map((o: any) => o.skillName);
      const developingSkills = (observations || [])
        .filter((o: any) => o.status === 'developing')
        .map((o: any) => o.skillName);

      const practiced = observations && observations.length > 0
        ? observations.map((o: any) => o.skillName).slice(0, 4).join(', ')
        : 'Foundational phonics correspondences and oral blending';

      const summary = {
        whatWePractised: `${learnerName} has been actively working on ${practiced}.`,
        independent: independentSkills.length > 0
          ? `${learnerName} now independently demonstrates ${independentSkills.slice(0, 3).join(', ')} without prompting.`
          : `${learnerName} shows consistent engagement and is beginning to apply foundational listening routines.`,
        needsSupport: supportSkills.length > 0
          ? `We are continuing to provide gentle modelling and extra repetition for ${supportSkills.slice(0, 2).join(' and ')}.`
          : developingSkills.length > 0
            ? `${learnerName} is developing confidence in ${developingSkills.slice(0, 2).join(' and ')} with occasional teacher prompts.`
            : `Consolidating smooth blending across three-sound words.`,
        nextTeachingFocus: currentFocus || (supportSkills[0] ? `Targeted practice with ${supportSkills[0]}` : 'Advancing to cumulative word reading'),
        homeActivity: `Play a quick 2-minute oral sound game at home: say a simple 3-sound word slowly like "s-a-t" or "c-u-p" and invite ${learnerName} to leap and say the whole word together.`
      };

      return res.json({ success: true, summary, aiGenerated: false, fallback: true });
    }
  } catch (error: any) {
    console.error('Error in draft parent summary endpoint:', error);
    return res.status(500).json({ error: error.message || 'Failed to draft summary' });
  }
});

// 2. Suggest Adaptation
app.post('/api/ai/suggest-adaptation', async (req, res) => {
  try {
    const { activityTitle, skillName, strand, learnerNeed } = req.body;

    const fallbackResponse = {
      success: true,
      extraSupport: `Use tactile manipulative tokens (e.g., sound buttons or counters) to represent each sound physically before asking the learner to blend.`,
      extension: `Invite the learner to substitute the initial sound to create a new rhyming word (e.g. change /s/ in "sat" to /m/ to make "mat").`,
      aiGenerated: false
    };

    if (!ai) {
      return res.json(fallbackResponse);
    }

    try {
      const prompt = `You are an early literacy instructional coach for Simphonics.
Activity: "${activityTitle}"
Skill Strand: "${strand}" (${skillName})
Learner Need: "${learnerNeed || 'Needs extra scaffolding or extension'}"

Provide two practical, concrete classroom adaptations using common materials (paper, chalk, physical tokens, movement):
1. "extraSupport": How to step down difficulty or provide concrete multi-sensory scaffolding without changing the core learning outcome.
2. "extension": How to challenge learners who demonstrate immediate mastery.
Return as JSON with keys "extraSupport" and "extension". Keep each to 1-2 practical sentences.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, ...parsed, aiGenerated: true });
    } catch (apiErr) {
      console.warn('Gemini adapt call failed, using fallback:', apiErr);
      return res.json(fallbackResponse);
    }
  } catch (error: any) {
    console.error('Error suggesting adaptation:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. Simplify Instruction
app.post('/api/ai/simplify-instruction', async (req, res) => {
  try {
    const { instruction, ageBand } = req.body;

    const fallbackResponse = {
      success: true,
      simplified: `Listen carefully: when I tap my fingers, put the sounds together into one word!`,
      aiGenerated: false
    };

    if (!ai) {
      return res.json(fallbackResponse);
    }

    try {
      const prompt = `Rewrite this teacher instruction for young children (age band ${ageBand || '3-5 years'}).
Make it punchy, rhythmic, direct, and under 15 words.
Instruction: "${instruction}"
Return JSON with key "simplified" (string).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, simplified: parsed.simplified, aiGenerated: true });
    } catch (apiErr) {
      console.warn('Gemini simplify call failed, using fallback:', apiErr);
      return res.json(fallbackResponse);
    }
  } catch (error: any) {
    console.error('Error simplifying instruction:', error);
    return res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Simphonics Teacher Companion server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
