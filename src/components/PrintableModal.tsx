import React from 'react';
import { X, Printer } from 'lucide-react';
import { PrintableSheet } from '../types/simphonics';

interface PrintableModalProps {
  sheet: PrintableSheet;
  onClose: () => void;
}

export const PrintableModal: React.FC<PrintableModalProps> = ({ sheet, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 no-print">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Classroom Activity Sheet
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{sheet.title}</h3>
            <p className="text-xs text-slate-500">{sheet.purpose}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="border-2 border-slate-300 rounded-xl p-8 bg-white space-y-6 font-sans">
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{sheet.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5">Simphonics Activity Books · Prolangue</p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p>Name: ____________________</p>
              <p className="mt-1">Date: ____________________</p>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-lg text-xs font-medium text-slate-800">
            <strong>Instructions:</strong> {sheet.instructions}
          </div>

          <div className="space-y-4 py-4">
            {sheet.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-800 flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="w-6 h-6 border-2 border-slate-400 rounded"></span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
            <span>Simphonics Teacher Companion · For educational classroom use</span>
            <span>Teacher Initials: _______</span>
          </div>
        </div>
      </div>
    </div>
  );
};
