import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
// import { type Album, validateAlbum } from "@/lib/album-data";
import { type Album, validateAlbum } from "../../lib/album-data";

export function ImportModal({ open, onClose, onImport }: { open: boolean; onClose: () => void; onImport: (a: Album) => void }) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!validateAlbum(data)) {
          setError("Arquivo JSON inválido ou estrutura incorreta.");
          return;
        }
        onImport(data);
        onClose();
      } catch {
        setError("Não foi possível ler o arquivo.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 `z-[100]` flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="glass-strong rounded-3xl p-6 max-w-md w-full shadow-card animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Importar carteira</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:bg-accent/30 transition"
        >
          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">Clique ou arraste um arquivo .json</p>
          <p className="text-xs text-muted-foreground mt-1">Sua carteira será carregada automaticamente</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {error && (
          <p className="mt-3 text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
        )}
      </div>
    </div>
  );
}
