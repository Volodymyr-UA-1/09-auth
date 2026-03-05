// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { fetchNoteById, deleteNote } from '@/lib/api/clientApi';
// import css from './NotePage.module.css';

// export default function NotePage() {
//   const params = useParams();
//   const router = useRouter();

//   const [note, setNote] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadNote = async () => {
//       try {
//         const data = await fetchNoteById(params.id as string);
//         setNote(data);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadNote();
//   }, [params.id]);

//   const handleDelete = async () => {
//     await deleteNote(params.id as string);
//     router.push('/notes');
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <main className={css.main}>
//       <h1>{note.title}</h1>
//       <p>{note.content}</p>
//       <span>{note.tag}</span>

//       <button onClick={handleDelete}>
//         Delete
//       </button>
//     </main>
//   );
// }
import { notFound } from "next/navigation";
import NoteDetailsClient from "./NoteDetails.client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;


  

  return <NoteDetailsClient id={id} />;
}