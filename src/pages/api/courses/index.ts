import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { isAuthenticated } from '../../../lib/auth/jwt';
import { nowISO } from '../../../lib/firestore-helpers';

export const POST: APIRoute = async ({ request, ...context }) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const now = nowISO();
    const id = crypto.randomUUID();

    const courseData = {
      id,
      title: body.title,
      duration_days: body.duration_days,
      level: body.level,
      experience_level: body.experience_level,
      max_participants: body.max_participants,
      price: body.price,
      target_audience: body.target_audience,
      contents: body.contents,
      requirements: body.requirements || null,
      dates: body.dates,
      location: body.location,
      active: body.active,
      created_at: now,
      updated_at: now,
    };

    await db.collection('courses').doc(id).set(courseData);

    return new Response(
      JSON.stringify({ success: true, data: courseData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async (context) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const snapshot = await db.collection('courses')
      .orderBy('created_at', 'desc')
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.data().id || doc.id, ...doc.data() }));

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
