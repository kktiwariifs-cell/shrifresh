import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google Gemini SDK if key is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  console.log('Gemini AI Client successfully initialized.');
} else {
  console.warn('GEMINI_API_KEY is not defined or is placeholder. Smart features will run in high-quality simulation mode.');
}

// Helper utility to execute async functions with robust automatic retry
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1200): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (e: any) {
      attempt++;
      if (attempt >= retries) {
        throw e;
      }
      const isUnavailable = e?.status === 'UNAVAILABLE' || e?.code === 503 || String(e).includes('503') || String(e).includes('UNAVAILABLE') || String(e).includes('high demand') || String(e).includes('temporarily');
      console.warn(`[Gemini SDK Wrapper] Attempt ${attempt} failed: ${e?.message || e}. ${isUnavailable ? 'Model is under temporary high demand. Backing off & retrying...' : 'Retrying in background...'}`);
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error('Retries exhausted');
}

// 1. Voice / Search AI assistant endpoint
app.post('/api/gemini/search', async (req, res) => {
  const { query, catalog } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Search query is missing' });
  }

  const defaultCatalog = catalog || [];

  if (!aiClient) {
    // Elegant fallbacks if API key is not present
    console.log('Simulating AI Search due to missing API key.');
    const queryLower = query.toLowerCase();
    let recommendedIds: string[] = [];
    let advice = `Based on your request "${query}", here is our fresh recommendation:`;

    if (queryLower.includes('protein') || queryLower.includes('muscle') || queryLower.includes('diet')) {
      recommendedIds = ['p5', 'p1', 'p2', 'p3']; // Paneer, milk
      advice = "We've selected our high-protein Fresh Malai Paneer and rich Milks. Paneer provides 18.5g of pure protein per 200g serving, which is perfect for muscle recovery and structural body cell nourishment. Our Gir Cow A2 milk offers supreme digestibility to prevent digestive heaviness.";
    } else if (queryLower.includes('fat') || queryLower.includes('low') || queryLower.includes('thin') || queryLower.includes('weight')) {
      recommendedIds = ['p1', 'p3', 'p6']; // Cow milk, Gir milk, curd
      advice = "For a lighter, low-fat intake, we recommend DairyFresh Standard Cow Milk (only 3.8% fat) and our probiotic Thick Farm Curd. They supply vital calcium (120-143mg) and premium whey proteins while keeping saturated lipids balanced.";
    } else if (queryLower.includes('curd') || queryLower.includes('dahi') || queryLower.includes('prob') || queryLower.includes('acid')) {
      recommendedIds = ['p6', 'p2']; // Curd, Buffalo milk (to make curd)
      advice = "To enjoy or culture premium curd, select our Thick Farm Curd containing active lactic probiotic strains. Alternatively, Buffalo Milk's high SNF (9.0%) and natural fats bind starter cultures beautifully to construct solid, sweet, cream-layered dahi at home.";
    } else {
      recommendedIds = ['p1', 'p3', 'p4'];
      advice = "We recommend our premium A2 Gir Cow Milk and Vedic Bilona Desi Ghee. They fit general wellness routines perfectly, supporting cognitive vitality, physical stamina, and natural immunity via easy-to-absorb short-chain fatty acids.";
    }

    return res.json({
      recommendedProductIds: recommendedIds,
      nutritionalAdvice: advice,
      isSimulated: true,
    });
  }

  try {
    // Call Gemini Model
    const systemPrompt = `You are the smart nutritionist & product recommender engine for DairyFresh E-commerce platform.
You are given a user request and our active dairy inventory.
You must analyze the user demand (e.g. high protein, low fat, baking, thick curd, lactose digest, ghee aroma) and select which product IDs match perfectly.
Return a structured JSON output containing:
1. "recommendedProductIds": a list of matching product ID strings from the provided catalog.
2. "nutritionalAdvice": highly customized 2-3 sentence human-friendly advice explaining why these products are ideal for their spec, citing specific fat, SNF, or protein facts.

Our dynamic product list: ${JSON.stringify(
      defaultCatalog.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        fat: p.fatPercentage,
        snf: p.snfPercentage,
        protein: p.nutrition?.protein,
        description: p.description,
      }))
    )}`;

    const response = await withRetry(() => aiClient!.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Find me the best dairy matches for this query: "${query}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'IDs of recommended products matching catalog entries',
            },
            nutritionalAdvice: {
              type: Type.STRING,
              description: 'Personalized expert advice explaining the dairy features',
            },
          },
          required: ['recommendedProductIds', 'nutritionalAdvice'],
        },
      },
    }));

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText.trim());
    return res.json(parsed);

  } catch (error: any) {
    console.warn('[Gemini API Recovery] Transient load or rate limit during search. Using high-fidelity local simulator:', error?.message || error);
    
    // Graceful high-fidelity simulation backup:
    const queryLower = (query || '').toLowerCase();
    let recommendedIds: string[] = [];
    let advice = `Based on your request "${query}", here is our fresh recommendation:`;

    if (queryLower.includes('protein') || queryLower.includes('muscle') || queryLower.includes('diet')) {
      recommendedIds = ['p5', 'p1', 'p2', 'p3']; // Paneer, milk
      advice = "We've selected our high-protein Fresh Malai Paneer and rich Milks. Paneer provides 18.5g of pure protein per 200g serving, which is perfect for muscle recovery and structural body cell nourishment. Our Gir Cow A2 milk offers supreme digestibility to prevent digestive heaviness.";
    } else if (queryLower.includes('fat') || queryLower.includes('low') || queryLower.includes('thin') || queryLower.includes('weight')) {
      recommendedIds = ['p1', 'p3', 'p6']; // Cow milk, Gir milk, curd
      advice = "For a lighter, low-fat intake, we recommend DairyFresh Standard Cow Milk (only 3.8% fat) and our probiotic Thick Farm Curd. They supply vital calcium (120-143mg) and premium whey proteins while keeping saturated lipids balanced.";
    } else if (queryLower.includes('curd') || queryLower.includes('dahi') || queryLower.includes('prob') || queryLower.includes('acid')) {
      recommendedIds = ['p6', 'p2']; // Curd, Buffalo milk (to make curd)
      advice = "To enjoy or culture premium curd, select our Thick Farm Curd containing active lactic probiotic strains. Alternatively, Buffalo Milk's high SNF (9.0%) and natural fats bind starter cultures beautifully to construct solid, sweet, cream-layered dahi at home.";
    } else {
      recommendedIds = ['p1', 'p3', 'p4'];
      advice = "We recommend our premium A2 Gir Cow Milk and Vedic Bilona Desi Ghee. They fit general wellness routines perfectly, supporting cognitive vitality, physical stamina, and natural immunity via easy-to-absorb short-chain fatty acids.";
    }

    return res.json({
      recommendedProductIds: recommendedIds,
      nutritionalAdvice: `${advice} (Note: System running in backup solver mode due to transient load on AI endpoints)`,
      isSimulated: true,
      errorOccurred: true
    });
  }
});

