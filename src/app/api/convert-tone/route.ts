import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 환경 변수로 키 관리
});

type ToneType = "mail" | "thread" | "banmal" | "jondaetmal";

const toneMap: Record<ToneType, string> = {
  mail: "격식 있는 메일 말투",
  thread:
    "온라인 커뮤니티 쓰레드에서 자주 쓰는 말투야. 친구한테 말하듯이 너무 딱딱하지 않고 자연스럽고 가볍게, 필요하면 이모지나 말줄임표도 써도 돼. 반말로 바꿔줘.",
  banmal: "친근한 반말",
  jondaetmal: "공손한 존댓말",
};

interface RequestBody {
  text: string;
  tone: ToneType;
}

export async function POST(req: Request) {
  const { text, tone } = (await req.json()) as RequestBody;

  if (!text || !tone || !toneMap[tone]) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const prompt = `
  아래 문장을 ${toneMap[tone]}로 바꿔줘. 결과는 오직 변환된 문장만 보여줘.
  접두어나 말투 종류는 적지 마.
  문장: ${text}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    const removePrefix = (text: string) => {
      return text.replace(/^(메일|반말|존댓말|쓰레드체)[:：]\s?/, "");
    };
    const cleanResult = removePrefix(result || "");
    return NextResponse.json({ result: cleanResult });
  } catch (error) {
    console.error("OpenAI API 호출 실패:", error);
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }
}
