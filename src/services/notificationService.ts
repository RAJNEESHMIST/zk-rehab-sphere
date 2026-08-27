/**
 * Clean abstraction for sending WhatsApp notification updates to ZK RehabSphere.
 * In production, this targets a secure server-side endpoint or webhook (e.g. VITE_WHATSAPP_WEBHOOK_URL).
 * If no endpoint is configured, it falls back to console logging to prevent credential exposure.
 */

export interface RegistrationPayload {
  registrationId: string;
  venueName: string;
  campaignTitle: string;
  campaignDate: string;
  fullName: string;
  age: number | string;
  gender: string;
  mobile: string;
  email?: string;
  primaryActivity: string;
  trainingExperience: string;
  assessmentAreas: string[];
  experiencingPain: boolean;
  painArea?: string;
  painSince?: string;
  painScore?: number;
  previousInjury: boolean;
  medicalInformation?: string;
  consent: boolean;
  createdAt: string;
}

export const notificationService = {
  async sendRegistrationNotification(payload: RegistrationPayload): Promise<boolean> {
    const formattedMessage = `
NEW FREE ASSESSMENT REGISTRATION
ZK REHABSPHERE

Registration ID:
${payload.registrationId}

Venue:
${payload.venueName}

Campaign:
${payload.campaignTitle}

Date:
${payload.campaignDate}

PARTICIPANT
Name: ${payload.fullName}
Age: ${payload.age}
Gender: ${payload.gender}
Mobile: ${payload.mobile}
Email: ${payload.email || 'None'}

FITNESS
Activity: ${payload.primaryActivity}
Experience: ${payload.trainingExperience}

ASSESSMENT
Area: ${payload.assessmentAreas.join(', ')}
Pain: ${payload.experiencingPain ? 'Yes' : 'No'}
${payload.experiencingPain ? `Pain Area: ${payload.painArea || 'N/A'}\nPain Since: ${payload.painSince || 'N/A'}\nPain Score: ${payload.painScore || 0}/10` : ''}

PREVIOUS HISTORY
Previous Injury: ${payload.previousInjury ? 'Yes' : 'No'}
Medical Information: ${payload.medicalInformation || 'None'}

Consent: ${payload.consent ? 'Accepted' : 'Declined'}
Registration Time: ${new Date(payload.createdAt).toLocaleString()}
`;

    // Retrieve endpoint from environment variables safely
    const webhookUrl = import.meta.env.VITE_WHATSAPP_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: formattedMessage,
            payload,
          }),
        });
        return response.ok;
      } catch (err) {
        console.error('Failed to send WhatsApp notification webhook:', err);
        return false;
      }
    } else {
      console.log('%c[WHATSAPP MOCK NOTIFICATION SENT]', 'background: #25d366; color: white; font-weight: bold; padding: 4px;', formattedMessage);
      return true;
    }
  }
};
