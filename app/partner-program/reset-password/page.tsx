import { Suspense } from 'react';
import ResetPasswordForm from './reset-password-form';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-body-regular text-[#2A2A2A]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#F0F0F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center">
                <Image
                  src="/images/arts-logo.png"
                  alt="ARTSCore Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-2">
                <h1 className="text-xl lg:text-2xl uppercase text-[#2A2A2A] font-body-semibold">
                  ARTSCORE
                </h1>
              </div>
            </Link>
            <Link href="/partner-program" className="flex items-center text-sm text-[#666666] hover:text-[#b38a34] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do strony programu
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4">
          <Suspense fallback={<Loading />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>

      <footer className="bg-white border-t border-[#F0F0F0] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-[#999999]">
            &copy; {new Date().getFullYear()} ARTSCORE. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  );
}
