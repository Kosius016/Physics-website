import type { ProblemSetProblemData } from "@/components/problem-sets/ProblemSetProblem";

export const linearAlgebraIdentityProblems: ProblemSetProblemData[] = [
  {
    number: 1,
    title: "Тъждество на Лагранж",
    tags: ["Векторно произведение", "Тъждество"],
    statement: [
      { kind: "paragraph", text: "Докажете, че" },
      {
        kind: "formula",
        latex: String.raw`|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2-(\vec a\cdot\vec b)^2,`,
      },
      {
        kind: "paragraph",
        text: String.raw`и оттук изведете $|\vec a\times\vec b|=|\vec a|\,|\vec b|\sin\theta$, без да използвате тази формула наготово.`,
      },
    ],
    solution: [
      {
        kind: "paragraph",
        text: String.raw`Записваме $\vec a\times\vec b$ по компоненти и разкриваме квадратите:`,
      },
      {
        kind: "formula",
        latex: String.raw`\vec a\times\vec b=(a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1),`,
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
|\vec a\times\vec b|^2={}&a_1^2b_2^2+a_1^2b_3^2+a_2^2b_1^2+a_2^2b_3^2+a_3^2b_1^2+a_3^2b_2^2\\
&-2(a_1a_2b_1b_2+a_1a_3b_1b_3+a_2a_3b_2b_3).
\end{aligned}`,
      },
      { kind: "paragraph", text: "От другата страна пресмятаме двата израза поотделно:" },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
|\vec a|^2|\vec b|^2={}&(a_1^2+a_2^2+a_3^2)(b_1^2+b_2^2+b_3^2),\\
(\vec a\cdot\vec b)^2={}&a_1^2b_1^2+a_2^2b_2^2+a_3^2b_3^2\\
&+2(a_1a_2b_1b_2+a_1a_3b_1b_3+a_2a_3b_2b_3).
\end{aligned}`,
      },
      {
        kind: "paragraph",
        text: String.raw`При изваждането членовете $a_1^2b_1^2$, $a_2^2b_2^2$ и $a_3^2b_3^2$ се съкращават. Остава точно компонентният израз за $|\vec a\times\vec b|^2$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Сега заместваме $\vec a\cdot\vec b=|\vec a|\,|\vec b|\cos\theta$:`,
      },
      {
        kind: "formula",
        latex: String.raw`|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2(1-\cos^2\theta)=|\vec a|^2|\vec b|^2\sin^2\theta.`,
      },
      {
        kind: "paragraph",
        text: String.raw`За $\theta\in[0,\pi]$ имаме $\sin\theta\geq0$, следователно $|\vec a\times\vec b|=|\vec a|\,|\vec b|\sin\theta$.`,
      },
    ],
  },
  {
    number: 2,
    title: "Формула BAC-CAB",
    tags: ["Векторно произведение", "Доказателство"],
    statement: [
      { kind: "paragraph", text: "Докажете формулата за двойното векторно произведение:" },
      {
        kind: "formula",
        latex: String.raw`\vec a\times(\vec b\times\vec c)=\vec b\,(\vec a\cdot\vec c)-\vec c\,(\vec a\cdot\vec b).`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`Достатъчно е да проверите първата компонента. Другите две се получават с цикличната смяна $1\to2\to3$. След разкриването добавете и извадете липсващия член $a_1b_1c_1$, за да се сглобят пълните скаларни произведения.`,
      },
    ],
    solution: [
      {
        kind: "paragraph",
        text: String.raw`Използваме $\vec b\times\vec c=(b_2c_3-b_3c_2,\ b_3c_1-b_1c_3,\ b_1c_2-b_2c_1)$ и пресмятаме първата компонента:`,
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
[\vec a\times(\vec b\times\vec c)]_1
&=a_2(b_1c_2-b_2c_1)-a_3(b_3c_1-b_1c_3)\\
&=b_1(a_1c_1+a_2c_2+a_3c_3)-c_1(a_1b_1+a_2b_2+a_3b_3)\\
&=[\vec b\,(\vec a\cdot\vec c)-\vec c\,(\vec a\cdot\vec b)]_1.
\end{aligned}`,
      },
      {
        kind: "paragraph",
        text: "Компоненти 2 и 3 се получават по същия начин с циклична смяна на индексите. Следователно векторите са равни.",
      },
    ],
  },
  {
    number: 3,
    title: "Асоциативността се проваля",
    tags: ["Векторно произведение", "Граничен случай"],
    statement: [
      {
        kind: "paragraph",
        text: String.raw`Пресметнете разликата $\vec a\times(\vec b\times\vec c)-(\vec a\times\vec b)\times\vec c$ и я изразете без вложени векторни произведения. Кога векторното произведение все пак е асоциативно?`,
      },
    ],
    solution: [
      {
        kind: "paragraph",
        text: "За първия член използваме BAC-CAB. За втория първо използваме антикомутативност, след това отново BAC-CAB:",
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
\vec a\times(\vec b\times\vec c)&=\vec b\,(\vec a\cdot\vec c)-\vec c\,(\vec a\cdot\vec b),\\
(\vec a\times\vec b)\times\vec c
&=-\vec c\times(\vec a\times\vec b)\\
&=\vec b\,(\vec a\cdot\vec c)-\vec a\,(\vec b\cdot\vec c).
\end{aligned}`,
      },
      {
        kind: "formula",
        latex: String.raw`\boxed{\vec a\times(\vec b\times\vec c)-(\vec a\times\vec b)\times\vec c
=\vec a\,(\vec b\cdot\vec c)-\vec c\,(\vec a\cdot\vec b)}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Асоциативност има точно когато $\vec a\,(\vec b\cdot\vec c)=\vec c\,(\vec a\cdot\vec b)$.`,
      },
      {
        kind: "list",
        items: [
          String.raw`Ако $\vec a\parallel\vec c$, равенството е изпълнено.`,
          String.raw`Ако $\vec a$ и $\vec c$ са линейно независими, трябва едновременно $\vec b\cdot\vec c=0$ и $\vec a\cdot\vec b=0$.`,
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Тъждество на Якоби",
    tags: ["Векторно произведение", "Тъждество"],
    statement: [
      { kind: "paragraph", text: "Докажете, че" },
      {
        kind: "formula",
        latex: String.raw`\vec a\times(\vec b\times\vec c)+\vec b\times(\vec c\times\vec a)+\vec c\times(\vec a\times\vec b)=\vec0.`,
      },
    ],
    solution: [
      { kind: "paragraph", text: "Прилагаме BAC-CAB към всеки член:" },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
\vec a\times(\vec b\times\vec c)&=\vec b(\vec a\cdot\vec c)-\vec c(\vec a\cdot\vec b),\\
\vec b\times(\vec c\times\vec a)&=\vec c(\vec b\cdot\vec a)-\vec a(\vec b\cdot\vec c),\\
\vec c\times(\vec a\times\vec b)&=\vec a(\vec c\cdot\vec b)-\vec b(\vec c\cdot\vec a).
\end{aligned}`,
      },
      {
        kind: "paragraph",
        text: "Групираме по вектори и използваме комутативността на скаларното произведение:",
      },
      {
        kind: "formula",
        latex: String.raw`\vec a(\vec c\cdot\vec b-\vec b\cdot\vec c)+
\vec b(\vec a\cdot\vec c-\vec c\cdot\vec a)+
\vec c(\vec b\cdot\vec a-\vec a\cdot\vec b)=\vec0.`,
      },
    ],
  },
  {
    number: 5,
    title: "Тъждество на Бине-Коши",
    tags: ["Векторно произведение", "Скаларно произведение"],
    statement: [
      { kind: "paragraph", text: "Докажете, че" },
      {
        kind: "formula",
        latex: String.raw`(\vec a\times\vec b)\cdot(\vec c\times\vec d)
=(\vec a\cdot\vec c)(\vec b\cdot\vec d)-(\vec a\cdot\vec d)(\vec b\cdot\vec c),`,
      },
      { kind: "paragraph", text: "и посочете кой частен случай дава тъждеството на Лагранж." },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`Използвайте размяната $(\vec a\times\vec b)\cdot\vec c=\vec a\cdot(\vec b\times\vec c)$, след това приложете BAC-CAB.`,
      },
    ],
    solution: [
      {
        kind: "paragraph",
        text: String.raw`Полагаме $\vec w=\vec c\times\vec d$ и преместваме скаларното произведение:`,
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
(\vec a\times\vec b)\cdot(\vec c\times\vec d)
&=\vec a\cdot[\vec b\times(\vec c\times\vec d)]\\
&=\vec a\cdot[\vec c(\vec b\cdot\vec d)-\vec d(\vec b\cdot\vec c)]\\
&=(\vec a\cdot\vec c)(\vec b\cdot\vec d)-(\vec a\cdot\vec d)(\vec b\cdot\vec c).
\end{aligned}`,
      },
      {
        kind: "paragraph",
        text: String.raw`При $\vec c=\vec a$ и $\vec d=\vec b$ лявата страна става $|\vec a\times\vec b|^2$. Получаваме тъждеството на Лагранж от задача 1.`,
      },
    ],
  },
  {
    number: 6,
    title: "Изведете смесеното произведение",
    tags: ["Смесено произведение", "Детерминанта"],
    statement: [
      {
        kind: "paragraph",
        text: String.raw`Дефинирайте $[\vec a,\vec b,\vec c]:=\vec a\cdot(\vec b\times\vec c)$ и докажете двете му ключови свойства:`,
      },
      {
        kind: "formula",
        latex: String.raw`[\vec a,\vec b,\vec c]=\det\begin{pmatrix}
a_1&a_2&a_3\\ b_1&b_2&b_3\\ c_1&c_2&c_3
\end{pmatrix},`,
      },
      {
        kind: "paragraph",
        text: String.raw`а $|[\vec a,\vec b,\vec c]|$ е обемът на паралелепипеда, построен върху трите вектора. Знакът кодира ориентацията.`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`За обема използвайте, че $|\vec b\times\vec c|$ е лицето на основата, а посоката на $\vec b\times\vec c$ е нормала към нея. Разложете $\vec a$ по тази нормала.`,
      },
    ],
    solution: [
      {
        kind: "subheading",
        text: "Детерминантният запис",
      },
      {
        kind: "formula",
        latex: String.raw`\vec a\cdot(\vec b\times\vec c)=
a_1(b_2c_3-b_3c_2)+a_2(b_3c_1-b_1c_3)+a_3(b_1c_2-b_2c_1).`,
      },
      {
        kind: "paragraph",
        text: "Това е точно развитието на показаната детерминанта по първия ред.",
      },
      {
        kind: "subheading",
        text: "Геометричният смисъл",
      },
      {
        kind: "paragraph",
        text: String.raw`Нека $\vec n=\vec b\times\vec c$. Тогава $|\vec n|=S$ е лицето на основата. Ако $\varphi$ е ъгълът между $\vec a$ и $\vec n$, то`,
      },
      {
        kind: "formula",
        latex: String.raw`[\vec a,\vec b,\vec c]=\vec a\cdot\vec n
=|\vec a|\,|\vec n|\cos\varphi=(\pm h)S.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Следователно $|[\vec a,\vec b,\vec c]|=Sh$, което е обемът. Знакът е положителен за дясно ориентирана тройка и отрицателен за ляво ориентирана.`,
      },
    ],
  },
  {
    number: 7,
    title: "Цикличност и антисиметрия",
    tags: ["Смесено произведение", "Ориентация"],
    statement: [
      {
        kind: "paragraph",
        text: "Използвайки детерминантния запис, докажете цикличността и смяната на знака при размяна на два вектора:",
      },
      {
        kind: "formula",
        latex: String.raw`[\vec a,\vec b,\vec c]=[\vec b,\vec c,\vec a]=[\vec c,\vec a,\vec b].`,
      },
      {
        kind: "paragraph",
        text: String.raw`Изведете и равенството $\vec a\cdot(\vec b\times\vec c)=(\vec a\times\vec b)\cdot\vec c$.`,
      },
    ],
    solution: [
      {
        kind: "paragraph",
        text: "Смесеното произведение е детерминанта с редове, образувани от трите вектора. Размяната на два реда сменя знака, следователно размяната на два вектора също сменя знака.",
      },
      {
        kind: "paragraph",
        text: String.raw`Цикличната смяна $\vec a\to\vec b\to\vec c\to\vec a$ е композиция от две размени. Тя е четна и запазва знака.`,
      },
      {
        kind: "formula",
        latex: String.raw`(\vec a\times\vec b)\cdot\vec c
=\vec c\cdot(\vec a\times\vec b)
=[\vec c,\vec a,\vec b]
=[\vec a,\vec b,\vec c]
=\vec a\cdot(\vec b\times\vec c).`,
      },
    ],
  },
  {
    number: 8,
    title: "Компланарност",
    tags: ["Смесено произведение", "Доказателство в две посоки"],
    statement: [
      {
        kind: "paragraph",
        text: "Докажете в двете посоки:",
      },
      {
        kind: "formula",
        latex: String.raw`\vec a,\vec b,\vec c\ \text{са компланарни}
\quad\Longleftrightarrow\quad
[\vec a,\vec b,\vec c]=0.`,
      },
    ],
    solution: [
      {
        kind: "subheading",
        text: "От компланарност към нулево произведение",
      },
      {
        kind: "paragraph",
        text: "Ако векторите са компланарни, паралелепипедът има нулева височина и нулев обем. Алгебрично единият вектор е линейна комбинация на другите два, например:",
      },
      {
        kind: "formula",
        latex: String.raw`\vec c=\alpha\vec a+\beta\vec b
\quad\Longrightarrow\quad
[\vec a,\vec b,\vec c]
=\alpha[\vec a,\vec b,\vec a]+\beta[\vec a,\vec b,\vec b]=0.`,
      },
      {
        kind: "subheading",
        text: "От нулево произведение към компланарност",
      },
      {
        kind: "paragraph",
        text: String.raw`Ако $\vec a$ и $\vec b$ са зависими, твърдението е очевидно. Ако са независими, $\vec a\times\vec b\neq\vec0$ е нормала към равнината, породена от тях. Условието`,
      },
      {
        kind: "formula",
        latex: String.raw`0=[\vec a,\vec b,\vec c]=(\vec a\times\vec b)\cdot\vec c`,
      },
      {
        kind: "paragraph",
        text: String.raw`означава $\vec c\perp(\vec a\times\vec b)$. Следователно $\vec c$ лежи в същата равнина и трите вектора са компланарни.`,
      },
    ],
  },
  {
    number: 9,
    title: "Двойно кръстосване",
    tags: ["Смесено произведение", "Геометрия"],
    starred: true,
    statement: [
      { kind: "paragraph", text: "Докажете, че" },
      {
        kind: "formula",
        latex: String.raw`(\vec a\times\vec b)\times(\vec c\times\vec d)
=[\vec a,\vec b,\vec d]\,\vec c-[\vec a,\vec b,\vec c]\,\vec d
=[\vec a,\vec c,\vec d]\,\vec b-[\vec b,\vec c,\vec d]\,\vec a.`,
      },
      { kind: "paragraph", text: "Дайте геометрична интерпретация на равенството на двата израза." },
    ],
    solution: [
      {
        kind: "subheading",
        text: "Първи запис",
      },
      {
        kind: "paragraph",
        text: String.raw`Полагаме $\vec u=\vec a\times\vec b$ и прилагаме BAC-CAB:`,
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
\vec u\times(\vec c\times\vec d)
&=\vec c(\vec u\cdot\vec d)-\vec d(\vec u\cdot\vec c)\\
&=[\vec a,\vec b,\vec d]\,\vec c-[\vec a,\vec b,\vec c]\,\vec d.
\end{aligned}`,
      },
      {
        kind: "subheading",
        text: "Втори запис",
      },
      {
        kind: "paragraph",
        text: String.raw`Полагаме $\vec w=\vec c\times\vec d$ и обръщаме реда на външното векторно произведение:`,
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
(\vec a\times\vec b)\times\vec w
&=-\vec w\times(\vec a\times\vec b)\\
&=\vec b(\vec w\cdot\vec a)-\vec a(\vec w\cdot\vec b)\\
&=[\vec a,\vec c,\vec d]\,\vec b-[\vec b,\vec c,\vec d]\,\vec a.
\end{aligned}`,
      },
      {
        kind: "subheading",
        text: "Геометрия",
      },
      {
        kind: "paragraph",
        text: String.raw`Векторът $\vec a\times\vec b$ е нормала на равнината $P_1=\operatorname{span}(\vec a,\vec b)$, а $\vec c\times\vec d$ е нормала на $P_2=\operatorname{span}(\vec c,\vec d)$. Тяхното векторно произведение е успоредно на пресечницата $P_1\cap P_2$. Първият запис го изразява чрез $\vec c,\vec d$, а вторият чрез $\vec a,\vec b$.`,
      },
    ],
  },
  {
    number: 10,
    title: "Детерминанта на Вандермонд",
    tags: ["Детерминанти", "Индукция"],
    starred: true,
    statement: [
      { kind: "paragraph", text: "Докажете първо случая с три променливи:" },
      {
        kind: "formula",
        latex: String.raw`\det\begin{pmatrix}
1&x_1&x_1^2\\
1&x_2&x_2^2\\
1&x_3&x_3^2
\end{pmatrix}
=(x_2-x_1)(x_3-x_1)(x_3-x_2),`,
      },
      { kind: "paragraph", text: "след което обобщете с индукция до" },
      {
        kind: "formula",
        latex: String.raw`V_n=\prod_{1\leq i<j\leq n}(x_j-x_i).`,
      },
    ],
    solution: [
      {
        kind: "subheading",
        text: "Случай n = 3",
      },
      {
        kind: "paragraph",
        text: String.raw`Изваждаме първия ред от останалите, $R_2\to R_2-R_1$ и $R_3\to R_3-R_1$, след което развиваме по първия стълб:`,
      },
      {
        kind: "formula",
        latex: String.raw`\det\begin{pmatrix}
1&x_1&x_1^2\\
0&x_2-x_1&x_2^2-x_1^2\\
0&x_3-x_1&x_3^2-x_1^2
\end{pmatrix}
=\det\begin{pmatrix}
x_2-x_1&x_2^2-x_1^2\\
x_3-x_1&x_3^2-x_1^2
\end{pmatrix}.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Изнасяме $(x_2-x_1)$ от първия ред и $(x_3-x_1)$ от втория, като използваме $x_k^2-x_1^2=(x_k-x_1)(x_k+x_1)$:`,
      },
      {
        kind: "formula",
        latex: String.raw`(x_2-x_1)(x_3-x_1)
\det\begin{pmatrix}1&x_2+x_1\\1&x_3+x_1\end{pmatrix}
=(x_2-x_1)(x_3-x_1)(x_3-x_2).`,
      },
      {
        kind: "subheading",
        text: "Общ случай",
      },
      {
        kind: "paragraph",
        text: String.raw`Нека $V_n=\det(x_i^{\,j-1})_{i,j=1}^n$. Отдясно наляво прилагаме операциите по стълбове $C_k\to C_k-x_1C_{k-1}$ за $k=n,n-1,\ldots,2$. Първият ред става $(1,0,\ldots,0)$, а всеки друг елемент е`,
      },
      {
        kind: "formula",
        latex: String.raw`x_i^{\,k-1}-x_1x_i^{\,k-2}=x_i^{\,k-2}(x_i-x_1).`,
      },
      {
        kind: "paragraph",
        text: "Развиваме по първия ред и изнасяме множителя от всеки от останалите редове:",
      },
      {
        kind: "formula",
        latex: String.raw`V_n=\prod_{i=2}^{n}(x_i-x_1)\,V_{n-1}(x_2,\ldots,x_n).`,
      },
      {
        kind: "paragraph",
        text: String.raw`По индукционното предположение $V_{n-1}=\prod_{2\leq i<j\leq n}(x_j-x_i)$. След умножението получаваме всички двойки индекси:`,
      },
      {
        kind: "formula",
        latex: String.raw`\boxed{V_n=\prod_{1\leq i<j\leq n}(x_j-x_i)}`,
      },
    ],
  },
];
