"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Copy } from "lucide-react";

type ToneType = "mail" | "thread" | "banmal" | "jondaetmal";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedTone, setSelectedTone] = useState<ToneType>("jondaetmal");
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    setIsConverting(true);
    setOutputText("");
    try {
      const res = await fetch("/api/convert-tone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText, tone: selectedTone }),
      });
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      setOutputText(data.result || "");
    } catch (err) {
      console.error(err);
      alert("말투 변환 중 오류가 발생했습니다.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">말투 변환기</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left textarea */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="input">원본 텍스트</Label>
            <Textarea
              id="input"
              placeholder="변환할 텍스트를 입력하세요..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          {/* Right textarea */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="output">변환된 텍스트</Label>
            <Textarea
              id="output"
              value={outputText}
              readOnly
              className="min-h-[200px] resize-none"
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleCopy}
              disabled={!outputText}
            >
              <Copy className="w-4 h-4 mr-2" />
              복사하기
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <RadioGroup
            value={selectedTone}
            onValueChange={(value) => setSelectedTone(value as ToneType)}
            className="flex flex-wrap gap-4 justify-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mail" id="mail" />
              <Label htmlFor="mail">메일체</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="thread" id="thread" />
              <Label htmlFor="thread">쓰레드체</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="banmal" id="banmal" />
              <Label htmlFor="banmal">반말</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jondaetmal" id="jondaetmal" />
              <Label htmlFor="jondaetmal">존댓말</Label>
            </div>
          </RadioGroup>

          <div className="flex justify-center">
            <Button
              onClick={handleConvert}
              disabled={!inputText || isConverting}
              className="w-full sm:w-auto"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  변환 중...
                </>
              ) : (
                "변환하기"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
