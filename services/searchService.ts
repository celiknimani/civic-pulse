
import { ElectionAnalysisResult, ScoreData, ComparisonPoint, PartyID } from '../types';
import { ZOTIMET, Zotim } from '../searchData';

export const analyzeElectionQuery = async (query: string): Promise<ElectionAnalysisResult> => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const normalizedQuery = query.toLowerCase();
  const searchTerms = normalizedQuery.split(/\s+/).filter(t => t.length > 2);

  // Filter zotimet based on keywords
  const matches = ZOTIMET.filter(z => {
    return searchTerms.some(term => 
      z.keywords.some(k => k.includes(term)) || 
      z.text.toLowerCase().includes(term) ||
      z.category.toLowerCase().includes(term)
    );
  });

  // If no direct matches, return general overview
  const relevantZotimet = matches.length > 0 ? matches : ZOTIMET.slice(0, 8);

  // Group by category for comparison points
  const categoriesFound = Array.from(new Set(relevantZotimet.map(z => z.category)));
  const comparisonPoints: ComparisonPoint[] = categoriesFound.slice(0, 3).map(cat => {
    const values: Record<string, string> = {};
    relevantZotimet.filter(z => z.category === cat).forEach(z => {
      values[z.partyId] = z.text;
    });
    return { category: cat, values };
  });

  // Calculate scores
  const scores: ScoreData[] = [PartyID.LVV, PartyID.PDK, PartyID.LDK, PartyID.AAK].map(pid => {
    const partyZotimet = relevantZotimet.filter(z => z.partyId === pid);
    
    // Base scores
    let gw = 5, ie = 5, sf = 5, sn = 5;

    partyZotimet.forEach(z => {
      if (z.scoreContribution.growthAndWages) gw = Math.min(10, gw + 1);
      if (z.scoreContribution.infrastructureAndEnergy) ie = Math.min(10, ie + 1);
      if (z.scoreContribution.socialAndFamily) sf = Math.min(10, sf + 1);
      if (z.scoreContribution.securityAndNATO) sn = Math.min(10, sn + 1);
    });

    return {
      partyId: pid,
      growthAndWages: gw,
      infrastructureAndEnergy: ie,
      socialAndFamily: sf,
      securityAndNATO: sn,
      summary: partyZotimet.length > 0 
        ? `Ka ${partyZotimet.length} zotime specifike për këtë kërkim.`
        : "Programe të përgjithshme për këtë kategori."
    };
  });

  // Generate analysis text
  let analysis = `### Rezultatet e kërkimit për: "${query}"\n\n`;
  if (matches.length > 0) {
    analysis += `Kemi gjetur **${matches.length} zotime specifike** që ndërlidhen me kërkesën tuaj.\n\n`;
    
    const byParty: Record<string, Zotim[]> = {};
    matches.forEach(m => {
      if (!byParty[m.partyId]) byParty[m.partyId] = [];
      byParty[m.partyId].push(m);
    });

    Object.entries(byParty).forEach(([pid, items]) => {
      analysis += `#### ${pid}\n`;
      items.forEach(item => {
        analysis += `- **${item.text}**: ${item.detail}\n`;
      });
      analysis += `\n`;
    });
  } else {
    analysis += "Nuk kemi gjetur zotime specifike për këto fjalë kyçe, por këtu janë pikat kryesore nga programet e vitit 2025 në kategoritë e ngjashme.\n";
  }

  return {
    analysis,
    scores,
    comparisonPoints,
    detectedCategory: categoriesFound[0] || "Ekonomia"
  };
};
