"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";


export default function Home() {
  const [text, setText] = useState("https://github.com");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-6">
      <h1 className="text-2xl font-bold">Gerador de QR Code</h1>
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite o texto ou URL..."
        className="border p-2 rounded-md w-80 text-black"
      />

      <div className="p-4 bg-white rounded-xl shadow-md">
        <QRCodeSVG value={text} size={200} />
      </div>
    </main>
  );
}