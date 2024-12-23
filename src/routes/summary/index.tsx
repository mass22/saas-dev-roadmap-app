// src/routes/summary/index.tsx
import { $, component$, useStore, useTask$ } from "@builder.io/qwik";
import jsPDF from "jspdf";

export default component$(() => {
  const store = useStore({
    checklist: [] as any[], // Liste des réponses
  });

  // Charger les données depuis le localStorage
  useTask$(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("checklistData");
      store.checklist = savedData ? JSON.parse(savedData) : [];
    }
  });

  const downloadPDF = $(() => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Résumé de la checklist", 10, 10);

    let y = 20;
    store.checklist.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${item.question}`, 10, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(`Réponse : ${item.answer || "Pas de réponse"}`, 10, y);
      y += 10;
    });

    doc.save("checklist-summary.pdf");
  });

  if (!store.checklist.length) {
    return <div class="container mx-auto p-4">Chargement...</div>;
  }

  return (
    <div class="container mx-auto p-4">
      <h1 class="mb-4 text-2xl font-bold">Résumé</h1>
      {store.checklist.map((item, index) => (
        <div key={item.id} class="mb-4">
          <h2 class="font-semibold">
            {index + 1}. {item.question}
          </h2>
          <p class="rounded border p-2">{item.answer || "Pas de réponse"}</p>
        </div>
      ))}
      <button
        onClick$={downloadPDF}
        class="mt-6 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Télécharger le PDF
      </button>
    </div>
  );
});
