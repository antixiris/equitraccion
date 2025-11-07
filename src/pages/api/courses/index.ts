import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthenticated } from '../../../lib/auth/jwt';

export const POST: APIRoute = async ({ request, ...context }) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert([{
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
        active: body.active
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al crear el curso' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

export const GET: APIRoute = async (context) => {
  // 🔐 Verificar autenticación
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try{
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al obtener cursos' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
