// store/useStore.ts
import { create } from 'zustand';

export interface Team { name: string; code: string; }
export interface KnockoutMatch { team1: Team | null; team2: Team | null; winner: Team | null; }

export const PLAYOFFS = [
  { id: 'UEFA_D', name: 'Playoff D', targetGroup: 'A', team1: {name: 'Dinamarca', code: 'dk'}, team2: {name: 'Rep. Tcheca', code: 'cz'} },
  { id: 'UEFA_A', name: 'Playoff A', targetGroup: 'B', team1: {name: 'Itália', code: 'it'}, team2: {name: 'País de Gales', code: 'gb-wls'} }, 
  { id: 'UEFA_C', name: 'Playoff C', targetGroup: 'D', team1: {name: 'Turquia', code: 'tr'}, team2: {name: 'Romênia', code: 'ro'} },
  { id: 'UEFA_B', name: 'Playoff B', targetGroup: 'F', team1: {name: 'Suécia', code: 'se'}, team2: {name: 'Polônia', code: 'pl'} },
  { id: 'IC_2', name: 'Inter-Confed 2', targetGroup: 'I', team1: {name: 'Iraque', code: 'iq'}, team2: {name: 'Bolívia', code: 'bo'} },
  { id: 'IC_1', name: 'Inter-Confed 1', targetGroup: 'K', team1: {name: 'DR Congo', code: 'cd'}, team2: {name: 'Jamaica', code: 'jm'} },
];

export const GROUPS: Record<string, Team[]> = {
  A: [{ name: 'México', code: 'mx' }, { name: 'África do Sul', code: 'za' }, { name: 'Coreia do Sul', code: 'kr' }],
  B: [{ name: 'Canadá', code: 'ca' }, { name: 'Suíça', code: 'ch' }, { name: 'Qatar', code: 'qa' }],
  C: [{ name: 'Brasil', code: 'br' }, { name: 'Marrocos', code: 'ma' }, { name: 'Escócia', code: 'gb-sct' }, { name: 'Haiti', code: 'ht' }],
  D: [{ name: 'Estados Unidos', code: 'us' }, { name: 'Paraguai', code: 'py' }, { name: 'Austrália', code: 'au' }],
  E: [{ name: 'Alemanha', code: 'de' }, { name: 'Equador', code: 'ec' }, { name: 'Costa do Marfim', code: 'ci' }, { name: 'Curaçao', code: 'cw' }],
  F: [{ name: 'Holanda', code: 'nl' }, { name: 'Japão', code: 'jp' }, { name: 'Tunísia', code: 'tn' }],
  G: [{ name: 'Bélgica', code: 'be' }, { name: 'Irã', code: 'ir' }, { name: 'Egito', code: 'eg' }, { name: 'Nova Zelândia', code: 'nz' }],
  H: [{ name: 'Espanha', code: 'es' }, { name: 'Uruguai', code: 'uy' }, { name: 'Arábia Saudita', code: 'sa' }, { name: 'Cabo Verde', code: 'cv' }],
  I: [{ name: 'França', code: 'fr' }, { name: 'Senegal', code: 'sn' }, { name: 'Noruega', code: 'no' }],
  J: [{ name: 'Argentina', code: 'ar' }, { name: 'Áustria', code: 'at' }, { name: 'Argélia', code: 'dz' }, { name: 'Jordânia', code: 'jo' }],
  K: [{ name: 'Portugal', code: 'pt' }, { name: 'Colômbia', code: 'co' }, { name: 'Uzbequistão', code: 'uz' }],
  L: [{ name: 'Inglaterra', code: 'gb-eng' }, { name: 'Croácia', code: 'hr' }, { name: 'Gana', code: 'gh' }, { name: 'Panamá', code: 'pa' }]
};

const TEAM_RANKING: Record<string, number> = {
  'br': 100, 'fr': 99, 'ar': 98, 'gb-eng': 97, 'es': 96, 'de': 95, 'pt': 94, 'nl': 93, 'it': 92, 'uy': 91, 
  'be': 90, 'hr': 89, 'co': 88, 'ma': 87, 'us': 86, 'jp': 85, 'sn': 84, 'mx': 83, 'ch': 82, 'dk': 81, 
  'tr': 80, 'se': 79, 'ec': 78, 'kr': 77, 'au': 76, 'ir': 75, 'za': 74, 'qa': 73, 'ht': 72, 'py': 71, 
  'ci': 70, 'cw': 69, 'tn': 68, 'eg': 67, 'nz': 66, 'sa': 65, 'cv': 64, 'no': 63, 'at': 62, 'dz': 61, 
  'jo': 60, 'uz': 59, 'gb-sct': 58, 'gh': 57, 'pa': 56, 'ca': 55, 'cz': 75, 'gb-wls': 73, 'ro': 72, 
  'pl': 74, 'iq': 60, 'bo': 58, 'cd': 59, 'jm': 61
};

