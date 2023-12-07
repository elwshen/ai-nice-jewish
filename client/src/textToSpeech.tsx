import axios, { ResponseType } from "axios";

const voiceId = "WruJHDAF1bWs03CrrotN";

export const getTextToSpeechUrl = async (
  inputText: string
): Promise<string> => {
  const options = {
    method: "POST",
    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    headers: {
      accept: "audio/mpeg",
      "xi-api-key": process.env.REACT_APP_ELEVEN_API_KEY,
      "Content-Type": "application/json",
    },
    data: {
      text: inputText,
    },
    responseType: "arraybuffer" as ResponseType,
  };
  const speechDetails = await axios.request(options);
  const data = speechDetails.data;
  const blob = new Blob([data], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  return url;
};
