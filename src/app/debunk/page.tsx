import { Metadata } from 'next';
import { DebunkContent } from './debunk-content';

export const metadata: Metadata = {
  title: 'Mythes & Réalités du Climat',
  description: 'Des faits scientifiques solides pour démonter les idées reçues sur le changement climatique.',
};

export default function DebunkPage() {
  return <DebunkContent />;
}