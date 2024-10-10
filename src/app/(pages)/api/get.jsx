import { getChatbotResponse } from '@/services/chatbot/chatbot'; // Asegúrate de que la ruta sea correcta

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    const response = await getChatbotResponse(message);
    res.status(200).json({ response });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
