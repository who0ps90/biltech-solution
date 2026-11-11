const buildEnv=typeof process!=='undefined'?process.env:{};
const previewOrigin=buildEnv.VERCEL_ENV==='preview'&&buildEnv.VERCEL_URL?'https://'+buildEnv.VERCEL_URL:undefined;
const siteOrigin=previewOrigin||import.meta.env?.VITE_SITE_ORIGIN||buildEnv.VITE_SITE_ORIGIN;
export const config={whatsapp:'60164532818',formEndpoint:import.meta.env?.VITE_ENABLE_CLIENT_CAPTURE==='true'?'/api/enquiries':null,origin:siteOrigin||'https://biltech-solution-v1.chris-keith5463.chatgpt.site'};

