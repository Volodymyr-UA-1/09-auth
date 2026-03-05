import { notFound } from "next/navigation";
import { 
  dehydrate, 
  HydrationBoundary, 
  QueryClient 
} from "@tanstack/react-query";

import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api/serverApi"; // Серверна функція

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;

  // 1. Створюємо екземпляр QueryClient на сервері
  const queryClient = new QueryClient();

  try {
    // 2. Попередньо завантажуємо дані (Prefetching)
    // Ключ ["note", id] має збігатися з ключем у клієнтському компоненті
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    // Якщо нотатку не знайдено — повертаємо 404
    notFound();
  }

  return (
    // 3. Обгортаємо клієнтський компонент у HydrationBoundary
    // dehydrate(queryClient) перетворює дані у формат, зрозумілий клієнту
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}