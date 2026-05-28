import QuestionItem from "./QuestionItem";
import type { Section } from "@/types";

interface SectionBlockProps {
  section: Section;
  startNumber: number;
}

export default function SectionBlock({ section, startNumber }: SectionBlockProps) {
  return (
    <div className="mt-8">
      <h3 className="text-center font-semibold text-base text-gray-900 mb-1">
        {section.title}
      </h3>
      <p className="font-semibold text-sm text-gray-800">{section.subtitle}</p>
      <p className="text-sm text-gray-500 italic mb-3">{section.instruction}</p>

      <div className="space-y-1.5">
        {section.questions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            number={startNumber + index}
          />
        ))}
      </div>
    </div>
  );
}
