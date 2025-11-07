import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthenticated } from '../../../lib/auth/jwt';

export const PUT: APIRoute = async ({ request, params, ...context }) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { id } = params;
    const body = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('courses')
      .update({
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
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al actualizar el curso' }),
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

export const DELETE: APIRoute = async ({ params, ...context }) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { id } = params;
    
    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting course:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al eliminar el curso' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Curso eliminado' }),
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
