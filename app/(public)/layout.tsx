import Navbar from './_components/Navbar';
import Footer from './_components/Footer';
import { IntroAnimation } from './_components/IntroAnimation';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IntroAnimation />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
