
type PreviewProps = {
  src: string;
  alt: string;
};

function Preview({ src, alt }: PreviewProps) {
  return (
    <div className="relative w-full h-full">
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover object-top" loading="lazy" />
    </div>
  );
}

export function JobPortalPreview()  { return <Preview src="/projects/jobportal.png"  alt="Job Portal" />; }
export function ItajaPreview()      { return <Preview src="/projects/itaja.png"      alt="Itaja — Fintech & Monetization Infrastructure" />; }
export function KanbanPreview()     { return <Preview src="/projects/kanban.png"      alt="Kanban" />; }
export function CryptoPreview()     { return <Preview src="/projects/crypto.png"      alt="Crypto" />; }
export function DesktopPreview()    { return <Preview src="/projects/trading.png"     alt="Trading" />; }
export function AuctionPreview()    { return <Preview src="/projects/contrasto.png"   alt="Auction" />; }
export function ArduinoPreview()    { return <Preview src="/projects/portfolio.png"     alt="Arduino" />; }

const PREVIEWS = {
  jobportal: JobPortalPreview,
  itaja: ItajaPreview,
  kanban: KanbanPreview,
  crypto: CryptoPreview,
  desktop: DesktopPreview,
  auction: AuctionPreview,
  arduino: ArduinoPreview,
} as const;

export default PREVIEWS;