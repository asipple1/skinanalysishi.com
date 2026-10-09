const TREATMENT_LABELS: Record<string, string> = {
  'diamondglow-facial': 'DiamondGlow Facial',
  'skinpen-microneedling': 'SkinPen Microneedling',
  'dysport': 'Dysport',
  'chemical-peels': 'Chemical Peels',
  'dermaplaning': 'Dermaplaning',
  'laser-hair-removal': 'Laser Hair Removal',
  'iv-therapy': 'IV Therapy',
  'hydrafacial': 'HydraFacial',
  'diamondglow-body': 'DiamondGlow Body',
  'red-light-therapy': 'Red Light Therapy',
  'professional-skincare': 'Professional Skincare',
};

async function flodeskFetch(path: string, body: unknown): Promise<any> {
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
  return res.json();
}

async function addToFlodesk(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  interests: string[],
  reach: string,
  message: string,
  segmentIds: string[]
): Promise<void> {
  const interestedServices = interests.length
    ? interests.map((id) => TREATMENT_LABELS[id] ?? id).join(', ')
    : 'Consultation';

  const customFields: Record<string, string> = {};
  if (phone) customFields['phone'] = phone;
  if (interestedServices) customFields['services'] = interestedServices;
  if (reach) customFields['contacttype'] = reach;
  if (message) customFields['notes'] = message;

  // Step 1: create/update subscriber with custom fields
  const subscriber = await flodeskFetch('/subscribers', {
    email,
    first_name: firstName,
    last_name: lastName,
    custom_fields: customFields,
  });

  // Step 2: assign segments using the returned subscriber ID
  if (segmentIds.length > 0 && subscriber?.id) {
    await flodeskFetch(`/subscribers/${subscriber.id}/segments`, {
      segment_ids: segmentIds,
    });
  }
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
  const phone = params.get('phone')?.trim() ?? '';
  const message = params.get('message')?.trim() ?? '';
  const reach = params.get('reach') ?? '';
  const interests = params.getAll('interests');
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
    await addToFlodesk(email, firstName, lastName, phone, interests, reach, message, segmentIds);
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