interface StoreState {
  phase: 'REPESCAGEM' | 'GRUPOS' | 'MATA_MATA' | 'CAMPEAO';
  setPhase: (phase: 'REPESCAGEM' | 'GRUPOS' | 'MATA_MATA' | 'CAMPEAO') => void;
  repechageWinners: Record<string, Team | null>;
  setRepechageWinner: (playoffId: string, team: Team) => void;
  groupWinners: Record<string, { first: Team | null, second: Team | null, third: Team | null }>;
  setGroupWinner: (groupName: string, position: 'first' | 'second' | 'third', team: Team) => void;
  bestThirds: Team[];
  toggleBestThird: (team: Team) => void;
  bracket: { dezesseisAvos: KnockoutMatch[]; oitavas: KnockoutMatch[]; quartas: KnockoutMatch[]; semis: KnockoutMatch[]; final: KnockoutMatch[]; };
  generateBracket: () => void;
  advanceTeam: (phase: 'dezesseisAvos' | 'oitavas' | 'quartas' | 'semis' | 'final', matchIndex: number, team: Team) => void;
  simulateIA: (targetPhase: 'REPESCAGEM' | 'GRUPOS' | 'MATA_MATA') => void;
}

const initialGroups: Record<string, { first: Team | null, second: Team | null, third: Team | null }> = {};
['A','B','C','D','E','F','G','H','I','J','K','L'].forEach(letter => { initialGroups[letter] = { first: null, second: null, third: null }; });
const createEmptyMatches = (count: number): KnockoutMatch[] => Array(count).fill({ team1: null, team2: null, winner: null });

