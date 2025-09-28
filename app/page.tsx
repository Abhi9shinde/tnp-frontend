import Image from "next/image";

// If Geist Sans is not available, fallback to Inter or system-ui
const fontClass = "font-[\'Geist\',_\'Inter\',_system-ui,_sans-serif]";

export default function Home() {
  return (
    <div className={`min-h-screen w-full grid grid-rows-[20px_1fr_20px] items-center justify-items-center bg-gradient-to-br from-white via-zinc-100 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 transition-colors duration-300 ${fontClass}`}>
      <main className="flex flex-col gap-14 row-start-2 items-center sm:items-start max-w-3xl w-full">
        <div className="flex flex-col items-center gap-6">
          <Image
            className="dark:invert drop-shadow-xl"
            src="/next.svg"
            alt="Centralised Placement System Logo"
            width={140}
            height={44}
            priority
          />
          <h1 className="text-5xl sm:text-7xl font-extrabold text-center text-black dark:text-white tracking-tight leading-tight drop-shadow-lg">
            Centralised<br className='hidden sm:block'/> Placement System
          </h1>
          <p className="text-2xl sm:text-3xl text-center text-zinc-800 dark:text-zinc-200 max-w-2xl font-medium leading-relaxed">
            Streamline your campus recruitment process with our all-in-one platform for students, companies, and placement coordinators.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mt-2">
          <a
            className="rounded-full border-2 border-black dark:border-white transition-all flex items-center justify-center bg-black text-white gap-2 hover:scale-105 hover:bg-gradient-to-r hover:from-black hover:to-zinc-800 font-bold text-lg h-14 px-10 sm:w-auto shadow-2xl shadow-black/10 dark:shadow-white/10 focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 outline-none"
            href="#get-started"
          >
            🚀 Get Started
          </a>
          <a
            className="rounded-full border-2 border-black dark:border-white transition-all flex items-center justify-center bg-white dark:bg-black text-black dark:text-white hover:scale-105 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-bold text-lg h-14 px-10 sm:w-auto focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 outline-none"
            href="#features"
          >
            Learn More
          </a>
        </div>

        <section id="features" className="mt-12 grid gap-8 sm:grid-cols-2 w-full">
          <div className="bg-white/80 dark:bg-zinc-900/80 border-2 border-black dark:border-white rounded-2xl p-8 shadow-xl flex flex-col items-center transition-colors backdrop-blur-md hover:scale-[1.03] hover:shadow-2xl duration-200">
            <Image src="/file.svg" alt="Student icon" width={40} height={40} />
            <h2 className="font-bold text-2xl mt-4 mb-2 text-black dark:text-white tracking-wide">For Students</h2>
            <p className="text-zinc-700 dark:text-zinc-300 text-center text-base font-medium">
              Browse job postings, apply easily, track your application status, and get notified about interviews and results.
            </p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 border-2 border-black dark:border-white rounded-2xl p-8 shadow-xl flex flex-col items-center transition-colors backdrop-blur-md hover:scale-[1.03] hover:shadow-2xl duration-200">
            <Image src="/window.svg" alt="Company icon" width={40} height={40} />
            <h2 className="font-bold text-2xl mt-4 mb-2 text-black dark:text-white tracking-wide">For Companies</h2>
            <p className="text-zinc-700 dark:text-zinc-300 text-center text-base font-medium">
              Post job openings, manage candidate pipelines, and schedule interviews with ease.
            </p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 border-2 border-black dark:border-white rounded-2xl p-8 shadow-xl flex flex-col items-center transition-colors backdrop-blur-md hover:scale-[1.03] hover:shadow-2xl duration-200">
            <Image src="/globe.svg" alt="Coordinator icon" width={40} height={40} />
            <h2 className="font-bold text-2xl mt-4 mb-2 text-black dark:text-white tracking-wide">For Coordinators</h2>
            <p className="text-zinc-700 dark:text-zinc-300 text-center text-base font-medium">
              Oversee the entire placement process, communicate with stakeholders, and generate insightful reports.
            </p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 border-2 border-black dark:border-white rounded-2xl p-8 shadow-xl flex flex-col items-center transition-colors backdrop-blur-md hover:scale-[1.03] hover:shadow-2xl duration-200">
            <Image src="/next.svg" alt="Secure icon" width={40} height={40} />
            <h2 className="font-bold text-2xl mt-4 mb-2 text-black dark:text-white tracking-wide">Secure & Centralised</h2>
            <p className="text-zinc-700 dark:text-zinc-300 text-center text-base font-medium">
              All data is securely managed in one place, ensuring privacy and transparency for all users.
            </p>
          </div>
        </section>
      </main>
      <footer className="row-start-3 flex gap-8 flex-wrap items-center justify-center text-zinc-600 dark:text-zinc-300 text-base border-t-2 border-zinc-200 dark:border-zinc-800 pt-8 w-full font-medium tracking-wide">
        <span>© {new Date().getFullYear()} Centralised Placement System</span>
        <a
          className="hover:underline hover:text-black dark:hover:text-white transition-colors"
          href="mailto:support@placement-system.com"
        >
          Contact Support
        </a>
        <a
          className="hover:underline hover:text-black dark:hover:text-white transition-colors"
          href="#"
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}
