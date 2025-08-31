
"use client";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string; // prop opcional
};

export default function Button({ onClick, children, className }: ButtonProps) {
  return (
    <button
      onClick = {onClick}
      className = {`bg-neutral-500 hover:bg-neutral-700 text-black font-bold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
}

