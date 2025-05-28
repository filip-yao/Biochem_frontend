'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [view, setView] = useState<'home' | 'notes' | 'exercises' | 'noteDetail'>('home');
  type Note = {
    id: number;
    title: string;
    content: string;
    category: string;
  };
  const [notes, setNotes] = useState<Note[]>([]);
  type Exercise = {
    id: number;
    question: string;
    correct: string;
    answer: string;
    category: string;
  };
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    async function fetchNotes() {
      const res = await fetch('http://localhost:1337/api/notes');
      const data = await res.json();
      setNotes(
        data.data.map((item: { id: number; title?: string; content?: string; category?: string }) => ({
          id: item.id,
          title: item.title || '',
          content: item.content || '',
          category: item.category || '',
        }))
      );
    }

    async function fetchExercises() {
      const res = await fetch('http://localhost:1337/api/exercises');
      const data = await res.json();
      setExercises(
        data.data.map((item: { id: number; question?: string; correct?: string; category?: string }) => ({
          id: item.id,
          question: item.question || '',
          correct: item.correct || '',
          answer: '',
          category: item.category || '',
        }))
      );
    }

    fetchNotes();
    fetchExercises();
  }, []);

  const categories = [
    'Organická chemie',
    'Anorganická chemie',
    'Biochemie',
    'Fyzika',
    'Biologie'
  ];

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">E-learning systém</h1>

      {view === 'home' && (
        <section className="text-center space-y-4">
          <p className="text-lg">Vítej v e-learningovém systému! Vyber si, co chceš studovat:</p>
          <div className="flex justify-center gap-4">
            <Button variant="default" onClick={() => setView('notes')}>📚 Poznámky</Button>
            <Button variant="secondary" onClick={() => setView('exercises')}>🧪 Cvičení</Button>
          </div>
        </section>
      )}

      {view === 'notes' && (
        <section className="mb-10">
          <Button variant="ghost" onClick={() => setView('home')} className="mb-4">⬅️ Zpět</Button>
          <h2 className="text-2xl font-semibold mb-4">Zápisky</h2>
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
            {categories.map(cat => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.filter(note => note.category === cat).map(note => (
                    <Card key={note.id} onClick={() => {
                      setSelectedNote(note);
                      setView('noteDetail');
                    }} className="cursor-pointer hover:bg-muted transition">
                      <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      )}

      {view === 'noteDetail' && selectedNote && (
        <section className="mb-10">
          <Button variant="ghost" onClick={() => setView('notes')} className="mb-4">⬅️ Zpět na poznámky</Button>
          <h2 className="text-2xl font-semibold mb-4">{selectedNote.title}</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
          </div>
        </section>
      )}

      {view === 'exercises' && (
        <section>
          <Button variant="ghost" onClick={() => setView('home')} className="mb-4">⬅️ Zpět</Button>
          <h2 className="text-2xl font-semibold mb-4">Cvičení</h2>
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
            {categories.map(cat => (
              <TabsContent key={cat} value={cat}>
                {exercises.filter(ex => ex.category === cat).map(ex => (
                  <Card key={ex.id} className="mb-4">
                    <CardContent className="p-4">
                      <p className="mb-2 font-medium">{ex.question}</p>
                      <Input
                        placeholder="Tvoje odpověď"
                        value={ex.answer}
                        onChange={e => {
                          const updated = exercises.map(item =>
                            item.id === ex.id ? { ...item, answer: e.target.value } : item
                          );
                          setExercises(updated);
                        }}
                      />
                      {ex.answer && (
                        <p className="mt-2 text-sm">
                          {ex.answer.trim().toLowerCase() === ex.correct.toLowerCase()
                            ? '✅ Správně!'
                            : '❌ Špatně, zkus to znovu.'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      )}
    </main>
  );
}
