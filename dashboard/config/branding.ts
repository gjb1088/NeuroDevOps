// dashboard/config/branding.ts
export interface Brand {
  name: string;
  logoPath: string;      // put burnit-logo.svg in /public
  primary: string;       // neon-magenta
  accent: string;        // toxic green
  fontFamily: string;
}

const branding: Brand = {
  name: 'Burn.IT',
  logoPath: '/burnit-logo.svg',
  primary: '#FF00FF',             // neon magenta
  accent: '#39FF14',              // toxic green
  fontFamily: '"VT323", monospace' // retro terminal vibe
};

export default branding;
