
import { notFound } from "next/navigation";
import NoteDetailsClient from "./NoteDetails.client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;


  

  return <NoteDetailsClient id={id} />;
}