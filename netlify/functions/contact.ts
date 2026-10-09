async function flodeskFetch(path: string, body: unknown): Promise<void> {
  const auth = Buffer.from(`${process.env.FLODESK_API_KEY}:`).toString('base64');
  const res = await fetch(`https://api.flodesk.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      'User-Agent': 'SkinAnalysisHI/1.0',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Flodesk ${path} error ${res.status}: ${text}`);
  }
}

async function addToFlodesk(
  email: string,
  firstName: string,
  lastName: string,
  segmentIds: string[]
): Promise<void> {
  await flodeskFetch('/subscribers', {
    email,
    first_name: firstName,
    last_name: lastName,
    segment_ids: segmentIds,
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!process.env.FLODESK_API_KEY) {
    console.error('FLODESK_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let text: string;
  try {
    text = await req.text();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const params = new URLSearchParams(text);
  const name = params.get('name')?.trim() ?? '';
  const email = params.get('email')?.trim() ?? '';
  const newsletter = params.get('newsletter') === 'true';

  if (name.length < 2 || !/^.+@.+\..+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Name and valid email are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const segmentIds: string[] = [];
  if (process.env.FLODESK_SEGMENT_CONTACT_FORM) {
    segmentIds.push(process.env.FLODESK_SEGMENT_CONTACT_FORM);
  }
  if (newsletter && process.env.FLODESK_SEGMENT_NEWSLETTER) {
    segmentIds.push(process.env.FLODESK_SEGMENT_NEWSLETTER);
  }

  try {
    await addToFlodesk(email, firstName, lastName, segmentIds);
  } catch (err) {
    console.error('Flodesk error:', err);
    return new Response(JSON.stringify({ error: 'Failed to add subscriber' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
