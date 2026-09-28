// Lead delivery from the site forms. send.php stores every lead on the hosting and forwards it to Telegram.
export const LEAD_ENDPOINT = 'send.php';
export const LEAD_LIMITS = { name: 80, contact: 120, interest: 120, task: 3000 };

const clean = (value, limit) => String(value ?? '').trim().slice(0, limit);

export function buildLead(values, { startedAt = Date.now(), now = Date.now(), page = '', source = '' } = {}) {
  return {
    name: clean(values.name, LEAD_LIMITS.name),
    contact: clean(values.contact, LEAD_LIMITS.contact),
    interest: clean(values.interest, LEAD_LIMITS.interest),
    task: clean(values.task, LEAD_LIMITS.task),
    consent: values.consent === true,
    website: String(values.website ?? ''),
    elapsed: Math.max(0, Math.floor((now - startedAt) / 1000)),
    page: clean(page, 300),
    source: clean(source, 40),
  };
}

export async function sendLead(lead, fetchImpl = fetch) {
  try {
    const response = await fetchImpl(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(lead),
    });
    const answer = await response.json();
    if (response.ok && answer?.ok === true) return { ok: true, delivered: answer.delivered === true };
  } catch {
    // Network failure or a host without PHP (the answer is not JSON).
  }
  return { ok: false, delivered: false };
}
