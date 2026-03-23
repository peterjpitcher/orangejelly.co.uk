'use server';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  pubName: string;
  message: string;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success?: boolean; error?: string }> {
  // Validate required fields server-side
  if (!data.name || data.name.length < 2) {
    return { error: 'Name must be at least 2 characters' };
  }
  if (!data.email || !data.email.includes('@')) {
    return { error: 'A valid email address is required' };
  }
  if (!data.pubName || data.pubName.length < 2) {
    return { error: 'Venue name must be at least 2 characters' };
  }
  if (!data.message || data.message.length < 10) {
    return { error: 'Message must be at least 10 characters' };
  }

  try {
    // Log submission for now; replace with email/CRM integration later
    console.log('[Contact Form] New submission:', {
      name: data.name,
      email: data.email,
      phone: data.phone || 'Not provided',
      pubName: data.pubName,
      messageLength: data.message.length,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch {
    return { error: 'Something went wrong. Please try again or message Peter on WhatsApp.' };
  }
}
