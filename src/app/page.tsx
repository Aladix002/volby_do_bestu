"use client";
import { useEffect, useState } from "react";

export default function QuestionApp() {
  const [questionsByRole, setQuestionsByRole] = useState<Record<string, string[]>>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data: Record<string, string[]>) => {
        setQuestionsByRole(data);
        setRoles(Object.keys(data));
      });
  }, []);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    showRandomQuestion(role);
  };

  const showRandomQuestion = (role: string) => {
    const questions = questionsByRole[role];
    if (!questions || questions.length === 0) {
      setCurrentQuestion("Žiadne otázky pre túto rolu.");
      return;
    }
    const random = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(random);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-50">
      {!selectedRole ? (
        <>
          <h1 className="text-5xl font-bold mb-10">Vyber pozíciu</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleSelectRole(role)}
                className="bg-blue-600 text-white py-6 px-10 rounded-2xl text-2xl shadow hover:bg-blue-700 transition"
              >
                {role}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-semibold mb-6">{selectedRole}</h2>
          <div className="bg-white p-10 rounded-2xl shadow-2xl text-3xl text-center mb-10 max-w-4xl">
            {currentQuestion}
          </div>
          <div className="flex gap-6">
            <button
              className="bg-green-600 text-white px-10 py-6 rounded-2xl text-2xl"
              onClick={() => showRandomQuestion(selectedRole)}
            >
              Ďalšia otázka
            </button>
            <button
              className="bg-gray-500 text-white px-10 py-6 rounded-2xl text-2xl"
              onClick={() => {
                setSelectedRole(null);
                setCurrentQuestion("");
              }}
            >
              Späť
            </button>
          </div>
        </>
      )}
    </div>
  );
}







