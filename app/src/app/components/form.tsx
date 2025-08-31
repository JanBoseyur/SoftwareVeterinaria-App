
"use client";

import { useState } from "react";

type UserFormProps = {
  onSubmit: (data: { name: string; email: string }) => void;
};

export default function UserForm({ onSubmit }: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    onSubmit({ name, email });
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit = {handleSubmit} className = "flex flex-col gap-4 w-full max-w-sm">
      
      <input
        type = "text"
        placeholder = "Nombre"
        value = {name}
        onChange = {(e) => setName(e.target.value)}
        className = "border rounded p-2"
      />

      <input
        type = "email"
        placeholder = "Correo"
        value = {email}
        onChange = {(e) => setEmail(e.target.value)}
        className = "border rounded p-2"
      />
      
      <button
        type = "submit"
        className = "bg-neutral-500 hover:bg-neutral-700 text-black font-bold py-2 px-4 rounded"
      >
        Crear Usuario
      </button>

    </form>
  );
}