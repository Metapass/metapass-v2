import { QRCode } from 'react-qrcode-logo';

export default function GenerateQR({ data }: { data: string }) {
  return <QRCode value={data || 'error'} qrStyle='dots' size={200} />;
}
