
import Image from "next/image";
import Button from "@/app/components/button";
import Form from "@/app/components/form"

export default function Home() {
  return (
    
    <div className = "font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">      
      <main className = "flex flex-col gap-[32px] row-start-2 items-center">
        
        <Image
          className = "dark:invert"
          src = "/next.svg"
          alt = "Next.js logo"
          width = {180}
          height = {38}
          priority
        />

        <Form>
        </Form>

        <Button onClick = {{  }} className = "">
          Botón
        </Button>

      </main>
    </div>
  );
}
