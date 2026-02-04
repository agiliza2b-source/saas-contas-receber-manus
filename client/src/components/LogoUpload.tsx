import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface LogoUploadProps {
  onLogoChange?: (logoUrl: string) => void;
  currentLogo?: string;
}

export function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem não pode ser maior que 5MB");
      return;
    }

    setIsLoading(true);
    try {
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onLogoChange?.(result);
        toast.success("Logo atualizada com sucesso!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao fazer upload da logo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLogo = () => {
    setPreview(null);
    onLogoChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Logo removida");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Logo da Empresa</Label>
        <p className="text-xs text-gray-500 mb-3">
          Usada na barra lateral, relatórios e emails. Máximo 5MB. Formatos: PNG, JPG, GIF
        </p>
      </div>

      {preview ? (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50">
            <img
              src={preview}
              alt="Logo preview"
              className="max-h-32 max-w-full object-contain"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Trocar Logo
            </Button>
            <Button
              variant="outline"
              onClick={handleRemoveLogo}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">Clique para fazer upload da logo</p>
          <p className="text-xs text-gray-500 mt-1">ou arraste a imagem aqui</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
}
