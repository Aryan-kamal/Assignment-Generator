"use client";

import Button from "@/components/ui/Button";

interface FormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  loading?: boolean;
  nextLabel?: string;
}

export default function FormNavigation({
  onBack,
  onNext,
  loading = false,
  nextLabel = "Next",
}: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8">
      <Button variant="outline" onClick={onBack} type="button">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Previous
      </Button>
      <Button variant="primary" onClick={onNext} disabled={loading} type="button">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating...
          </>
        ) : (
          <>
            {nextLabel}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </Button>
    </div>
  );
}