// 2. AI Demand Forecasting endpoint
app.post('/api/gemini/forecast', async (req, res) => {
  const { currentTemp, activeSeason, currentOrdersCount } = req.body;

  if (!aiClient) {
    console.log('Simulating AI Demand Forecast.');
    // Dynamic simulated forecast data based on temperature and weather season
    const baseMilkVols = activeSeason === 'Summer' ? [140, 155, 175, 190, 185, 160, 150] : [120, 125, 130, 145, 140, 135, 120];
    const baseCurdVols = activeSeason === 'Summer' ? [90, 110, 120, 135, 130, 105, 95] : [55, 60, 65, 78, 70, 68, 50];
    const baseGheeVols = activeSeason === 'Sweets' ? [45, 55, 70, 85, 75, 60, 50] : [20, 22, 25, 30, 28, 25, 20];

    const labels = ['Tue', 'Wed', 'Thu', 'Fri (Peak)', 'Sat', 'Sun', 'Mon (Next)'];
    
    return res.json({
      labels,
      milkForecast: baseMilkVols,
      curdForecast: baseCurdVols,
      gheeForecast: baseGheeVols,
      aiAnalysis: `Simulation engine suggests ${activeSeason === 'Summer' ? 'elevated curd and ice cream' : 'steady ghee and butter'} demand over the next 7 days. Higher temps of (${currentTemp}°C) typically increase buttermilk/curd intake by 25%. Peak expected on Friday.`,
      predictedMilkRequired: activeSeason === 'Summer' ? '12,500 L (+25%)' : '9,800 L (Normal)',
      recommendations: activeSeason === 'Summer' ? 'Enable early dispatch chilling. Summer demand surge expected for high fatigue probiotic items.' : 'Maintain normal inventory targets across milk lines.',
      riskIndicators: currentTemp > 30 ? 'High risk of temperature breach; recommend prompt dispatch route optimizations for AM cold dispatches.' : 'Low danger of cold chain leakage.',
      isSimulated: true
    });
  }

  try {
    const prompt = `Formulate a next-7-days sales volume demand forecast for our top dairy categories: Milk, Curd, and Ghee.
Our system stats:
- Current Temperature: ${currentTemp}°C
- Current Active Season/Focus: ${activeSeason}
- Active daily order index: ${currentOrdersCount}

Generate forecast values as numbers representing Litres/kgs needed per day for:
Day 1, Day 2, Day 3, Day 4 (Friday Peak), Day 5, Day 6, Day 7.
Also write a summary paragraph of why the AI predicted these numbers (mention temperature effects, e.g. heatwaves spike lassi/curd, winter/festive spikes ghee).

Your JSON output must contain these exact keys:
1. labels: 7 day labels
2. milkForecast: 7 integer demand values
3. curdForecast: 7 integer demand values
4. gheeForecast: 7 integer demand values
5. aiAnalysis: explanation paragraph describing overall trends
6. predictedMilkRequired: A short display string like "12,500 L (+25% Surge)"
7. recommendations: Actionable advice for cold dispatch
8. riskIndicators: Transit/storage risk assessment under temperature factors`;

    const response = await withRetry(() => aiClient!.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            labels: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '7 abbreviated labels representing consecutive week days starting tomorrow',
            },
            milkForecast: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: '7 predicted daily volume figures (in Litres) for Milk demand',
            },
            curdForecast: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: '7 predicted daily volume figures (in kgs) for Curd demand',
            },
            gheeForecast: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: '7 predicted daily volume figures (in kg/Litres) for Ghee demand',
            },
            aiAnalysis: {
              type: Type.STRING,
              description: 'Explanation paragraph summarizing seasonal factors, temperature trends and production adjustments recommended.',
            },
            predictedMilkRequired: {
              type: Type.STRING,
              description: 'Short peak milk demand string like "12,500 L (+25% Surge)"',
            },
            recommendations: {
              type: Type.STRING,
              description: 'Actionable strategic recommendations for cold chain and dispatch inventory adjustments',
            },
            riskIndicators: {
              type: Type.STRING,
              description: 'Detail about transit risk or thermal load breach risk',
            },
          },
          required: ['labels', 'milkForecast', 'curdForecast', 'gheeForecast', 'aiAnalysis', 'predictedMilkRequired', 'recommendations', 'riskIndicators'],
        },
      },
    }));

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('[Gemini API Recovery] Transient load or rate limit during demand forecasting. Using high-fidelity local simulator:', error?.message || error);
    
    // Graceful high-fidelity simulation backup on error:
    const baseMilkVols = activeSeason === 'Summer' ? [140, 155, 175, 190, 185, 160, 150] : [120, 125, 130, 145, 140, 135, 120];
    const baseCurdVols = activeSeason === 'Summer' ? [90, 110, 120, 135, 130, 105, 95] : [55, 60, 65, 78, 70, 68, 50];
    const baseGheeVols = activeSeason === 'Sweets' ? [45, 55, 70, 85, 75, 60, 50] : [20, 22, 25, 30, 28, 25, 20];

    const labels = ['Tue', 'Wed', 'Thu', 'Fri (Peak)', 'Sat', 'Sun', 'Mon (Next)'];
    
    return res.json({
      labels,
      milkForecast: baseMilkVols,
      curdForecast: baseCurdVols,
      gheeForecast: baseGheeVols,
      aiAnalysis: `Simulation engine suggests ${activeSeason === 'Summer' ? 'elevated curd and lassi' : 'steady ghee and butter'} demand over the next 7 days. Higher temps of (${currentTemp}°C) typically increase yogurt/curd intake by 25%. Peak expected on Friday.`,
      predictedMilkRequired: activeSeason === 'Summer' ? '12,500 L (+25%)' : '9,800 L (Normal)',
      recommendations: activeSeason === 'Summer' ? 'Enable early dispatch chilling. Summer demand surge expected for high fatigue probiotic items.' : 'Maintain normal inventory targets across milk lines.',
      riskIndicators: currentTemp > 30 ? 'High risk of temperature breach; recommend prompt dispatch route optimizations for AM cold dispatches.' : 'Low danger of cold chain leakage.',
      isSimulated: true,
      errorOccurred: true
    });
  }
});


// 3. Vite development middleware / production static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DairyFresh Fullstack Server operating at http://localhost:${PORT}`);
  });
}

startServer();
