import { Locale } from "@/lib/definitions";
import "@/app/globals.css";
interface Props {
  params: { lang: Locale };
  children: React.ReactNode;
}

export default function Root({ params, children }: Props) {
  return (
    <html lang={params.lang}>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
