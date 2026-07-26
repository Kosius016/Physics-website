"use client";

import { useState } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import { BTN_PRI, BTN_SEC, PANEL_CLASS } from "./svg";

type PracticeProblem = {
  title: string;
  difficulty: "основна" | "средна" | "сложна";
  matrix: string;
  prompt: string;
  hint: string;
  answer?: number;
  solution: { text: string; latex: string }[];
};

const problems: PracticeProblem[] = [
  {
    title: "Разгъване по ред",
    difficulty: "основна",
    matrix: String.raw`A=\begin{pmatrix}2&-1&3\\0&4&5\\1&2&-2\end{pmatrix}`,
    prompt: "Намерете $\\det A$ чрез разгъване по първия ред.",
    hint: "Знаците по първия ред са $+,-,+$. Минусът пред елемента $-1$ изисква особено внимание.",
    answer: -53,
    solution: [
      {
        text: "Зачеркваме реда и колоната на всеки елемент от първия ред:",
        latex: String.raw`\det A=2\begin{vmatrix}4&5\\2&-2\end{vmatrix}-(-1)\begin{vmatrix}0&5\\1&-2\end{vmatrix}+3\begin{vmatrix}0&4\\1&2\end{vmatrix}`,
      },
      {
        text: "Смятаме трите минора и събираме със знаците им:",
        latex: String.raw`\det A=2(-18)+1(-5)+3(-4)=\boxed{-53}`,
      },
    ],
  },
  {
    title: "Ред с две нули",
    difficulty: "основна",
    matrix: String.raw`B=\begin{pmatrix}0&3&0\\2&-1&4\\0&5&6\end{pmatrix}`,
    prompt: "Намерете $\\det B$ с възможно най-малко сметки.",
    hint: "Разгънете по първия ред. Само средният елемент дава ненулев член, а знакът му е отрицателен.",
    answer: -36,
    solution: [
      {
        text: "Изборът на ред с най-много нули оставя само един минор:",
        latex: String.raw`\det B=-3\begin{vmatrix}2&4\\0&6\end{vmatrix}=-3(12)=\boxed{-36}`,
      },
    ],
  },
  {
    title: "Триъгълна матрица",
    difficulty: "основна",
    matrix: String.raw`C=\begin{pmatrix}-3&2&1\\0&5&-4\\0&0&8\end{pmatrix}`,
    prompt: "Намерете $\\det C$ без разгъване на три минора.",
    hint: "При триъгълна матрица детерминантата е произведението на диагоналните елементи.",
    answer: -120,
    solution: [
      {
        text: "Всичко под главния диагонал е нула, затова:",
        latex: String.raw`\det C=(-3)\cdot5\cdot8=\boxed{-120}`,
      },
    ],
  },
  {
    title: "Редови операции",
    difficulty: "средна",
    matrix: String.raw`D=\begin{pmatrix}4&7&10\\2&5&8\\6&12&19\end{pmatrix}`,
    prompt: "Намерете $\\det D$, като първо създадете нули в първата колона.",
    hint: "Операцията $R_i\\leftarrow R_i+kR_j$ не променя детерминантата. Използвайте втория ред.",
    answer: 6,
    solution: [
      {
        text: "Прилагаме операции, които не променят детерминантата:",
        latex: String.raw`R_1\leftarrow R_1-2R_2,\quad R_3\leftarrow R_3-3R_2\quad\Longrightarrow\quad\begin{pmatrix}0&-3&-6\\2&5&8\\0&-3&-5\end{pmatrix}`,
      },
      {
        text: "Разгъваме по първата колона; ненулевият елемент е на позиция $(2,1)$ със знак минус:",
        latex: String.raw`\det D=-2\begin{vmatrix}-3&-6\\-3&-5\end{vmatrix}=-2(15-18)=\boxed{6}`,
      },
    ],
  },
  {
    title: "Пълен числен пример",
    difficulty: "средна",
    matrix: String.raw`E=\begin{pmatrix}3&-2&5\\4&1&-3\\2&6&1\end{pmatrix}`,
    prompt: "Намерете $\\det E$ и проверете внимателно редуването на знаците.",
    hint: "При разгъване по първия ред запишете първо само схемата $+,-,+$; после заместете числата.",
    answer: 187,
    solution: [
      {
        text: "Разгъваме по първия ред:",
        latex: String.raw`\det E=3(1\cdot1-(-3)\cdot6)-(-2)(4\cdot1-(-3)\cdot2)+5(4\cdot6-1\cdot2)` ,
      },
      {
        text: "След опростяване:",
        latex: String.raw`\det E=3\cdot19+2\cdot10+5\cdot22=57+20+110=\boxed{187}`,
      },
    ],
  },
  {
    title: "Скрита зависимост",
    difficulty: "средна",
    matrix: String.raw`F=\begin{pmatrix}2&1&4\\3&-2&1\\5&-1&5\end{pmatrix}`,
    prompt: "Предскажете $\\det F$ преди каквото и да е разгъване.",
    hint: "Сравнете третия ред със сумата на първите два.",
    answer: 0,
    solution: [
      {
        text: "Третият ред не носи ново независимо направление:",
        latex: String.raw`R_3=R_1+R_2\quad\Longrightarrow\quad R_3\leftarrow R_3-R_1-R_2=(0,0,0)` ,
      },
      {
        text: "Матрица с нулев ред след допустими редови операции е изродена:",
        latex: String.raw`\boxed{\det F=0}`,
      },
    ],
  },
  {
    title: "Големи числа, малка сметка",
    difficulty: "сложна",
    matrix: String.raw`G=\begin{pmatrix}17&18&20\\16&19&23\\15&20&29\end{pmatrix}`,
    prompt: "Намерете $\\det G$. Целта е да избегнете три тежки минора.",
    hint: "Извадете първия ред от втория и новия втори ред от третия; следете кои операции пазят детерминантата.",
    answer: 105,
    solution: [
      {
        text: "Създаваме малки числа без промяна на детерминантата:",
        latex: String.raw`R_2\leftarrow R_2-R_1=(-1,1,3),\qquad R_3\leftarrow R_3-R_1=(-2,2,9)` ,
      },
      {
        text: "После $R_3\\leftarrow R_3-2R_2=(0,0,3)$ и разгъваме по третия ред:",
        latex: String.raw`\det G=3\begin{vmatrix}17&18\\-1&1\end{vmatrix}=3(17+18)=\boxed{105}`,
      },
    ],
  },
  {
    title: "Параметър и изроденост",
    difficulty: "сложна",
    matrix: String.raw`H(t)=\begin{pmatrix}t&1&1\\1&t&1\\1&1&t\end{pmatrix}`,
    prompt: "Намерете $\\det H(t)$ и всички стойности на $t$, за които матрицата не е обратима.",
    hint: "Извадете първия ред от втория и третия. В получения израз трябва да се появи множител $(t-1)^2$.",
    solution: [
      {
        text: "След $R_2\\leftarrow R_2-R_1$ и $R_3\\leftarrow R_3-R_1$ изнасяме общ множител от всеки от двата реда:",
        latex: String.raw`\det H(t)=(t-1)^2\begin{vmatrix}t&1&1\\-1&1&0\\-1&0&1\end{vmatrix}`,
      },
      {
        text: "Останалата детерминанта е $t+2$, следователно:",
        latex: String.raw`\det H(t)=(t-1)^2(t+2)=t^3-3t+2` ,
      },
      {
        text: "Необратимост има точно при нулите на детерминантата:",
        latex: String.raw`\boxed{t=1\ \text{или}\ t=-2}`,
      },
    ],
  },
  {
    title: "Вандермондова структура",
    difficulty: "сложна",
    matrix: String.raw`V=\begin{pmatrix}1&1&1\\1&2&4\\1&4&16\end{pmatrix}`,
    prompt: "Намерете $\\det V$ чрез колонни операции, а не чрез директно разгъване.",
    hint: "Извадете първата колона от втората и третата. После извадете три пъти новата втора колона от третата.",
    answer: 6,
    solution: [
      {
        text: "Операциите $C_2\\leftarrow C_2-C_1$ и $C_3\\leftarrow C_3-C_1$ пазят детерминантата:",
        latex: String.raw`\det V=\begin{vmatrix}1&0&0\\1&1&3\\1&3&15\end{vmatrix}`,
      },
      {
        text: "Разгъваме по първия ред или правим още една колонна операция:",
        latex: String.raw`\det V=\begin{vmatrix}1&3\\3&15\end{vmatrix}=15-9=\boxed{6}`,
      },
      {
        text: "Това е частен случай на формулата на Вандермонд:",
        latex: String.raw`\det\begin{pmatrix}1&1&1\\x&y&z\\x^2&y^2&z^2\end{pmatrix}=(y-x)(z-x)(z-y)` ,
      },
    ],
  },
];

