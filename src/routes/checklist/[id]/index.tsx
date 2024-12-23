// src/routes/checklist/[id]/index.tsx
import { $, component$, useStore, useTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import "animate.css";
import checklistData from "~/data/checklistData.json";

// Charger les données JSON depuis /public
export const useChecklistData = routeLoader$(() => {
  return checklistData.flatMap((section: any) => section.steps);
});

export default component$(() => {
  const location = useLocation();
  const store = useStore({
    checklist: [] as any[], // Liste complète des questions
    currentQuestion: null as any, // Question actuelle avec catégorie
    animationClass: "animate__fadeIn", // Classe d'animation
  });

  // Charger les données depuis le localStorage ou depuis le JSON initial
  useTask$(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("checklistData");
      store.checklist = savedData
        ? JSON.parse(savedData)
        : checklistData.flatMap((section) => section.steps);
    }
  });

  // Mettre à jour la question actuelle et sa catégorie
  useTask$(({ track }) => {
    track(() => location.params.id); // Écouter les changements d'URL
    const questionId = parseInt(location.params.id || "1");

    // Trouver la question et sa catégorie
    for (const section of checklistData) {
      const question = section.steps.find((q) => q.id === questionId);
      if (question) {
        store.currentQuestion = {
          ...question,
          category: section.category, // Ajouter la catégorie
        };
        break;
      }
    }

    // Réinitialiser l'animation à chaque changement de question
    store.animationClass = "";
    setTimeout(() => {
      store.animationClass = "animate__fadeIn";
    }, 10); // Délai pour permettre la réinitialisation
  });

  // Sauvegarder les données dans le localStorage
  const saveChecklist = $(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checklistData", JSON.stringify(store.checklist));
    }
  });

  if (!store.currentQuestion) {
    return <div class="container mx-auto p-4">Chargement...</div>;
  }

  const questionId = parseInt(location.params.id || "1");

  return (
    <div
      class={`animate__animated container mx-auto flex h-screen flex-col items-center justify-center p-4 ${store.animationClass}`}
    >
      {/* Barre de progression globale */}
      <div class="mb-4 h-2.5 w-full rounded bg-gray-200">
        <div
          class="h-2.5 rounded bg-blue-600"
          style={{
            width: `${(store.checklist.filter((q) => q.completed).length / store.checklist.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Affichage de la catégorie */}
      <h2 class="mb-2 text-sm font-semibold text-gray-500">
        {store.currentQuestion.category || "Sans catégorie"}
      </h2>

      {/* Titre de la question */}
      <h1 class="mb-4 text-lg font-bold">
        Question {store.currentQuestion.id}
        {store.currentQuestion.critical && (
          <span class="ml-2 text-sm text-red-600">(Critique)</span>
        )}
      </h1>

      {/* Texte de la question */}
      <p class="mb-6 text-center">{store.currentQuestion.question}</p>

      {/* Champ de réponse */}
      <textarea
        class="w-full rounded border p-2"
        placeholder="Votre réponse"
        value={store.currentQuestion.answer || ""}
        onInput$={(e) => {
          const newAnswer = (e.target as HTMLTextAreaElement).value;
          store.currentQuestion.answer = newAnswer;

          const questionIndex = store.checklist.findIndex(
            (q) => q.id === store.currentQuestion.id,
          );
          if (questionIndex > -1) {
            store.checklist[questionIndex].answer = newAnswer;
            store.checklist[questionIndex].completed = newAnswer.trim() !== "";
          }
        }}
      />

      {/* Navigation */}
      <div class="mt-6 flex w-full justify-between">
        {questionId > 1 && (
          <Link
            href={`/checklist/${questionId - 1}`}
            class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
            onClick$={saveChecklist}
          >
            Précédent
          </Link>
        )}
        <Link
          href={
            questionId < store.checklist.length
              ? `/checklist/${questionId + 1}`
              : "/summary"
          }
          class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick$={saveChecklist}
        >
          {questionId < store.checklist.length ? "Suivant" : "Résumé"}
        </Link>
      </div>
    </div>
  );
});
