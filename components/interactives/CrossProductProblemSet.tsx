import Formula from "@/components/Formula";
import RichText from "@/components/RichText";

const problems = [
  {
    tag: "Координати · основна",
    title: "Сметнете и проверете перпендикулярността",
    statement: String.raw`Дадени са $\vec a=(2,-1,3)$ и $\vec b=(1,4,-2)$. Намерете $\vec a\times\vec b$ и проверете резултата със скаларни произведения.`,
    steps: [
      String.raw`\vec a\times\vec b=\begin{vmatrix}\vec i&\vec j&\vec k\\2&-1&3\\1&4&-2\end{vmatrix}=(-10,7,9)`,
      String.raw`\vec a\cdot(-10,7,9)=-20-7+27=0,\qquad \vec b\cdot(-10,7,9)=-10+28-18=0`,
    ],
    answer: String.raw`Следователно $\boxed{\vec a\times\vec b=(-10,7,9)}$ и векторът е перпендикулярен и на двата множителя.`,
  },
  {
    tag: "Геометрия · средна",
    title: "Площ на триъгълник в пространството",
    statement: String.raw`Точките са $A(1,0,2)$, $B(3,1,0)$ и $C(0,2,1)$. Намерете площта на $\triangle ABC$.`,
    steps: [
      String.raw`\vec{AB}=(2,1,-2),\qquad \vec{AC}=(-1,2,-1)`,
      String.raw`\vec{AB}\times\vec{AC}=(3,4,5),\qquad \left|\vec{AB}\times\vec{AC}\right|=\sqrt{50}=5\sqrt2`,
      String.raw`S_{\triangle}=\frac12\left|\vec{AB}\times\vec{AC}\right|=\boxed{\frac{5\sqrt2}{2}}`,
    ],
    answer: "Факторът $1/2$ е задължителен: векторното произведение дава площта на успоредника, не на триъгълника.",
  },
  {
    tag: "Аналитична геометрия · средна",
    title: "Равнина през три точки",
    statement: String.raw`Намерете уравнението на равнината през $P(1,0,2)$, $Q(2,1,2)$ и $R(0,2,3)$.`,
    steps: [
      String.raw`\vec{PQ}=(1,1,0),\qquad \vec{PR}=(-1,2,1)`,
      String.raw`\vec n=\vec{PQ}\times\vec{PR}=(1,-1,3)`,
      String.raw`\vec n\cdot\bigl((x,y,z)-P\bigr)=0\quad\Longrightarrow\quad (x-1)-y+3(z-2)=0`,
    ],
    answer: String.raw`Уравнението е $\boxed{x-y+3z-7=0}$. Всяко ненулево кратно на нормалата дава същата равнина.`,
  },
  {
    tag: "Механика · средна",
    title: "Момент на сила",
    statement: String.raw`Сила $\vec F=(0,40,0)\,\mathrm N$ действа в точка с радиус-вектор $\vec r=(0.30,0,0)\,\mathrm m$. Намерете момента $\vec\tau=\vec r\times\vec F$.`,
    steps: [
      String.raw`\vec\tau=(0.30,0,0)\times(0,40,0)=(0,0,12)\,\mathrm{N\,m}`,
    ],
    answer: String.raw`$\boxed{\vec\tau=12\,\vec k\,\mathrm{N\,m}}$. Посоката $+z$ идва от правилото на дясната ръка: от $\vec r$ към $\vec F$.`,
  },
  {
    tag: "Електромагнетизъм · средна",
    title: "Посока и големина на силата на Лоренц",
    statement: String.raw`Заряд $q=2\,\mathrm{mC}$ се движи с $\vec v=(3,0,0)\,\mathrm{m/s}$ в поле $\vec B=(0,0,0.5)\,\mathrm T$. Намерете $\vec F=q\vec v\times\vec B$.`,
    steps: [
      String.raw`\vec v\times\vec B=(3,0,0)\times(0,0,0.5)=(0,-1.5,0)`,
      String.raw`\vec F=2\cdot10^{-3}(0,-1.5,0)=\boxed{(0,-3\cdot10^{-3},0)\,\mathrm N}`,
    ],
    answer: String.raw`За положителен заряд посоката е $-y$. При отрицателен заряд силата би била в противоположната посока.`,
  },
  {
    tag: "Смесено произведение · сложна",
    title: "Обем на паралелепипед",
    statement: String.raw`Дадени са $\vec a=(1,2,0)$, $\vec b=(0,1,3)$ и $\vec c=(2,0,1)$. Намерете обема на паралелепипеда.`,
    steps: [
      String.raw`\vec b\times\vec c=(1,6,-2)`,
      String.raw`\vec a\cdot(\vec b\times\vec c)=1+12+0=13`,
      String.raw`V=\left|\vec a\cdot(\vec b\times\vec c)\right|=\boxed{13}`,
    ],
    answer: "Абсолютната стойност дава геометричния обем; знакът преди нея пази ориентацията на тройката вектори.",
  },
  {
    tag: "Параметър · сложна",
    title: "Кога три вектора са компланарни?",
    statement: String.raw`За коя стойност на $\lambda$ векторите $\vec a=(1,\lambda,2)$, $\vec b=(2,-1,1)$ и $\vec c=(3,2,0)$ лежат в една равнина?`,
    steps: [
      String.raw`\vec b\times\vec c=(-2,3,7)`,
      String.raw`\vec a\cdot(\vec b\times\vec c)=-2+3\lambda+14=3\lambda+12`,
      String.raw`3\lambda+12=0\quad\Longrightarrow\quad\boxed{\lambda=-4}`,
    ],
    answer: "Компланарността е точно условието ориентираният обем да бъде нула — същото „смачкване“, което det = 0 описва в урока за детерминанти.",
  },
];

export default function CrossProductProblemSet() {
  return (
    <div className="space-y-4">
      {problems.map((problem, i) => (
        <details key={problem.title} className="group rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 open:shadow-hard-sm">
          <summary className="cursor-pointer list-none select-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-minus">Задача {i + 1} · {problem.tag}</span>
                <h3 className="mt-1 font-serif text-[20px] font-bold text-ink">{problem.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/90"><RichText text={problem.statement} /></p>
              </div>
              <span className="mt-1 shrink-0 text-[22px] font-bold text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </div>
          </summary>
          <div className="mt-4 space-y-3 border-t-[1.5px] border-dashed border-rule pt-4 animate-rise">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-plus">Решение</p>
            {problem.steps.map((latex, step) => (
              <div key={latex}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">Стъпка {step + 1}</p>
                <Formula latex={latex} />
              </div>
            ))}
            <p className="rounded-r-lg border-l-4 border-ok bg-ok/10 px-4 py-3 text-[15px] leading-relaxed text-ink/90">
              <RichText text={problem.answer} />
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
