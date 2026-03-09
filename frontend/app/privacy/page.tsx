'use client';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Политика за поверителност</h1>
        <p className="text-slate-500 mb-10">Последна актуализация: март 2026 г.</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <p>
            Добре дошли в Skillio („ние", „нашата платформа"). Ние уважаваме вашата поверителност и се ангажираме да защитаваме личните ви данни. Настоящата политика обяснява какви данни събираме, как ги използваме и как ги защитаваме при използването на платформата Skillio.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Какви данни събираме</h2>
            <p>При използване на Skillio можем да събираме следните данни:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>име</li>
              <li>имейл адрес</li>
              <li>данни за профил</li>
              <li>информация, която доброволно добавяте към профила си</li>
              <li>IP адрес</li>
              <li>техническа информация за използването на платформата</li>
            </ul>
            <p className="mt-3">Тези данни се събират когато:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>създавате акаунт</li>
              <li>влизате в платформата</li>
              <li>редактирате профила си</li>
              <li>използвате функционалностите на сайта</li>
            </ul>
            <p className="mt-3">
              Потребителите могат да създадат акаунт чрез външни доставчици като Google или Facebook. В този случай получаваме основна информация за профила (име и имейл), необходима за създаване на акаунт в платформата.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Как използваме вашите данни</h2>
            <p>Събраната информация се използва за:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>предоставяне и поддръжка на платформата Skillio</li>
              <li>управление на потребителски акаунти</li>
              <li>подобряване на услугата</li>
              <li>комуникация с потребителите</li>
              <li>защита на сигурността на платформата</li>
            </ul>
            <p className="mt-3">Ние не продаваме вашите лични данни на трети страни.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Правно основание за обработка (GDPR)</h2>
            <p>Съгласно Общия регламент за защита на данните (GDPR), обработваме лични данни на следните основания:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>вашето съгласие</li>
              <li>необходимостта да предоставим услугата</li>
              <li>наш легитимен интерес (например сигурност и подобрение на платформата)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Съхранение и защита на данните</h2>
            <p>Данните се съхраняват чрез надеждни инфраструктурни доставчици. В момента използваме:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Vercel – хостинг на уеб приложението</li>
              <li>Supabase – база данни и автентикация</li>
              <li>Hetzner – сървърна инфраструктура</li>
            </ul>
            <p className="mt-3">Тези доставчици използват мерки за сигурност за защита на данните.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Срок на съхранение</h2>
            <p>Личните данни се съхраняват само за периода, необходим за предоставяне на услугата или за изпълнение на законови задължения. Можете по всяко време да поискате изтриване на своя акаунт.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Вашите права</h2>
            <p>Съгласно GDPR имате право:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>да получите достъп до вашите лични данни</li>
              <li>да поискате корекция</li>
              <li>да поискате изтриване</li>
              <li>да ограничите обработката</li>
              <li>да получите копие на вашите данни</li>
            </ul>
            <p className="mt-3">
              За упражняване на тези права можете да се свържете с нас на:{' '}
              <a href="mailto:nikol_93_bg@proton.me" className="text-emerald-600 hover:underline">nikol_93_bg@proton.me</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Бисквитки (Cookies)</h2>
            <p>Skillio може да използва основни бисквитки, които са необходими за функционирането на платформата. Не използваме рекламни бисквитки без съгласието на потребителя.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Промени в политиката</h2>
            <p>Можем периодично да актуализираме тази политика за поверителност. Всички промени ще бъдат публикувани на тази страница.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Контакт</h2>
            <p>
              Ако имате въпроси относно тази политика, можете да се свържете с нас на:{' '}
              <a href="mailto:nikol_93_bg@proton.me" className="text-emerald-600 hover:underline">nikol_93_bg@proton.me</a>
            </p>
          </section>
        </div>
    </div>
  );
}
