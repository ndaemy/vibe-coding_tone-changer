import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 환경 변수로 키 관리
});

const toneMap = {
  mail: "격식 있는 메일 말투",
  thread: "온라인 커뮤니티나 슬랙에 어울리는 자연스러운 말투",
  banmal: "친근한 반말",
  jondaetmal: "공손한 존댓말",
};

export async function POST(req: Request) {
  const { text, tone } = await req.json();

  if (!text || !tone || !toneMap[tone]) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const prompt = `다음 문장을 ${toneMap[tone]}로 바꿔줘.\n\n문장: ${text}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({ result });
  } catch (error) {
    console.error("OpenAI API 호출 실패:", error);
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }
}
