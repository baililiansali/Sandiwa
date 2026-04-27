import sandiwaLogo from "@/assets/sandiwa-logo.png"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={sandiwaLogo} 
        alt="Sandiwa" 
        className="h-9 w-9 object-contain"
      />
      <span className="font-serif text-2xl font-semibold text-gold tracking-tight">
        Sandiwa
      </span>
    </div>
  );
}