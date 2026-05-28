"use client";

import Button from "@/components/ui/Button";

interface AIBannerProps {
  subject: string;
  onDownloadPDF?: () => void;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

export default function AIBanner({
  subject,
  onDownloadPDF,
  onRegenerate,
  regenerating,
}: AIBannerProps) {
  return (
    <div className="bg-gray-800 text-white rounded-2xl p-5 mb-6">
      <p className="text-sm leading-relaxed mb-4">
        Certainly! Here are customized Question Paper for your {subject} classes:
      </p>
      <div className="flex flex-wrap gap-3">
        {onDownloadPDF && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadPDF}
            className="!border-white/20 !text-white hover:!bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download as PDF
          </Button>
        )}
        {onRegenerate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={regenerating}
            className="!border-white/20 !text-white hover:!bg-white/10"
          >
            <svg
              className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            {regenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        )}
      </div>
    </div>
  );
}
