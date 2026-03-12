import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Организации за деца в България | Skillio',
  description: 'Проверени организации, спортни школи и курсове за деца. Намерете дейности близо до вас в цяла България.',
  openGraph: {
    title: 'Организации за деца | Skillio',
    description: 'Проверени организации и курсове за деца в цяла България.',
  },
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
