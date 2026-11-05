"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const linkPattern = /^(https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#][^\s]*)?$/i;

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const isValidLink = linkPattern.test(inputText.trim());

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidLink) return;

    setQrValue(inputText.trim());
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <Card className="w-full max-w-md p-6">
        <CardContent className="flex flex-col items-center gap-6 p-0">
          
          {/* QR Code ou Placeholder */}
          {qrValue ? (
            <div className="p-4 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <QRCodeSVG value={qrValue} size={180} level="H" />
            </div>
          ) : (
            <div className="w-[212px] h-[212px] bg-muted rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Seu QR Code aqui
            </div>
          )}

          {/* Títulos */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Gerar QR Code
            </h2>
            <p className="text-sm text-muted-foreground">
              Insira o link ou texto para gerar o código.
            </p>
          </div>

          {/* Formulário limpo utilizando os componentes do shadcn */}
          <form onSubmit={handleGenerate} className="w-full flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Cole seu link ou texto..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <Button
              type="submit"
              variant={isValidLink ? "default" : "secondary"}
              className="w-full font-medium"
            >
              Gerar Código 🚀
            </Button>
          </form>

        </CardContent>
      </Card>
    </main>
  );
}