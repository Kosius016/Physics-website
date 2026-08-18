"use client";

import { useEffect, useId, useRef, useState } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import { TeacherNote } from "@/components/interactives/TeacherMode";
import { C, DRAWING_FONT_FAMILY, STAGE_BG, STAGE_CLASS } from "@/components/interactives/svg";
import type { RichTextString } from "@/lib/types";

interface StepChoice {
  text: RichTextString;
  correct: boolean;
  why: RichTextString;
}

interface TaylorStep {
  title: string;
  question: RichTextString;
  choices: StepChoice[];
  text: RichTextString;
  latex?: string;
}

interface PlotData {
  xDomain: [number, number];
  yDomain: [number, number];
  xTex: string;
  yTex: string;
  point: number;
  pointTex: string;
  exact: (x: number) => number;
  first: (x: number) => number;
  second: (x: number) => number;
}

interface TaylorProblemData {
  id: string;
  domain: string;
  difficulty: string;
  title: string;
  statement: RichTextString;
  plot: PlotData;
  caption: RichTextString;
  steps: TaylorStep[];
  teacherNotes: RichTextString[];
}

const problems: TaylorProblemData[] = [
  {
    id: "pendulum",
    domain: "Механика",
    difficulty: "Основна",
    title: "Махало отвъд линейното приближение",
    statement: String.raw`Математично махало с дължина $L=1{,}00\,\mathrm m$ е отклонено на $\theta=0{,}30\,\mathrm{rad}$. Намерете ъгловото ускорение с първата нелинейна поправка и оценете грешката на приближението $\sin\theta\approx\theta$. Приемете $g=9{,}81\,\mathrm{m/s^2}$.`,
    plot: {
      xDomain: [-0.8, 0.8],
      yDomain: [-0.82, 0.82],
      xTex: String.raw`\theta`,
      yTex: String.raw`\sin\theta`,
      point: 0.3,
      pointTex: String.raw`\theta=0{,}30`,
      exact: Math.sin,
      first: (x) => x,
      second: (x) => x - x ** 3 / 6,
    },
    caption: String.raw`Бялата крива е $\sin\theta$. Жълтата права е линейният модел, а зелената крива включва кубичната поправка.`,
    steps: [
      {
        title: "Избираме малкия параметър",
        question: String.raw`Коя величина е малкият **безразмерен** параметър?`,
        choices: [
          {
            text: String.raw`$\varepsilon=\theta$, когато ъгълът е в радиани`,
            correct: true,
            why: String.raw`Радианът е безразмерен и $\theta=0{,}30<1$, затова степените на $\theta$ се подреждат по големина.`,
          },
          {
            text: String.raw`$\varepsilon=L/g$`,
            correct: false,
            why: String.raw`$L/g$ има размерност време на квадрат и не може да бъде аргумент на ред на Тейлър.`,
          },
          {
            text: String.raw`$\varepsilon=g\theta$`,
            correct: false,
            why: String.raw`Произведението има размерност ускорение. Малкият параметър трябва да е безразмерен.`,
          },
        ],
        text: String.raw`Точното уравнение съдържа една нелинейна функция. Малката величина е ъгълът в радиани: $\varepsilon=\theta=0{,}30$.`,
        latex: String.raw`\ddot\theta=-\frac{g}{L}\sin\theta`,
      },
      {
        title: "Разгъваме синуса",
        question: String.raw`Кой ред запазва първата нелинейна поправка?`,
        choices: [
          {
            text: String.raw`$\sin\theta=\theta-\theta^3/3!+O(\theta^5)$`,
            correct: true,
            why: String.raw`Синусът е нечетна функция. След линейния член идва кубичен член с отрицателен знак.`,
          },
          {
            text: String.raw`$\sin\theta=1-\theta^2/2+O(\theta^4)$`,
            correct: false,
            why: String.raw`Това е редът на $\cos\theta$. Той дори дава стойност 1 при $\theta=0$, а $\sin0=0$.`,
          },
          {
            text: String.raw`$\sin\theta=\theta+\theta^3/3!+O(\theta^5)$`,
            correct: false,
            why: String.raw`Кубичният член е отрицателен. Затова $\sin\theta$ лежи под правата $y=\theta$ за малки положителни ъгли.`,
          },
        ],
        text: String.raw`Запазваме членовете до трета степен. Остатъкът започва от пета степен и при $\theta=0{,}30$ вече е много малък.`,
        latex: String.raw`\sin\theta=\theta-\frac{\theta^3}{6}+O(\theta^5),\qquad
\ddot\theta\approx-\frac gL\left(\theta-\frac{\theta^3}{6}\right)`,
      },
      {
        title: "Смятаме и сравняваме",
        question: String.raw`Коя сметка е минималната, която изпълнява условието?`,
        choices: [
          {
            text: String.raw`Запазваме $\theta$ и $-\theta^3/6$`,
            correct: true,
            why: String.raw`Линейният член дава основния модел, а кубичният е точно първата нелинейна поправка.`,
          },
          {
            text: String.raw`Запазваме само $\theta$`,
            correct: false,
            why: String.raw`Това възпроизвежда линейния модел, но не намира поисканата нелинейна поправка.`,
          },
          {
            text: String.raw`Трябва задължително да стигнем до $\theta^9$`,
            correct: false,
            why: String.raw`По-високите членове са допустими, но не са необходими. Редът се прекъсва според търсената точност.`,
          },
        ],
        text: String.raw`Линейният модел дава $-2{,}943\,\mathrm{rad/s^2}$, а кубичната поправка го променя до $-2{,}899\,\mathrm{rad/s^2}$. Точната стойност също е $-2{,}899\,\mathrm{rad/s^2}$ до показаната точност.`,
        latex: String.raw`\ddot\theta_{(3)}=-9{,}81\left(0{,}30-\frac{0{,}30^3}{6}\right)
=-2{,}899\,\mathrm{rad/s^2}`,
      },
      {
        title: "Четем физическия смисъл",
        question: String.raw`Какво означава отрицателната кубична поправка в $\sin\theta$?`,
        choices: [
          {
            text: "Точната възстановяваща сила е малко по-слаба от линейния модел",
            correct: true,
            why: String.raw`За $\theta>0$ имаме $\sin\theta<\theta$, следователно големината на възстановяващото ускорение е по-малка.`,
          },
          {
            text: "Точната възстановяваща сила е по-силна",
            correct: false,
            why: String.raw`Това би изисквало $\sin\theta>\theta$, но графиката и редът показват обратното.`,
          },
          {
            text: "Поправката сменя посоката на ускорението",
            correct: false,
            why: String.raw`При малък ъгъл поправката променя големината, но общият знак остава възстановяващ.`,
          },
        ],
        text: String.raw`Линейният модел надценява големината с около $1{,}52\%$. Нелинейността отслабва възстановяването и е причината периодът на реалното махало да нараства с амплитудата.`,
        latex: String.raw`\frac{|\ddot\theta_{\mathrm{lin}}|-|\ddot\theta_{\mathrm{exact}}|}
{|\ddot\theta_{\mathrm{exact}}|}\,100\%\approx1{,}52\%`,
      },
    ],
    teacherNotes: [
      String.raw`Попитайте защо $30^\circ$ не може да се постави директно в реда. Очакваният отговор е, че степенният ред използва радиани.`,
      String.raw`Честа грешка е знакът пред $\theta^3/6$. Нека ученикът сравни графично $\sin\theta$ и $\theta$.`,
    ],
  },
  {
    id: "gravity",
    domain: "Гравитация",
    difficulty: "Основна",
    title: "Кога формулата mgh започва да греши?",
    statement: String.raw`Тяло се издига от земната повърхност на височина $h=100\,\mathrm{km}$. Приемете $R_\oplus=6371\,\mathrm{km}$ и $g=9{,}81\,\mathrm{m/s^2}$. Намерете първите две поправки към $\Delta U=mgh$ и оценете грешката на модела с постоянно $g$.`,
    plot: {
      xDomain: [0, 0.2],
      yDomain: [0.8, 1.02],
      xTex: String.raw`\eta=h/R_\oplus`,
      yTex: String.raw`\Delta U/(mgh)`,
      point: 100 / 6371,
      pointTex: String.raw`\eta=0{,}0157`,
      exact: (x) => 1 / (1 + x),
      first: (x) => 1 - x,
      second: (x) => 1 - x + x ** 2,
    },
    caption: String.raw`Графиката показва отношението $\Delta U/(mgh)$. При малка височина то е близо до 1, но намалява, защото гравитацията отслабва.`,
    steps: [
      {
        title: "Намираме мащаба",
        question: String.raw`Кое отношение контролира точността на приближението?`,
        choices: [
          {
            text: String.raw`$\eta=h/R_\oplus$`,
            correct: true,
            why: String.raw`Това е безразмерното отношение между промяната на радиуса и земния радиус. Тук $\eta\approx0{,}0157$.`,
          },
          {
            text: String.raw`$h-g$`,
            correct: false,
            why: "Височина и ускорение имат различни размерности и не могат да се изваждат.",
          },
          {
            text: String.raw`$m/R_\oplus$`,
            correct: false,
            why: "Масата на тялото не определя геометричната промяна на гравитационното поле.",
          },
        ],
        text: String.raw`Използваме точния гравитационен потенциал и изнасяме познатия мащаб $mgh$.`,
        latex: String.raw`\Delta U=GMm\left(\frac1{R_\oplus}-\frac1{R_\oplus+h}\right)
=mgh\,\frac1{1+h/R_\oplus}`,
      },
      {
        title: "Разпознаваме геометричния ред",
        question: String.raw`Кой ред трябва да приложим към $1/(1+\eta)$?`,
        choices: [
          {
            text: String.raw`$1-\eta+\eta^2+O(\eta^3)$`,
            correct: true,
            why: String.raw`Това е геометричният ред с аргумент $-\eta$. Знаците се редуват.`,
          },
          {
            text: String.raw`$1+\eta+\eta^2+O(\eta^3)$`,
            correct: false,
            why: String.raw`Този ред е за $1/(1-\eta)$. Тук знаменателят е $1+\eta$.`,
          },
          {
            text: String.raw`$\eta-\eta^2/2+O(\eta^3)$`,
            correct: false,
            why: String.raw`Това е началото на $\ln(1+\eta)$, а в задачата имаме обратна величина.`,
          },
        ],
        text: String.raw`Първата поправка е отрицателна, защото реалната сила отслабва с височината. Втората връща малка положителна част.`,
        latex: String.raw`\Delta U=mgh\left[1-\frac h{R_\oplus}+\left(\frac h{R_\oplus}\right)^2
+O\!\left(\frac{h^3}{R_\oplus^3}\right)\right]`,
      },
      {
        title: "Оценяваме поправката",
        question: String.raw`Кое число трябва да сравним с 1, за да оценим $mgh$?`,
        choices: [
          {
            text: String.raw`$1-\eta+\eta^2\approx0{,}98455$`,
            correct: true,
            why: "Това е множителят пред $mgh$ след включване на двете поправки.",
          },
          {
            text: String.raw`$1+\eta\approx1{,}0157$`,
            correct: false,
            why: "Знакът пред първата поправка е грешен и би означавал усилване на гравитацията.",
          },
          {
            text: String.raw`$\eta^2\approx0{,}000246$`,
            correct: false,
            why: "Това е само вторият коригиращ член, не пълният множител пред $mgh$.",
          },
        ],
        text: String.raw`За $h=100\,\mathrm{km}$ получаваме $\eta=0{,}015696$ и множител $0{,}98455$. Точният множител е $0{,}984546$, така че вторият ред вече е отличен.`,
        latex: String.raw`\boxed{\Delta U\approx0{,}98455\,mgh}`,
      },
      {
        title: "Проверяваме посоката на грешката",
        question: String.raw`Моделът $\Delta U=mgh$ надценява или подценява точния резултат?`,
        choices: [
          {
            text: "Надценява го, защото използва повърхностното g по целия път",
            correct: true,
            why: "Над повърхността реалното ускорение е по-малко от повърхностното, затова постоянната стойност дава прекалено голяма работа.",
          },
          {
            text: "Подценява го, защото g расте с височината",
            correct: false,
            why: "Гравитационното ускорение намалява като обратния квадрат на разстоянието.",
          },
          {
            text: "Няма грешка при никоя височина",
            correct: false,
            why: String.raw`Формулата $mgh$ е локално приближение и става точна само в границата $h/R_\oplus\to0$.`,
          },
        ],
        text: String.raw`Относителното надценяване е приблизително $1{,}57\%$. Знакът на първата поправка можеше да бъде предвиден още преди сметката от намаляването на $g$.`,
        latex: String.raw`\frac{mgh-\Delta U}{mgh}\,100\%\approx1{,}55\%`,
      },
    ],
    teacherNotes: [
      String.raw`Диагностичен въпрос: ако $h$ стане сравнимо с $R_\oplus$, допустимо ли е да пазим само два члена?`,
      "Следете учениците да не разлагат размерната величина h, а безразмерното отношение h/R.",
    ],
  },
  {
    id: "relativity",
    domain: "Относителност",
    difficulty: "Средна",
    title: "Първата релативистична поправка",
    statement: String.raw`Частица с маса $m$ се движи със скорост $v=0{,}20c$. Разгънете релативистичната кинетична енергия $K=(\gamma-1)mc^2$ до четвърта степен по $v/c$ и сравнете с Нютоновия резултат.`,
    plot: {
      xDomain: [0, 0.7],
      yDomain: [0, 0.43],
      xTex: String.raw`\beta=v/c`,
      yTex: String.raw`K/(mc^2)`,
      point: 0.2,
      pointTex: String.raw`\beta=0{,}20`,
      exact: (x) => 1 / Math.sqrt(1 - x ** 2) - 1,
      first: (x) => x ** 2 / 2,
      second: (x) => x ** 2 / 2 + (3 * x ** 4) / 8,
    },
    caption: String.raw`Нютоновата парабола е първият ненулев член. Зелената крива добавя поправката от ред $\beta^4$.`,
    steps: [
      {
        title: "Избираме параметъра",
        question: String.raw`Кой параметър трябва да е малък за Нютоновата граница?`,
        choices: [
          {
            text: String.raw`$\beta=v/c$`,
            correct: true,
            why: String.raw`Отношението е безразмерно и Нютоновата граница е точно $v/c\ll1$.`,
          },
          {
            text: String.raw`$mc^2$`,
            correct: false,
            why: "Това е енергиен мащаб, не малък безразмерен параметър.",
          },
          {
            text: String.raw`$v-c$`,
            correct: false,
            why: "Разликата има размерност скорост и е голяма в нискоскоростната граница.",
          },
        ],
        text: String.raw`Записваме лоренцовия фактор чрез $\beta$. При $\beta=0{,}20$ следващите четни степени бързо намаляват.`,
        latex: String.raw`\gamma=(1-\beta^2)^{-1/2},\qquad \beta=\frac vc=0{,}20`,
      },
      {
        title: "Прилагаме биномния ред",
        question: String.raw`Кое разгъване на $\gamma$ е вярно?`,
        choices: [
          {
            text: String.raw`$\gamma=1+\beta^2/2+3\beta^4/8+O(\beta^6)$`,
            correct: true,
            why: String.raw`Използваме $(1-x)^{-1/2}$ с $x=\beta^2$, затова се появяват само четни степени на $\beta$.`,
          },
          {
            text: String.raw`$\gamma=1+\beta/2+3\beta^2/8+O(\beta^3)$`,
            correct: false,
            why: String.raw`Аргументът на биномния ред е $\beta^2$, не $\beta$. Лоренцовият фактор е четна функция на скоростта.`,
          },
          {
            text: String.raw`$\gamma=1-\beta^2/2+O(\beta^4)$`,
            correct: false,
            why: String.raw`За ненулева скорост $\gamma>1$, следователно първата поправка трябва да е положителна.`,
          },
        ],
        text: String.raw`Биномният ред показва защо енергията не зависи от знака на скоростта: всички степени са четни.`,
        latex: String.raw`(1-\beta^2)^{-1/2}=1+\frac12\beta^2+\frac38\beta^4+O(\beta^6)`,
      },
      {
        title: "Отделяме кинетичната енергия",
        question: String.raw`Какво трябва да направим с постоянния член 1 в $\gamma$?`,
        choices: [
          {
            text: String.raw`Той се съкращава в $\gamma-1$`,
            correct: true,
            why: String.raw`Кинетичната енергия изключва енергията на покой $mc^2$, затова постоянният член не остава.`,
          },
          {
            text: String.raw`Той дава допълнителен член $mc^2$ в $K$`,
            correct: false,
            why: String.raw`Това би било пълната енергия $E=\gamma mc^2$, не кинетичната $K=E-mc^2$.`,
          },
          {
            text: "Заменяме го с нула още преди разгъването",
            correct: false,
            why: "Първо разгъваме коректно γ, после изваждаме единицата според дефиницията на K.",
          },
        ],
        text: String.raw`Първият останал член е точно Нютоновата енергия. Следващият е първата релативистична поправка.`,
        latex: String.raw`K=mc^2\left(\frac12\beta^2+\frac38\beta^4+O(\beta^6)\right)
=\frac12mv^2+\frac38\frac{mv^4}{c^2}+O\!\left(\frac{mv^6}{c^4}\right)`,
      },
      {
        title: "Оценяваме размера на ефекта",
        question: String.raw`Каква част от Нютоновия член е първата поправка при $\beta=0{,}20$?`,
        choices: [
          {
            text: String.raw`$(3/4)\beta^2=3{,}0\%$`,
            correct: true,
            why: String.raw`Делим $(3/8)\beta^4$ на $(1/2)\beta^2$ и получаваме $(3/4)\beta^2$.`,
          },
          {
            text: String.raw`$(3/8)\beta^4=0{,}06\%$`,
            correct: false,
            why: "Това е абсолютният безразмерен член, а въпросът иска отношението му към Нютоновия член.",
          },
          {
            text: String.raw`$\beta=20\%$`,
            correct: false,
            why: "Скоростта като дял от c не е същото като относителната енергийна поправка.",
          },
        ],
        text: String.raw`Получаваме $K/(mc^2)\approx0{,}020600$, докато точната стойност е $0{,}020621$. Нютоновият резултат $0{,}020000$ подценява енергията с около $3\%$.`,
        latex: String.raw`\boxed{\frac{K_{(4)}}{mc^2}=0{,}020600},\qquad
\frac{K_{\mathrm{exact}}}{mc^2}=0{,}020621`,
      },
    ],
    teacherNotes: [
      String.raw`Попитайте защо не може да има член, пропорционален на $v^3$. Симетрията $v\mapsto-v$ изключва нечетните степени.`,
      "Честа грешка е запазването на енергията на покой в кинетичната енергия.",
    ],
  },
  {
    id: "diffraction",
    domain: "Оптика",
    difficulty: "Средна",
    title: "Формата на централния дифракционен максимум",
    statement: String.raw`При дифракция от единичен процеп интензитетът е $I/I_0=(\sin u/u)^2$, където $u=\pi a\sin\theta/\lambda$. Намерете приближението около центъра до четвърта степен и го проверете при $u=0{,}50$.`,
    plot: {
      xDomain: [-2, 2],
      yDomain: [0.05, 1.08],
      xTex: "u",
      yTex: String.raw`I/I_0`,
      point: 0.5,
      pointTex: String.raw`u=0{,}50`,
      exact: (x) => (Math.abs(x) < 1e-9 ? 1 : (Math.sin(x) / x) ** 2),
      first: (x) => 1 - x ** 2 / 3,
      second: (x) => 1 - x ** 2 / 3 + (2 * x ** 4) / 45,
    },
    caption: String.raw`Около $u=0$ централният максимум е почти парабола. Членът от четвърта степен възстановява лекото изправяне на кривата.`,
    steps: [
      {
        title: "Локализираме центъра",
        question: String.raw`Кой е малкият параметър близо до оптичната ос?`,
        choices: [
          {
            text: String.raw`$u=\pi a\sin\theta/\lambda$`,
            correct: true,
            why: String.raw`Това е безразмерният аргумент на синуса и в центъра $u\to0$.`,
          },
          {
            text: String.raw`$a+\lambda$`,
            correct: false,
            why: "Сумата има размерност дължина и не е аргументът на функцията sinc.",
          },
          {
            text: String.raw`$I_0/I$`,
            correct: false,
            why: "Това е резултатът, който търсим, а не малкият геометричен параметър.",
          },
        ],
        text: String.raw`В центъра имаме неопределената на вид форма $\sin u/u$, но редът веднага показва, че границата е 1.`,
        latex: String.raw`\frac{\sin u}{u}=1-\frac{u^2}{6}+\frac{u^4}{120}+O(u^6)`,
      },
      {
        title: "Повдигаме реда на квадрат",
        question: String.raw`Кое е правилното начало на $(\sin u/u)^2$?`,
        choices: [
          {
            text: String.raw`$1-u^2/3+2u^4/45+O(u^6)$`,
            correct: true,
            why: String.raw`Квадратът на $-u^2/6$ и удвоеният член $2(u^4/120)$ заедно дават $2u^4/45$.`,
          },
          {
            text: String.raw`$1-u^2/6+u^4/120+O(u^6)$`,
            correct: false,
            why: "Това е редът преди повдигането на квадрат.",
          },
          {
            text: String.raw`$1-u/3+2u^2/45+O(u^3)$`,
            correct: false,
            why: "Интензитетът е четна функция на u, затова не може да съдържа нечетни степени.",
          },
        ],
        text: String.raw`Когато квадратуваме прекъснат ред, събираме всички произведения, които допринасят до исканата степен.`,
        latex: String.raw`\left(1-\frac{u^2}{6}+\frac{u^4}{120}\right)^2
=1-\frac{u^2}{3}+\left(\frac1{36}+\frac1{60}\right)u^4+O(u^6)`,
      },
      {
        title: "Сглобяваме локалния профил",
        question: String.raw`Защо около $u=0$ няма линеен член?`,
        choices: [
          {
            text: "Интензитетът е симетричен от двете страни на центъра",
            correct: true,
            why: String.raw`Функцията е четна: $I(-u)=I(u)$. Всички нечетни производни в центъра са нула.`,
          },
          {
            text: "Защото интензитетът е отрицателен вляво",
            correct: false,
            why: "Интензитетът не е отрицателен. Квадратът гарантира неотрицателност.",
          },
          {
            text: "Защото u има размерност дължина",
            correct: false,
            why: "u е безразмерно. Липсата на линейния член идва от симетрията.",
          },
        ],
        text: String.raw`Крайният локален профил съдържа само четни степени и има максимум при $u=0$. Отрицателният квадратичен член задава първоначалния спад.`,
        latex: String.raw`\boxed{\frac I{I_0}\approx1-\frac{u^2}{3}+\frac{2u^4}{45}}`,
      },
      {
        title: "Проверяваме при u=0,50",
        question: String.raw`Кой резултат е съвместим с графиката и реда?`,
        choices: [
          {
            text: String.raw`$I/I_0\approx0{,}91944$, много близо до точната стойност`,
            correct: true,
            why: String.raw`Замяната в двата коригиращи члена дава $1-0{,}25/3+2(0{,}0625)/45=0{,}91944$.`,
          },
          {
            text: String.raw`$I/I_0\approx1{,}50$`,
            correct: false,
            why: "Това би надвишило централния максимум I₀, въпреки че се отдалечаваме от центъра.",
          },
          {
            text: String.raw`$I/I_0\approx-0{,}92$`,
            correct: false,
            why: "Интензитетът е квадрат и не може да бъде отрицателен.",
          },
        ],
        text: String.raw`Точната стойност е $0{,}919395$. Полиномът от четвърта степен греши само с около $4{,}9\times10^{-5}$ в абсолютна стойност.`,
        latex: String.raw`\left.\frac I{I_0}\right|_{u=0{,}50}\approx0{,}919444,
\qquad \left(\frac{\sin0{,}50}{0{,}50}\right)^2=0{,}919395`,
      },
    ],
    teacherNotes: [
      String.raw`Поискайте аргумент от симетрията за липсата на членове $u$ и $u^3$, преди учениците да умножат редовете.`,
      "Честа техническа грешка е да се забрави кръстосаният член при повдигането на квадрат.",
    ],
  },
  {
    id: "thermodynamics",
    domain: "Термодинамика",
    difficulty: "Средна",
    title: "Малка адиабатна компресия на въздух",
    statement: String.raw`Въздух с адиабатен показател $\gamma=1{,}40$ се компресира квазистатично от $V_0$ до $V=0{,}95V_0$. Използвайте $pV^\gamma=\mathrm{const}$, за да намерите налягането до втори ред по относителната промяна на обема.`,
    plot: {
      xDomain: [-0.18, 0.18],
      yDomain: [0.78, 1.34],
      xTex: String.raw`x=\Delta V/V_0`,
      yTex: String.raw`p/p_0`,
      point: -0.05,
      pointTex: String.raw`x=-0{,}05`,
      exact: (x) => (1 + x) ** -1.4,
      first: (x) => 1 - 1.4 * x,
      second: (x) => 1 - 1.4 * x + 1.68 * x ** 2,
    },
    caption: String.raw`При компресия $x<0$. Изпъкналостта на точната крива прави квадратичната поправка положителна.`,
    steps: [
      {
        title: "Описваме промяната безразмерно",
        question: String.raw`Какъв е малкият параметър при $V=0{,}95V_0$?`,
        choices: [
          {
            text: String.raw`$x=(V-V_0)/V_0=-0{,}05$`,
            correct: true,
            why: "Относителната промяна е безразмерна, малка и отрицателна при компресия.",
          },
          {
            text: String.raw`$x=V-V_0=-0{,}05$`,
            correct: false,
            why: "Без деление на V₀ разликата има размерност обем и числото зависи от избраните единици.",
          },
          {
            text: String.raw`$x=+0{,}95$`,
            correct: false,
            why: "Това е останалата част от обема, не малката промяна. Освен това знакът не показва компресия.",
          },
        ],
        text: String.raw`Пишем $V=V_0(1+x)$. Адиабатният закон се превръща в биномен израз с показател $-\gamma$.`,
        latex: String.raw`\frac p{p_0}=\left(\frac{V_0}{V}\right)^\gamma=(1+x)^{-\gamma},
\qquad x=-0{,}05`,
      },
      {
        title: "Разгъваме обща степен",
        question: String.raw`Кой е вторият коефициент в $(1+x)^{-\gamma}$?`,
        choices: [
          {
            text: String.raw`$\gamma(\gamma+1)/2$`,
            correct: true,
            why: String.raw`За показател $\alpha=-\gamma$ коефициентът е $\alpha(\alpha-1)/2=\gamma(\gamma+1)/2$.`,
          },
          {
            text: String.raw`$\gamma(\gamma-1)/2$`,
            correct: false,
            why: "Този коефициент би се появил при положителния показател γ, не при -γ.",
          },
          {
            text: String.raw`$-\gamma/2$`,
            correct: false,
            why: "Коефициентът на x² зависи от произведение на два последователни фактора на показателя.",
          },
        ],
        text: String.raw`И двата минуса в $(-\gamma)(-\gamma-1)$ се съкращават, затова квадратичната поправка е положителна.`,
        latex: String.raw`(1+x)^{-\gamma}=1-\gamma x+\frac{\gamma(\gamma+1)}2x^2+O(x^3)`,
      },
      {
        title: "Заместваме за въздух",
        question: String.raw`Колко е коефициентът пред $x^2$ при $\gamma=1{,}40$?`,
        choices: [
          {
            text: String.raw`$1{,}68$`,
            correct: true,
            why: String.raw`$1{,}40\cdot2{,}40/2=1{,}68$.`,
          },
          {
            text: String.raw`$0{,}28$`,
            correct: false,
            why: "Това се получава от γ(γ-1)/2 и използва грешния биномен коефициент.",
          },
          {
            text: String.raw`$-1{,}68$`,
            correct: false,
            why: "Квадратичният коефициент е положителен, независимо от знака на x.",
          },
        ],
        text: String.raw`Линейният член повишава налягането със $7\%$, а квадратичният добавя още $0{,}42\%$ от $p_0$.`,
        latex: String.raw`\frac p{p_0}\approx1-1{,}40(-0{,}05)+1{,}68(0{,}05)^2
=1{,}0742`,
      },
      {
        title: "Сверяваме с точния закон",
        question: String.raw`Защо линейният модел подценява повишаването на налягането?`,
        choices: [
          {
            text: "Кривата p(V) е изпъкнала и квадратичната поправка е положителна",
            correct: true,
            why: "Допирателната към изпъкнала крива лежи под нея. Положителният член 1,68x² измерва точно това отклонение.",
          },
          {
            text: "Защото при компресия x е положително",
            correct: false,
            why: "При компресия x е отрицателно. Подценяването идва от изпъкналостта, не от грешен знак.",
          },
          {
            text: "Линейният модел всъщност надценява налягането",
            correct: false,
            why: String.raw`Линейният резултат е $1{,}0700$, а точният е $1{,}07445$.`,
          },
        ],
        text: String.raw`Точното отношение е $(0{,}95)^{-1{,}4}=1{,}07445$. Вторият ред пропуска само $0{,}00025$, докато линейният модел пропуска $0{,}00445$.`,
        latex: String.raw`\boxed{p_{(2)}=1{,}0742p_0},\qquad p_{\mathrm{exact}}=1{,}07445p_0`,
      },
    ],
    teacherNotes: [
      "Проверете знака на x преди всяка сметка. Учениците често записват компресията като положителна промяна.",
      "Свържете положителния втори член с геометричната идея за изпъкнала графика и допирателна.",
    ],
  },
  {
    id: "ring",
    domain: "Електростатика",
    difficulty: "Разширена",
    title: "Поле близо до центъра на зареден пръстен",
    statement: String.raw`Пръстен с радиус $R$ и заряд $Q>0$ има потенциал по оста $V(z)=kQ/\sqrt{R^2+z^2}$. За $|z|\ll R$ намерете потенциала до четвърта степен и полето до кубична степен. Проверете при $z=0{,}30R$.`,
    plot: {
      xDomain: [-0.8, 0.8],
      yDomain: [0.72, 1.03],
      xTex: String.raw`\xi=z/R`,
      yTex: String.raw`VR/(kQ)`,
      point: 0.3,
      pointTex: String.raw`\xi=0{,}30`,
      exact: (x) => 1 / Math.sqrt(1 + x ** 2),
      first: (x) => 1 - x ** 2 / 2,
      second: (x) => 1 - x ** 2 / 2 + (3 * x ** 4) / 8,
    },
    caption: String.raw`Потенциалът е четен и има максимум в центъра. Полето се получава от отрицателния наклон на тази крива.`,
    steps: [
      {
        title: "Изнасяме физическия мащаб",
        question: String.raw`Кой запис отделя безразмерния аргумент?`,
        choices: [
          {
            text: String.raw`$V=(kQ/R)(1+z^2/R^2)^{-1/2}$`,
            correct: true,
            why: String.raw`Изнасяме $R^2$ от корена. Остава безразмерната величина $z^2/R^2$.`,
          },
          {
            text: String.raw`$V=(kQ/R)(1+z/R)^{-1/2}$`,
            correct: false,
            why: String.raw`В точната геометрия участва $R^2+z^2$, затова аргументът е $(z/R)^2$.`,
          },
          {
            text: String.raw`$V=kQ(1+z^2/R^2)^{-1/2}$`,
            correct: false,
            why: String.raw`Липсва множителят $1/R$, така че размерността вече не е потенциал.`,
          },
        ],
        text: String.raw`Въвеждаме $\xi=z/R$. Физическият мащаб е $kQ/R$, а цялата пространствена зависимост е в една безразмерна функция.`,
        latex: String.raw`V(z)=\frac{kQ}{R}(1+\xi^2)^{-1/2},\qquad \xi=\frac zR`,
      },
      {
        title: "Разгъваме потенциала",
        question: String.raw`Кое разгъване е съвместимо със симетрията $z\mapsto-z$?`,
        choices: [
          {
            text: String.raw`$1-\xi^2/2+3\xi^4/8+O(\xi^6)$`,
            correct: true,
            why: "Потенциалът е четна функция, а биномният ред с аргумент ξ² съдържа само четни степени.",
          },
          {
            text: String.raw`$1-\xi/2+3\xi^2/8+O(\xi^3)$`,
            correct: false,
            why: "Линейният член би разрушил симетрията на пръстена спрямо равнината z=0.",
          },
          {
            text: String.raw`$1+\xi^2/2+3\xi^4/8+O(\xi^6)$`,
            correct: false,
            why: "Потенциалът трябва да намалява при отдалечаване от центъра, затова квадратичният член е отрицателен.",
          },
        ],
        text: String.raw`Първата производна в центъра е нула, а отрицателният квадратичен член показва, че центърът е максимум на потенциала по оста.`,
        latex: String.raw`V(z)=\frac{kQ}{R}\left[1-\frac12\left(\frac zR\right)^2
+\frac38\left(\frac zR\right)^4+O\!\left(\frac{z^6}{R^6}\right)\right]`,
      },
      {
        title: "Диференцираме с правилния мащаб",
        question: String.raw`Кой допълнителен множител идва от $d/dz=(1/R)d/d\xi$?`,
        choices: [
          {
            text: String.raw`$1/R$`,
            correct: true,
            why: String.raw`Понеже $\xi=z/R$, имаме $d\xi/dz=1/R$. Това превръща мащаба $kQ/R$ в $kQ/R^2$.`,
          },
          {
            text: String.raw`$R$`,
            correct: false,
            why: "Веригата на производната дава dξ/dz, което е 1/R, не R.",
          },
          {
            text: "Не идва никакъв множител",
            correct: false,
            why: "Тогава полето би имало грешна размерност на потенциал вместо потенциал на единица дължина.",
          },
        ],
        text: String.raw`Полето е нечетна функция. Линейният член задава поле, подобно на това при хармоничен потенциал, а кубичният описва първото отклонение.`,
        latex: String.raw`E_z=-\frac{dV}{dz}=\frac{kQ}{R^2}\left[\xi-\frac32\xi^3+O(\xi^5)\right]`,
      },
      {
        title: "Проверяваме при z=0,30R",
        question: String.raw`Каква е посоката на полето при $Q>0$ и $z>0$?`,
        choices: [
          {
            text: "Към положителната посока на оста, навън от пръстена",
            correct: true,
            why: "Положителният пръстен отблъсква положителен пробен заряд. За z>0 полето е по +z.",
          },
          {
            text: "Към центъра на пръстена",
            correct: false,
            why: "Това би било вярно за отрицателен заряд Q. При Q>0 полето е насочено навън.",
          },
          {
            text: "Полето е нула за всяко z",
            correct: false,
            why: "Симетрията занулява полето само в точния център z=0.",
          },
        ],
        text: String.raw`При $\xi=0{,}30$ кубичното приближение дава $E_zR^2/(kQ)=0{,}2595$. Точната стойност е $0{,}26362$, тоест грешката е около $1{,}56\%$.`,
        latex: String.raw`\frac{E_{z,(3)}R^2}{kQ}=0{,}30-\frac32(0{,}30)^3=0{,}2595,
\qquad \frac{E_{z,\mathrm{exact}}R^2}{kQ}=\frac{0{,}30}{(1+0{,}30^2)^{3/2}}=0{,}26362`,
      },
    ],
    teacherNotes: [
      "Изисквайте проверка на четност за потенциала и нечетност за полето преди диференцирането.",
      String.raw`Честа грешка е загубата на $1/R$ при веригата на производната. Проверете резултата по размерност.`,
    ],
  },
];

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function StepGate({
  index,
  step,
  onSolved,
}: {
  index: number;
  step: TaylorStep;
  onSolved: () => void;
}) {
  const choicesRef = useRef(step.choices);
  const [choices, setChoices] = useState<StepChoice[] | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setChoices(shuffle(choicesRef.current));
  }, []);

  if (!choices) {
    return (
      <div className="rounded-[10px] border-[1.5px] border-rule bg-surface px-4 py-4 text-[14px] text-muted" aria-busy="true">
        Подготвяме следващия въпрос…
      </div>
    );
  }

  const pickedChoice = picked === null ? null : choices[picked];

  return (
    <div className="animate-rise">
      <div className="rounded-[10px] border-[1.5px] border-rule bg-hl/45 p-4">
        <p className="text-[10.5px] font-bold uppercase tracking-[.16em] text-minus">
          Ключ към стъпка {index}
        </p>
        <p className="mt-1.5 font-semibold text-ink">
          <RichText text={step.question} />
        </p>
        <div className="mt-3 grid gap-2.5">
          {choices.map((choice, choiceIndex) => {
            const wasPicked = picked === choiceIndex;
            let className =
              "rounded-[9px] border-[1.5px] px-4 py-2.5 text-left text-[14.5px] transition-all ";
            if (solved && choice.correct) {
              className += "border-ok bg-ok/10 font-semibold text-ink";
            } else if (!solved && wasPicked && !choice.correct) {
              className += "border-plus bg-plus/10 text-ink";
            } else if (solved) {
              className += "border-rule bg-surface text-muted";
            } else {
              className +=
                "cursor-pointer border-rule bg-surface text-ink shadow-hard-sm hover:border-ink active:translate-x-px active:translate-y-px active:shadow-none";
            }

            return (
              <button
                key={choiceIndex}
                type="button"
                className={className}
                disabled={solved}
                onClick={() => {
                  setPicked(choiceIndex);
                  if (choice.correct) {
                    setSolved(true);
                    onSolved();
                  }
                }}
              >
                <RichText text={choice.text} />
              </button>
            );
          })}
        </div>

        {pickedChoice && (
          <div
            className={`mt-3 rounded-r-lg border-l-4 px-4 py-3 text-[14.5px] leading-relaxed ${
              solved ? "border-ok bg-ok/10" : "border-plus bg-plus/10"
            }`}
            role="status"
          >
            <strong className={solved ? "text-ok" : "text-plus"}>
              {solved ? "Вярно. " : "Опитайте отново. "}
            </strong>
            <RichText text={pickedChoice.why} />
          </div>
        )}
      </div>

      {solved && (
        <div className="mt-4 grid gap-3 border-l-[3px] border-minus pl-4 sm:grid-cols-[2.2rem_1fr]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-ink bg-surface text-[12px] font-bold">
            {index}
          </div>
          <div className="min-w-0">
            <h4 className="font-serif text-[19px] font-bold text-ink">{step.title}</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/90">
              <RichText text={step.text} />
            </p>
            {step.latex && (
              <div className="mt-3">
                <Formula latex={step.latex} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FIGURE = { width: 640, height: 326, left: 62, right: 616, top: 58, bottom: 292 } as const;

function curvePath(plot: PlotData, fn: (x: number) => number) {
  const sx = (x: number) =>
    FIGURE.left +
    ((x - plot.xDomain[0]) / (plot.xDomain[1] - plot.xDomain[0])) *
      (FIGURE.right - FIGURE.left);
  const sy = (y: number) =>
    FIGURE.bottom -
    ((y - plot.yDomain[0]) / (plot.yDomain[1] - plot.yDomain[0])) *
      (FIGURE.bottom - FIGURE.top);

  return Array.from({ length: 181 }, (_, i) => {
    const x = plot.xDomain[0] + (i / 180) * (plot.xDomain[1] - plot.xDomain[0]);
    return `${i === 0 ? "M" : "L"}${sx(x).toFixed(2)},${sy(fn(x)).toFixed(2)}`;
  }).join(" ");
}

function numberTex(value: number) {
  const absolute = Math.abs(value);
  const digits = absolute >= 0.1 ? 5 : 6;
  return value.toFixed(digits).replace(".", "{,}");
}

function ProgressivePlot({ plot, phase, caption }: { plot: PlotData; phase: number; caption: RichTextString }) {
  const clipId = useId().replaceAll(":", "");
  const sx = (x: number) =>
    FIGURE.left +
    ((x - plot.xDomain[0]) / (plot.xDomain[1] - plot.xDomain[0])) *
      (FIGURE.right - FIGURE.left);
  const sy = (y: number) =>
    FIGURE.bottom -
    ((y - plot.yDomain[0]) / (plot.yDomain[1] - plot.yDomain[0])) *
      (FIGURE.bottom - FIGURE.top);
  const xAxisY = plot.yDomain[0] <= 0 && plot.yDomain[1] >= 0 ? sy(0) : FIGURE.bottom;
  const yAxisX = plot.xDomain[0] <= 0 && plot.xDomain[1] >= 0 ? sx(0) : FIGURE.left;
  const exactAtPoint = plot.exact(plot.point);
  const secondAtPoint = plot.second(plot.point);

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="mx-auto min-w-[640px]">
          <svg
            viewBox={`0 0 ${FIGURE.width} ${FIGURE.height}`}
            className={STAGE_CLASS}
            aria-label="Постепенно построяване на точна функция и приближенията ѝ"
          >
            <rect width={FIGURE.width} height={FIGURE.height} fill={STAGE_BG} />
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={FIGURE.left}
                  y={FIGURE.top}
                  width={FIGURE.right - FIGURE.left}
                  height={FIGURE.bottom - FIGURE.top}
                />
              </clipPath>
            </defs>
            {[0.25, 0.5, 0.75].map((part) => (
              <g key={part} stroke={C.faint} strokeWidth={1}>
                <line
                  x1={FIGURE.left}
                  y1={FIGURE.top + part * (FIGURE.bottom - FIGURE.top)}
                  x2={FIGURE.right}
                  y2={FIGURE.top + part * (FIGURE.bottom - FIGURE.top)}
                />
                <line
                  x1={FIGURE.left + part * (FIGURE.right - FIGURE.left)}
                  y1={FIGURE.top}
                  x2={FIGURE.left + part * (FIGURE.right - FIGURE.left)}
                  y2={FIGURE.bottom}
                />
              </g>
            ))}
            <g stroke={C.mut} strokeWidth={1.5}>
              <line x1={FIGURE.left} y1={xAxisY} x2={FIGURE.right} y2={xAxisY} />
              <line x1={yAxisX} y1={FIGURE.top} x2={yAxisX} y2={FIGURE.bottom} />
            </g>

            <g clipPath={`url(#${clipId})`}>
              <path d={curvePath(plot, plot.exact)} fill="none" stroke={C.wire} strokeWidth={3.1} />
              {phase >= 1 && (
                <path
                  d={curvePath(plot, plot.first)}
                  fill="none"
                  stroke={C.warn}
                  strokeWidth={2.4}
                  strokeDasharray="8 5"
                  className="animate-rise"
                />
              )}
              {phase >= 2 && (
                <path
                  d={curvePath(plot, plot.second)}
                  fill="none"
                  stroke={C.ok}
                  strokeWidth={2.7}
                  className="animate-rise"
                />
              )}
            </g>
            {phase >= 3 && (
              <g className="animate-rise">
                <line
                  x1={sx(plot.point)}
                  y1={FIGURE.top}
                  x2={sx(plot.point)}
                  y2={FIGURE.bottom}
                  stroke={C.minus}
                  strokeWidth={1.5}
                  strokeDasharray="4 5"
                />
                <circle cx={sx(plot.point)} cy={sy(exactAtPoint)} r={5.5} fill={C.wire} stroke={STAGE_BG} strokeWidth={2} />
                <circle cx={sx(plot.point)} cy={sy(secondAtPoint)} r={4.2} fill={C.ok} stroke={STAGE_BG} strokeWidth={2} />
              </g>
            )}

            <g style={{ fontFamily: DRAWING_FONT_FAMILY }}>
              <line x1={88} y1={26} x2={116} y2={26} stroke={C.wire} strokeWidth={3} />
              <SvgTex x={124} y={26} tex="f" color={C.wire} width={40} />
              {phase >= 1 && (
                <g className="animate-rise">
                  <line x1={274} y1={26} x2={302} y2={26} stroke={C.warn} strokeWidth={2.4} strokeDasharray="7 4" />
                  <SvgTex x={310} y={26} tex="T_1" color={C.warn} width={44} />
                </g>
              )}
              {phase >= 2 && (
                <g className="animate-rise">
                  <line x1={441} y1={26} x2={469} y2={26} stroke={C.ok} strokeWidth={2.7} />
                  <SvgTex x={477} y={26} tex="T_2" color={C.ok} width={44} />
                </g>
              )}
            </g>

            <SvgTex x={FIGURE.right - 3} y={xAxisY - 16} tex={plot.xTex} color={C.mut} width={115} anchor="end" />
            <SvgTex x={yAxisX + 9} y={FIGURE.top + 9} tex={plot.yTex} color={C.mut} width={126} />
          </svg>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          ["Точка", `$${plot.pointTex}$`],
          ["Точна крива", `$f=${numberTex(exactAtPoint)}$`],
          ["Втори полином", `$T_2=${numberTex(secondAtPoint)}$`],
          ["Абсолютна грешка", `$|T_2-f|=${numberTex(Math.abs(secondAtPoint - exactAtPoint))}$`],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</dt>
            <dd className="mt-0.5 text-[14px] font-bold tabular-nums text-ink">
              <RichText text={value} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        <RichText text={caption} />
      </p>
    </div>
  );
}

function TaylorProblem({ problem, index }: { problem: TaylorProblemData; index: number }) {
  const [solvedSteps, setSolvedSteps] = useState(0);
  const completed = solvedSteps === problem.steps.length;

  return (
    <article id={problem.id} className="scroll-mt-24 rounded-[12px] border-[1.5px] border-ink bg-surface p-5 shadow-hard sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-[10.5px] font-bold uppercase tracking-[.14em]">
          <span className="rounded-full border-[1.5px] border-plus bg-plus/10 px-3 py-1 text-plus">
            Задача {index}
          </span>
          <span className="rounded-full border-[1.5px] border-rule px-3 py-1 text-muted">{problem.domain}</span>
          <span className="rounded-full border-[1.5px] border-rule px-3 py-1 text-muted">{problem.difficulty}</span>
        </div>
        <span className={`text-[12px] font-bold ${completed ? "text-ok" : "text-muted"}`} aria-live="polite">
          {completed ? "Решена" : `${solvedSteps}/${problem.steps.length} стъпки`}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-[clamp(24px,4vw,31px)] font-bold leading-tight text-ink">{problem.title}</h3>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink/90">
        <RichText text={problem.statement} />
      </p>

      <div className="mt-5">
        <ProgressivePlot plot={problem.plot} phase={solvedSteps} caption={problem.caption} />
      </div>

      <div className="mt-6 space-y-5 border-t-[1.5px] border-dashed border-rule pt-5">
        {problem.steps.slice(0, Math.min(solvedSteps + 1, problem.steps.length)).map((step, stepIndex) => (
          <StepGate
            key={stepIndex}
            index={stepIndex + 1}
            step={step}
            onSolved={() => setSolvedSteps((current) => Math.max(current, stepIndex + 1))}
          />
        ))}
      </div>

      {completed && (
        <div className="mt-6 rounded-r-lg border-l-4 border-ok bg-ok/10 px-4 py-3 text-[15px] font-semibold text-ink animate-rise">
          Всички стъпки са отключени. Върнете се към графиката и проверете как всеки добавен член приближава точната крива около избраната точка.
        </div>
      )}

      <TeacherNote title="Методически бележки">
        <ul className="list-disc space-y-1.5 pl-5">
          {problem.teacherNotes.map((note) => (
            <li key={note}>
              <RichText text={note} />
            </li>
          ))}
        </ul>
      </TeacherNote>
    </article>
  );
}

export default function TaylorProblemSet() {
  return (
    <div className="space-y-8">
      {problems.map((problem, index) => (
        <TaylorProblem key={problem.id} problem={problem} index={index + 1} />
      ))}
    </div>
  );
}