const difficultyTone = {
  основна: "text-ok",
  средна: "text-minus",
  сложна: "text-plus",
} as const;

export default function Determinant3x3Practice() {
  const [active, setActive] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<"correct" | "wrong" | null>(null);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const problem = problems[active];

  const choose = (index: number) => {
    setActive(index);
    setInput("");
    setChecked(null);
    setHint(false);
    setSolution(false);
  };

  const check = () => {
    if (problem.answer === undefined) {
      setSolution(true);
      return;
    }
    const normalized = input.replace(",", ".").trim();
    setChecked(Number(normalized) === problem.answer ? "correct" : "wrong");
  };

  return (
    <div className={PANEL_CLASS}>
      <div className="flex flex-wrap gap-2" aria-label="Избор на задача">
        {problems.map((p, i) => (
          <button
            key={p.title}
            onClick={() => choose(i)}
            className={`${BTN_SEC} ${active === i ? "bg-ink text-white hover:bg-ink" : ""}`}
            aria-pressed={active === i}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Задача {active + 1} от {problems.length}
          </p>
          <h3 className="mt-1 font-serif text-[22px] font-bold text-ink">{problem.title}</h3>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${difficultyTone[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="mt-4">
        <Formula latex={problem.matrix} />
      </div>
      <p className="mt-4 text-[15.5px] leading-relaxed text-ink/90">
        <RichText text={problem.prompt} />
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {problem.answer !== undefined && (
          <label className="flex items-center gap-2 text-[14px] font-semibold text-ink">
            <RichText text="$\\det=$" />
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setChecked(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              inputMode="decimal"
              className="w-28 rounded-lg border-[1.5px] border-ink bg-surface px-3 py-2 text-[15px] tabular-nums outline-none focus:ring-2 focus:ring-minus/40"
              aria-label="Вашият отговор за детерминантата"
            />
          </label>
        )}
        <button className={BTN_PRI} onClick={check} disabled={problem.answer !== undefined && input.trim() === ""}>
          {problem.answer === undefined ? "Покажи решението" : "Провери"}
        </button>
        <button className={BTN_SEC} onClick={() => setHint((v) => !v)}>
          {hint ? "Скрий подсказката" : "Подсказка"}
        </button>
      </div>

      {checked && (
        <p
          aria-live="polite"
          className={`mt-3 rounded-r-lg border-l-4 px-4 py-2.5 text-[15px] animate-rise ${
            checked === "correct" ? "border-ok bg-ok/10" : "border-plus bg-plus/10"
          }`}
        >
          {checked === "correct"
            ? "Точно така. Сега сравнете метода си с краткото решение."
            : "Числото още не е вярно. Проверете знаците и избрания ред или колона."}
        </p>
      )}

      {hint && (
        <p className="mt-3 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[15px] leading-relaxed animate-rise">
          <RichText text={problem.hint} />
        </p>
      )}

      {(checked === "correct" || checked === "wrong" || problem.answer === undefined) && !solution && (
        <button className={`${BTN_SEC} mt-3`} onClick={() => setSolution(true)}>
          Разгъни решението стъпка по стъпка
        </button>
      )}

      {solution && (
        <div className="mt-5 space-y-4 border-t-[1.5px] border-dashed border-rule pt-4 animate-rise">
          {problem.solution.map((step, i) => (
            <div key={step.latex} className="space-y-2">
              <p className="text-[15px] text-ink/90">
                <span className="mr-2 text-[11px] font-bold uppercase tracking-wide text-muted">Стъпка {i + 1}</span>
                <RichText text={step.text} />
              </p>
              <Formula latex={step.latex} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
