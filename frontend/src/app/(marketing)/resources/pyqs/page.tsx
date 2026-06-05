'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ChevronDown, ChevronUp, MessageCircle, Send } from 'lucide-react';

// ─── Folder paths ─────────────────────────────────────────────────────────────
const PRELIMS_DIR  = '/documents/Last 10 Years UPSC Prelims Question Papers PDF';
const MAINS_DIR    = '/documents/UPSC Mains Optional Subjects Question Papers';
const OPTIONAL_DIR = '/documents/UPSC Mains Previous Year Question Paper';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const prelimsData = [
  { year: 2026, gs: `${PRELIMS_DIR}/UPSC_Prelims_Question_Paper_2026_GS_1_Set_A_English_480b39bd20.pdf`,  csat: `${PRELIMS_DIR}/UPSC_Prelims_Question_Paper_2026_CSAT_SET_A_English_8d3089e49b.pdf` },
  { year: 2024, gs: `${PRELIMS_DIR}/UPSC_prelims_question_paper_2024_set_a_d2abf9b7e1_e62c39421e.pdf`,   csat: `${PRELIMS_DIR}/UPSC_2024_CSAT_Set_A_539e2e0fca_ace5cfd2c7.pdf` },
  { year: 2023, gs: `${PRELIMS_DIR}/UPSC_Prelims_General_Studies_Paper_1_2023_6da55b7359.pdf`,            csat: `${PRELIMS_DIR}/UPSC_CSAT_Question_Paper_2023_9898e771f3.pdf` },
  { year: 2022, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2022_d7741690c1.pdf`,                              csat: `${PRELIMS_DIR}/CSAT_Question_Paper_2022_02ae2eaa67.pdf` },
  { year: 2021, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2021_20b0361c52.pdf`,                              csat: `${PRELIMS_DIR}/CSAT_Question_Paper_2021_ebd7bc9043.pdf` },
  { year: 2020, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2020_20bab6dc5c.pdf`,                              csat: `${PRELIMS_DIR}/CSAT_Question_Paper_2020_92b5218f57.pdf` },
  { year: 2019, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2019_2dadbae721.pdf`,                              csat: `${PRELIMS_DIR}/UPSC_CSAT_Question_Paper_2019_c5dc2724b2.pdf` },
  { year: 2018, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2018_da9cb41056.pdf`,                              csat: `${PRELIMS_DIR}/UPSC_CSAT_Question_Paper_2018_6b46e9c266.pdf` },
  { year: 2017, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2017_c402669e91.pdf`,                              csat: `${PRELIMS_DIR}/UPSC_CSAT_Question_Paper_2017_661d98fd64.pdf` },
  { year: 2016, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2016_efbf12c724.pdf`,                              csat: `${PRELIMS_DIR}/UPSC_CSAT_Question_Paper_2016_60302c309e.pdf` },
  { year: 2015, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2015_c32006c6bc.pdf`,                              csat: `${PRELIMS_DIR}/UPSC_CSAT_Question_Paper_2015_60e2a78520.pdf` },
  { year: 2014, gs: `${PRELIMS_DIR}/Prelims_GS_Paper_1_2014_6b37afc722.pdf`,                              csat: `${PRELIMS_DIR}/UPSC_CSAT_Question_Paper_2014_f0fa096ae4.pdf` },
];

type MainsYear = {
  year: number;
  papers: ({ label: string; file: string } | null)[];
};

