export default function StudentInfo({ className }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <p className="text-sm text-gray-800">
        Name: <span className="inline-block w-48 border-b border-gray-400"></span>
      </p>
      <p className="text-sm text-gray-800">
        Roll Number: <span className="inline-block w-36 border-b border-gray-400"></span>
      </p>
      <p className="text-sm text-gray-800">
        Class: <span className="inline-block w-16 border-b border-gray-400"></span>{" "}
        Section: <span className="inline-block w-20 border-b border-gray-400"></span>
      </p>
    </div>
  );
}
