import { createClient } from '@supabase/supabase-js';
import Header from "../../components/Header";
import Clients from "../../components/Clients";
import Partners from "../../components/Partners";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function PartnersPage() {
  // 1. Fetch data on the server before anything is sent to the user
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, slug, logo')
    .order('id', { ascending: false });

  return (
    <div>
      <Header />
      
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">Partners and Clients</h1>
        </div>
      </section>

      <main>
        {/* 2. Pass the pre-fetched data to the Clients component */}
        <Clients initialClients={clients || []} />
        
        <Partners />
      </main>
    </div>
  );
}