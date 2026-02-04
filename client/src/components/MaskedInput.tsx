import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { useMask, MaskType } from "@/hooks/useMask";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maskType: MaskType;
  label?: string;
  showValidation?: boolean;
  onMaskedChange?: (value: string) => void;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ maskType, label, showValidation = true, onMaskedChange, onChange, ...props }, ref) => {
    const mask = useMask({ type: maskType });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      mask.handleChange(inputValue);
      onMaskedChange?.(mask.value);
      onChange?.(e);
    };

    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="relative">
          <Input
            ref={ref}
            {...props}
            value={mask.value}
            onChange={handleChange}
            className={cn(
              "pr-10",
              mask.error && "border-red-500 focus-visible:ring-red-500",
              showValidation && mask.value && !mask.error && "border-green-500 focus-visible:ring-green-500"
            )}
          />
          {showValidation && mask.value && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {mask.error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          )}
        </div>
        {mask.error && showValidation && <p className="text-xs text-red-500">{mask.error}</p>}
      </div>
    );
  }
);

MaskedInput.displayName = "MaskedInput";
