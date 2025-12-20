import ClientDetail from "../../../components/ClientDetail";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch data here so the page "waits" on the server
  const { data: client, error } = await supabase
    .from('clients')
    .select('name, logo, gallery')
    .eq('slug', slug)
    .single();

  // If no client exists, show the 404 page immediately
  if (error || !client) {
    return notFound();
  }

  return (
    <div>
        <ClientDetail client={client} />
    </div>
  );
}