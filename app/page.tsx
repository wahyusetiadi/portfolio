import { readPortfolioData, toPublicPortfolioData } from '@/lib/portfolioStore';
import PortfolioClient from './PortfolioClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await readPortfolioData();
  return <PortfolioClient initialData={toPublicPortfolioData(data)} />;
}
