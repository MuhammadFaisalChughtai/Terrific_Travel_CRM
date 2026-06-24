import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { Printer, RotateCcw, Edit3 } from "lucide-react";

interface HtmlEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHtml: string;
  title: string;
  onPrint: (html: string) => void;
}

export default function HtmlEditorModal({
  isOpen,
  onClose,
  initialHtml,
  title,
  onPrint,
}: HtmlEditorModalProps) {
  const [html, setHtml] = useState(initialHtml);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync initialHtml
  useEffect(() => {
    if (isOpen) {
      setHtml(initialHtml);
    }
  }, [isOpen, initialHtml]);

  // Update iframe preview
  useEffect(() => {
    if (iframeRef.current) {
      const doc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit & Preview: ${title}`}>
      <div className="flex flex-col lg:flex-row gap-4 h-[70vh] w-[90vw] max-w-7xl font-sans text-xs">
        {/* Editor (Left column) */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex justify-between items-center bg-secondary/20 p-2 rounded-lg border border-border">
            <span className="font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
              <Edit3 size={12} className="text-primary" /> HTML / CSS Editor
            </span>
            <button
              type="button"
              onClick={() => setHtml(initialHtml)}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-600/10 px-2 py-1 rounded"
              title="Reset to default template"
            >
              <RotateCcw size={10} /> Reset
            </button>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="flex-1 w-full p-3 font-mono text-[11px] bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
            spellCheck={false}
          />
        </div>

        {/* Live Preview (Right column) */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center bg-secondary/20 p-2 rounded-lg border border-border">
            <span className="font-bold text-foreground uppercase tracking-wider">
              Live Preview
            </span>
          </div>
          <div className="flex-1 border border-border rounded-lg bg-white overflow-hidden shadow-inner">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Print Preview Frame"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border/60">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 bg-secondary text-foreground font-bold rounded-lg text-xs hover:bg-secondary/80 transition-all border border-border cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onPrint(html)}
          className="px-4 py-1.5 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Printer size={12} /> Print Edited Version
        </button>
      </div>
    </Modal>
  );
}
