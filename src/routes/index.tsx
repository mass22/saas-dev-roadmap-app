// src/routes/checklist/index.tsx
import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container mx-auto flex h-screen flex-col items-center justify-center p-4">
      <h1 class="text-center text-2xl font-bold">
        Checklist pour le développement d'un SaaS
      </h1>
      <p class="mt-4 text-center">
        Répondez à une série de questions pour organiser votre projet.
      </p>
      <Link
        href="/checklist/1"
        class="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Commencer
      </Link>
    </div>
  );
});
