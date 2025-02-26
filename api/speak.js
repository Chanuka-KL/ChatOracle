import axios from 'axios';

export default async (req, res) => {
    try {
        const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = req.body;
        
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                text,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            },
            {
                headers: {
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json',
                    'accept': 'audio/mpeg'
                },
                responseType: 'arraybuffer'
            }
        );

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(response.data);
        
    } catch (error) {
        console.error('ElevenLabs Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to generate speech',
            details: error.response?.data || error.message
        });
    }
};