export const useStore = create<StoreState>((set) => ({
  phase: 'REPESCAGEM',
  setPhase: (phase) => set({ phase }),
  
  repechageWinners: { 'UEFA_D': null, 'UEFA_A': null, 'UEFA_C': null, 'UEFA_B': null, 'IC_2': null, 'IC_1': null },
  setRepechageWinner: (playoffId, team) => set((state) => ({ repechageWinners: { ...state.repechageWinners, [playoffId]: team } })),

  groupWinners: initialGroups,
  setGroupWinner: (groupName, position, team) =>
    set((state) => {
      const newGroups = JSON.parse(JSON.stringify(state.groupWinners));
      const isToggleOff = newGroups[groupName][position]?.code === team.code;
      Object.keys(newGroups).forEach((g) => {
        if (newGroups[g].first?.code === team.code) newGroups[g].first = null;
        if (newGroups[g].second?.code === team.code) newGroups[g].second = null;
        if (newGroups[g].third?.code === team.code) newGroups[g].third = null;
      });
      if (!isToggleOff) newGroups[groupName][position] = team;
      
      let newBestThirds = [...state.bestThirds];
      if (position !== 'third') newBestThirds = newBestThirds.filter(t => t.code !== team.code);
      
      return { groupWinners: newGroups, bestThirds: newBestThirds };
    }),

  bestThirds: [],
  toggleBestThird: (team) => set((state) => {
    const exists = state.bestThirds.find(t => t.code === team.code);
    if (exists) return { bestThirds: state.bestThirds.filter(t => t.code !== team.code) };
    if (state.bestThirds.length >= 8) return state; 
    return { bestThirds: [...state.bestThirds, team] };
  }),

  bracket: { dezesseisAvos: createEmptyMatches(16), oitavas: createEmptyMatches(8), quartas: createEmptyMatches(4), semis: createEmptyMatches(2), final: createEmptyMatches(1) },

  generateBracket: () => set((state) => {
    const gw = state.groupWinners;
    const teams32 = [
      ...Object.values(gw).map(g => g.first),  
      ...Object.values(gw).map(g => g.second), 
      ...Object.values(gw).map(g => g.third).filter(Boolean)
    ];
    const dezesseisAvos = [];
    for (let i = 0; i < 16; i++) {
      dezesseisAvos.push({ team1: teams32[i] || null, team2: teams32[31 - i] || null, winner: null });
    }
    return { phase: 'MATA_MATA', bracket: { dezesseisAvos, oitavas: createEmptyMatches(8), quartas: createEmptyMatches(4), semis: createEmptyMatches(2), final: createEmptyMatches(1) } };
  }),

  advanceTeam: (phase, matchIndex, team) => set((state) => {
    const newBracket = { ...state.bracket };
    newBracket[phase][matchIndex] = { ...newBracket[phase][matchIndex], winner: team };
    const nextMatch = Math.floor(matchIndex / 2);
    const isTeam1 = matchIndex % 2 === 0;

    if (phase === 'dezesseisAvos') {
      newBracket.oitavas[nextMatch] = { ...newBracket.oitavas[nextMatch] };
      if (isTeam1) newBracket.oitavas[nextMatch].team1 = team; else newBracket.oitavas[nextMatch].team2 = team;
    }
    else if (phase === 'oitavas') {
      newBracket.quartas[nextMatch] = { ...newBracket.quartas[nextMatch] };
      if (isTeam1) newBracket.quartas[nextMatch].team1 = team; else newBracket.quartas[nextMatch].team2 = team;
    } 
    else if (phase === 'quartas') {
      newBracket.semis[nextMatch] = { ...newBracket.semis[nextMatch] };
      if (isTeam1) newBracket.semis[nextMatch].team1 = team; else newBracket.semis[nextMatch].team2 = team;
    }
    else if (phase === 'semis') {
      newBracket.final[0] = { ...newBracket.final[0] };
      if (isTeam1) newBracket.final[0].team1 = team; else newBracket.final[0].team2 = team;
    }
    else if (phase === 'final') { return { bracket: newBracket, phase: 'CAMPEAO' }; }
    
    return { bracket: newBracket };
  }),

  simulateIA: (targetPhase) => set((state) => {
    if (targetPhase === 'REPESCAGEM') {
      const newWinners = { ...state.repechageWinners };
      PLAYOFFS.forEach(p => {
        const w1 = TEAM_RANKING[p.team1.code] || 50;
        const w2 = TEAM_RANKING[p.team2.code] || 50;
        newWinners[p.id] = w1 >= w2 ? p.team1 : p.team2;
      });
      return { repechageWinners: newWinners };
    }

    if (targetPhase === 'GRUPOS') {
      const newGroups = JSON.parse(JSON.stringify(initialGroups));
      const tempThirds: { group: string, team: Team }[] = [];

      Object.keys(GROUPS).forEach(groupName => {
        let teams = [...GROUPS[groupName]];
        const playoff = PLAYOFFS.find(p => p.targetGroup === groupName);
        if (playoff && state.repechageWinners[playoff.id]) {
          teams.push(state.repechageWinners[playoff.id]!);
        }
        teams.sort((a, b) => (TEAM_RANKING[b.code] || 50) - (TEAM_RANKING[a.code] || 50));
        newGroups[groupName].first = teams[0] || null;
        newGroups[groupName].second = teams[1] || null;
        if (teams[2]) tempThirds.push({ group: groupName, team: teams[2] });
      });

      tempThirds.sort((a, b) => (TEAM_RANKING[b.team.code] || 50) - (TEAM_RANKING[a.team.code] || 50));
      const best8 = tempThirds.slice(0, 8);
      best8.forEach(t => { newGroups[t.group].third = t.team; });

      return { groupWinners: newGroups, bestThirds: best8.map(t => t.team) };
    }

    if (targetPhase === 'MATA_MATA') {
      const newBracket = JSON.parse(JSON.stringify(state.bracket));
      
      // Função blindada pra decidir quem ganha (com fallback se o time for nulo)
      const defineWinner = (match: KnockoutMatch) => {
        if (!match.team1 && !match.team2) return null;
        if (!match.team1) return match.team2;
        if (!match.team2) return match.team1;
        const rank1 = TEAM_RANKING[match.team1.code] || 50;
        const rank2 = TEAM_RANKING[match.team2.code] || 50;
        return rank1 >= rank2 ? match.team1 : match.team2;
      };

      // 1. Resolve os 16-avos
      newBracket.dezesseisAvos.forEach((m: KnockoutMatch, i: number) => {
        m.winner = defineWinner(m);
        const nextMatch = Math.floor(i / 2);
        if (i % 2 === 0) newBracket.oitavas[nextMatch].team1 = m.winner;
        else newBracket.oitavas[nextMatch].team2 = m.winner;
      });

      // 2. Resolve as Oitavas
      newBracket.oitavas.forEach((m: KnockoutMatch, i: number) => {
        m.winner = defineWinner(m);
        const nextMatch = Math.floor(i / 2);
        if (i % 2 === 0) newBracket.quartas[nextMatch].team1 = m.winner;
        else newBracket.quartas[nextMatch].team2 = m.winner;
      });

      // 3. Resolve as Quartas
      newBracket.quartas.forEach((m: KnockoutMatch, i: number) => {
        m.winner = defineWinner(m);
        const nextMatch = Math.floor(i / 2);
        if (i % 2 === 0) newBracket.semis[nextMatch].team1 = m.winner;
        else newBracket.semis[nextMatch].team2 = m.winner;
      });

      // 4. Resolve as Semis
      newBracket.semis.forEach((m: KnockoutMatch, i: number) => {
        m.winner = defineWinner(m);
        if (i % 2 === 0) newBracket.final[0].team1 = m.winner;
        else newBracket.final[0].team2 = m.winner;
      });

      // 5. Resolve a Grande Final
      newBracket.final[0].winner = defineWinner(newBracket.final[0]);

      return { bracket: newBracket, phase: 'CAMPEAO' };
    }

    return state;
  }),
}));