import React, { useId, useState } from 'react';
import { ArrowRight, TrendDown, TrendUp, Timer } from '@phosphor-icons/react';
import { calculateFinancialImpact, FINANCIAL_DEFAULTS, FINANCIAL_LIMITS } from './financial-model';
import './financial-impact.css';

const numberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const monthsFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
const rubles = value => `${numberFormat.format(value)} ₽`;

const fields = [
  { key: 'monthlySavings', label: 'Сокращаемые расходы', unit: '₽ / мес.', hint: 'Расходы, которые действительно уйдут из бюджета.' },
  { key: 'extraDeals', label: 'Дополнительные сделки', unit: 'в месяц', hint: 'Сколько завершённых сделок добавится за месяц.' },
  { key: 'marginPerDeal', label: 'Маржа с одной сделки', unit: '₽ / сделку', hint: 'Выручка за вычетом переменных затрат на эту сделку.' },
  { key: 'monthlyAiCost', label: 'ИИ и сопровождение', unit: '₽ / мес.', hint: 'Сервисы, использование моделей и поддержка.' },
  { key: 'setupCost', label: 'Стоимость запуска', unit: '₽ разово', hint: 'Разработка, настройка и внедрение.' }
];

export function FinancialImpact({ onChoose }) {
  const instanceId = useId();
  const [values, setValues] = useState(() => ({ ...FINANCIAL_DEFAULTS }));
  const { inputs, additionalMargin, monthlyEffect, paybackMonths } = calculateFinancialImpact(values);
  const hasPayback = paybackMonths !== null;
  const paybackText = hasPayback ? `${monthsFormat.format(paybackMonths)} мес.` : 'Не окупается по модели';
  const inputId = key => `financial-${instanceId}-${key}`;
  const inputIds = fields.map(field => inputId(field.key)).join(' ');

  function updateValue(key, value) {
    const normalized = value === '' ? '' : calculateFinancialImpact({ [key]: value }).inputs[key];
    setValues(previous => ({ ...previous, [key]: normalized }));
  }

  function discussCalculation() {
    const task = [
      'Хотим проверить экономику внедрения ИИ на наших данных.',
      `Сокращаемые расходы: ${rubles(inputs.monthlySavings)} в месяц.`,
      `Дополнительные сделки: ${numberFormat.format(inputs.extraDeals)} в месяц.`,
      `Маржа с одной сделки после переменных затрат: ${rubles(inputs.marginPerDeal)}.`,
      `ИИ и сопровождение: ${rubles(inputs.monthlyAiCost)} в месяц.`,
      `Стоимость запуска: ${rubles(inputs.setupCost)} разово.`,
      `Расчётный денежный эффект: ${rubles(monthlyEffect)} в месяц.`,
      `Окупаемость запуска: ${paybackText}`,
      'Эффект до налогов. Окупаемость с выхода на указанный месячный объём.',
      'Нужно проверить допущения и подобрать решение под наш процесс.'
    ].join('\n');
    onChoose?.({ interest: 'Решение под мою задачу', task });
  }

  return (
    <section id="economics" className="financial-section" aria-labelledby={`financial-title-${instanceId}`}>
      <div className="financial-container">
        <header className="financial-heading">
          <div>
            <p className="financial-eyebrow">Экономика внедрения</p>
            <h2 id={`financial-title-${instanceId}`} className="financial-title">Считаем эффект<br/>в рублях</h2>
          </div>
          <p className="financial-intro">Посмотрите, как сокращение расходов и дополнительные сделки могут покрыть затраты на внедрение.</p>
        </header>

        <dl className="financial-criteria">
          <div>
            <dt><TrendDown size={23} aria-hidden="true" />Снижение расходов</dt>
            <dd>Что перестанете оплачивать каждый месяц</dd>
          </div>
          <div>
            <dt><TrendUp size={23} aria-hidden="true" />Дополнительная маржа</dt>
            <dd>Что останется от новых сделок после переменных затрат</dd>
          </div>
          <div>
            <dt><Timer size={23} aria-hidden="true" />Окупаемость</dt>
            <dd>Когда расчётный эффект покроет стоимость запуска</dd>
          </div>
        </dl>

        <div className="financial-calculator">
          <div className="financial-input-panel">
            <fieldset className="financial-fieldset" aria-describedby={`financial-example-${instanceId}`}>
              <legend>Ваши исходные данные</legend>
              <p id={`financial-example-${instanceId}`} className="financial-example">Пример расчёта. Подставьте свои данные.</p>
              <div className="financial-fields">
                {fields.map(field => (
                  <div className="financial-field" key={field.key}>
                    <div className="financial-field-copy">
                      <label htmlFor={inputId(field.key)}>{field.label}</label>
                      <p id={`${inputId(field.key)}-hint`}>{field.hint}</p>
                    </div>
                    <div className="financial-control">
                      <input
                        id={inputId(field.key)}
                        name={field.key}
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max={FINANCIAL_LIMITS[field.key]}
                        step="1"
                        value={values[field.key]}
                        placeholder="0"
                        aria-describedby={`${inputId(field.key)}-hint ${inputId(field.key)}-unit`}
                        onChange={event => updateValue(field.key, event.target.value)}
                      />
                      <span id={`${inputId(field.key)}-unit`}>{field.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
            <p className="financial-input-note">Укажите целые суммы в рублях. Пустые поля считаем нулём.</p>
          </div>

          <div className="financial-result-panel">
            <p className="financial-result-eyebrow">Денежный эффект в месяц</p>
            <output className="financial-total" htmlFor={inputIds} aria-label="Расчётный денежный эффект в месяц">{rubles(monthlyEffect)}</output>
            <p className="financial-total-caption">После расходов на ИИ и сопровождение</p>

            <dl className="financial-breakdown">
              <div><dt><span aria-hidden="true">+</span>Сокращаемые расходы</dt><dd>{rubles(inputs.monthlySavings)}</dd></div>
              <div><dt><span aria-hidden="true">+</span>Маржа от новых сделок</dt><dd>{rubles(additionalMargin)}</dd></div>
              <div><dt><span aria-hidden="true">−</span>ИИ и сопровождение</dt><dd>{rubles(inputs.monthlyAiCost)}</dd></div>
            </dl>

            <div className="financial-payback">
              <div className="financial-payback-heading"><Timer size={22} aria-hidden="true" /><p>Окупаемость запуска</p></div>
              <output className={`financial-payback-value${hasPayback ? '' : ' financial-payback-unavailable'}`} htmlFor={inputIds}>{paybackText}</output>
              <p className="financial-payback-note">
                {hasPayback
                  ? inputs.setupCost === 0
                    ? 'В расчёте нет разовых вложений в запуск.'
                    : `Запуск за ${rubles(inputs.setupCost)}. При таком же эффекте каждый месяц.`
                  : 'Ежемесячные затраты на ИИ равны сумме экономии и дополнительной маржи или превышают её.'}
              </p>
            </div>

            <button type="button" className="financial-cta" onClick={discussCalculation}>
              <span>Обсудить этот расчёт</span><ArrowRight size={21} aria-hidden="true" />
            </button>
            <p className="financial-model-note">Эффект до налогов. Окупаемость с выхода на указанный месячный объём. Проверим ваши вводные на реальном процессе.</p>
          </div>
        </div>

        <p className="financial-salary-note"><strong>Свободное время и экономия бюджета считаются отдельно.</strong> Если сотрудник продолжает получать ту же зарплату, его освободившееся время само по себе не сокращает расходы. Внесите только суммы, которые действительно перестанете тратить.</p>
        <p className="financial-sr-only" role="status" aria-live="polite" aria-atomic="true">Расчётный эффект: {rubles(monthlyEffect)} в месяц. Окупаемость: {paybackText}</p>
      </div>
    </section>
  );
}

export default FinancialImpact;
