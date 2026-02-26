// app/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore, Team, KnockoutMatch, PLAYOFFS, GROUPS } from '../store/useStore'; 
import { Trophy, ArrowRight, Globe2, Crown, AlertTriangle, Camera, MessageCircle, Twitter, Link, Sparkles, Github, Linkedin, Code, Globe, Smartphone } from 'lucide-react';
import { toPng } from 'html-to-image';


const getFlagUrl = (code: string) => `https://flagcdn.com/w80/${code}.png`;

export default function Simulator() {
  const { phase, setPhase, repechageWinners, setRepechageWinner, groupWinners, setGroupWinner, bracket, generateBracket, advanceTeam, simulateIA, bestThirds } = useStore();
  
  const [showWarning, setShowWarning] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // REFERÊNCIA PARA O SCROLL DO CHAVEAMENTO
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // EFEITO PARA CENTRALIZAR O SCROLL NO MATA-MATA (MOBILE)
  useEffect(() => {
    if ((phase === 'MATA_MATA' || phase === 'CAMPEAO') && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Calcula o meio exato e rola para lá
      const scrollPosition = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = scrollPosition;
    }
  }, [phase]);

  const allRepechageDone = Object.values(repechageWinners).every(winner => winner !== null);
  const allFirstsAndSecondsDone = Object.values(groupWinners).every(g => g.first !== null && g.second !== null);
  const totalThirdsSelected = Object.values(groupWinners).filter(g => g.third !== null).length;
  const allGroupsDone = allFirstsAndSecondsDone && totalThirdsSelected === 8;

  const handleSetGroupWinner = (groupName: string, position: 'first' | 'second' | 'third', team: Team) => {
    if (position === 'third') {
      const groupHasThird = groupWinners[groupName].third !== null;
      const teamIsAlreadyThird = Object.values(groupWinners).some(g => g.third?.code === team.code);
      const isToggleOff = groupWinners[groupName].third?.code === team.code;

      if (totalThirdsSelected >= 8 && !groupHasThird && !teamIsAlreadyThird && !isToggleOff) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        return; 
      }
    }
    setShowWarning(false);
    setGroupWinner(groupName, position, team);
  };

  const shareText = "Montei meu chaveamento da Copa de 2026! Quem leva a taça? Faça o seu também:";
  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); };
  const handleWhatsAppShare = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`, '_blank');
  const handleTwitterShare = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`, '_blank');

  // FUNÇÃO DE FOTO ATUALIZADA
  const handleDownloadImage = async () => {
    setIsCapturing(true);
    setTimeout(async () => {
      const element = document.getElementById('bracket-capture');
      if (element) {
        try {
          const dataUrl = await toPng(element, { 
            backgroundColor: '#09090b', 
            pixelRatio: 2 
          });
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'meu-chaveamento-2026.png';
          link.click();
        } catch (error) {
          console.error("Erro na foto:", error);
          alert("Ops! Deu ruim ao tirar o print. Tente de novo.");
        }
      }
      setIsCapturing(false);
    }, 300); 
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 font-sans relative">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-zinc-800 pb-4 max-w-7xl mx-auto gap-4">
        <h1 className="text-2xl font-black flex items-center gap-2 text-yellow-500">
          <Globe2 size={28} /> FIFA World Cup 2026™
        </h1>
        <div className="flex gap-1 md:gap-2 text-[10px] md:text-xs">
          <span className={`px-2 py-1 rounded font-bold ${phase === 'REPESCAGEM' ? 'bg-yellow-500 text-black' : 'text-zinc-600'}`}>1. Playoffs</span>
          <span className={`px-2 py-1 rounded font-bold ${phase === 'GRUPOS' ? 'bg-yellow-500 text-black' : 'text-zinc-600'}`}>2. Grupos</span>
          <span className={`px-2 py-1 rounded font-bold ${phase === 'MATA_MATA' || phase === 'CAMPEAO' ? 'bg-green-500 text-black' : 'text-zinc-600'}`}>3. Mata-Mata</span>
        </div>
      </header>

      {/* --- FASE 1: REPESCAGEM --- */}
      {phase === 'REPESCAGEM' && (
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="flex flex-col items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-center">Jogos Decisivos da Repescagem</h2>
            <button onClick={() => simulateIA('REPESCAGEM')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
              <Sparkles size={18} /> Simulação da IA
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {PLAYOFFS.map((match) => (
              <div key={match.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-lg">
                <p className="text-yellow-500 text-xs font-bold uppercase text-center mb-4">{match.name}</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setRepechageWinner(match.id, match.team1)} className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all ${repechageWinners[match.id]?.code === match.team1.code ? 'bg-green-600/20 border-green-500' : 'bg-zinc-800 border-transparent hover:border-zinc-600'}`}>
                    <img src={getFlagUrl(match.team1.code)} className="w-6 rounded" alt="flag"/> <span className="font-bold text-sm">{match.team1.name}</span>
                  </button>
                  <div className="text-center text-zinc-600 text-xs font-bold uppercase">vs</div>
                  <button onClick={() => setRepechageWinner(match.id, match.team2)} className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all ${repechageWinners[match.id]?.code === match.team2.code ? 'bg-green-600/20 border-green-500' : 'bg-zinc-800 border-transparent hover:border-zinc-600'}`}>
                    <img src={getFlagUrl(match.team2.code)} className="w-6 rounded" alt="flag"/> <span className="font-bold text-sm">{match.team2.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center"><button onClick={() => setPhase('GRUPOS')} disabled={!allRepechageDone} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-black px-8 py-3 rounded-xl flex items-center gap-2">Ir para Fase de Grupos <ArrowRight/></button></div>
        </div>
      )}

      {/* --- FASE 2: GRUPOS --- */}
      {phase === 'GRUPOS' && (
         <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-6 gap-4">
              <h2 className="text-3xl font-bold text-center">Fase de Grupos</h2>
              <button onClick={() => simulateIA('GRUPOS')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
                <Sparkles size={18} /> Simulação da IA
              </button>
              <p className="text-center text-zinc-400">Selecione todos os 1º e 2º lugares, e defina apenas os <strong className="text-white">8 melhores 3ºs lugares</strong>.</p>
            </div>
            
            {showWarning && (
              <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center justify-center gap-3 animate-pulse max-w-2xl mx-auto">
                <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
                <span className="font-bold text-sm">Limite de 8 terceiros lugares atingido! Você precisa desmarcar um 3º lugar de outro grupo.</span>
              </div>
            )}

            <div className="flex justify-center mb-6">
              <span className={`px-4 py-1.5 rounded-full font-bold text-sm border transition-colors ${totalThirdsSelected === 8 ? 'bg-green-600/20 text-green-400 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                3ºs Colocados: {totalThirdsSelected} / 8 Vagas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {Object.entries(GROUPS).map(([groupName, baseTeams]) => {
              let finalTeams = [...baseTeams];
              const p = PLAYOFFS.find(p => p.targetGroup === groupName);
              if (p && repechageWinners[p.id]) finalTeams.push(repechageWinners[p.id]!);
              return (
                <div key={groupName} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <h3 className="text-base font-bold text-yellow-500 mb-2 border-b border-zinc-800 pb-1">Grupo {groupName}</h3>
                  <div className="space-y-1.5">
                    {finalTeams.map((team) => {
                      const isFirst = groupWinners[groupName].first?.code === team.code;
                      const isSecond = groupWinners[groupName].second?.code === team.code;
                      const isThird = groupWinners[groupName].third?.code === team.code;
                      return (
                        <div key={team.code} className="flex justify-between items-center bg-zinc-950 p-1.5 rounded">
                          <div className="flex items-center gap-2 overflow-hidden"><img src={getFlagUrl(team.code)} className="w-5 rounded flex-shrink-0"/> <span className="text-xs font-semibold truncate" title={team.name}>{team.name}</span></div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => handleSetGroupWinner(groupName, 'first', team)} className={`w-6 h-6 rounded text-[10px] font-bold transition-colors ${isFirst ? 'bg-yellow-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}>1º</button>
                            <button onClick={() => handleSetGroupWinner(groupName, 'second', team)} className={`w-6 h-6 rounded text-[10px] font-bold transition-colors ${isSecond ? 'bg-zinc-300 text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}>2º</button>
                            <button onClick={() => handleSetGroupWinner(groupName, 'third', team)} className={`w-6 h-6 rounded text-[10px] font-bold transition-colors ${isThird ? 'bg-orange-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}>3º</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
            </div>
            
            <div className="flex justify-center mb-10">
              <button onClick={generateBracket} disabled={!allGroupsDone} className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-black text-xl px-10 py-4 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] mx-auto">
                Gerar Chaveamento (32 Times) <Trophy/>
              </button>
            </div>
         </div>
      )}

      {/* --- FASE 3: MATA-MATA E CAMPEÃO --- */}
      {(phase === 'MATA_MATA' || phase === 'CAMPEAO') && (
        <div className="w-full h-full pb-10 flex flex-col items-center pt-2">
          
          <div className="flex flex-wrap justify-center items-center gap-3 mb-8 w-full max-w-5xl px-4">
            {phase !== 'CAMPEAO' && (
              <button onClick={() => simulateIA('MATA_MATA')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-colors mr-auto">
                <Sparkles size={18} /> Preencher Mata-Mata (IA)
              </button>
            )}
            
            <button onClick={handleDownloadImage} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors ml-auto">
              <Camera size={18} /> {isCapturing ? 'Gerando Imagem...' : 'Salvar Imagem'}
            </button>
            <button onClick={handleWhatsAppShare} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </button>
            <button onClick={handleTwitterShare} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 border border-zinc-700 transition-colors">
              <Twitter size={18} /> X
            </button>
          </div>

          {/* Aviso para virar o celular (Só aparece em telas pequenas e no modo retrato) */}
          {!isCapturing && (
            <div className="md:hidden portrait:flex bg-yellow-500 text-black font-black p-3 rounded-xl mb-6 items-center justify-center gap-3 animate-pulse w-11/12 max-w-sm mx-auto shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              <Smartphone className="rotate-90 transition-transform" size={24} />
              <span className="text-sm text-center">Gire o celular para a horizontal para ver o chaveamento completo!</span>
            </div>
          )}

          {phase === 'CAMPEAO' && bracket.final[0].winner && !isCapturing && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-50 bg-zinc-900/95 p-8 rounded-3xl border-4 border-yellow-500 shadow-[0_0_100px_rgba(234,179,8,0.5)] animate-bounce-short">
               <Crown size={56} className="text-yellow-500 mb-2"/>
               <h2 className="text-4xl font-black text-white mb-4">CAMPEÃO 2026</h2>
               <img src={getFlagUrl(bracket.final[0].winner.code)} className="w-24 rounded-lg shadow-xl mb-4" />
               <h3 className="text-2xl font-bold text-yellow-500 uppercase text-center">{bracket.final[0].winner.name}</h3>
               <button onClick={() => window.location.reload()} className="mt-6 text-zinc-400 underline text-sm hover:text-white">Simular Novamente</button>
            </div>
          )}

          {/* AJUSTE AQUI: reficionado, e flex removido para permitir o scroll natural */}
          <div 
            id="bracket-capture" 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto custom-scrollbar py-8 bg-zinc-950"
          >
            {/* w-fit e mx-auto garantem centro no PC e borda liberada no celular */}
            <div className="w-fit mx-auto flex items-center px-4 md:px-8 gap-2">
              
              <div className="flex gap-2">
                 {!isCapturing && (
                   <div className="flex flex-col justify-around h-[800px]">
                     {bracket.dezesseisAvos.slice(0,8).map((m, i) => <MatchNode key={`dez-${i}`} match={m} onSelect={(t) => advanceTeam('dezesseisAvos', i, t)} isSmall />)}
                   </div>
                 )}
                 <div className="flex flex-col justify-around h-[800px]">
                   {bracket.oitavas.slice(0,4).map((m, i) => <MatchNode key={`oit-${i}`} match={m} onSelect={(t) => advanceTeam('oitavas', i, t)} />)}
                 </div>
                 <div className="flex flex-col justify-around h-[800px]">
                   {bracket.quartas.slice(0,2).map((m, i) => <MatchNode key={`qua-${i}`} match={m} onSelect={(t) => advanceTeam('quartas', i, t)} />)}
                 </div>
                 <div className="flex flex-col justify-around h-[800px]">
                   <MatchNode match={bracket.semis[0]} onSelect={(t) => advanceTeam('semis', 0, t)} />
                 </div>
              </div>

              <div className="flex flex-col items-center justify-center h-[800px] px-2 md:px-6">
                 <Trophy size={40} className="text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]"/>
                 <div className="transform scale-110 border-2 border-yellow-500 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-zinc-950">
                    <p className="text-center text-yellow-500 font-black text-[10px] py-1.5 uppercase tracking-widest bg-zinc-900 rounded-t-lg">Finalíssima</p>
                    <MatchNode match={bracket.final[0]} onSelect={(t) => advanceTeam('final', 0, t)} isFinal />
                 </div>
                 
                 {isCapturing && bracket.final[0].winner && (
                   <div className="mt-8 flex flex-col items-center">
                     <Crown size={32} className="text-yellow-500 mb-2"/>
                     <span className="text-yellow-500 font-black uppercase text-xl">{bracket.final[0].winner.name}</span>
                   </div>
                 )}
              </div>

              <div className="flex gap-2 flex-row-reverse">
                 {!isCapturing && (
                   <div className="flex flex-col justify-around h-[800px]">
                     {bracket.dezesseisAvos.slice(8,16).map((m, i) => <MatchNode key={`dez-${i+8}`} match={m} onSelect={(t) => advanceTeam('dezesseisAvos', i+8, t)} reverse isSmall />)}
                   </div>
                 )}
                 <div className="flex flex-col justify-around h-[800px]">
                   {bracket.oitavas.slice(4,8).map((m, i) => <MatchNode key={`oit-${i+4}`} match={m} onSelect={(t) => advanceTeam('oitavas', i+4, t)} reverse />)}
                 </div>
                 <div className="flex flex-col justify-around h-[800px]">
                   {bracket.quartas.slice(2,4).map((m, i) => <MatchNode key={`qua-${i+2}`} match={m} onSelect={(t) => advanceTeam('quartas', i+2, t)} reverse />)}
                 </div>
                 <div className="flex flex-col justify-around h-[800px]">
                   <MatchNode match={bracket.semis[1]} onSelect={(t) => advanceTeam('semis', 1, t)} reverse />
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER DO CRIADOR --- */}
      <footer className="w-full max-w-7xl mx-auto mt-16 pt-6 pb-8 border-t border-zinc-800/80 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <Code size={18} className="text-red-500" />
            <p className="text-sm">
              Desenvolvido por <strong className="text-zinc-300">Lucas Lira</strong> © 2026
            </p>
          </div>
          
          <a 
            href="https://lucaslira11.github.io/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:text-red-400 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]"
          >
            <Globe size={14} />
            Ver meu Portfólio
          </a>
        </div>
        
        <div className="flex gap-5">
          <a 
            href="https://github.com/LucasLira11" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white hover:scale-110 transition-all"
            title="Meu GitHub"
          >
            <Github size={22} />
          </a>
          <a 
            href="https://www.linkedin.com/in/lucas-lira-79b339272/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-blue-400 hover:scale-110 transition-all"
            title="Meu LinkedIn"
          >
            <Linkedin size={22} />
          </a>
        </div>
      </footer>
    </main>
  );
}

function MatchNode({ match, onSelect, isFinal = false, reverse = false, isSmall = false }: { match: KnockoutMatch, onSelect: (t: Team) => void, isFinal?: boolean, reverse?: boolean, isSmall?: boolean }) {
  const renderTeamBtn = (team: Team | null, isWinner: boolean) => (
    <button 
      onClick={() => team && onSelect(team)}
      disabled={!team || !!match.winner}
      className={`w-full flex items-center gap-2 ${isSmall ? 'p-1' : 'p-1.5 md:p-2'} border-b border-zinc-800 transition-all ${!team ? 'opacity-50 bg-zinc-900/50' : 'bg-zinc-900 hover:bg-zinc-800'} ${isWinner ? 'bg-green-900/40 text-green-400' : ''} ${reverse ? 'flex-row-reverse text-right' : ''}`}
    >
      {team ? (
        <><img src={getFlagUrl(team.code)} className={`${isSmall ? 'w-4' : 'w-5 md:w-6'} rounded shadow-sm flex-shrink-0`} alt="flag"/><span className={`font-bold ${isSmall ? 'text-[9px]' : 'text-[10px] md:text-xs'} truncate w-full`}>{team.name}</span></>
      ) : (
        <><div className={`${isSmall ? 'w-4 h-2' : 'w-5 h-3 md:w-6 md:h-4'} bg-zinc-800 rounded flex-shrink-0`}></div><span className={`${isSmall ? 'text-[9px]' : 'text-[10px] md:text-xs'} text-zinc-600 italic truncate w-full`}>A definir</span></>
      )}
    </button>
  );

  return (
    <div className={`w-28 md:w-32 lg:w-36 bg-zinc-950 border border-zinc-700 rounded-lg overflow-hidden shadow-xl ${isFinal ? 'w-40 md:w-48' : ''}`}>
      {renderTeamBtn(match.team1, match.winner?.code === match.team1?.code)}
      {renderTeamBtn(match.team2, match.winner?.code === match.team2?.code)}
    </div>
  );
}