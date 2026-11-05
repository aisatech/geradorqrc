"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import Confetti from "react-confetti";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const linkPattern = /^(https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#][^\s]*)?$/i;

type ImageFormat = "svg" | "png";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [imageFormat, setImageFormat] = useState<ImageFormat | null>(null);
  const qrCodeRef = useRef<SVGSVGElement>(null);
  const qrCodeCanvasRef = useRef<HTMLCanvasElement>(null);
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

  const handleDownload = () => {
    if (!imageFormat) return;

    if (imageFormat === "svg" && qrCodeRef.current) {
      const svg = qrCodeRef.current.cloneNode(true) as SVGSVGElement;
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const svgText = new XMLSerializer().serializeToString(svg);
      downloadBlob(
        new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
        "qrcode.svg"
      );
      return;
    }

    qrCodeCanvasRef.current?.toBlob((blob) => {
      if (blob) downloadBlob(blob, "qrcode.png");
    }, "image/png");
  };

  const handleRestart = () => {
    window.location.assign(window.location.pathname);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <Card className="w-full max-w-md p-6">
        <CardContent className="flex flex-col items-center gap-6 p-0">
          
          {/* QR Code ou Placeholder */}
          {qrValue ? (
            <div className="p-4 bg-white rounded-xl shadow-sm flex items-center justify-center">
              <QRCodeSVG ref={qrCodeRef} value={qrValue} size={180} level="H" />
            </div>
          ) : (
            <div className="w-[212px] h-[212px] bg-muted rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Seu QR Code aqui
            </div>
          )}

          {/* Títulos */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              {qrValue ? "QR Code gerado" : "Gerar QR Code"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {qrValue
                ? "Escolha um formato para baixar seu QR Code."
                : "Insira o link ou texto para gerar o código."}
            </p>
          </div>

          {qrValue ? (
            <div className="flex w-full flex-col gap-3">
              <QRCodeCanvas
                ref={qrCodeCanvasRef}
                value={qrValue}
                size={512}
                level="H"
                className="hidden"
              />
              <Select
                value={imageFormat}
                onValueChange={(value) => setImageFormat(value as ImageFormat | null)}
              >
                <SelectTrigger
                  className="w-full"
                  aria-label="Selecione um formato para baixar"
                >
                  <SelectValue placeholder="Selecione um formato para baixar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="svg">SVG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {imageFormat && (
                <Button onClick={handleDownload} className="w-full font-medium">
                  <DownloadIcon data-icon="inline-start" />
                  Baixar {imageFormat.toUpperCase()}
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={handleRestart}
                className="w-full font-medium"
              >
                <RefreshCwIcon data-icon="inline-start" />
                Gerar novo QR Code
              </Button>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="flex w-full flex-col gap-3">
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
                Gerar Código
              </Button>
            </form>
          )}

        </CardContent>
      </Card>
    </main>
  );
}