/**
 * AboutPage Component
 * The vision and philosophy behind PDFH
 */

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          The Last File Format You'll Need
          <span className="block text-2xl md:text-3xl mt-2 text-primary-600 dark:text-primary-400">
            (Before You Don't Need One)
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          PDFH is a bridge. A short-lived format for a world transitioning from
          static documents to living, structured content.
        </p>
      </section>

      {/* The Problem */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          The Problem We Created
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            Every day, billions of documents are created from rich, structured sources—Word documents,
            HTML pages, spreadsheets, databases—and <strong className="text-gray-900 dark:text-white">flattened into PDFs</strong>.
            The headings, tables, links, and semantic meaning? Gone. Reduced to pixels on a page.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            Then we spend <strong className="text-gray-900 dark:text-white">billions of compute cycles</strong> trying
            to reconstruct what we already knew. OCR systems squint at text. AI models guess at table
            structures. We're archaeologists excavating information we buried ourselves.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 font-mono text-sm">
            <div className="text-gray-500 dark:text-gray-400 mb-2">// The absurdity:</div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400">richDocument</span>
              <span className="text-gray-500"> → </span>
              <span className="text-red-600 dark:text-red-400">flatten()</span>
              <span className="text-gray-500"> → </span>
              <span className="text-purple-600 dark:text-purple-400">pdf</span>
              <span className="text-gray-500"> → </span>
              <span className="text-orange-600 dark:text-orange-400">ai.reconstruct()</span>
              <span className="text-gray-500"> → </span>
              <span className="text-green-600 dark:text-green-400">~richDocument</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          The Vision: HTML Is the Internet's Language
        </h2>
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-primary-200 dark:border-primary-800">
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            HTML isn't just for websites. It's a <strong className="text-gray-900 dark:text-white">universal
            language for structured content</strong>. Headings, paragraphs, tables, lists, links—HTML
            describes what content <em>means</em>, not just how it looks.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            Every browser speaks it. Every AI understands it. Every developer knows it.
            It's time <strong className="text-primary-700 dark:text-primary-400">humans start speaking it too</strong>.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            PDFH is how we get there. By embedding HTML inside PDFs, we create documents that
            work everywhere today while carrying the seeds of tomorrow's web-native future.
          </p>
        </div>
      </section>

      {/* Why Short-Lived */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          A Transitional Format (And Proud of It)
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            We don't expect PDFH to last forever. In fact, we hope it doesn't. The goal is to
            accelerate the transition to a world where <strong className="text-gray-900 dark:text-white">rich,
            structured HTML is the default</strong>—not a fossil buried inside legacy containers.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-400 dark:text-gray-600 mb-2">Past</div>
              <div className="text-gray-600 dark:text-gray-400">Flat PDFs</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Information lost</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">Now</div>
              <div className="text-gray-900 dark:text-white font-medium">PDFH</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">The bridge</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">Future</div>
              <div className="text-gray-600 dark:text-gray-400">Native HTML</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Structure everywhere</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </span>
          Beautifully Simple
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
            A PDFH file is just a PDF with HTML embedded inside. That's it. No new viewers needed.
            No compatibility issues. Open it anywhere—it looks like a normal PDF. But inside,
            the original structure waits to be discovered.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">For Humans</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Opens in any PDF reader
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Prints perfectly
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Shares like any document
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">For Machines</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Structured data extraction
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No OCR needed
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  10-100x faster processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </span>
          The Philosophy
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Don't Throw Away Information</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Every time we convert rich content to PDF, we're destroying value. PDFH preserves
              the original—because you never know when you'll need it back.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Work With the World, Not Against It</h3>
            <p className="text-gray-600 dark:text-gray-400">
              PDFs aren't going away tomorrow. PDFH works within existing infrastructure while
              planting seeds for something better.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Design for Obsolescence</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The best transitional technologies know when to step aside. PDFH is designed to
              make itself unnecessary.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Open By Default</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No proprietary formats. No lock-in. Just standard PDF with standard HTML inside.
              Extract it, transform it, use it anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Start Speaking HTML</h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Create your first PDFH document. Embed structure in your documents.
            Help build the bridge to a rich-text future.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/mjamiv/PDFH"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Version */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-500">
        PDFH Specification v1.0 | Built for the transition
      </div>
    </div>
  );
}

export default AboutPage;