const mainsData: MainsYear[] = [
  { year: 2025, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/upsc_mains_gs_1_question_paper_2025_935c238402.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/upsc_mains_gs_2_question_paper_2025_e03530e0c7.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/upsc_gs_3_paper_2025_a6a623ba94.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/upsc_gs_4_paper_2025_b8eeec0710.pdf` },
  ]},
  { year: 2024, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/general_studies_paper_i_2024_1_1cb4a06b1e.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/general_studies_paper_ii_2024_1_5a48463997.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/general_studies_paper_iii_2024_1_cc72c61ddb.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/general_studies_paper_iv_2024_1_841b0a6c57.pdf` },
  ]},
  { year: 2023, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/upsc_mains_2023_question_paper_gs_1_e9db61c7c3.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/upsc_mains_gs_2_question_paper_2023_4a85a62bfe.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/upsc_mains_question_paper_2023_gs_paper3_41e3f5f75d.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/upsc_mains_gs_4_question_paper_2023_e9bd601cd0.pdf` },
  ]},
  { year: 2022, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_1_2022_72f7635fe6.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_2_2022_cc58aabed4.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_3_2022_2287875398.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_4_2022_4e5554e32c.pdf` },
  ]},
  { year: 2021, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_1_2021_b54c78a4b8.pdf` },
    null,
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_3_2021_67578f30ea.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_4_2021_4c4c23b921.pdf` },
  ]},
  { year: 2020, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_1_2020_7289debadf.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_2_2020_dd18fc66f1.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_3_2020_2f50095e89.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_4_2020_aa865aaac0.pdf` },
  ]},
  { year: 2019, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_1_2019_13e77a5efd.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_2_2019_a6595e3d90.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_3_2019_fdc0c3f755.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_Mains_GS_Paper_4_2019_6659cf246a.pdf` },
  ]},
  { year: 2018, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_2018_GS_1_Mains_Paper_0c365ae64a.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_2018_GS_2_Mains_Paper_e1988d5e43.pdf` },
    null,
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_2018_GS_4_Mains_Paper_bb16237680.pdf` },
  ]},
  { year: 2017, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_2017_GS_1_Mains_Paper_d6ea4366a6.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_2017_GS_2_Mains_Paper_a826c29ab3.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_2017_GS_3_Mains_Paper_f0848e1d44.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_2017_GS_4_Mains_Paper_49262f8baa.pdf` },
  ]},
  { year: 2016, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_2016_GS_1_Mains_Paper_ad91ce92c1.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_2016_GS_2_Mains_Paper_a2f3fb4238.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_2016_GS_3_Mains_Paper_b877792a0a.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_2016_GS_4_Mains_Paper_26794c4a7a.pdf` },
  ]},
  { year: 2015, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_2015_GS_1_Mains_Paper_a67756ae43.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_2015_GS_2_Mains_Paper_029279cfec.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_2015_GS_3_Mains_Paper_598606f5a4.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_2015_GS_4_Mains_Paper_34588f2d01.pdf` },
  ]},
  { year: 2014, papers: [
    { label: 'UPSC Mains GS Paper 1', file: `${MAINS_DIR}/UPSC_2014_GS_1_Mains_Paper_ab153264f9.pdf` },
    { label: 'UPSC Mains GS Paper 2', file: `${MAINS_DIR}/UPSC_2014_GS_2_Mains_Paper_4e513c6d1a.pdf` },
    { label: 'UPSC Mains GS Paper 3', file: `${MAINS_DIR}/UPSC_2014_GS_3_Mains_Paper_69086bc0ae.pdf` },
    { label: 'UPSC Mains GS Paper 4', file: `${MAINS_DIR}/UPSC_2014_GS_4_Mains_Paper_13952593df.pdf` },
  ]},
];

const optionalSubjects = [
  {
    subject: 'Anthropology',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/CSE_Mains_2024_Anthropology_Paper_1_747ed3096a_721cc516e6.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/Anthro_Paper_II_optional_2024_1_a198b507cc_a866a148a7.pdf` },
    ],
  },
  {
    subject: 'Commerce & Accountancy',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/commerce_paper_1_optional_2024_7c897661d1_d00ac810a7.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/commerce_optional_paper_2_2024_72d7d05dad_a8669d64d1.pdf` },
    ],
  },
  {
    subject: 'Geography',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/Geography_0bc562b80a_e51cb31f34.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/geography_optional_paper_2_2024_1ab026bd65_1_076d9253d7.pdf` },
    ],
  },
  {
    subject: 'History',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/History_4ab038125b_7b213c3778.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/History_Optional_Paper_II_2024_ff53562df0_a643b569ff.pdf` },
    ],
  },
  {
    subject: 'PSIR',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/5_6325565608062619828_f77255ccd7_87c8912f07.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/PSIR_Paper_2_optional_22024_7a0d7797e9_290a6a2839.pdf` },
    ],
  },
  {
    subject: 'Psychology',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/PSYCHOLOGY_MAINS_PAPER_1_2024_966e64e621_72e52f0415.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/QP_CSM_24_PSYCHOLOGY_PAPER_II_031024_657d136979_56edd97416.pdf` },
    ],
  },
  {
    subject: 'Public Administration',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/Doc_Scanner_29_Sept_2024_12_10_a55e5c3a9e_2a3dcb9593.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/QP_CSM_24_PUBLIC_ADMINISTRATION_PAPER_II_031024_378697d139_ede3a415a9.pdf` },
    ],
  },
  {
    subject: 'Sociology',
    papers: [
      { label: 'Question Paper I',  file: `${OPTIONAL_DIR}/Sociology_67a7b8055c_f1105ed320.pdf` },
      { label: 'Question Paper II', file: `${OPTIONAL_DIR}/Sociology_paper_2_optional_2024_62f734ae2b_5103cd9295.pdf` },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const PdfCard = ({ label, file }: { label: string; file: string }) => (
  <a
    href={file}
    download
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl
               px-4 py-3 hover:border-orange-400 hover:shadow-md
               transition-all duration-200 group flex-1 min-w-[190px]"
  >
    <div className="flex-shrink-0 w-9 h-10 bg-red-500 rounded-md flex flex-col items-center justify-center shadow-sm">
      <span className="text-white font-black text-[8px] leading-none">PDF</span>
      <FileText className="w-3.5 h-3.5 text-white/80 mt-0.5" />
    </div>
    <span className="flex-1 text-sm font-semibold text-gray-800 leading-tight">{label}</span>
    <div className="flex-shrink-0 w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center
                    shadow-md group-hover:bg-orange-600 group-hover:scale-110 transition-all duration-200">
      <Download className="w-4 h-4 text-white" strokeWidth={2.5} />
    </div>
  </a>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-12">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-5 group text-left"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
          {title}
        </h2>
        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-orange-400 group-hover:text-orange-500 transition-all flex-shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-gray-300 rounded-xl overflow-hidden"
        >
          <table className="w-full border-collapse">{children}</table>
        </motion.div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PyqsPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f4] pb-24">

      {/* Hero Header */}
      <div className="bg-navy pt-32 pb-16 rounded-b-[3rem] relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-gold font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">Free Resources</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4 leading-tight">
            UPSC Previous Year <span className="text-gold italic">Question Papers</span>
          </h1>
          <p className="text-white/60 text-base font-light max-w-2xl mx-auto">
            Download Prelims, Mains & Optional subject PYQs — year-wise, free, no sign-up needed.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── COMMUNITY LINKS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm mb-12"
        >
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-1">Stay Updated</p>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Join Our Community</h3>
            <p className="text-sm text-gray-500">Get instant updates on new PYQs, answer keys, and strategy tips.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            {/* WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029VbCyspNEKyZ85dyVHw1Q"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#1ebe5d] transition-all shadow-md shadow-green-200 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Channel
            </a>
            {/* Telegram */}
            <a
              href="https://t.me/upscwitheshwar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#229ED9] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#1a8bbf] transition-all shadow-md shadow-blue-200 hover:scale-105"
            >
              <Send className="w-4 h-4" />
              Telegram Channel
            </a>
          </div>
        </motion.div>

        {/* ── SECTION 1: PRELIMS ── */}
        <Section title="Last 10 Years UPSC Prelims Question Papers PDF">
          <tbody>
            {prelimsData.map((row, i) => (
              <motion.tr
                key={row.year}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-4 px-5 w-24 align-middle border-r border-gray-200">
                  <span className="text-xl font-black text-gray-800">{row.year}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-3">
                    <PdfCard label="GS Paper" file={row.gs} />
                    <PdfCard label="CSAT" file={row.csat} />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Section>

        {/* ── SECTION 2: MAINS ── */}
        <Section title="UPSC Mains Previous Year Question Paper">
          <tbody>
            {mainsData.map((row, i) => (
              <motion.tr
                key={row.year}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-5 px-5 w-24 align-top border-r border-gray-200">
                  <span className="text-xl font-black text-gray-800">{row.year}</span>
                </td>
                <td className="py-5 px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {row.papers.map((p, idx) =>
                      p ? (
                        <PdfCard key={p.label} label={p.label} file={p.file} />
                      ) : (
                        <div key={idx} className="flex-1 min-w-[190px]" />
                      )
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Section>

        {/* ── SECTION 3: OPTIONAL SUBJECTS ── */}
        <Section title="UPSC Mains Optional Subjects Question Papers">
          <tbody>
            {/* Year header */}
            <tr className="border-b border-gray-200 bg-gray-50">
              <td colSpan={2} className="py-3 px-5">
                <span className="text-lg font-black text-gray-800">2024</span>
              </td>
            </tr>
            {optionalSubjects.map((sub, i) => (
              <motion.tr
                key={sub.subject}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-4 px-5 w-44 align-middle border-r border-gray-200">
                  <span className="text-sm font-bold text-gray-800">{sub.subject}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-3">
                    {sub.papers.map((p) => (
                      <PdfCard key={p.label} label={p.label} file={p.file} />
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Section>

      </div>
    </div>
  );
}
