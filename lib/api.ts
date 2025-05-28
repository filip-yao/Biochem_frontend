export async function fetchNotes() {
  const res = await fetch('http://localhost:1337/api/notes');
  const data = await res.json();
  return data.data.map((item: any) => ({
    id: item.id,
    title: item.attributes.title,
    content: item.attributes.content,
  }));
}

export async function fetchExercises() {
  const res = await fetch('http://localhost:1337/api/exercises');
  const data = await res.json();
  return data.data.map((item: any) => ({
    id: item.id,
    question: item.attributes.question,
    correct: item.attributes.correct,
    answer: '',
  }));
}
