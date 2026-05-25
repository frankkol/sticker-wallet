import { Sparkles, Upload, Trophy } from "lucide-react";

export function WelcomeScreen({ onCreate, onImport }: { onCreate: () => void; onImport: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 rounded-3xl items-center justify-center mb-6 shadow-glow"
               style={{ background: "var(--gradient-hero)" }}>
            <Trophy className="h-10 w-10 text-background" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">FIFA World Cup</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
            <span className="text-gradient">Album 2026</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Gerencie sua carteira de figurinhas com estilo premium.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={onCreate}
            className="glass rounded-3xl p-6 text-left hover:scale-[1.02] transition shadow-card group"
          >
            <div className="h-12 w-12 rounded-2xl bg-success/20 text-success flex items-center justify-center mb-4 group-hover:shadow-glow transition">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold mb-1">Criar Nova Carteira</h2>
            <p className="text-sm text-muted-foreground">Começar do zero com os países disponíveis.</p>
          </button>

          <button
            onClick={onImport}
            className="glass rounded-3xl p-6 text-left hover:scale-[1.02] transition shadow-card group"
          >
            <div className="h-12 w-12 rounded-2xl bg-info/20 text-info flex items-center justify-center mb-4 group-hover:shadow-glow transition">
              <Upload className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold mb-1">Importar Carteira</h2>
            <p className="text-sm text-muted-foreground">Carregar um arquivo JSON da sua coleção.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
