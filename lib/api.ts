type Note = {
  id: number;
  title: string;
  content: string;
};

type Exercise = {
  id: number;
  question: string;
  correct: string;
  answer: string;
};

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch('http://localhost:1337/api/notes');
  const data = await res.json();
  return data.data.map((item: { id: number; attributes: { title: string; content: string } }) => ({
    id: item.id,
    title: item.attributes.title,
    content: item.attributes.content,
  }));
}

export async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch('http://localhost:1337/api/exercises');
  const data = await res.json();
  return data.data.map((item: { id: number; attributes: { question: string; correct: string } }) => ({
    id: item.id,
    question: item.attributes.question,
    correct: item.attributes.correct,
    answer: '',
  }));
}
