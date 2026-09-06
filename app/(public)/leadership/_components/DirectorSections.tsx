'use client';
import { useRef, useState, useEffect } from 'react';

interface Deputy {
  name?: string;
  photo?: string;
}

interface Props {
  deputy1: Deputy | null;
  deputy2: Deputy | null;
}

function useRowColor() {
  const [colorized, setColorized] = useState(false);
  return { colorized, setColorized };
}


export function DirectorSection() {
  const { colorized, setColorized } = useRowColor();
  return (
    <section
      className="bg-paper border-b hairline"
      onMouseEnter={() => setColorized(true)}
      onMouseLeave={() => setColorized(false)}
    >
      <div className="w-full px-6 sm:px-12 xl:px-20 py-16">
        <p className="kicker mb-8" style={{ color: '#970003' }}>Director, Student Activity Centre</p>

        <div className="group grid overflow-hidden rounded-2xl border hairline bg-paper sm:grid-cols-[300px_1fr]">

          {/* Photo */}
          <div className="aspect-[4/3] overflow-hidden sm:aspect-auto">
            <img
              loading="lazy"
              decoding="async"
              src="/sai vijay sir.png"
              alt="Er. P Sai Vijay"
              className={`w-full h-full object-cover object-top transition-[filter] duration-700 ${!colorized ? 'sm:grayscale' : 'sm:grayscale-0'}`}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
            <p className="kicker text-red-700">Director</p>
            <h3 className="font-display mt-3 text-3xl font-medium text-foreground sm:text-4xl">
              Er. P Sai Vijay
            </h3>
            <p className="mt-2 text-base font-semibold text-red-700">
              Director, Student Activity Centre
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-foreground/55">
              The Director of the Student Activity Centre oversees all student clubs, domains, events, and
              extracurricular programmes at KL University — guiding both the faculty leadership and student
              council in fostering a vibrant campus community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DeputyDirectorsSection({ deputy1, deputy2 }: Props) {
  const { colorized, setColorized } = useRowColor();
  return (
    <section
      className="bg-white border-b hairline"
      onMouseEnter={() => setColorized(true)}
      onMouseLeave={() => setColorized(false)}
    >
      <div className="w-full px-6 sm:px-12 xl:px-20 py-16">
        <p className="kicker mb-8" style={{ color: '#970003' }}>Deputy Directors, SAC</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
          {/* Deputy 1 */}
          <div className="flex flex-col items-center">
            <div className="w-56 md:w-64 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-5 border hairline relative shadow-sm">
              {!deputy1?.photo ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold uppercase tracking-widest text-xs">
                  Deputy Director 1
                </div>
              ) : (
                <img src={deputy1.photo} alt={deputy1.name} className={`w-full h-full object-cover object-top transition-[filter] duration-700 ${!colorized ? 'sm:grayscale' : 'sm:grayscale-0'}`} />
              )}
            </div>
            <h3 className="font-display text-xl font-medium text-foreground text-center">{deputy1?.name || 'Deputy Director Name'}</h3>
            <p className="text-red-700 font-semibold text-sm text-center">Deputy Director, SAC</p>
          </div>

          {/* Quote */}
          <div className="text-center px-2 py-8 md:py-0">
            <p className="text-lg leading-relaxed text-foreground/70 italic font-display" style={{ letterSpacing: '-0.01em' }}>
              &ldquo;Our Deputy Directors play a pivotal role in bridging the gap between student aspirations and institutional resources. They are the driving force behind our vibrant campus life, ensuring that every club, domain, and student initiative receives the guidance and support needed to thrive and create lasting impact.&rdquo;
            </p>
          </div>

          {/* Deputy 2 */}
          <div className="flex flex-col items-center">
            <div className="w-56 md:w-64 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-5 border hairline relative shadow-sm">
              {!deputy2?.photo ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold uppercase tracking-widest text-xs">
                  Deputy Director 2
                </div>
              ) : (
                <img src={deputy2.photo} alt={deputy2.name} className={`w-full h-full object-cover object-top transition-[filter] duration-700 ${!colorized ? 'sm:grayscale' : 'sm:grayscale-0'}`} />
              )}
            </div>
            <h3 className="font-display text-xl font-medium text-foreground text-center">{deputy2?.name || 'Deputy Director Name'}</h3>
            <p className="text-red-700 font-semibold text-sm text-center">Deputy Director, SAC</p>
          </div>
        </div>
      </div>
    </section>
  );
}
