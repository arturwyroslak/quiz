"use client";

import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AnimatedElement } from "@/components/animations/animated-element";
import { fadeIn } from "@/components/animations/animation-variants";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mockowane dane zadań
type Task = {
  id: number;
  name: string;
  related: string;
  status: string;
  priority: string;
  date: string;
  owner: string;
  description: string;
  comments: { user: string; text: string; date: string }[];
};

const mockTasks: Task[] = [
  {
    id: 1,
    name: "Weryfikacja leada: Jan Kowalski",
    related: "Jan Kowalski (lead)",
    status: "Nowe",
    priority: "Wysoki",
    date: "2023-06-15",
    owner: "admin@artscore.pro",
    description: "Sprawdź poprawność danych kontaktowych i skontaktuj się z leadem.",
    comments: [
      { user: "admin@artscore.pro", text: "Zadanie utworzone.", date: "2023-06-15" },
    ],
  },
  {
    id: 2,
    name: "Podpisanie umowy z partnerem: Firma Testowa",
    related: "Firma Testowa (partner)",
    status: "W trakcie",
    priority: "Średni",
    date: "2023-06-10",
    owner: "admin@artscore.pro",
    description: "Przygotuj i wyślij umowę partnerską do podpisu.",
    comments: [
      { user: "admin@artscore.pro", text: "Umowa wysłana do partnera.", date: "2023-06-11" },
    ],
  },
  {
    id: 3,
    name: "Aktualizacja statusu leada: Anna Nowak",
    related: "Anna Nowak (lead)",
    status: "Zakończone",
    priority: "Niski",
    date: "2023-06-05",
    owner: "admin@artscore.pro",
    description: "Zmień status leada na 'Zakończony' po otrzymaniu potwierdzenia.",
    comments: [
      { user: "admin@artscore.pro", text: "Status zaktualizowany.", date: "2023-06-06" },
    ],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasksPerPage = 5;

  // Filtrowanie i wyszukiwanie
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.related.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Paginacja
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-body-regular p-4">
      <h1 className="text-2xl font-body-semibold mb-6">Lista zadań</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Szukaj zadania lub powiązanego kontaktu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Wszystkie statusy</SelectItem>
            <SelectItem value="Nowe">Nowe</SelectItem>
            <SelectItem value="W trakcie">W trakcie</SelectItem>
            <SelectItem value="Zakończone">Zakończone</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Priorytet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Wszystkie priorytety</SelectItem>
            <SelectItem value="Wysoki">Wysoki</SelectItem>
            <SelectItem value="Średni">Średni</SelectItem>
            <SelectItem value="Niski">Niski</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-[#F0F0F0] text-[#2A2A2A]">
              <th className="py-3 px-4 text-left">Nazwa zadania</th>
              <th className="py-3 px-4 text-left">Powiązany kontakt/lead</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Priorytet</th>
              <th className="py-3 px-4 text-left">Data</th>
              <th className="py-3 px-4 text-left">Opiekun</th>
              <th className="py-3 px-4 text-left">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-[#999]">Brak zadań do wyświetlenia.</td>
              </tr>
            ) : (
              currentTasks.map((task) => (
                <tr key={task.id} className="border-b last:border-none hover:bg-[#F8F4EF] transition-colors">
                  <td className="py-3 px-4 font-body-medium cursor-pointer" onClick={() => setSelectedTask(task)}>{task.name}</td>
                  <td className="py-3 px-4">{task.related}</td>
                  <td className="py-3 px-4">{task.status}</td>
                  <td className="py-3 px-4">{task.priority}</td>
                  <td className="py-3 px-4">{task.date}</td>
                  <td className="py-3 px-4">{task.owner}</td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>Szczegóły</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Paginacja */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button size="icon" variant="ghost" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm">Strona {currentPage} z {totalPages}</span>
        <Button size="icon" variant="ghost" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      {/* Modal szczegółów zadania */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTask(null)}>
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-body-semibold mb-4">{selectedTask.name}</h2>
            <div className="mb-2 text-sm text-[#666]">Powiązany kontakt/lead: <span className="font-body-medium text-[#2A2A2A]">{selectedTask.related}</span></div>
            <div className="mb-2 text-sm text-[#666]">Status: <span className="font-body-medium text-[#2A2A2A]">{selectedTask.status}</span></div>
            <div className="mb-2 text-sm text-[#666]">Priorytet: <span className="font-body-medium text-[#2A2A2A]">{selectedTask.priority}</span></div>
            <div className="mb-2 text-sm text-[#666]">Data: <span className="font-body-medium text-[#2A2A2A]">{selectedTask.date}</span></div>
            <div className="mb-2 text-sm text-[#666]">Opiekun: <span className="font-body-medium text-[#2A2A2A]">{selectedTask.owner}</span></div>
            <div className="mb-4 text-sm text-[#666]">Opis: <span className="font-body-regular text-[#2A2A2A]">{selectedTask.description}</span></div>
            <div className="mb-4">
              <h3 className="font-body-semibold mb-2">Komentarze i notatki:</h3>
              <ul className="space-y-2">
                {selectedTask.comments.map((comment, idx) => (
                  <li key={idx} className="text-sm text-[#333] bg-[#F8F4EF] rounded p-2">
                    <span className="font-body-medium text-[#b38a34]">{comment.user}</span>: {comment.text} <span className="text-xs text-[#999] ml-2">({comment.date})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedTask(null)}>Zamknij</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 