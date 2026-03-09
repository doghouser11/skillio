'use client';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Общи условия за ползване</h1>
        <p className="text-slate-500 mb-10">Последна актуализация: март 2026 г.</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <p>
            Добре дошли в Skillio. Чрез използването на платформата Skillio вие се съгласявате с настоящите условия.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Използване на платформата</h2>
            <p>Skillio е онлайн платформа, която позволява на потребителите да създават профили, да представят умения и да се свързват с други хора. Вие се съгласявате да използвате платформата по законен и коректен начин.</p>
            <p className="mt-3">Забранено е:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>нарушаването на приложимото законодателство</li>
              <li>публикуването на незаконно съдържание</li>
              <li>опитите за нарушаване на сигурността на платформата</li>
              <li>достъп до чужди данни без разрешение</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Потребителски акаунти</h2>
            <p>За достъп до определени функции може да е необходимо създаване на акаунт. Вие носите отговорност за:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>защитата на вашата парола</li>
              <li>всички действия, извършени чрез вашия акаунт</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Потребителско съдържание</h2>
            <p>Потребителите могат да публикуват съдържание като профили, описания и информация за дейности. Вие запазвате собствеността върху съдържанието си, но предоставяте на Skillio право да го показва в рамките на платформата.</p>
            <p className="mt-3">Потребителите носят отговорност за законността на публикуваното съдържание.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Достъпност на услугата</h2>
            <p>Стремим се да поддържаме платформата постоянно достъпна, но не можем да гарантираме непрекъсната работа. Възможно е да променяме или прекратяваме определени функции.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Ограничаване на отговорността</h2>
            <p>Skillio се предоставя „както е". Ние не носим отговорност за преки или косвени вреди, произтичащи от използването на платформата.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Прекратяване</h2>
            <p>Можем да ограничим или прекратим достъпа до акаунти, които нарушават тези условия. Потребителите могат по всяко време да поискат изтриване на своя акаунт.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Промени в условията</h2>
            <p>Можем периодично да актуализираме тези условия. Продължаването на използването на платформата означава, че приемате актуализираните условия.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Контакт</h2>
            <p>
              Ако имате въпроси относно тези условия, можете да се свържете с нас на:{' '}
              <a href="mailto:nikol_93_bg@proton.me" className="text-emerald-600 hover:underline">nikol_93_bg@proton.me</a>
            </p>
          </section>
        </div>
    </div>
  );
}
