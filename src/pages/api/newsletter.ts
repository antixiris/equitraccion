import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Validation
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email es obligatorio' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Insert into database (will fail if email already exists due to unique constraint)
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([
        {
          email: email.trim().toLowerCase(),
          source: source || 'website',
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Este email ya está suscrito' }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Error al suscribirse' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Suscripción exitosa',
        data
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
